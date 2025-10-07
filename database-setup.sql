-- =====================================================
-- LOVABLE LEARNING PLATFORM - DATABASE SETUP
-- Execute este SQL no SQL Editor do Supabase
-- Este script é idempotente (pode ser executado múltiplas vezes)
-- =====================================================

-- Create enum for user roles (only if not exists)
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'employee');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create enum for course categories (only if not exists)
DO $$ BEGIN
    CREATE TYPE public.course_category AS ENUM ('Comunicação', 'Vendas', 'Gestão', 'Marketing', 'TI', 'Suporte');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- COMPANIES TABLE
-- =====================================================
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.companies enable row level security;

-- =====================================================
-- PROFILES TABLE
-- =====================================================
create table if not exists public.profiles (
  id uuid not null,
  company_id uuid null,
  name text not null,
  email text not null,
  phone text null,
  company_name text null,
  cnpj text null,
  employee_count text null,
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone('utc'::text, now()),
  constraint profiles_pkey primary key (id),
  constraint profiles_company_id_fkey foreign key (company_id) references companies(id) on delete cascade,
  constraint profiles_id_fkey foreign key (id) references auth.users(id) on delete cascade
);

alter table public.profiles enable row level security;

-- =====================================================
-- USER ROLES TABLE (CRITICAL: Separate table for security)
-- =====================================================
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- =====================================================
-- COURSES TABLE
-- =====================================================
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  category course_category not null,
  duration text not null,
  description text not null,
  video_url text not null,
  content text not null,
  summary text,
  skills text[] not null default '{}',
  image_url text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.courses enable row level security;

-- =====================================================
-- COURSE RESOURCES TABLE
-- =====================================================
create table if not exists public.course_resources (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete cascade not null,
  file_name text not null,
  file_url text not null,
  file_type text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.course_resources enable row level security;

-- =====================================================
-- COURSE ENROLLMENTS TABLE
-- =====================================================
create table if not exists public.course_enrollments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (course_id, user_id)
);

alter table public.course_enrollments enable row level security;

-- =====================================================
-- COURSE PROGRESS TABLE
-- =====================================================
create table if not exists public.course_progress (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  completed boolean default false,
  progress_percentage integer default 0 check (progress_percentage >= 0 and progress_percentage <= 100),
  completed_at timestamp with time zone,
  last_accessed timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (course_id, user_id)
);

alter table public.course_progress enable row level security;

-- =====================================================
-- SECURITY DEFINER FUNCTION (prevents RLS recursion)
-- =====================================================
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- =====================================================
-- FUNCTION TO CREATE PROFILE ON SIGNUP
-- =====================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id, 
    name, 
    email,
    phone,
    company_name,
    cnpj,
    employee_count
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'companyName',
    new.raw_user_meta_data->>'cnpj',
    new.raw_user_meta_data->>'employeeCount'
  );
  return new;
end;
$$;

-- Trigger to create profile on user signup (only if not exists)
DO $$ BEGIN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Companies: Only admins can manage
drop policy if exists "Admins can view all companies" on public.companies;
create policy "Admins can view all companies"
  on public.companies for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can insert companies" on public.companies;
create policy "Admins can insert companies"
  on public.companies for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can update companies" on public.companies;
create policy "Admins can update companies"
  on public.companies for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Profiles: Users can view their own, managers/admins can view their company
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Managers can view company profiles" on public.profiles;
create policy "Managers can view company profiles"
  on public.profiles for select
  to authenticated
  using (
    public.has_role(auth.uid(), 'manager') and
    company_id = (select company_id from public.profiles where id = auth.uid())
  );

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles"
  on public.profiles for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- User Roles: Admins can manage all, users can view their own
drop policy if exists "Users can view own roles" on public.user_roles;
create policy "Users can view own roles"
  on public.user_roles for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Admins can view all roles" on public.user_roles;
create policy "Admins can view all roles"
  on public.user_roles for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can insert roles" on public.user_roles;
create policy "Admins can insert roles"
  on public.user_roles for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can delete roles" on public.user_roles;
create policy "Admins can delete roles"
  on public.user_roles for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Courses: All authenticated users can view, admins can manage
drop policy if exists "Authenticated users can view courses" on public.courses;
create policy "Authenticated users can view courses"
  on public.courses for select
  to authenticated
  using (true);

