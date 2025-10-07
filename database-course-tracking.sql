-- Tabela para rastrear cursos favoritos e concluídos pelos gestores
create table if not exists public.manager_course_tracking (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  course_id text not null,
  is_favorite boolean default false,
  is_completed boolean default false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique (user_id, course_id)
);

-- Habilitar RLS
alter table public.manager_course_tracking enable row level security;

-- Políticas RLS: usuários podem ver e gerenciar apenas seus próprios registros
create policy "Users can view their own course tracking"
  on public.manager_course_tracking
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own course tracking"
  on public.manager_course_tracking
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own course tracking"
  on public.manager_course_tracking
  for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete their own course tracking"
  on public.manager_course_tracking
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Índices para melhorar performance
create index if not exists idx_manager_course_tracking_user_id 
  on public.manager_course_tracking(user_id);

create index if not exists idx_manager_course_tracking_course_id 
  on public.manager_course_tracking(course_id);

create index if not exists idx_manager_course_tracking_is_favorite 
  on public.manager_course_tracking(is_favorite) where is_favorite = true;

create index if not exists idx_manager_course_tracking_is_completed 
  on public.manager_course_tracking(is_completed) where is_completed = true;
