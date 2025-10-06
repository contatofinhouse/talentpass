import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";
import Papa from "papaparse";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    companyName: "",
    managerName: "",
    email: "",
    employeeCount: "",
  });
  const [employees, setEmployees] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    Papa.parse(file, {
      complete: (results) => {
        const emails = results.data
          .flat()
          .filter((item) => typeof item === "string" && item.includes("@"))
          .map((email) => String(email).trim());
        
        setEmployees(emails);
        toast({
          title: "Arquivo carregado",
          description: `${emails.length} colaboradores encontrados`,
        });
      },
      error: () => {
        toast({
          title: "Erro ao processar arquivo",
          description: "Verifique o formato do arquivo",
          variant: "destructive",
        });
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyName || !formData.managerName || !formData.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("manager", JSON.stringify(formData));
    localStorage.setItem("employees", JSON.stringify(employees));
    localStorage.setItem("userType", "manager");

    toast({
      title: "Cadastro realizado!",
      description: "Bem-vindo ao MicroLearn",
    });

    navigate("/manager/dashboard");
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
                <Label htmlFor="companyName">Nome da Empresa</Label>
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
                <Label htmlFor="managerName">Nome do Gestor</Label>
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
                <Label htmlFor="email">E-mail</Label>
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

              <div className="space-y-2">
                <Label htmlFor="employeeFile">
                  Lista de Colaboradores (CSV ou XLSX)
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="employeeFile"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("employeeFile")?.click()}
                    className="w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {fileName || "Selecionar arquivo"}
                  </Button>
                </div>
                {employees.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {employees.length} colaboradores carregados
                  </p>
                )}
              </div>

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
