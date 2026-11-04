/* Eu Amo Esoterismo — aplicação (Supabase Auth + Postgres + Storage) */
const CFG = window.EAE_CONFIG || {};
const root = document.getElementById("root");
const configured = !!(CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY);
const sb = configured ? window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY) : null;

let session = null;   // sessão do Supabase Auth
let perfil = null;    // linha de public.profiles
let mapa = null;      // linha de public.mapas_numerologicos
let tiragens = [];    // linhas de public.tiragens
let authTab = "cadastro";
let signoSel = null;

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmtDate = iso => { if (!iso) return ""; const [y,m,d] = iso.split("-"); return `${d}/${m}/${y}`; };
const dataBR = ts => new Date(ts).toLocaleDateString("pt-BR");
function toast(t){ const el=document.getElementById("toast"); el.textContent=t; el.hidden=false; clearTimeout(toast.t); toast.t=setTimeout(()=>el.hidden=true,3000); }
function erroMsg(e){
  const m = (e && e.message) || "";
  if (/already registered|already exists/i.test(m)) return "Este e-mail já tem conta. Use a aba Entrar.";
  if (/Invalid login credentials/i.test(m)) return "E-mail ou senha não conferem.";
  if (/Email not confirmed/i.test(m)) return "Confirme seu e-mail pelo link que enviamos antes de entrar.";
  if (/Password should be/i.test(m)) return "A senha precisa de pelo menos 6 caracteres.";
  if (/rate limit/i.test(m)) return "Muitas tentativas seguidas. Aguarde alguns minutos e tente de novo.";
  return "Não foi possível concluir agora. Verifique sua conexão e tente de novo.";
}

/* ---------- Carregamento ---------- */
async function carregarDados(){
  const uid = session.user.id;
  const [p, m, t] = await Promise.all([
    sb.from("profiles").select("*").eq("id", uid).single(),
    sb.from("mapas_numerologicos").select("*").eq("user_id", uid).maybeSingle(),
    sb.from("tiragens").select("*").eq("user_id", uid).order("created_at", { ascending:false }).limit(50)
  ]);
  if (p.error) throw p.error;
  perfil = p.data; mapa = m.data || null; tiragens = t.data || [];
}
async function render(){
  if (!configured){ renderSemConfig(); return; }
  if (!session){ renderLanding(); return; }
  if (!perfil){
    root.innerHTML = `<div class="loading">Abrindo seu espaço…</div>`;
    try { await carregarDados(); } catch(e){ console.error(e); root.innerHTML = `<div class="loading">Não conseguimos carregar seu perfil. Recarregue a página.</div>`; return; }
  }
  renderApp();
}
function renderSemConfig(){
  root.innerHTML = `<main><div class="view"><div class="notice"><span class="eyebrow">Configuração</span><h2>Conecte o Supabase</h2>
  <p class="muted">Preencha SUPABASE_URL e SUPABASE_ANON_KEY no arquivo config.js e rode supabase/schema.sql no seu projeto. Veja o README.</p></div></div></main>`;
}

