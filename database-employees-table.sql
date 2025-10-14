-- =====================================================
-- CRIAR TABELA EMPLOYEES PARA VINCULAR GESTORES E FUNCIONÁRIOS
-- Execute este SQL no SQL Editor do Supabase
-- =====================================================

-- 1. Criar tabela employees
create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  manager_id uuid not null references public.profiles(id) on delete cascade,
  employee_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(manager_id, employee_id)
);

-- 2. Criar índices para performance
create index if not exists employees_manager_id_idx on public.employees(manager_id);
create index if not exists employees_employee_id_idx on public.employees(employee_id);

-- 3. Enable RLS
alter table public.employees enable row level security;

-- 4. RLS Policies para employees

-- Managers podem visualizar seus employees
create policy "Managers can view their employees"
  on public.employees for select
  to authenticated
  using (
    public.has_role(auth.uid(), 'manager') and
    manager_id = auth.uid()
  );

-- Managers podem inserir employees (somente se status = active)
create policy "Managers can insert employees"
  on public.employees for insert
  to authenticated
  with check (
    public.has_role(auth.uid(), 'manager') and
    manager_id = auth.uid() and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and status = 'active'
    )
  );

-- Managers podem deletar seus employees
create policy "Managers can delete their employees"
  on public.employees for delete
  to authenticated
  using (
    public.has_role(auth.uid(), 'manager') and
    manager_id = auth.uid()
  );

-- Employees podem visualizar sua própria relação
create policy "Employees can view their own record"
  on public.employees for select
  to authenticated
  using (
    public.has_role(auth.uid(), 'employee') and
    employee_id = auth.uid()
  );

-- 5. Atualizar RLS policies de user_roles para usar a tabela employees

-- Remover policies antigas de managers (se existirem)
drop policy if exists "Managers can insert employee roles" on public.user_roles;
drop policy if exists "Managers can delete employee roles" on public.user_roles;
drop policy if exists "Managers can view employee roles" on public.user_roles;

-- Managers podem inserir roles de employee para usuários vinculados
create policy "Managers can insert employee roles"
  on public.user_roles for insert
  to authenticated
  with check (
    public.has_role(auth.uid(), 'manager') and
    role = 'employee' and
    user_id in (
      select employee_id from public.employees 
      where manager_id = auth.uid()
    )
  );

-- Managers podem deletar roles de employee de usuários vinculados
create policy "Managers can delete employee roles"
  on public.user_roles for delete
  to authenticated
  using (
    public.has_role(auth.uid(), 'manager') and
    role = 'employee' and
    user_id in (
      select employee_id from public.employees 
      where manager_id = auth.uid()
    )
  );

-- Managers podem visualizar roles de employee de usuários vinculados
create policy "Managers can view employee roles"
  on public.user_roles for select
  to authenticated
  using (
    public.has_role(auth.uid(), 'manager') and
    user_id in (
      select employee_id from public.employees 
      where manager_id = auth.uid()
    )
  );

-- 6. Atualizar RLS policies de profiles para usar a tabela employees

-- Remover policies antigas de managers (se existirem)
drop policy if exists "Managers can insert employees" on public.profiles;
drop policy if exists "Managers can delete employees" on public.profiles;
drop policy if exists "Managers can update employees" on public.profiles;

-- Managers podem visualizar profiles de seus employees
create policy "Managers can view employee profiles"
  on public.profiles for select
  to authenticated
  using (
    public.has_role(auth.uid(), 'manager') and
    id in (
      select employee_id from public.employees 
      where manager_id = auth.uid()
    )
  );

-- 7. Migrar dados existentes (se houver manager_id em profiles)
-- Comentado para evitar erros se não houver dados ou coluna
/*
insert into public.employees (manager_id, employee_id)
select manager_id, id
from public.profiles
where manager_id is not null
on conflict do nothing;
*/

-- 8. Remover coluna manager_id da tabela profiles (opcional, após migração)
-- Comentado para execução manual após verificação
/*
alter table public.profiles drop column if exists manager_id;
*/
