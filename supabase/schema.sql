-- Eu Amo Esoterismo — schema do banco (Supabase / Postgres)
-- Rode este arquivo inteiro no SQL Editor do Supabase (ou via CLI/MCP).
-- Todas as tabelas usam Row Level Security: cada cliente só lê e grava os próprios dados.

-- =========================================================
-- 1. Perfis (dados de cadastro de cada cliente)
-- =========================================================
create table if not exists public.profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  nome             text not null,
  data_nascimento  date not null,
  hora_nascimento  time,
  cidade_nascimento text,
  email            text not null,
  whatsapp         text not null,
  avatar_tipo      text not null default 'icone' check (avatar_tipo in ('icone','foto')),
  avatar_icone     text not null default 'lua',
  avatar_url       text,
  aceite_termos_em timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "perfil: ler o próprio" on public.profiles;
create policy "perfil: ler o próprio" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "perfil: atualizar o próprio" on public.profiles;
create policy "perfil: atualizar o próprio" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Nome, nascimento e e-mail não podem ser alterados pelo cliente
-- (o mapa numerológico depende deles). Só WhatsApp e avatar.
create or replace function public.protege_campos_perfil()
returns trigger language plpgsql as $$
begin
  if auth.role() = 'authenticated' then
    new.nome := old.nome;
    new.data_nascimento := old.data_nascimento;
    new.hora_nascimento := old.hora_nascimento;
    new.cidade_nascimento := old.cidade_nascimento;
    new.email := old.email;
    new.aceite_termos_em := old.aceite_termos_em;
    new.created_at := old.created_at;
  end if;
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists trg_protege_perfil on public.profiles;
create trigger trg_protege_perfil before update on public.profiles
  for each row execute function public.protege_campos_perfil();

-- Cria o perfil automaticamente quando a conta é criada no Auth,
-- usando os dados enviados no cadastro (funciona mesmo com confirmação de e-mail ligada).
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nome, data_nascimento, hora_nascimento, cidade_nascimento,
                               email, whatsapp, aceite_termos_em)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', ''),
    (new.raw_user_meta_data->>'data_nascimento')::date,
    nullif(new.raw_user_meta_data->>'hora_nascimento','')::time,
    nullif(new.raw_user_meta_data->>'cidade_nascimento',''),
    new.email,
    coalesce(new.raw_user_meta_data->>'whatsapp', ''),
    nullif(new.raw_user_meta_data->>'aceite_termos_em','')::timestamptz
  );
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================
-- 2. Tiragens de tarô (uma pergunta por carta)
-- =========================================================
create table if not exists public.tiragens (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users(id) on delete cascade default auth.uid(),
  pergunta   text not null check (char_length(pergunta) between 5 and 160),
  carta      smallint not null check (carta between 0 and 21),
  invertida  boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists tiragens_user_idx on public.tiragens (user_id, created_at desc);

alter table public.tiragens enable row level security;

drop policy if exists "tiragens: ler as próprias" on public.tiragens;
create policy "tiragens: ler as próprias" on public.tiragens
  for select using (auth.uid() = user_id);

drop policy if exists "tiragens: criar as próprias" on public.tiragens;
create policy "tiragens: criar as próprias" on public.tiragens
  for insert with check (auth.uid() = user_id);
-- Sem update/delete: o histórico é permanente.

-- =========================================================
-- 3. Mapa numerológico cabalístico (1 por cadastro, imutável)
-- =========================================================
create table if not exists public.mapas_numerologicos (
  user_id      uuid primary key references auth.users(id) on delete cascade default auth.uid(),
  nome_base    text not null,
  destino      smallint not null,
  expressao    smallint not null,
  motivacao    smallint not null,
  impressao    smallint not null,
  missao       smallint not null,
  dia_natalicio smallint not null,
  letras       jsonb not null,
  created_at   timestamptz not null default now()
);

alter table public.mapas_numerologicos enable row level security;

drop policy if exists "mapa: ler o próprio" on public.mapas_numerologicos;
create policy "mapa: ler o próprio" on public.mapas_numerologicos
  for select using (auth.uid() = user_id);

drop policy if exists "mapa: criar uma vez" on public.mapas_numerologicos;
create policy "mapa: criar uma vez" on public.mapas_numerologicos
  for insert with check (auth.uid() = user_id);
-- A chave primária em user_id garante um único mapa; sem update/delete.

-- =========================================================
-- 4. Fotos de perfil (Storage)
-- =========================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

drop policy if exists "avatars: enviar na própria pasta" on storage.objects;
create policy "avatars: enviar na própria pasta" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "avatars: trocar na própria pasta" on storage.objects;
create policy "avatars: trocar na própria pasta" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "avatars: leitura pública" on storage.objects;
create policy "avatars: leitura pública" on storage.objects
  for select using (bucket_id = 'avatars');

-- =========================================================
-- 5. Ajustes de segurança (avisos do Security Advisor)
-- =========================================================
alter function public.protege_campos_perfil() set search_path = public;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.protege_campos_perfil() from public, anon, authenticated;

-- =========================================================
-- 6. Leitura aprofundada (IA) — gravada só pela Edge Function 'leitura'
-- =========================================================
alter table public.tiragens
  add column if not exists leitura_ia text,
  add column if not exists leitura_ia_em timestamptz,
  add column if not exists leitura_ia_crise boolean not null default false;
create index if not exists tiragens_leitura_ia_idx on public.tiragens (user_id, leitura_ia_em);