/* ---------- Landing / Auth ---------- */
function renderLanding(){
  root.innerHTML = `
  <div class="landing">
    <section class="hero">
      <canvas id="sky" aria-hidden="true"></canvas>
      <div class="brand">${I.moon}<span>Eu Amo Esoterismo</span></div>
      <div>
        <h1>Seu mapa, suas cartas, seu caminho.</h1>
        <p class="lead">Crie sua conta com nome e data de nascimento e receba sua leitura numerológica cabalística, tiragens de tarô e as previsões do seu signo.</p>
      </div>
      <ul>
        <li>${I.cards}<div><b>Tarô de uma pergunta</b>Faça uma pergunta e tire uma carta dos 22 Arcanos Maiores.</div></li>
        <li>${I.num}<div><b>Mapa numerológico cabalístico</b>Calculado uma vez a partir do seu nome de nascimento e guardado no seu perfil.</div></li>
        <li>${I.zodiac}<div><b>Signos e previsões</b>Amor, trabalho e energia para os 12 signos.</div></li>
      </ul>
    </section>
    <section class="auth"><div class="auth-box">
      <div class="tabs" role="tablist">
        <button role="tab" id="t-cad" aria-selected="${authTab==="cadastro"}">Criar conta</button>
        <button role="tab" id="t-ent" aria-selected="${authTab==="entrar"}">Entrar</button>
      </div>
      ${authTab==="cadastro" ? `
      <form class="form" id="f-cad" novalidate>
        <div><h2>Comece sua jornada</h2><p class="muted">Seus dados de nascimento são usados no mapa e no signo.</p></div>
        <div class="field"><label for="c-nome">Nome completo de nascimento</label><input id="c-nome" required placeholder="Como consta na certidão" autocomplete="name"><span class="hint">A numerologia cabalística usa o nome de registro.</span></div>
        <div class="grid2">
          <div class="field"><label for="c-nasc">Data de nascimento</label><input id="c-nasc" type="date" required></div>
          <div class="field"><label for="c-hora">Hora de nascimento</label><input id="c-hora" type="time"></div>
        </div>
        <div class="field"><label for="c-cidade">Cidade de nascimento</label><input id="c-cidade" placeholder="Ex.: Porto Alegre – RS"></div>
        <div class="group-title">Contato e acesso</div>
        <div class="grid2">
          <div class="field"><label for="c-email">E-mail</label><input id="c-email" type="email" required autocomplete="email"></div>
          <div class="field"><label for="c-whats">WhatsApp</label><input id="c-whats" type="tel" required placeholder="(51) 99999-0000" autocomplete="tel"></div>
        </div>
        <div class="field"><label for="c-senha">Senha</label><input id="c-senha" type="password" required minlength="6" autocomplete="new-password"><span class="hint">Mínimo de 6 caracteres.</span></div>
        <label class="check" for="c-lgpd"><input type="checkbox" id="c-lgpd"><span>Autorizo o uso dos meus dados de nascimento e contato para gerar minhas leituras e receber comunicações do Eu Amo Esoterismo, conforme a LGPD.</span></label>
        <p class="err" id="c-err" role="alert"></p>
        <button class="btn" type="submit" id="c-btn">Criar minha conta</button>
      </form>` : `
      <form class="form" id="f-ent" novalidate>
        <div><h2>Bem-vinda de volta</h2><p class="muted">Entre com o e-mail cadastrado.</p></div>
        <div class="field"><label for="e-email">E-mail</label><input id="e-email" type="email" required autocomplete="email"></div>
        <div class="field"><label for="e-senha">Senha</label><input id="e-senha" type="password" required autocomplete="current-password"></div>
        <p class="err" id="e-err" role="alert"></p>
        <button class="btn" type="submit" id="e-btn">Entrar</button>
        <button class="demo-link" type="button" id="esqueci">Esqueci minha senha</button>
      </form>`}
    </div></section>
  </div>`;
  document.getElementById("t-cad").onclick = () => { authTab="cadastro"; render(); };
  document.getElementById("t-ent").onclick = () => { authTab="entrar"; render(); };

  const fc = document.getElementById("f-cad");
  if (fc) fc.onsubmit = async e => {
    e.preventDefault();
    const v = id => document.getElementById(id).value.trim(), err = document.getElementById("c-err"), btn = document.getElementById("c-btn");
    const nome=v("c-nome").replace(/\s+/g," "), nasc=v("c-nasc"), email=v("c-email").toLowerCase(), whats=v("c-whats"), senha=document.getElementById("c-senha").value;
    if (nome.split(" ").length<2) return err.textContent="Informe o nome completo, com sobrenome.";
    if (!nasc) return err.textContent="Informe a data de nascimento.";
    if (!/^\S+@\S+\.\S+$/.test(email)) return err.textContent="Digite um e-mail válido, como nome@email.com.";
    if (whats.replace(/\D/g,"").length<10) return err.textContent="Digite o WhatsApp com DDD.";
    if (senha.length<6) return err.textContent="A senha precisa de pelo menos 6 caracteres.";
    if (!document.getElementById("c-lgpd").checked) return err.textContent="Marque a autorização de uso dos dados para continuar.";
    err.textContent=""; btn.disabled=true; btn.textContent="Criando conta…";
    const { data, error } = await sb.auth.signUp({ email, password: senha, options: {
      emailRedirectTo: location.origin + location.pathname,
      data: { nome, data_nascimento:nasc, hora_nascimento:v("c-hora"), cidade_nascimento:v("c-cidade"), whatsapp:whats, aceite_termos_em:new Date().toISOString() }
    }});
    btn.disabled=false; btn.textContent="Criar minha conta";
    if (error) return err.textContent = erroMsg(error);
    if (data.user && data.user.identities && data.user.identities.length===0) return err.textContent="Este e-mail já tem conta. Use a aba Entrar.";
    if (!data.session){
      document.querySelector(".auth-box").innerHTML = `<div class="notice"><span class="eyebrow">Quase lá</span><h2>Confirme seu e-mail</h2>
        <p>Enviamos um link de confirmação para <b>${esc(email)}</b>. Abra o link e depois entre com sua senha.</p></div>`;
      return;
    }
    location.hash = "numerologia";
  };

  const fe = document.getElementById("f-ent");
  if (fe) {
    fe.onsubmit = async e => {
      e.preventDefault();
      const err=document.getElementById("e-err"), btn=document.getElementById("e-btn");
      btn.disabled=true;
      const { error } = await sb.auth.signInWithPassword({ email:document.getElementById("e-email").value.trim().toLowerCase(), password:document.getElementById("e-senha").value });
      btn.disabled=false;
      if (error) err.textContent = erroMsg(error);
    };
    document.getElementById("esqueci").onclick = async () => {
      const email=document.getElementById("e-email").value.trim().toLowerCase(), err=document.getElementById("e-err");
      if (!/^\S+@\S+\.\S+$/.test(email)) return err.textContent="Digite seu e-mail acima para receber o link.";
      const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname });
      err.textContent = error ? erroMsg(error) : "";
      if (!error) toast("Enviamos um link para redefinir a senha.");
    };
  }
  drawSky();
}
function drawSky(){
  const c=document.getElementById("sky"); if(!c) return;
  const r=c.getBoundingClientRect(), dpr=devicePixelRatio||1; c.width=r.width*dpr; c.height=r.height*dpr;
  const x=c.getContext("2d"); x.scale(dpr,dpr); const rnd=seeded("ceu"); x.fillStyle="#fff";
  for(let i=0;i<160;i++){ const a=rnd()*1.4; x.globalAlpha=.25+rnd()*.7; x.beginPath(); x.arc(rnd()*r.width,rnd()*r.height,a,0,7); x.fill(); }
  x.globalAlpha=.18; x.strokeStyle="#fff"; x.lineWidth=1; const cx=r.width*.85, cy=r.height*.2;
  [90,140,200].forEach(R=>{ x.beginPath(); x.arc(cx,cy,R,0,7); x.stroke(); });
  for(let i=0;i<12;i++){ const a=i*Math.PI/6; x.beginPath(); x.moveTo(cx+Math.cos(a)*140,cy+Math.sin(a)*140); x.lineTo(cx+Math.cos(a)*200,cy+Math.sin(a)*200); x.stroke(); }
}

