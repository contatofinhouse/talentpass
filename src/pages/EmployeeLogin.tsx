import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

const EmployeeLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Campo obrigatório",
        description: "Digite seu e-mail",
        variant: "destructive",
      });
      return;
    }

    const employees = JSON.parse(localStorage.getItem("employees") || "[]");

    if (employees.includes(email)) {
      localStorage.setItem("userType", "employee");
      localStorage.setItem("userEmail", email);
      navigate("/dashboard");
    } else {
      toast({
        title: "Acesso negado",
        description: "E-mail não encontrado na lista de colaboradores",
        variant: "destructive",
      });
    }
  };

  // 🔹 Função para resetar senha
  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Campo obrigatório",
        description: "Digite seu e-mail para redefinir a senha",
        variant: "destructive",
      });
      return;
    }

    setIsResetting(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setIsResetting(false);

    if (error) {
      toast({
        title: "Erro ao enviar e-mail",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "E-mail enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12">
      <div className="container mx-auto px-4">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Login - Colaborador</CardTitle>
            <CardDescription>Digite seu e-mail corporativo para acessar os cursos</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>

              <Button type="submit" size="lg" className="w-full">
                Acessar Dashboard
              </Button>
            </form>

            {/* 🔹 Link de esqueci a senha — AGORA FORA DO FORM */}
            <div className="text-center mt-4">
              <Button
                type="button"
                variant="link"
                className="text-sm text-primary underline-offset-4 hover:underline"
                disabled={isResetting}
                onClick={handleForgotPassword}
              >
                {isResetting ? "Enviando..." : "Esqueceu sua senha?"}
              </Button>
            </div>

            <div className="text-center mt-2">
              <Button type="button" variant="link" onClick={() => navigate("/")}>
                Voltar para página inicial
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeLogin;
