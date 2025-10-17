/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase";
import { useToast } from "@/hooks/use-toast";

const EDGE_FUNCTION_URL =
  "https://tpwafkhuetbrdlykyegy.supabase.co/functions/v1/hyper-endpoint";

export interface Employee {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

interface UseEmployeeActionsProps {
  userId?: string;
  role?: string;
}

export const useEmployeeActions = ({ userId, role }: UseEmployeeActionsProps) => {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Buscar colaboradores
  const fetchEmployees = useCallback(async () => {
    if (!userId || role !== "manager") return;

    const { data, error } = await supabase
      .from("employees")
      .select("employee_id, created_at, profiles!employees_employee_id_fkey (id, name, email)")
      .eq("manager_id", userId);

    if (error) {
      console.error(error);
      toast({ title: "Erro", description: "Falha ao carregar colaboradores.", variant: "destructive" });
      return;
    }

    const list = (data ?? [])
      .filter((row: any) => row.profiles)
      .map((row: any) => ({
        id: String(row.profiles.id),
        name: String(row.profiles.name ?? ""),
        email: String(row.profiles.email ?? ""),
        created_at: String(row.created_at ?? ""),
      }));

    setEmployees(list);
  }, [userId, role, toast]);

  // 🔹 Adicionar colaborador
  const addEmployee = useCallback(
    async (name: string, email: string) => {
      if (role !== "manager") return;
      if (!name || !email) {
        toast({ title: "Erro", description: "Preencha nome e e-mail", variant: "destructive" });
        return;
      }

      setLoading(true);

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token || !userId) {
          toast({
            title: "Erro de autenticação",
            description: "Sessão inválida. Faça login novamente.",
            variant: "destructive",
          });
          return;
        }

        const res = await fetch(EDGE_FUNCTION_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ name, email, manager_id: userId }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? "Erro ao enviar convite");

        toast({ title: "Sucesso", description: "Convite enviado com sucesso." });
        await fetchEmployees();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erro inesperado";
        toast({ title: "Erro", description: msg, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    },
    [role, userId, toast, fetchEmployees]
  );

  // 🔹 Remover colaborador
  const deleteEmployee = useCallback(
    async (employeeId: string) => {
      if (role !== "manager") return;

      try {
        const { error: relError } = await supabase
          .from("employees")
          .delete()
          .eq("employee_id", employeeId)
          .eq("manager_id", userId ?? "");

        if (relError) throw relError;

        const { error: profileError } = await supabase
          .from("profiles")
          .delete()
          .eq("id", employeeId);

        if (profileError) throw profileError;

        toast({ title: "Sucesso", description: "Colaborador removido com sucesso." });
        await fetchEmployees();
      } catch (error) {
        console.error("Erro ao deletar colaborador:", error);
        toast({
          title: "Erro",
          description: "Não foi possível remover o colaborador.",
          variant: "destructive",
        });
      }
    },
    [role, userId, toast, fetchEmployees]
  );

  return {
    employees,
    loading,
    fetchEmployees,
    addEmployee,
    deleteEmployee,
  };
};
