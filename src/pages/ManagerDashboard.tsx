import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Play,
  Clock,
  Users,
  LogOut,
  Download,
  Loader2,
  Heart,
  CheckCircle2,
  Search,
  User,
  Settings,
  BookOpen,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchCoursesFromSupabase } from "@/data/courses";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase";
import { toast } from "@/hooks/use-toast";
import { sanitizeHtml } from "@/lib/sanitize";

interface CourseTracking {
  course_id: string;
  is_favorite: boolean;
  is_completed: boolean;
}

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [courseTracking, setCourseTracking] = useState<Record<string, CourseTracking>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeView, setActiveView] = useState<"courses" | "profile" | "employees">("courses");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setProfile(data);
      }

      // Buscar cursos da tabela Supabase
      const supabaseCourses = await fetchCoursesFromSupabase();
      setAllCourses(supabaseCourses);

      // Carregar tracking de cursos
      await fetchCourseTracking();

      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const fetchCourseTracking = async () => {
    if (!user) return;

    const { data, error } = await supabase.from("manager_course_tracking").select("*").eq("user_id", user.id);

    if (error) {
      console.error("Error fetching course tracking:", error);
      return;
    }

    const trackingMap: Record<string, CourseTracking> = {};
    data?.forEach((item) => {
      trackingMap[item.course_id] = {
        course_id: item.course_id,
        is_favorite: item.is_favorite,
        is_completed: item.is_completed,
      };
    });
    setCourseTracking(trackingMap);
  };

  const toggleFavorite = async (courseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;

    const currentStatus = courseTracking[courseId]?.is_favorite || false;
    const newStatus = !currentStatus;

    const { error } = await supabase.from("manager_course_tracking").upsert(
      {
        user_id: user.id,
        course_id: courseId,
        is_favorite: newStatus,
        is_completed: courseTracking[courseId]?.is_completed || false,
      },
      {
        onConflict: "user_id,course_id",
      },
    );

    if (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar favorito",
        variant: "destructive",
      });
      return;
    }

    setCourseTracking({
      ...courseTracking,
      [courseId]: {
        course_id: courseId,
        is_favorite: newStatus,
        is_completed: courseTracking[courseId]?.is_completed || false,
      },
    });

    toast({
      title: newStatus ? "Favoritado!" : "Removido dos favoritos",
      description: newStatus ? "Curso adicionado aos favoritos" : "Curso removido dos favoritos",
    });
  };

  const toggleCompleted = async (courseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;

    const currentStatus = courseTracking[courseId]?.is_completed || false;
    const newStatus = !currentStatus;

    const { error } = await supabase.from("manager_course_tracking").upsert(
      {
        user_id: user.id,
        course_id: courseId,
        is_favorite: courseTracking[courseId]?.is_favorite || false,
        is_completed: newStatus,
        completed_at: newStatus ? new Date().toISOString() : null,
      },
      {
        onConflict: "user_id,course_id",
      },
    );

    if (error) {
      console.error("Error toggling completed:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar status",
        variant: "destructive",
      });
      return;
    }

    setCourseTracking({
      ...courseTracking,
      [courseId]: {
        course_id: courseId,
        is_favorite: courseTracking[courseId]?.is_favorite || false,
        is_completed: newStatus,
      },
    });

    toast({
      title: newStatus ? "Concluído!" : "Marcado como não concluído",
      description: newStatus ? "Parabéns por concluir o curso!" : "Status atualizado",
    });
  };

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
    const link = document.createElement("a");
    link.href = file.data;
    link.download = file.name;
    link.click();
  };

  // Filtrar cursos
  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.skills?.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(allCourses.map((c) => c.category || "Geral")))];

  const favoriteCount = Object.values(courseTracking).filter((t) => t.is_favorite).length;
  const completedCount = Object.values(courseTracking).filter((t) => t.is_completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div>
            <h1 className="text-xl font-bold">FinHero</h1>
            <p className="text-sm text-muted-foreground">Painel do Gestor</p>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <User className="mr-2 h-4 w-4" />
                  Minha Conta
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{profile?.name}</p>
                    <p className="text-xs text-muted-foreground">{profile?.company_name}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveView("courses")}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Cursos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveView("profile")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Cadastro
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveView("employees")}>
                  <Users className="mr-2 h-4 w-4" />
                  Colaboradores
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    const message = encodeURIComponent(
                      "Olá! Quero ativar o plano Starter na plataforma de educação com IA. \nVi que o Plano Teams é R$49/mês até 40 funcionários e R$0,99 por funcionário adicional. \nGostaria de incluir minha equipe e garantir acesso imediato.",
                    );
                    window.open(`https://wa.me/5511955842951?text=${message}`, "_blank");
                  }}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Ativar Plano
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 grid gap-4 md:grid-cols-4">
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
              <CardTitle className="text-sm font-medium">Favoritos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                <div className="text-2xl font-bold">{favoriteCount}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div className="text-2xl font-bold">{completedCount}</div>
              </div>
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
        </div>

        {activeView === "courses" && (
          <Tabs defaultValue="courses">
            <TabsList className="mb-6">
              <TabsTrigger value="courses">Todos os Cursos</TabsTrigger>
              <TabsTrigger value="favorites">Favoritos</TabsTrigger>
              <TabsTrigger value="completed">Concluídos</TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="space-y-4">
              <div className="mb-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por título, descrição ou skill..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex flex-wrap gap-2 max-w-full overflow-x-auto pb-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      className="cursor-pointer whitespace-nowrap flex-shrink-0"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category === "all" ? "Todas" : category}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.map((course) => (
                  <Card
                    key={course.id}
                    className="group cursor-pointer transition-shadow hover:shadow-lg overflow-hidden"
                    onClick={() => setSelectedCourse(course)}
                  >
                    {course.image && (
                      <div className="aspect-video w-full overflow-hidden relative">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8"
                            onClick={(e) => toggleFavorite(course.id, e)}
                          >
                            <Heart
                              className={`h-4 w-4 ${
                                courseTracking[course.id]?.is_favorite ? "fill-red-500 text-red-500" : ""
                              }`}
                            />
                          </Button>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8"
                            onClick={(e) => toggleCompleted(course.id, e)}
                          >
                            <CheckCircle2
                              className={`h-4 w-4 ${
                                courseTracking[course.id]?.is_completed ? "fill-green-500 text-green-500" : ""
                              }`}
                            />
                          </Button>
                        </div>
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
                      {course.subtitle && <p className="text-sm text-muted-foreground">{course.subtitle}</p>}
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

            <TabsContent value="favorites" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCourses
                  .filter((course) => courseTracking[course.id]?.is_favorite)
                  .map((course) => (
                    <Card
                      key={course.id}
                      className="group cursor-pointer transition-shadow hover:shadow-lg overflow-hidden"
                      onClick={() => setSelectedCourse(course)}
                    >
                      {course.image && (
                        <div className="aspect-video w-full overflow-hidden relative">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute top-2 right-2 flex gap-2">
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8"
                              onClick={(e) => toggleFavorite(course.id, e)}
                            >
                              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                            </Button>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8"
                              onClick={(e) => toggleCompleted(course.id, e)}
                            >
                              <CheckCircle2
                                className={`h-4 w-4 ${
                                  courseTracking[course.id]?.is_completed ? "fill-green-500 text-green-500" : ""
                                }`}
                              />
                            </Button>
                          </div>
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
                        {course.subtitle && <p className="text-sm text-muted-foreground">{course.subtitle}</p>}
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
              {filteredCourses.filter((course) => courseTracking[course.id]?.is_favorite).length === 0 && (
                <div className="text-center py-12">
                  <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhum curso favoritado ainda</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCourses
                  .filter((course) => courseTracking[course.id]?.is_completed)
                  .map((course) => (
                    <Card
                      key={course.id}
                      className="group cursor-pointer transition-shadow hover:shadow-lg overflow-hidden"
                      onClick={() => setSelectedCourse(course)}
                    >
                      {course.image && (
                        <div className="aspect-video w-full overflow-hidden relative">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute top-2 right-2 flex gap-2">
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8"
                              onClick={(e) => toggleFavorite(course.id, e)}
                            >
                              <Heart
                                className={`h-4 w-4 ${
                                  courseTracking[course.id]?.is_favorite ? "fill-red-500 text-red-500" : ""
                                }`}
                              />
                            </Button>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8"
                              onClick={(e) => toggleCompleted(course.id, e)}
                            >
                              <CheckCircle2
                                className={`h-4 w-4 ${
                                  courseTracking[course.id]?.is_completed ? "fill-green-500 text-green-500" : ""
                                }`}
                              />
                            </Button>
                          </div>
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
                        {course.subtitle && <p className="text-sm text-muted-foreground">{course.subtitle}</p>}
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
              {filteredCourses.filter((course) => courseTracking[course.id]?.is_completed).length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhum curso concluído ainda</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {activeView === "profile" && (
          <Card>
            <CardHeader>
              <CardTitle>Meu Cadastro</CardTitle>
              <CardDescription>Dados cadastrais da empresa</CardDescription>
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
              </div>
            </CardContent>
          </Card>
        )}

        {activeView === "employees" && (
          <Card>
            <CardHeader>
              <CardTitle>Colaboradores</CardTitle>
              <CardDescription>Informações sobre os colaboradores da empresa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <p className="text-sm font-medium">Número de Colaboradores</p>
                  <p className="text-sm text-muted-foreground">{profile?.employee_count || "Não informado"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {selectedCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={() => setSelectedCourse(null)}
        >
          <Card className="max-h-[90vh] w-full max-w-3xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
              {selectedCourse.subtitle && <p className="text-sm text-muted-foreground">{selectedCourse.subtitle}</p>}
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
                  <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(selectedCourse.content) }} />
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
                    {selectedCourse.resourceFiles.map(
                      (file: { name: string; data: string; type: string }, index: number) => (
                        <Button
                          key={index}
                          onClick={() => handleDownloadResource(file)}
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          {file.name}
                        </Button>
                      ),
                    )}
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
