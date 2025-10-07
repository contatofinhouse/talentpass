import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Clock, Users, LogOut, Download, Loader2 } from "lucide-react";
import { courses as defaultCourses } from "@/data/courses";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setProfile(data);
      }

      const adminCourses = JSON.parse(localStorage.getItem("adminCourses") || "[]");
      setAllCourses([...defaultCourses, ...adminCourses]);
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleDownloadResource = (file: { name: string; data: string }) => {
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div>
            <h1 className="text-xl font-bold">FinHero</h1>
            <p className="text-sm text-muted-foreground">Painel do Gestor</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{profile?.name}</p>
              <p className="text-xs text-muted-foreground">{profile?.company_name}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total de Cursos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allCourses.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Colaboradores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div className="text-2xl font-bold">{profile?.employee_count || "0"}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Categorias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(allCourses.map((c) => c.category || "Geral")).size}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="courses">
          <TabsList className="mb-6">
            <TabsTrigger value="courses">Todos os Cursos</TabsTrigger>
            <TabsTrigger value="employees">Colaboradores</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allCourses.map((course) => (
                <Card
                  key={course.id}
                  className="group cursor-pointer transition-shadow hover:shadow-lg overflow-hidden"
                  onClick={() => setSelectedCourse(course)}
                >
                  {course.image && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={course.image} 
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="mb-2 flex items-start justify-between">
                      <Badge variant="secondary">{course.category || "Geral"}</Badge>
                      {course.duration && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {course.duration}
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    {course.subtitle && (
                      <p className="text-sm text-muted-foreground">{course.subtitle}</p>
                    )}
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm" className="w-full">
                      <Play className="mr-2 h-4 w-4" />
                      Ver Detalhes
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="employees">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Empresa</CardTitle>
                <CardDescription>
                  Dados cadastrais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <p className="text-sm font-medium">Empresa</p>
                    <p className="text-sm text-muted-foreground">{profile?.company_name}</p>
                  </div>
                  <div className="grid gap-2">
                    <p className="text-sm font-medium">CNPJ</p>
                    <p className="text-sm text-muted-foreground">{profile?.cnpj}</p>
                  </div>
                  <div className="grid gap-2">
                    <p className="text-sm font-medium">Telefone</p>
                    <p className="text-sm text-muted-foreground">{profile?.phone}</p>
                  </div>
                  <div className="grid gap-2">
                    <p className="text-sm font-medium">E-mail</p>
                    <p className="text-sm text-muted-foreground">{profile?.email}</p>
                  </div>
                  <div className="grid gap-2">
                    <p className="text-sm font-medium">Número de Colaboradores</p>
                    <p className="text-sm text-muted-foreground">{profile?.employee_count || "Não informado"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {selectedCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={() => setSelectedCourse(null)}
        >
          <Card
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="mb-2 flex items-center justify-between">
                <Badge variant="secondary">{selectedCourse.category || "Geral"}</Badge>
                {selectedCourse.duration && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {selectedCourse.duration}
                  </div>
                )}
              </div>
              <CardTitle className="text-2xl">{selectedCourse.title}</CardTitle>
              {selectedCourse.subtitle && (
                <p className="text-sm text-muted-foreground">{selectedCourse.subtitle}</p>
              )}
              <CardDescription>{selectedCourse.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                <iframe
                  width="100%"
                  height="100%"
                  src={selectedCourse.videoUrl}
                  title={selectedCourse.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {selectedCourse.summary && (
                <div className="prose prose-sm max-w-none">
                  <h4 className="font-semibold mb-2">Resumo Completo:</h4>
                  <p className="whitespace-pre-wrap">{selectedCourse.summary}</p>
                </div>
              )}

              {selectedCourse.content && (
                <div className="prose prose-sm max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: selectedCourse.content }} />
                </div>
              )}

              <div>
                <h4 className="mb-2 font-semibold">Skills desenvolvidas:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCourse.skills?.map((skill: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedCourse.resourceFiles && selectedCourse.resourceFiles.length > 0 && (
                <div className="border-t pt-4 space-y-3">
                  <h4 className="font-semibold">Recursos adicionais</h4>
                  <div className="space-y-2">
                    {selectedCourse.resourceFiles.map((file: { name: string; data: string; type: string }, index: number) => (
                      <Button 
                        key={index}
                        onClick={() => handleDownloadResource(file)} 
                        variant="outline" 
                        className="w-full justify-start"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        {file.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button onClick={() => setSelectedCourse(null)} className="flex-1">
                  Fechar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
