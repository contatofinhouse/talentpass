import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase";

const Welcome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [daysRemaining, setDaysRemaining] = useState(14);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
      } else if (data) {
        setProfile(data);

        // Calculate days remaining
        const createdAt = new Date(data.created_at);
        const now = new Date();
        const diffTime = now.getTime() - createdAt.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const remaining = Math.max(0, 14 - diffDays);
        setDaysRemaining(remaining);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
                  Bem-vindo{profile?.name ? `, ${profile.name}` : ""} ao FinHero
                </span>
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="bg-accent/10 rounded-lg p-6 space-y-4">
              <p className="text-lg leading-relaxed">
                Você agora tem{" "}
                <span className="font-bold text-primary text-xl">
                  {daysRemaining} {daysRemaining === 1 ? "dia" : "dias"}
                </span>{" "}
                para testar a ferramenta e explorar todo o conteúdo disponível.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                A qualquer momento, você pode ativar o plano Teams (R$49/mês para até 40 colaboradores) e continuar com
                acesso ilimitado aos cursos criados com IA. Para cada colaborador adicional, o valor é de apenas
                R$0,99/mês. Inclua sua equipe agora e garanta acesso imediato para todo o seu time à plataforma.
              </p>
            </div>

            <div className="pt-4 space-y-3">
              {daysRemaining > 0 && (
                <Button size="lg" className="w-full max-w-md" onClick={() => navigate("/manager/dashboard")}>
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
Olá! Quero ativar o plano Starter na plataforma de educação com IA.
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Welcome;
