import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { LogOut, Upload, Plus } from "lucide-react";

const AVAILABLE_SKILLS = [
  "Comunicação Eficaz",
  "Negociação",
  "Gestão de Tempo",
  "Liderança",
  "Trabalho em Equipe",
  "Resolução de Problemas",
  "Pensamento Crítico",
  "Adaptabilidade",
  "Inteligência Emocional",
  "Produtividade",
  "Marketing Digital",
  "Análise de Dados",
  "Automação",
  "Criatividade"
];

interface CourseFormData {
  title: string;
  subtitle: string;
  description: string;
  videoUrl: string;
  summary: string;
  skills: string[];
  resourceFile?: { name: string; data: string; type: string };
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    subtitle: "",
    description: "",
    videoUrl: "",
    summary: "",
    skills: []
  });

  useEffect(() => {
    if (sessionStorage.getItem("adminAuth") !== "true") {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    toast.success("Logout realizado!");
    navigate("/admin/login");
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Apenas arquivos PDF ou XLSX são permitidos!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({
        ...prev,
        resourceFile: {
          name: file.name,
          data: event.target?.result as string,
          type: file.type
        }
      }));
      toast.success("Arquivo carregado!");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.videoUrl || formData.skills.length === 0) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }

    const existingCourses = JSON.parse(localStorage.getItem("adminCourses") || "[]");
    const newCourse = {
      id: `course-${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem("adminCourses", JSON.stringify([...existingCourses, newCourse]));
    
    toast.success("Curso adicionado com sucesso!");
    
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      videoUrl: "",
      summary: "",
      skills: []
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Painel Admin</h1>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Adicionar Novo Curso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Marketing Digital Avançado"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtítulo</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Ex: Domine as estratégias modernas"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição curta do curso"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="videoUrl">URL do Vídeo *</Label>
                <Input
                  id="videoUrl"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/embed/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Resumo Completo</Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Descrição detalhada com resumo do conteúdo do curso"
                  rows={5}
                />
              </div>

              <div className="space-y-3">
                <Label>Skills Desenvolvidas *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {AVAILABLE_SKILLS.map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        id={skill}
                        checked={formData.skills.includes(skill)}
                        onCheckedChange={() => handleSkillToggle(skill)}
                      />
                      <Label htmlFor={skill} className="text-sm font-normal cursor-pointer">
                        {skill}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resource">Recursos Adicionais (PDF/XLSX)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="resource"
                    type="file"
                    accept=".pdf,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="flex-1"
                  />
                  {formData.resourceFile && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Upload className="w-4 h-4" />
                      {formData.resourceFile.name}
                    </div>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full md:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Curso
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
