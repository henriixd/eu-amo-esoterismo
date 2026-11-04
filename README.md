# Eu Amo Esoterismo

Micro SaaS esotérico: cadastro com dados de nascimento, tiragem de tarô (uma carta por pergunta), mapa numerológico cabalístico (gerado uma vez e salvo), signos com previsões diárias e perfil com foto ou avatar.

Site estático (HTML, CSS e JavaScript puro) com **Supabase** para login, banco de dados e fotos.

## Estrutura

| Arquivo | Conteúdo |
|---|---|
| `index.html` | Página principal |
| `styles.css` | Visual (branco e roxo, tema claro e escuro) |
| `data.js` | Arcanos, tabela cabalística, signos, previsões e cálculos |
| `app.js` | Telas e integração com o Supabase |
| `config.js` | URL e chave pública do Supabase, links das redes sociais |
| `supabase/schema.sql` | Tabelas, segurança (RLS) e bucket de fotos |

## Banco de dados

- `profiles`: nome, nascimento (data, hora, cidade), e-mail, WhatsApp, avatar e data do aceite LGPD. Criado automaticamente no cadastro.
- `tiragens`: cada pergunta com a carta sorteada e se saiu invertida. Histórico permanente.
- `mapas_numerologicos`: um mapa por cliente, sem edição.
- Storage `avatars`: fotos de perfil, uma pasta por cliente.

Cada cliente só acessa os próprios dados. Você vê todos os cadastros no painel do Supabase (Table Editor).

## Como configurar

1. Crie um projeto em [supabase.com](https://supabase.com) (região São Paulo, `sa-east-1`).
2. Em **SQL Editor**, cole e rode `supabase/schema.sql`.
3. Em **Project Settings → API**, copie a *Project URL* e a chave *anon / publishable* para `config.js`.
4. Em **Authentication → URL Configuration**, coloque o endereço do site em *Site URL* (para o link de confirmação de e-mail).
5. Publique a pasta em qualquer hospedagem estática (Vercel, Netlify, GitHub Pages).

Para testar localmente: `npx serve .` e abra `http://localhost:3000`.

## Próximos passos

- Ligar os links de Instagram e Facebook em `config.js`.
- Textos próprios para as previsões dos signos.
- Página de política de privacidade (LGPD).
- Planos pagos (tiragens extras, mapa completo).
