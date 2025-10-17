/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase";
import { useAuth } from "@/hooks/useAuth";

export type UserRole = "manager" | "employee" | null;

export interface Profile {
  id: string;
  name: string;
  email: string;
  company_name?: string | null;
  cnpj?: string | null;
  phone?: string | null;
  employee_count?: string | null;
  status?: string | null;
  user_roles?: { role: UserRole }[]; // ✅ tipagem correta
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchProfile = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          name,
          email,
          company_name,
          cnpj,
          phone,
          employee_count,
          status,
          user_roles ( role )
        `)
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Erro ao buscar perfil:", error);
        setLoading(false);
        return;
      }

      if (data) {
        const userRole =
          Array.isArray(data.user_roles) && data.user_roles.length > 0
            ? (data.user_roles[0].role as UserRole)
            : "manager"; // fallback padrão

        setProfile(data);
        setRole(userRole);
      }

      setLoading(false);
    };

    fetchProfile();
  }, [user?.id]);

  return { user, profile, role, loading };
};
