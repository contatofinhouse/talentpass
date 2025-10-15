-- =====================================================
-- TRIGGER PARA CONFIGURAR EMPLOYEE APÓS ACEITAR CONVITE
-- Execute este SQL no SQL Editor do Supabase
-- =====================================================

-- Função que será executada quando um usuário aceitar o convite
create or replace function public.handle_employee_invite()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  manager_uuid uuid;
begin
  -- Verificar se o usuário tem manager_id nos metadados
  manager_uuid := (new.raw_user_meta_data->>'manager_id')::uuid;
  
  if manager_uuid is not null then
    -- 1. Criar vínculo na tabela employees
    insert into public.employees (manager_id, employee_id)
    values (manager_uuid, new.id)
    on conflict (manager_id, employee_id) do nothing;
    
    -- 2. Adicionar role de employee
    insert into public.user_roles (user_id, role)
    values (new.id, 'employee')
    on conflict (user_id, role) do nothing;
    
    -- 3. Criar perfil do employee
    insert into public.profiles (id, name)
    values (new.id, new.raw_user_meta_data->>'name')
    on conflict (id) do update
    set name = excluded.name;
  end if;
  
  return new;
end;
$$;

-- Criar trigger que executa após confirmação do email
drop trigger if exists on_employee_invite_accepted on auth.users;
create trigger on_employee_invite_accepted
  after insert on auth.users
  for each row
  when (new.raw_user_meta_data->>'manager_id' is not null)
  execute function public.handle_employee_invite();

-- Também executar quando o usuário atualizar (caso aceite convite depois)
drop trigger if exists on_employee_invite_accepted_update on auth.users;
create trigger on_employee_invite_accepted_update
  after update on auth.users
  for each row
  when (
    new.email_confirmed_at is not null and
    old.email_confirmed_at is null and
    new.raw_user_meta_data->>'manager_id' is not null
  )
  execute function public.handle_employee_invite();
