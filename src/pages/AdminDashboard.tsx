import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

const CATEGORIES = [
  "Vendas e Marketing",
  "Automação com IA",
  "Gestão, Liderança e Comunicação"
];

interface CourseFormData {
  title: string;
  subtitle: string;
  category: string;
  description: string;
  videoUrl: string;
  content: string;
  summary: string;
  duration: string;
  skills: string[];
  image?: string;
  resourceFile?: { name: string; data: string; type: string };
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    subtitle: "",
    category: "",
    description: "",
    videoUrl: "",
    content: "",
    summary: "",
    duration: "",
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Apenas imagens JPG, PNG ou WEBP são permitidas!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({
        ...prev,
        image: event.target?.result as string
      }));
      toast.success("Imagem carregada!");
    };
    reader.readAsDataURL(file);
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

    if (!formData.title || !formData.category || !formData.description || !formData.videoUrl || !formData.duration || !formData.image || formData.skills.length === 0) {
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
      category: "",
      description: "",
      videoUrl: "",
      content: "",
      summary: "",
      duration: "",
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
                  <Label htmlFor="category">Categoria *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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

              <div className="grid md:grid-cols-2 gap-6">
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
                  <Label htmlFor="duration">Tempo Estimado *</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="Ex: 5 min"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Conteúdo do Curso</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Conteúdo detalhado em Markdown ou texto formatado"
                  rows={6}
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
                <Label htmlFor="image">Imagem do Curso *</Label>
                <div className="space-y-3">
                  <Input
                    id="image"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    onChange={handleImageUpload}
                  />
                  {formData.image && (
                    <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border">
                      <img 
                        src={formData.image} 
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
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
