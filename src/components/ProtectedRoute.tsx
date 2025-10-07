import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading || (requireAdmin && roleLoading)) return;

    // 🔹 Bloqueia apenas se o usuário não estiver logado
    if (!user) {
      toast.error("Você precisa fazer login para acessar esta página.");
      navigate("/auth", { replace: true });
      return;
    }

    // 🔹 Se for página admin e o usuário não for admin
    if (requireAdmin && role !== "admin") {
      toast.error("Acesso negado. Apenas administradores podem acessar esta área.");
      navigate("/", { replace: true });
    }
  }, [user, role, authLoading, roleLoading, requireAdmin, navigate]);

  // 🔹 Enquanto carrega autenticação
  if (authLoading || (requireAdmin && roleLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Carregando...</div>
      </div>
    );
  }

  // 🔹 Se não está logado, redireciona
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // 🔹 Se for rota admin e não for admin, bloqueia
  if (requireAdmin && role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // 🔹 Qualquer outro caso: libera o acesso
  return <>{children}</>;
};
