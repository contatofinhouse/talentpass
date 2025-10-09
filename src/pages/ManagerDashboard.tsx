import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Play, Clock, Users, LogOut, Download, Loader2, Heart, CheckCircle2, Search, User, Settings, BookOpen } from "lucide-react";
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

      setLoading(true);

      // Buscar perfil do usuário
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error("Erro ao buscar perfil:", profileError);
      } else {
        setProfile(profileData);
      }

      // Buscar cursos do Supabase
      const { data: supabaseCourses, error: supabaseError } = await supabase
        .from('courses')
        .select('*');

      if (supabaseError) {
        console.error("Erro ao buscar cursos do Supabase:", supabaseError);
      }

      // Cursos admin locais
      const adminCourses = JSON.parse(localStorage.getItem("adminCourses") || "[]");

      // Combinar cursos, removendo duplicados por id
      const combinedCourses = [
        ...defaultCourses,
        ...adminCourses,
        ...(supabaseCourses || [])
      ].filter((course, index, self) => index === self.findIndex(c => c.id === course.id));

      setAllCourses(combinedCourses);

      // Buscar tracking de cursos
      await fetchCourseTracking();

      setLoading(false);
    };

    fetchProfileAndCourses();
  }, [user]);

  const fetchCourseTracking = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('manager_course_tracking')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error("Erro ao buscar tracking de cursos:", error);
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

    const { error } = await supabase
      .from('manager_course_tracking')
      .upsert({
        user_id: user.id,
        course_id: courseId,
        is_favorite: newStatus,
        is_completed: courseTracking[courseId]?.is_completed || false,
      }, { onConflict: 'user_id,course_id' });

    if (error) {
      console.error("Erro ao atualizar favorito:", error);
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

    const { error } = await supabase
      .from('manager_course_tracking')
      .upsert({
        user_id: user.id,
        course_id: courseId,
        is_favorite: courseTracking[courseId]?.is_favorite || false,
        is_completed: newStatus,
        completed_at: newStatus ? new Date().toISOString() : null,
      }, { onConflict: 'user_id,course_id' });

    if (error) {
      console.error("Erro ao atualizar status:", error);
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
    const link = document.createElement('a');
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

  const favoriteCount = Object.values(courseTracking).filter(t => t.is_favorite).length;
  const completedCount = Object.values(courseTracking).filter(t => t.is_completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
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

        {/* Conteúdo tabs */}
        {activeView === "courses" && (
          <Tabs defaultValue="courses">
            <TabsList className="mb-6">
              <TabsTrigger value="courses">Todos os Cursos</TabsTrigger>
              <TabsTrigger value="favorites">Favoritos</TabsTrigger>
              <TabsTrigger value="completed">Concluídos</TabsTrigger>
            </TabsList>

            {/* Todos cursos */}
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
                  <CourseCard 
                    key={course.id} 
                    course={course} 
                    courseTracking={courseTracking} 
                    toggleFavorite={toggleFavorite} 
                    toggleCompleted={toggleCompleted} 
                    setSelectedCourse={setSelectedCourse} 
                  />
                ))}
              </div>
            </TabsContent>

            {/* Favoritos */}
            <TabsContent value="favorites" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.filter(c => courseTracking[c.id]?.is_favorite).map((course) => (
                  <CourseCard 
                    key={course.id} 
                    course={course} 
                    courseTracking={courseTracking} 
                    toggleFavorite={toggleFavorite} 
                    toggleCompleted={toggleCompleted} 
                    setSelectedCourse={setSelectedCourse} 
                  />
                ))}
              </div>
              {filteredCourses.filter(c => courseTracking[c.id]?.is_favorite).length === 0 && (
                <div className="text-center py-12">
                  <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhum curso favoritado ainda</p>
                </div>
              )}
            </TabsContent>

            {/* Concluídos */}
            <TabsContent value="completed" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.filter(c => courseTracking[c.id]?.is_completed).map((course) => (
                  <CourseCard 
                    key={course.id} 
                    course={course} 
                    courseTracking={courseTracking} 
                    toggleFavorite={toggleFavorite} 
                    toggleCompleted={toggleCompleted} 
                    setSelectedCourse={setSelectedCourse} 
                  />
                ))}
              </div>
              {filteredCourses.filter(c => courseTracking[c.id]?.is_completed).length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhum curso concluído ainda</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {/* Perfil */}
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

        {/* Colaboradores */}
        {activeView === "employees" && (
          <Card>
            <CardHeader>
              <CardTitle>Colaboradores</CardTitle>
              <CardDescription>Informações sobre os colaboradores da empresa</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Funcionalidade de colaboradores será implementada em breve</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de Curso */}
      {selectedCourse && (
        <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
      )}
    </div>
  );
};

export default ManagerDashboard;

// Componente CourseCard
const CourseCard = ({ course, courseTracking, toggleFavorite, toggleCompleted, setSelectedCourse }: any) => {
  const isFavorite = courseTracking[course.id]?.is_favorite;
  const isCompleted = courseTracking[course.id]?.is_completed;

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition"
      onClick={() => setSelectedCourse(course)}
    >
      <img src={course.image || "/placeholder.png"} alt={course.title} className="h-40 w-full object-cover rounded-t-md" />
      <CardContent>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-sm">{course.title}</CardTitle>
            <CardDescription className="text-xs line-clamp-2">{course.description}</CardDescription>
          </div>
          <div className="flex flex-col gap-1">
            <Button size="icon" variant="ghost" onClick={(e) => toggleFavorite(course.id, e)}>
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button size="icon" variant="ghost" onClick={(e) => toggleCompleted(course.id, e)}>
              <CheckCircle2 className={`h-4 w-4 ${isCompleted ? "text-green-500" : ""}`} />
            </Button>
          </div>
        </div>
        {course
