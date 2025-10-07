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
import { LogOut, Upload, Plus, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase";

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
  imageFile?: File;
  resourceFiles?: File[];
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasAdminRole, setHasAdminRole] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    subtitle: "",
    category: "",
    description: "",
    videoUrl: "",
    content: "",
    summary: "",
    duration: "",
    skills: [],
    resourceFiles: []
  });

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        navigate("/admin/login");
        setLoading(false);
        return;
      }

      try {
        // Verificar se o usuário tem role admin usando RPC
        const { data: hasAdminRole, error } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'admin'
        });

        if (error || !hasAdminRole) {
          toast.error("Acesso negado: você não tem permissão de administrador");
          navigate("/");
          return;
        }

        setHasAdminRole(true);
      } catch (error) {
        console.error("Erro ao verificar role:", error);
        navigate("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAdminRole();
  }, [user, navigate]);

  const handleLogout = async () => {
    await signOut();
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

    setFormData(prev => ({ ...prev, imageFile: file }));
    
    // Preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    toast.success("Imagem carregada!");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const allowedTypes = ['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    
    const validFiles: File[] = [];
    Array.from(files).forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name}: Apenas arquivos PDF ou XLSX são permitidos!`);
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        resourceFiles: [...(prev.resourceFiles || []), ...validFiles]
      }));
      toast.success(`${validFiles.length} arquivo(s) carregado(s)!`);
    }
  };

  const handleRemoveResource = (index: number) => {
    setFormData(prev => ({
      ...prev,
      resourceFiles: prev.resourceFiles?.filter((_, i) => i !== index)
    }));
    toast.success("Recurso removido!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.description || !formData.videoUrl || !formData.duration || !formData.imageFile || formData.skills.length === 0) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Upload da imagem
      const imageExt = formData.imageFile.name.split('.').pop();
      const imageName = `${Date.now()}-${Math.random()}.${imageExt}`;
      
      const { error: imageError, data: imageData } = await supabase.storage
        .from('course-images')
        .upload(imageName, formData.imageFile);

      if (imageError) throw new Error(`Erro ao fazer upload da imagem: ${imageError.message}`);

      const { data: { publicUrl: imageUrl } } = supabase.storage
        .from('course-images')
        .getPublicUrl(imageName);

      // 2. Criar curso no banco
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .insert({
          title: formData.title,
          subtitle: formData.subtitle || null,
          category: formData.category,
          description: formData.description,
          video_url: formData.videoUrl,
          content: formData.content || null,
          summary: formData.summary || null,
          duration: formData.duration,
          skills: formData.skills,
          image_url: imageUrl
        })
        .select()
        .single();

      if (courseError) throw new Error(`Erro ao criar curso: ${courseError.message}`);

      // 3. Upload de recursos adicionais (se houver)
      if (formData.resourceFiles && formData.resourceFiles.length > 0) {
        for (const file of formData.resourceFiles) {
          const resourceExt = file.name.split('.').pop();
          const resourceName = `${courseData.id}/${Date.now()}-${Math.random()}.${resourceExt}`;
          
          const { error: resourceUploadError } = await supabase.storage
            .from('course-resources')
            .upload(resourceName, file);

          if (resourceUploadError) {
            console.error(`Erro ao fazer upload do recurso ${file.name}:`, resourceUploadError);
            continue;
          }

          const { data: { publicUrl: resourceUrl } } = supabase.storage
            .from('course-resources')
            .getPublicUrl(resourceName);

          // Salvar referência no banco
          await supabase
            .from('course_resources')
            .insert({
              course_id: courseData.id,
              file_name: file.name,
              file_url: resourceUrl,
              file_type: file.type
            });
        }
      }

      toast.success("Curso adicionado com sucesso!");
      
      // Resetar formulário
      setFormData({
        title: "",
        subtitle: "",
        category: "",
        description: "",
        videoUrl: "",
        content: "",
        summary: "",
        duration: "",
        skills: [],
        resourceFiles: []
      });
      setImagePreview("");
      
      // Limpar inputs de arquivo
      const imageInput = document.getElementById('image') as HTMLInputElement;
      const resourceInput = document.getElementById('resource') as HTMLInputElement;
      if (imageInput) imageInput.value = '';
      if (resourceInput) resourceInput.value = '';

    } catch (error: any) {
      console.error("Erro ao adicionar curso:", error);
      toast.error(error.message || "Erro ao adicionar curso");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasAdminRole) {
    return null;
  }

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
                  {imagePreview && (
                    <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border">
                      <img 
                        src={imagePreview} 
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resource">Recursos Adicionais (PDF/XLSX)</Label>
                <Input
                  id="resource"
                  type="file"
                  accept=".pdf,.xlsx,.xls"
                  multiple
                  onChange={handleFileUpload}
                />
                {formData.resourceFiles && formData.resourceFiles.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {formData.resourceFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between gap-2 p-2 border rounded-md">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Upload className="w-4 h-4" />
                          {file.name}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveResource(index)}
                        >
                          Remover
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full md:w-auto" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Curso
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