/* ---------- App ---------- */
const ROUTES=[["tarot","Tarô",I.cards],["numerologia","Numerologia",I.num],["signos","Signos",I.zodiac],["perfil","Perfil",I.user]];
function avatarHTML(cls=""){
  return `<div class="avatar ${cls}">${perfil.avatar_tipo==="foto" && perfil.avatar_url ? `<img src="${esc(perfil.avatar_url)}" alt="Foto de perfil">` : AVATARS[perfil.avatar_icone] || AVATARS.lua}</div>`;
}
function socialHTML(){
  const ig = CFG.INSTAGRAM_URL ? `<a href="${esc(CFG.INSTAGRAM_URL)}" target="_blank" rel="noopener">${I.ig} Instagram</a>` : `<span>${I.ig} Instagram</span>`;
  const fb = CFG.FACEBOOK_URL ? `<a href="${esc(CFG.FACEBOOK_URL)}" target="_blank" rel="noopener">${I.fb} Facebook</a>` : `<span>${I.fb} Facebook</span>`;
  return ig + fb;
}
function renderApp(){
  let r = location.hash.slice(1); if (!ROUTES.some(x=>x[0]===r)) r="tarot";
  const si = signoDe(perfil.data_nascimento);
  root.innerHTML = `<div class="app">
    <aside class="side">
      <div class="brand-wrap"><div class="brand">${I.moon}<span>Eu Amo Esoterismo</span></div></div>
      <div class="me">${avatarHTML()}<div class="who"><b>${esc(perfil.nome.split(" ")[0])}</b><span>${si>=0 ? SIGNOS[si][1]+" "+SIGNOS[si][0] : ""}</span></div></div>
      <nav class="menu">${ROUTES.map(([k,l,ic])=>`<a href="#${k}" ${k===r?'aria-current="page"':""}>${ic}<span>${l}</span></a>`).join("")}</nav>
      <div class="bottom"><div class="social">${socialHTML()}</div><button class="logout" id="logout">Sair</button></div>
    </aside>
    <main><div class="view" id="view"></div></main>
  </div>`;
  document.getElementById("logout").onclick = () => sb.auth.signOut();
  ({ tarot:vTarot, numerologia:vNum, signos:vSignos, perfil:vPerfil })[r](document.getElementById("view"));
  window.scrollTo(0,0);
}

