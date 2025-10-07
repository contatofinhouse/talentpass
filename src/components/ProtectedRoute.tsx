import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole(user?.id);

  // 🔹 Enquanto carrega autenticação
  if (authLoading || (requireAdmin && roleLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Carregando...</div>
      </div>
    );
  }

  // 🔹 Se não está logado, bloqueia
  if (!user) {
    toast.error("Você precisa fazer login para acessar esta página.");
    return <Navigate to="/auth" replace />;
  }

  // 🔹 Se é rota admin e não é admin, bloqueia
  if (requireAdmin && role !== "admin") {
    toast.error("Acesso negado. Apenas administradores podem acessar esta área.");
    return <Navigate to="/" replace />;
  }

  // 🔹 Caso contrário, libera acesso
  return <>{children}</>;
};
