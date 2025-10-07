import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: "admin" | "manager" | "employee";
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasRequiredRole, setHasRequiredRole] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        setIsAuthenticated(true);

        // If no specific role required, allow access
        if (!role) {
          setHasRequiredRole(true);
          setLoading(false);
          return;
        }

        // Check if user has the required role
        const { data: roleData, error } = await supabase.rpc('has_role', {
          _user_id: session.user.id,
          _role: role
        });

        if (error) {
          console.error("Error checking role:", error);
          setHasRequiredRole(false);
        } else {
          setHasRequiredRole(roleData === true);
        }

        setLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        setLoading(false);
      }
    };

    checkAuth();
  }, [role]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && !hasRequiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