/* Tarô */
function cardFace(i,inv){ const a=ARCANOS[i]; return `<div class="face front ${inv?"rev":""}"><span class="num">${a[0]}</span><span class="glyph"><svg width="90" height="90" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="24" cy="24" r="16"/><path d="M24 4l3 14 14 6-14 3-3 14-3-14-14-3 14-6z"/></svg></span><span class="nm">${a[1]}</span></div>`; }
function vTarot(v){
  v.innerHTML = `<div class="head"><span class="eyebrow">Tarô · Arcanos Maiores</span><h2>Faça sua pergunta</h2><p class="muted">Concentre-se em uma única pergunta. Cada pergunta recebe uma carta.</p></div>
  <form class="panel" id="f-q"><div class="ask"><div class="field"><label for="q">Sua pergunta</label><input id="q" maxlength="160" placeholder="Ex.: O que devo saber sobre minha carreira nos próximos meses?"></div>
  <button class="btn" style="align-self:flex-end" id="tirar">Tirar carta</button></div><p class="err" id="q-err" role="alert"></p></form>
  <div class="panel soft reading" id="res" hidden></div>
  <div><div class="head" style="margin-bottom:12px"><h3>Suas tiragens</h3></div><div class="panel history" id="hist"></div></div>`;
  const hist = () => { document.getElementById("hist").innerHTML = tiragens.length
    ? tiragens.map(t=>`<div class="row"><time>${dataBR(t.created_at)}</time><div class="q">${esc(t.pergunta)}</div><span class="pill">${ARCANOS[t.carta][1]}${t.invertida?" · invertida":""}</span></div>`).join("")
    : `<p class="muted">Nenhuma tiragem ainda. Sua primeira pergunta aparecerá aqui.</p>`; };
  hist();
  document.getElementById("f-q").onsubmit = async e => {
    e.preventDefault();
    const q=document.getElementById("q").value.trim(), err=document.getElementById("q-err"), btn=document.getElementById("tirar");
    if (q.length<5) return err.textContent="Escreva sua pergunta antes de tirar a carta.";
    err.textContent=""; btn.disabled=true;
    const c=crypto.getRandomValues(new Uint32Array(2)), i=c[0]%22, inv=c[1]%4===0;
    const { data, error } = await sb.from("tiragens").insert({ pergunta:q, carta:i, invertida:inv }).select().single();
    btn.disabled=false;
    if (error){ console.error(error); return err.textContent="Não foi possível registrar sua tiragem. Tente de novo."; }
    tiragens.unshift(data);
    const a=ARCANOS[i], res=document.getElementById("res"); res.hidden=false;
    res.innerHTML = `<div class="card-wrap"><div class="card" id="card"><div class="face back">${AVATARS.estrela}</div>${cardFace(i,inv)}</div></div>
      <div style="display:flex;flex-direction:column;gap:12px;min-width:0"><span class="eyebrow">Sua pergunta</span><p style="font-style:italic">“${esc(q)}”</p>
      <h2>${a[1]}${inv?' <span class="pill">invertida</span>':""}</h2><p>${inv?a[3]:a[2]}</p>
      <p class="muted">Arcano ${a[0]}. A leitura é um convite à reflexão; a decisão é sempre sua.</p>
      <button class="btn ghost" type="button" id="nova" style="align-self:flex-start">Fazer nova pergunta</button></div>`;
    requestAnimationFrame(()=>setTimeout(()=>document.getElementById("card").classList.add("flipped"),120));
    document.getElementById("nova").onclick = () => { document.getElementById("q").focus(); res.hidden=true; };
    document.getElementById("q").value=""; hist();
  };
}

