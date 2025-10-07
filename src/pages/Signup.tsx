import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const validateCNPJ = (cnpj: string): boolean => {
  const cleaned = cnpj.replace(/[^\d]/g, '');
  if (cleaned.length !== 14) return false;
  if (/^(\d)\1+$/.test(cleaned)) return false;
  
  let size = cleaned.length - 2;
  let numbers = cleaned.substring(0, size);
  const digits = cleaned.substring(size);
  let sum = 0;
  let pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;
  
  size = size + 1;
  numbers = cleaned.substring(0, size);
  sum = 0;
  pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return result === parseInt(digits.charAt(1));
};

const checkEmailUnique = (email: string): boolean => {
  const existingManagers = localStorage.getItem("allManagers");
  if (!existingManagers) return true;
  
  const managers = JSON.parse(existingManagers);
  return !managers.some((m: any) => m.email.toLowerCase() === email.toLowerCase());
};

const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[^\d]/g, '');
  return cleaned.length === 11;
};

const signupSchema = z.object({
  companyName: z.string().trim().min(1, "Nome da empresa é obrigatório").max(100, "Nome muito longo"),
  cnpj: z.string().trim().refine(validateCNPJ, "CNPJ inválido"),
  managerName: z.string().trim().min(1, "Nome do gestor é obrigatório").max(100, "Nome muito longo"),
  email: z.string().trim().email("E-mail inválido").max(255, "E-mail muito longo").refine(checkEmailUnique, "E-mail já cadastrado"),
  phone: z.string().trim().refine(validatePhone, "Celular inválido"),
  employeeCount: z.string().optional(),
  honeypot: z.string().max(0, "Erro de validação"),
  formLoadTime: z.number().refine((val) => Date.now() - val > 3000, "Submissão muito rápida")
});

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formLoadTime] = useState(Date.now());
  const [formData, setFormData] = useState({
    companyName: "",
    cnpj: "",
    managerName: "",
    email: "",
    phone: "",
    employeeCount: "",
    honeypot: "",
    formLoadTime: Date.now(),
  });

  const handleSubmit = (e: React.FormEvent) => {
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

    // Salvar na lista de todos os gerentes para validação de email único
    const existingManagers = JSON.parse(localStorage.getItem("allManagers") || "[]");
    const newManager = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    localStorage.setItem("allManagers", JSON.stringify([...existingManagers, newManager]));

    localStorage.setItem("manager", JSON.stringify(newManager));
    localStorage.setItem("employees", JSON.stringify([]));
    localStorage.setItem("userType", "manager");

    toast({
      title: "Cadastro realizado!",
      description: "Bem-vindo ao MicroLearn",
    });

    navigate("/welcome");
  };

  const formatCNPJ = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})$/);
    if (match) {
      return [match[1], match[2], match[3], match[4], match[5]]
        .filter(Boolean)
        .join('.')
        .replace(/\.(\d{3})\./, '.$1/')
        .replace(/(\d{4})\.(\d{2})$/, '$1-$2');
    }
    return value;
  };

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 2) {
      return cleaned;
    } else if (cleaned.length <= 7) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    } else if (cleaned.length <= 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
    }
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12">
      <div className="container mx-auto px-4">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle className="text-3xl">Cadastro da Empresa</CardTitle>
            <CardDescription>
              Preencha os dados para começar sua jornada de microlearning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da Empresa *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  placeholder="Ex: Tech Solutions LTDA"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) =>
                    setFormData({ ...formData, cnpj: formatCNPJ(e.target.value) })
                  }
                  placeholder="XX.XXX.XXX/XXXX-XX"
                  maxLength={18}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="managerName">Nome do Gestor *</Label>
                <Input
                  id="managerName"
                  value={formData.managerName}
                  onChange={(e) =>
                    setFormData({ ...formData, managerName: e.target.value })
                  }
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="seu@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Celular *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: formatPhone(e.target.value) })
                  }
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeCount">Número de Colaboradores</Label>
                <Input
                  id="employeeCount"
                  type="number"
                  value={formData.employeeCount}
                  onChange={(e) =>
                    setFormData({ ...formData, employeeCount: e.target.value })
                  }
                  placeholder="Ex: 50"
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

              <Button type="submit" size="lg" className="w-full">
                Começar Agora
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
