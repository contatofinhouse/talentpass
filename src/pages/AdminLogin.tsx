import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Senha do admin - pode ser alterada aqui
const ADMIN_PASSWORD = "admin123";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Login via Supabase Auth
const { data: sessionData, error: loginError } = await supabase.auth.signInWithPassword({
  email,
  password,
});

if (loginError || !sessionData.user) {
  toast.error(loginError?.message || "Erro ao logar");
  setLoading(false);
  return;
}

// Checar se o usuário é admin
const { data: roleData, error: roleError } = await supabase
  .from("user_roles")
  .select("role")
  .eq("user_id", sessionData.user.id)
  .eq("role", "admin")
  .single();

if (roleError || !roleData) {
  toast.error("Acesso negado. Você não é admin.");
  setLoading(false);
  return;
}

// Login bem-sucedido
sessionStorage.setItem("admin_authenticated", "true");
toast.success("Login realizado com sucesso!");
navigate("/admin/dashboard");

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Admin</CardTitle>
          <CardDescription className="text-center">Insira a senha para acessar o painel administrativo</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
                autoFocus
              />
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite a senha de admin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                required
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
