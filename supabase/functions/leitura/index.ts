// Edge Function: gera a leitura reflexiva de uma tiragem com o Claude e salva no banco.
// Chamada pelo site com: supabase.functions.invoke("leitura", { body: { tiragem_id } })
import { createClient } from "jsr:@supabase/supabase-js@2";
import { SYSTEM_PROMPT } from "./prompt.ts";
import { ARCANOS, SIGNOS } from "./dados.ts";

const MODELO = "claude-sonnet-5-5";
const LIMITE_POR_DIA = 5;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

function signoDe(nasc: string): string {
  const [, m, d] = nasc.split("-").map(Number);
  const s = SIGNOS.find(({ ini: [sm, sd], fim: [em, ed] }) =>
    sm <= em
      ? (m === sm && d >= sd) || (m === em && d <= ed) || (m > sm && m < em)
      : (m === sm && d >= sd) || (m === em && d <= ed));
  return s ? s.nome : "";
}
function idade(nasc: string): number {
  const n = new Date(nasc + "T12:00:00Z"), h = new Date();
  let a = h.getUTCFullYear() - n.getUTCFullYear();
  if (h.getUTCMonth() < n.getUTCMonth() || (h.getUTCMonth() === n.getUTCMonth() && h.getUTCDate() < n.getUTCDate())) a--;
  return a;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ erro: "Método não permitido." }, 405);

  const url = Deno.env.get("SUPABASE_URL")!;
  const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
  const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const chave = Deno.env.get("ANTHROPIC_API_KEY");
  if (!chave) return json({ erro: "A leitura aprofundada ainda não está configurada." }, 503);

  // Quem está chamando
  const auth = req.headers.get("Authorization") ?? "";
  const userClient = createClient(url, anon, { global: { headers: { Authorization: auth } } });
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return json({ erro: "Entre na sua conta para pedir a leitura." }, 401);

  let tiragemId: number;
  try { tiragemId = Number((await req.json()).tiragem_id); } catch { tiragemId = NaN; }
  if (!Number.isInteger(tiragemId)) return json({ erro: "Tiragem inválida." }, 400);

  const db = createClient(url, service);
  const { data: t } = await db.from("tiragens").select("*").eq("id", tiragemId).eq("user_id", user.id).maybeSingle();
  if (!t) return json({ erro: "Tiragem não encontrada." }, 404);
  if (t.leitura_ia) return json({ leitura: t.leitura_ia, crise: t.leitura_ia_crise, em: t.leitura_ia_em });

  // Limite diário por cliente (controle de custo)
  const desde = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const { count } = await db.from("tiragens").select("id", { count: "exact", head: true })
    .eq("user_id", user.id).gte("leitura_ia_em", desde);
  if ((count ?? 0) >= LIMITE_POR_DIA)
    return json({ erro: `Você já recebeu ${LIMITE_POR_DIA} leituras aprofundadas nas últimas 24 horas. Volte amanhã para continuar.` }, 429);

  const [{ data: perfil }, { data: mapa }] = await Promise.all([
    db.from("profiles").select("nome, data_nascimento").eq("id", user.id).single(),
    db.from("mapas_numerologicos").select("destino").eq("user_id", user.id).maybeSingle(),
  ]);
  const carta = ARCANOS[t.carta];
  const primeiroNome = (perfil?.nome ?? "").split(" ")[0];
  const contexto = [
    `Primeiro nome: ${primeiroNome}`,
    perfil?.data_nascimento ? `Idade: ${idade(perfil.data_nascimento)} anos` : "",
    perfil?.data_nascimento ? `Signo solar: ${signoDe(perfil.data_nascimento)}` : "",
    mapa?.destino ? `Número de destino (numerologia cabalística): ${mapa.destino}` : "",
    `Carta: ${carta.nome} (Arcano ${carta.num}), ${t.invertida ? "invertida" : "na posição normal"}`,
    `Sentido tradicional nesta posição: ${t.invertida ? carta.invertida : carta.normal}`,
  ].filter(Boolean).join("\n");

  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": chave, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: MODELO,
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: `${contexto}\n\n<pergunta>\n${t.pergunta}\n</pergunta>` }],
    }),
  });
  if (!resp.ok) {
    console.error("Anthropic", resp.status, await resp.text());
    return json({ erro: "Não foi possível escrever sua leitura agora. Tente de novo em alguns minutos." }, 502);
  }
  const out = await resp.json();
  let texto: string = (out.content ?? []).filter((b: { type: string }) => b.type === "text")
    .map((b: { text: string }) => b.text).join("\n").trim();
  if (!texto) return json({ erro: "Não foi possível escrever sua leitura agora. Tente de novo." }, 502);

  const crise = texto.startsWith("[[CRISE]]");
  texto = texto.replace(/^\[\[CRISE\]\]\s*/, "").trim();
  const em = new Date().toISOString();
  await db.from("tiragens").update({ leitura_ia: texto, leitura_ia_em: em, leitura_ia_crise: crise }).eq("id", t.id);

  return json({ leitura: texto, crise, em });
});