/* Numerologia */
function vNum(v){
  if (!mapa){
    v.innerHTML = `<div class="head"><span class="eyebrow">Numerologia cabalística</span><h2>Seu mapa ainda não foi gerado</h2><p class="muted">O mapa é calculado uma única vez a partir do nome de nascimento e fica salvo no seu perfil.</p></div>
    <div class="panel"><dl class="data"><dt>Nome</dt><dd>${esc(perfil.nome)}</dd><dt>Nascimento</dt><dd>${fmtDate(perfil.data_nascimento)}</dd></dl>
    <p class="hint" style="margin:14px 0">Confira se o nome está exatamente como no registro. Depois de gerado, o mapa não muda.</p><button class="btn" id="gerar">Gerar meu mapa</button><p class="err" id="n-err" role="alert"></p></div>`;
    document.getElementById("gerar").onclick = async () => {
      const btn=document.getElementById("gerar"); btn.disabled=true;
      const n = numerologia(perfil.nome, perfil.data_nascimento);
      const { data, error } = await sb.from("mapas_numerologicos").insert({
        nome_base:perfil.nome, destino:n.destino, expressao:n.expressao, motivacao:n.motivacao,
        impressao:n.impressao, missao:n.missao, dia_natalicio:n.diaNatalicio, letras:n.letters
      }).select().single();
      if (error){
        // já existe (ex.: gerado em outro aparelho) → carrega o salvo
        const r = await sb.from("mapas_numerologicos").select("*").eq("user_id", session.user.id).maybeSingle();
        if (r.data){ mapa=r.data; vNum(v); return; }
        btn.disabled=false; document.getElementById("n-err").textContent="Não foi possível gerar o mapa agora. Tente de novo."; return;
      }
      mapa=data; vNum(v); toast("Mapa gerado e salvo no seu perfil.");
    };
    return;
  }
  const m = { destino:mapa.destino, expressao:mapa.expressao, motivacao:mapa.motivacao, impressao:mapa.impressao, missao:mapa.missao, diaNatalicio:mapa.dia_natalicio };
  const box=(k,t,d)=>`<div class="numcard"><div class="tt"><span class="eyebrow">${t}</span><span class="big">${m[k]}</span></div><h3>${NUM_TXT[m[k]][0]}</h3><p class="muted">${d}</p><p>${NUM_TXT[m[k]][1]}</p></div>`;
  v.innerHTML = `<div class="head"><span class="eyebrow">Numerologia cabalística</span><h2>Mapa de ${esc(mapa.nome_base)}</h2><p class="muted">Gerado em ${dataBR(mapa.created_at)} · nascimento ${fmtDate(perfil.data_nascimento)}</p></div>
  <div class="panel soft"><span class="eyebrow">Valores de cada letra</span><div class="letters" style="margin-top:12px">${mapa.letras.map(l=>l.c===" "?'<span class="sp"></span>':`<span>${esc(l.c)}<i>${l.v}</i></span>`).join("")}</div></div>
  <div class="numgrid">
   ${box("destino","Destino","Soma da data de nascimento: o caminho que a vida propõe.")}
   ${box("expressao","Expressão","Soma de todas as letras: como você age no mundo.")}
   ${box("motivacao","Motivação","Soma das vogais: o que move sua alma.")}
   ${box("impressao","Impressão","Soma das consoantes: como os outros a percebem.")}
   ${box("missao","Missão","Expressão + Destino: o propósito a cumprir.")}
   ${box("diaNatalicio","Dia natalício","Dia do nascimento: o talento que você traz.")}
  </div>`;
}

