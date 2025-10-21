-- Tabela para armazenar badges conquistados pelos usuários
create table if not exists public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  badge_type text not null,
  earned_at timestamp with time zone default now(),
  unique(user_id, badge_type)
);

-- Habilitar RLS
alter table public.user_badges enable row level security;

-- Políticas RLS: usuários podem ver apenas seus próprios badges
create policy "Users can view own badges"
  on public.user_badges
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own badges"
  on public.user_badges
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Índices para melhorar performance
create index if not exists idx_user_badges_user_id 
  on public.user_badges(user_id);

create index if not exists idx_user_badges_type 
  on public.user_badges(badge_type);
