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
import { courses as defaultCourses } from "@/data/courses";
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
    const fetchProfileAndCourses = async () => {
      if (!user) return;

      // 1️⃣ Buscar perfil
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Erro ao buscar perfil:", profileError);
      } else {
        setProfile(profileData);
      }

      // 2️⃣ Buscar cursos do Supabase
      const { data: supabaseCourses, error: coursesError } = await supabase.from("courses").select("*");

      if (coursesError) {
        console.error("Erro ao buscar cursos:", coursesError);
      }

      // 3️⃣ Buscar cursos admin locais
      const adminCourses = JSON.parse(localStorage.getItem("adminCourses") || "[]");

      // 4️⃣ Combinar todos (sem duplicatas)
      const combinedCourses = [...defaultCourses, ...adminCourses, ...(supabaseCourses || [])].filter(
        (course, index, self) => index === self.findIndex((c) => c.id === course.id),
      );

      setAllCourses(combinedCourses);

      // 5️⃣ Carregar tracking de cursos
      await fetchCourseTracking();

      setLoading(false);
    };

    fetchProfileAndCourses();
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

  const handleDownloadResource = (file: { name: string; data: string }) => {
    const link = document.createElement("a");
    link.href = file.data;
    link.download = file.name;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
                      "Olá! Quero ativar o plano Starter na plataforma de educação com IA.\nVi que o Plano Teams é R$49/mês até 40 funcionários e R$0,99 por funcionário adicional.\nGostaria de incluir minha equipe e garantir acesso imediato.",
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
        {/* Cards resumo */}
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

        {/* Conteúdo das Tabs */}
        {activeView === "courses" && (
          <Tabs defaultValue="courses">
            <TabsList className="mb-6">
              <TabsTrigger value="courses">Todos os Cursos</TabsTrigger>
              <TabsTrigger value="favorites">Favoritos</TabsTrigger>
              <TabsTrigger value="completed">Concluídos</TabsTrigger>
            </TabsList>

            {/* Tab: Todos os Cursos */}
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

            {/* Tabs Favoritos e Concluídos seguem mesma lógica */}
            {/* ... Você pode repetir o mesmo padrão acima para 'favorites' e 'completed' */}
          </Tabs>
        )}

        {/* Perfil */}
        {activeView === "profile" && (
          <Card>
            <CardHeader>
              <CardTitle>Meu Cadastro</CardTitle>
              <CardDescription>Dados cadastrais da empresa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Nome</label>
                <Input value={profile?.name} readOnly />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Empresa</label>
                <Input value={profile?.company_name} readOnly />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Email</label>
                <Input value={profile?.email} readOnly />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Colaboradores */}
        {activeView === "employees" && (
          <Card>
            <CardHeader>
              <CardTitle>Colaboradores</CardTitle>
              <CardDescription>Gerencie seus colaboradores</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Lista de colaboradores virá aqui...</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
