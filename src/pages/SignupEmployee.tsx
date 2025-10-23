import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "A senha deve ter no mínimo 8 caracteres")
  .max(72, "Senha muito longa");

const SignupEmployee = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, updateUser } = useAuth();
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = passwordSchema.safeParse(password);
    if (!validation.success) {
      toast({
        title: "Erro de validação",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Sessão inválida",
        description: "Abra o link de convite enviado por e-mail.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    const { error } = await updateUser({ password });
    setSubmitting(false);

    if (error) {
      toast({
        title: "Erro ao definir senha",
        description: error,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Senha criada com sucesso! 🎉",
      description: "Bem-vindo ao TalentPass 👋",
    });

    // ✅ Só agora libera acesso ao dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12">
      <div className="container mx-auto px-4">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Crie sua senha</CardTitle>
            <CardDescription>
              Você foi convidado para acessar o TalentPass. Defina sua senha abaixo para continuar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="password">Nova senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando senha...
                  </>
                ) : (
                  "Salvar e acessar"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupEmployee;
