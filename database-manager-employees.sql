-- =====================================================
-- ADICIONAR CAMPOS NECESSÁRIOS PARA MANAGER/EMPLOYEE
-- Execute este SQL no SQL Editor do Supabase
-- =====================================================

-- 1. Adicionar coluna de status à tabela profiles (se ainda não existir)
-- Se já existe, pode ignorar este comando
alter table public.profiles 
  add column if not exists status text default 'trial' check (status in ('trial', 'active'));

-- 2. Adicionar coluna manager_id para vincular employees aos managers
alter table public.profiles 
  add column if not exists manager_id uuid references public.profiles(id) on delete set null;

-- 3. Criar índice para performance
create index if not exists profiles_manager_id_idx on public.profiles(manager_id);

-- 4. Atualizar RLS para permitir managers inserirem/excluírem employees
-- Managers podem inserir employees vinculados a eles
create policy "Managers can insert employees"
  on public.profiles for insert
  to authenticated
  with check (
    public.has_role(auth.uid(), 'manager') and
    status = 'active' and
    manager_id = auth.uid()
  );

-- Managers podem deletar employees vinculados a eles
create policy "Managers can delete employees"
  on public.profiles for delete
  to authenticated
  using (
    public.has_role(auth.uid(), 'manager') and
    manager_id = auth.uid()
  );

-- Managers podem atualizar employees vinculados a eles
create policy "Managers can update employees"
  on public.profiles for update
  to authenticated
  using (
    public.has_role(auth.uid(), 'manager') and
    manager_id = auth.uid()
  );

-- 5. Permitir managers gerenciar roles de seus employees
create policy "Managers can insert employee roles"
  on public.user_roles for insert
  to authenticated
  with check (
    public.has_role(auth.uid(), 'manager') and
    role = 'employee' and
    user_id in (
      select id from public.profiles 
      where manager_id = auth.uid()
    )
  );

create policy "Managers can delete employee roles"
  on public.user_roles for delete
  to authenticated
  using (
    public.has_role(auth.uid(), 'manager') and
    role = 'employee' and
    user_id in (
      select id from public.profiles 
      where manager_id = auth.uid()
    )
  );

create policy "Managers can view employee roles"
  on public.user_roles for select
  to authenticated
  using (
    public.has_role(auth.uid(), 'manager') and
    user_id in (
      select id from public.profiles 
      where manager_id = auth.uid()
    )
  );
