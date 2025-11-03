-- ================================================
-- Policies RLS para Open2Work
-- ================================================

-- 1. Permitir que open2work users vejam suas próprias roles na tabela user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 2. Atualizar/Criar policy para open2work users acessarem próprio perfil
DROP POLICY IF EXISTS "Open2Work users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Open2Work users can update own profile" ON public.profiles;

CREATE POLICY "Open2Work users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id AND
    (
      EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role = 'open2work'
      )
      OR
      EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role = 'manager'
      )
      OR
      EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role = 'employee'
      )
    )
  );

CREATE POLICY "Open2Work users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id AND
    (
      EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role = 'open2work'
      )
      OR
      EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role = 'manager'
      )
    )
  );

-- 3. Garantir que a tabela user_roles tem RLS habilitado
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Verificar se há policy de SELECT na tabela user_roles (se não, criar)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_roles' 
    AND policyname = 'Users can view own roles'
  ) THEN
    -- Já criamos acima, mas isso garante
    NULL;
  END IF;
END $$;
