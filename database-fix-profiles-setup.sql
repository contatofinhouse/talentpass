-- =====================================================
-- CORRIGIR CONFIGURAÇÃO DA TABELA PROFILES
-- Execute este SQL no SQL Editor do Supabase
-- =====================================================

-- 1. Criar tabela profiles se não existir
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  company_name text,
  phone text,
  cnpj text,
  employee_count text,
  status text default 'trial' check (status in ('trial', 'active')),
  manager_id uuid references public.profiles(id),
  company_id uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Enable RLS
alter table public.profiles enable row level security;

-- 3. Remover políticas antigas que possam estar conflitando
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;

-- 4. Criar políticas RLS corretas
-- Usuários podem ver seu próprio perfil
create policy "Users can view own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

-- Usuários podem atualizar seu próprio perfil
create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- Usuários podem inserir seu próprio perfil
create policy "Users can insert own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- 5. Criar trigger para criar perfil automaticamente
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, company_name, phone, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'company_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    'trial'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- 6. Criar trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 7. Criar perfis para usuários existentes que não têm perfil
insert into public.profiles (id, name, email, company_name, phone, status)
select 
  au.id,
  coalesce(au.raw_user_meta_data->>'name', ''),
  au.email,
  coalesce(au.raw_user_meta_data->>'company_name', ''),
  coalesce(au.raw_user_meta_data->>'phone', ''),
  'trial'
from auth.users au
where not exists (
  select 1 from public.profiles p where p.id = au.id
)
on conflict (id) do nothing;

-- 8. IMPORTANTE: Atualizar status para 'active' dos managers que devem ter acesso
-- Substitua 'seu-email@exemplo.com' pelo email do seu manager
-- Exemplo:
-- update public.profiles
-- set status = 'active'
-- where email = 'edu@gmail.com';

-- Descomente e execute a linha abaixo com seu email:
-- update public.profiles set status = 'active' where email = 'edu@gmail.com';
