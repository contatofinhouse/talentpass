import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import { Loader2 } from "lucide-react";

const empresaSchema = z.object({
  companyName: z.string().trim().min(1, "Nome da empresa é obrigatório").max(100, "Nome muito longo"),
  managerName: z.string().trim().min(1, "Nome do gestor é obrigatório").max(100, "Nome muito longo"),
  email: z.string().trim().email("E-mail inválido").max(255, "E-mail muito longo"),
  phone: z.string().trim().min(14, "Telefone inválido").max(15, "Telefone inválido"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres").max(72, "Senha muito longa"),
  honeypot: z.string().max(0, "Erro de validação"),
  formLoadTime: z.number().refine((val) => Date.now() - val > 3000, "Submissão muito rápida"),
});

const open2workSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
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
  const [planType, setPlanType] = useState<"empresa" | "open2work">("empresa");
  const [formData, setFormData] = useState({
    companyName: "",
    managerName: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    honeypot: "",
    formLoadTime: Date.now(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const schema = planType === "empresa" ? empresaSchema : open2workSchema;
    const dataToValidate = planType === "empresa" 
      ? { 
          companyName: formData.companyName,
          managerName: formData.managerName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          honeypot: formData.honeypot,
          formLoadTime
        }
      : {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          honeypot: formData.honeypot,
          formLoadTime
        };

    const validation = schema.safeParse(dataToValidate);

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

    const userData = planType === "empresa"
      ? {
          name: formData.managerName,
          company_name: formData.companyName,
          phone: formData.phone,
          plan_type: "empresa"
        }
      : {
          name: formData.name,
          phone: formData.phone,
          plan_type: "open2work"
        };

    const { error } = await signUp(formData.email, formData.password, userData);

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
      description: "Bem-vindo ao TalentPass",
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
            <CardTitle className="text-3xl">Comece sua Jornada</CardTitle>
            <CardDescription>
              Escolha o tipo de cadastro ideal para você
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={planType} onValueChange={(v) => setPlanType(v as "empresa" | "open2work")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="empresa">🏢 Para Empresas</TabsTrigger>
                <TabsTrigger value="open2work">👩‍💼 Open2Work (R$ 9,80)</TabsTrigger>
              </TabsList>

              {/* Aba Empresa */}
              <TabsContent value="empresa">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="companyName">Nome da Empresa</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="Ex: Tech Solutions"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="managerName">Nome do Gestor</Label>
                    <Input
                      id="managerName"
                      value={formData.managerName}
                      onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Telefone</Label>
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
                    <Label htmlFor="password">Senha</Label>
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
                      "Começar Teste Grátis"
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Aba Open2Work */}
              <TabsContent value="open2work">
                <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">👩‍💼</span>
                    <h3 className="font-semibold text-indigo-900 dark:text-indigo-100">Plano Open2Work</h3>
                  </div>
                  <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-2">
                    Acesso completo por <strong>R$ 9,80/mês</strong> para quem está em busca de recolocação profissional.
                  </p>
                  <ul className="text-xs text-indigo-600 dark:text-indigo-400 space-y-1 ml-4 list-disc">
                    <li>✅ Certificados reconhecidos pelo mercado</li>
                    <li>✅ Cancele quando quiser - sem fidelidade</li>
                    <li>✅ Todas as trilhas de aprendizado</li>
                  </ul>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email-o2w">Email</Label>
                    <Input
                      id="email-o2w"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone-o2w">Telefone</Label>
                    <Input
                      id="phone-o2w"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                      placeholder="(XX) XXXXX-XXXX"
                      maxLength={15}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password-o2w">Senha</Label>
                    <Input
                      id="password-o2w"
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

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Cadastrando...
                      </>
                    ) : (
                      "Começar Agora 🚀"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