/* Signos */
function vSignos(v){
  const mine=signoDe(perfil.data_nascimento); if (signoSel===null) signoSel = mine>=0 ? mine : 0;
  const s=SIGNOS[signoSel], hoje=new Date(), key=hoje.toLocaleDateString("sv-SE"), rnd=seeded(key+s[0]);
  const pick=a=>a[Math.floor(rnd()*a.length)], lucky=1+Math.floor(rnd()*9);
  v.innerHTML = `<div class="head"><span class="eyebrow">Horóscopo · ${hoje.toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})}</span><h2>Signos e previsões</h2><p class="muted">${mine>=0?`Seu signo solar é ${SIGNOS[mine][0]}. `:""}Toque em um signo para ver a previsão do dia.</p></div>
  <div class="signs">${SIGNOS.map((x,i)=>`<button class="sign" data-i="${i}" aria-pressed="${i===signoSel}"><span class="sy">${x[1]}</span><span>${x[0]}</span><small>${x[2]}</small></button>`).join("")}</div>
  <div class="panel"><div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:10px;margin-bottom:18px"><h2>${s[1]} ${s[0]}</h2><div class="meta"><span class="pill">${s[3]}</span><span class="pill">Regente: ${s[4]}</span><span class="pill">Número do dia: ${lucky}</span></div></div>
  <div class="forecast"><div><span class="eyebrow">Amor</span><p>${pick(PREV.amor)}</p></div><div><span class="eyebrow">Trabalho</span><p>${pick(PREV.trabalho)}</p></div><div><span class="eyebrow">Energia</span><p>${pick(PREV.energia)}</p></div></div></div>`;
  v.querySelectorAll(".sign").forEach(b=>b.onclick=()=>{ signoSel=+b.dataset.i; vSignos(v); });
}

