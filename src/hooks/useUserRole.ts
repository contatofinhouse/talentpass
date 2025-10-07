import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase";

type UserRole = "admin" | "manager" | "employee";

export function useUserRole(userId: string | undefined) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (!userId) {
      setRole(null);
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      try {
        const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId);

        if (isMounted) {
          if (error) {
            console.error("Erro ao buscar role:", error);
            setRole(null);
          } else {
            const roles = data?.map((r) => r.role) || [];
            if (roles.includes("admin")) setRole("admin");
            else if (roles.includes("manager")) setRole("manager");
            else if (roles.includes("employee")) setRole("employee");
            else setRole(null);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setLoading(false);
      }
    };

    fetchRole();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return { role, loading };
}
