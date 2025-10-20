/* eslint-disable @typescript-eslint/no-explicit-any */ 
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase";

const Welcome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [role, setRole] = useState<string | null>(null); // 👈 role real do user_roles

  useEffect(() => {
    if (!user?.id) return;

    const fetchProfile = async () => {
      try {
        // 🔹 Busca perfil básico
        const { data, error } = await supabase
          .from("profiles")
          .select("id, name, email, status")
          .eq("id", user.id)
          .maybeSingle();

        if (error) console.error("Erro ao buscar perfil:", error);
        setProfile(data);

        // 🔹 Busca o papel real na tabela user_roles
        const { data: roleData, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .maybeSingle();

        if (roleError) console.error("Erro ao buscar papel:", roleError);
        setRole(roleData?.role || "manager");

        // 🔹 Calcula dias restantes de teste
        const createdAt = new Date(user.created_at);
        const now = new Date();
        const createdAtMidnight = new Date(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate());
        const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const diffTime = nowMidnight.getTime() - createdAtMidnight.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const remaining = Math.max(0, 14 - diffDays);
        setDaysRemaining(remaining);
      } catch (err) {
        console.error("Erro inesperado ao buscar perfil:", err);
        setDaysRemaining(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id, user?.created_at]);

  if (loading || daysRemaining === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isEmployee = role === "employee";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center py-12">
      <div className="container mx-auto px-4">
        <Card className="mx-auto max-w-2xl border-2 border-primary/20">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-primary" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Parabéns pelo Primeiro Passo!
              </CardTitle>
              <div className="flex items-center justify-center gap-2 text-primary">
                <Sparkles className="w-5 h-5" />
                <span className="text-lg font-semibold">
                  Bem-vindo{profile?.name ? `, ${profile.name}` : ""} ao TalentPass
                </span>
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 text-center">
            {isEmployee ? (
              /* ===== VISÃO DO EMPLOYEE ===== */
              <div className="bg-accent/10 rounded-lg p-6 space-y-4">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  🎉 Parabéns por fazer parte da sua empresa no <strong>TalentPass</strong>!
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Acesse trilhas e conteúdos feitos para o seu desenvolvimento profissional.
                  Aproveite esse benefício corporativo e explore os cursos disponíveis.
                </p>
                <Button
                  size="lg"
                  className="w-full max-w-md mt-2"
                  onClick={() => navigate("/manager/dashboard")}
                >
                  Acessar Plataforma
                </Button>
              </div>
            ) : (
              /* ===== VISÃO DO MANAGER ===== */
              <div className="bg-accent/10 rounded-lg p-6 space-y-4">
                <p className="text-lg leading-relaxed">
                  Você agora tem{" "}
                  <span className="font-bold text-primary text-xl">
                    {daysRemaining} {daysRemaining === 1 ? "dia" : "dias"}
                  </span>{" "}
                  para explorar todos os cursos e recursos do TalentPass.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Gostou do teste? Ative o plano Teams e cadastre sua equipe para acesso completo.
                </p>

                <div className="pt-4 space-y-3">
                  {daysRemaining > 0 && (
                    <Button
                      size="lg"
                      className="w-full max-w-md"
                      onClick={() => navigate("/manager/dashboard")}
                    >
                      Continuar para o Painel
                    </Button>
                  )}

                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full max-w-md"
                    onClick={() => {
                      const phoneNumber = "5511955842951";
                      const message = `
Olá! Quero ativar o plano Teams na plataforma de educação com IA.
Vi que o Plano Teams é R$49/mês até 40 funcionários e R$0,99 por funcionário adicional.
Gostaria de incluir minha equipe e garantir acesso imediato.
                      `.trim();
                      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                      window.open(url, "_blank");
                    }}
                  >
                    Ativar Plano
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Welcome;
