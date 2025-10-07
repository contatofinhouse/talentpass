import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean; // se true, só admins podem acessar
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole(user?.id);

  // Espera hooks carregarem antes de qualquer decisão
  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Carregando...</div>
      </div>
    );
  }

  // Se a rota exige admin, bloqueia se não for admin
  if (requireAdmin && role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Qualquer outra rota (mesmo sem user) é liberada
  return <>{children}</>;
};
