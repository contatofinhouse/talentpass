import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import { Loader2 } from "lucide-react";

const signupSchema = z.object({
  companyName: z.string().trim().min(1, "Nome da empresa é obrigatório").max(100, "Nome muito longo"),
  managerName: z.string().trim().min(1, "Nome do gestor é obrigatório").max(100, "Nome muito longo"),
  email: z.string().trim().email("E-mail inválido").max(255, "E-mail muito longo"),
  phone: z.string().trim().min(14, "Telefone inválido").max(15, "Telefone inválido"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres").max(72, "Senha muito longa"),
  honeypot: z.string().max(0, "Erro de validação"),
  formLoadTime: z.number().refine((val) => Date.now() - val > 3000, "Submissão muito rápida"),
});

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp } = useAuth();
  const [formLoadTime] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    managerName: "",
    email: "",
    phone: "",
    password: "",
    honeypot: "",
    formLoadTime: Date.now(),
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = signupSchema.safeParse({ ...formData, formLoadTime });

    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast({
        title: "Erro de validação",
        description: firstError.message,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await signUp(formData.email, formData.password, {
      name: formData.managerName,
      company_name: formData.companyName,
      phone: formData.phone,
    });

    if (error) {
      toast({
        title: "Erro no cadastro",
        description: error,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Cadastro realizado!",
      description: "Bem-vindo ao FinHero",
    });

    navigate("/welcome");
  };

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
    if (match) {
      return [match[1], match[2], match[3]]
        .filter(Boolean)
        .join(" ")
        .replace(/^(\d{2}) /, "($1) ")
        .replace(/ (\d{4})$/, "-$1");
    }
    return value;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12">
      <div className="container mx-auto px-4">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle className="text-3xl">Cadastro para Teste Grátis</CardTitle>
            <CardDescription>
              Preencha os dados para começar sua nova jornada de aprendizado corporativo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="companyName">Nome da Empresa *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="Ex: Tech Solutions"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="managerName">Nome *</Label>
                <Input
                  id="managerName"
                  value={formData.managerName}
                  onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email de trabalho *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                  placeholder="(XX) XXXXX-XXXX"
                  maxLength={15}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Senha *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Mínimo 8 caracteres"
                />
              </div>

              <input
                type="text"
                name="website"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                className="absolute -left-[9999px]"
                tabIndex={-1}
                autoComplete="off"
              />

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  "Começar Agora"
                )}
              </Button>

              <div className="text-center mt-4">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => navigate("/auth")}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Esqueci minha senha
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