/* Perfil */
async function salvarPerfil(campos){
  const { data, error } = await sb.from("profiles").update(campos).eq("id", session.user.id).select().single();
  if (error){ console.error(error); toast("Não foi possível salvar. Tente de novo."); return false; }
  perfil = data; return true;
}
function vPerfil(v){
  const si=signoDe(perfil.data_nascimento);
  v.innerHTML = `<div class="head"><span class="eyebrow">Perfil</span><h2>${esc(perfil.nome)}</h2></div>
  <div class="panel profile">
    ${avatarHTML("lg")}
    <div style="display:flex;flex-direction:column;gap:16px;min-width:0">
      <div><h3>Foto ou avatar</h3><p class="muted">Envie uma foto ou escolha um símbolo.</p></div>
      <label class="upload btn ghost" for="foto">Enviar foto<input type="file" id="foto" accept="image/jpeg,image/png,image/webp"></label>
      <div class="avatars">${Object.keys(AVATARS).map(k=>`<button data-a="${k}" aria-label="Avatar ${k}" aria-pressed="${perfil.avatar_tipo==="icone"&&perfil.avatar_icone===k}">${AVATARS[k]}</button>`).join("")}</div>
    </div>
  </div>
  <div class="panel"><h3 style="margin-bottom:14px">Dados de nascimento</h3><dl class="data">
    <dt>Data</dt><dd>${fmtDate(perfil.data_nascimento)}</dd><dt>Hora</dt><dd>${esc((perfil.hora_nascimento||"").slice(0,5))||"—"}</dd><dt>Cidade</dt><dd>${esc(perfil.cidade_nascimento)||"—"}</dd>
    <dt>Signo solar</dt><dd>${si>=0?SIGNOS[si][0]:"—"}</dd><dt>Mapa numerológico</dt><dd>${mapa?"Gerado em "+dataBR(mapa.created_at):"Ainda não gerado"}</dd></dl>
    <p class="hint" style="margin-top:14px">Para corrigir dados de nascimento, fale com o atendimento.</p></div>
  <form class="panel form" id="f-cont"><h3>Contato</h3><div class="grid2">
    <div class="field"><label for="p-email">E-mail</label><input id="p-email" value="${esc(perfil.email)}" disabled></div>
    <div class="field"><label for="p-whats">WhatsApp</label><input id="p-whats" type="tel" value="${esc(perfil.whatsapp)}"></div></div>
    <button class="btn" style="align-self:flex-start">Salvar contato</button></form>`;
  v.querySelectorAll("[data-a]").forEach(b=>b.onclick=async()=>{
    if (await salvarPerfil({ avatar_tipo:"icone", avatar_icone:b.dataset.a })){ renderApp(); toast("Avatar atualizado."); }
  });
  document.getElementById("foto").onchange = e => {
    const f=e.target.files[0]; if(!f) return;
    const rd=new FileReader();
    rd.onload=()=>{ const img=new Image(); img.onload=()=>{
      const c=document.createElement("canvas"), S=400, k=Math.min(img.width,img.height); c.width=c.height=S;
      c.getContext("2d").drawImage(img,(img.width-k)/2,(img.height-k)/2,k,k,0,0,S,S);
      c.toBlob(async blob=>{
        toast("Enviando foto…");
        const path = `${session.user.id}/avatar.jpg`;
        const up = await sb.storage.from("avatars").upload(path, blob, { upsert:true, contentType:"image/jpeg" });
        if (up.error){ console.error(up.error); toast("Não foi possível enviar a foto. Use JPG ou PNG de até 2 MB."); return; }
        const url = sb.storage.from("avatars").getPublicUrl(path).data.publicUrl + "?v=" + Date.now();
        if (await salvarPerfil({ avatar_tipo:"foto", avatar_url:url })){ renderApp(); toast("Foto atualizada."); }
      }, "image/jpeg", .86);
    }; img.src=rd.result; };
    rd.readAsDataURL(f);
  };
  document.getElementById("f-cont").onsubmit = async e => {
    e.preventDefault(); const w=document.getElementById("p-whats").value.trim();
    if (w.replace(/\D/g,"").length<10) return toast("Digite o WhatsApp com DDD.");
    if (await salvarPerfil({ whatsapp:w })) toast("Contato salvo.");
  };
}

/* ---------- Início ---------- */
window.addEventListener("hashchange", () => { if (session && perfil) renderApp(); });
window.addEventListener("resize", () => { clearTimeout(drawSky.t); drawSky.t=setTimeout(drawSky,200); });
if (configured){
  sb.auth.onAuthStateChange((evento, s) => {
    const mudouUsuario = (s?.user?.id) !== (session?.user?.id);
    session = s;
    if (mudouUsuario){ perfil=null; mapa=null; tiragens=[]; signoSel=null; }
    // setTimeout evita travar o cliente ao chamar o Supabase dentro deste callback
    if (evento==="PASSWORD_RECOVERY") return setTimeout(renderNovaSenha, 0);
    if (mudouUsuario || evento==="INITIAL_SESSION") setTimeout(render, 0);
  });
} else render();

function renderNovaSenha(){
  root.innerHTML = `<main><div class="view" style="max-width:460px"><form class="form panel" id="f-ns"><h2>Nova senha</h2>
  <div class="field"><label for="ns">Digite a nova senha</label><input id="ns" type="password" minlength="6" autocomplete="new-password"></div>
  <p class="err" id="ns-err" role="alert"></p><button class="btn">Salvar nova senha</button></form></div></main>`;
  document.getElementById("f-ns").onsubmit = async e => {
    e.preventDefault(); const p=document.getElementById("ns").value;
    if (p.length<6) return document.getElementById("ns-err").textContent="A senha precisa de pelo menos 6 caracteres.";
    const { error } = await sb.auth.updateUser({ password:p });
    if (error) return document.getElementById("ns-err").textContent=erroMsg(error);
    toast("Senha atualizada."); render();
  };
}