drop policy if exists "Admins can insert courses" on public.courses;
create policy "Admins can insert courses"
  on public.courses for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can update courses" on public.courses;
create policy "Admins can update courses"
  on public.courses for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can delete courses" on public.courses;
create policy "Admins can delete courses"
  on public.courses for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Course Resources: Follow course permissions
drop policy if exists "Authenticated users can view resources" on public.course_resources;
create policy "Authenticated users can view resources"
  on public.course_resources for select
  to authenticated
  using (true);

drop policy if exists "Admins can insert resources" on public.course_resources;
create policy "Admins can insert resources"
  on public.course_resources for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can delete resources" on public.course_resources;
create policy "Admins can delete resources"
  on public.course_resources for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Course Enrollments: Users can view their own, managers can view company enrollments
drop policy if exists "Users can view own enrollments" on public.course_enrollments;
create policy "Users can view own enrollments"
  on public.course_enrollments for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Managers can view company enrollments" on public.course_enrollments;
create policy "Managers can view company enrollments"
  on public.course_enrollments for select
  to authenticated
  using (
    public.has_role(auth.uid(), 'manager') and
    user_id in (
      select id from public.profiles 
      where company_id = (select company_id from public.profiles where id = auth.uid())
    )
  );

drop policy if exists "Admins can manage enrollments" on public.course_enrollments;
create policy "Admins can manage enrollments"
  on public.course_enrollments for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Course Progress: Users can manage their own, managers can view company progress
drop policy if exists "Users can view own progress" on public.course_progress;
create policy "Users can view own progress"
  on public.course_progress for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Users can update own progress" on public.course_progress;
create policy "Users can update own progress"
  on public.course_progress for update
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Users can insert own progress" on public.course_progress;
create policy "Users can insert own progress"
  on public.course_progress for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "Managers can view company progress" on public.course_progress;
create policy "Managers can view company progress"
  on public.course_progress for select
  to authenticated
  using (
    public.has_role(auth.uid(), 'manager') and
    user_id in (
      select id from public.profiles 
      where company_id = (select company_id from public.profiles where id = auth.uid())
    )
  );

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================

-- Course images bucket (only if not exists)
insert into storage.buckets (id, name, public)
values ('course-images', 'course-images', true)
on conflict (id) do nothing;

-- Course resources bucket (only if not exists)
insert into storage.buckets (id, name, public)
values ('course-resources', 'course-resources', true)
on conflict (id) do nothing;

-- Storage policies for course images
drop policy if exists "Anyone can view course images" on storage.objects;
create policy "Anyone can view course images"
  on storage.objects for select
  using (bucket_id = 'course-images');

drop policy if exists "Admins can upload course images" on storage.objects;
create policy "Admins can upload course images"
  on storage.objects for insert
  with check (
    bucket_id = 'course-images' and
    public.has_role(auth.uid(), 'admin')
  );

drop policy if exists "Admins can delete course images" on storage.objects;
create policy "Admins can delete course images"
  on storage.objects for delete
  using (
    bucket_id = 'course-images' and
    public.has_role(auth.uid(), 'admin')
  );

-- Storage policies for course resources
drop policy if exists "Authenticated users can view course resources" on storage.objects;
create policy "Authenticated users can view course resources"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'course-resources');

drop policy if exists "Admins can upload course resources" on storage.objects;
create policy "Admins can upload course resources"
  on storage.objects for insert
  with check (
    bucket_id = 'course-resources' and
    public.has_role(auth.uid(), 'admin')
  );

drop policy if exists "Admins can delete course resources" on storage.objects;
create policy "Admins can delete course resources"
  on storage.objects for delete
  using (
    bucket_id = 'course-resources' and
    public.has_role(auth.uid(), 'admin')
  );

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
create index if not exists profiles_company_id_idx on public.profiles(company_id);
create index if not exists user_roles_user_id_idx on public.user_roles(user_id);
create index if not exists user_roles_role_idx on public.user_roles(role);
create index if not exists courses_category_idx on public.courses(category);
create index if not exists course_resources_course_id_idx on public.course_resources(course_id);
create index if not exists course_enrollments_user_id_idx on public.course_enrollments(user_id);
create index if not exists course_enrollments_course_id_idx on public.course_enrollments(course_id);
create index if not exists course_progress_user_id_idx on public.course_progress(user_id);
create index if not exists course_progress_course_id_idx on public.course_progress(course_id);
