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

      // Perfil
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(profileData);

      // Cursos do Supabase
      const { data: supabaseCourses } = await supabase.from("courses").select("*");

      // Cursos admin locais
      const adminCourses = JSON.parse(localStorage.getItem("adminCourses") || "[]");

      // Combinar cursos
      const combinedCourses = [...defaultCourses, ...adminCourses, ...(supabaseCourses || [])].filter(
        (course, index, self) => index === self.findIndex((c) => c.id === course.id),
      );

      setAllCourses(combinedCourses);
      await fetchCourseTracking();
      setLoading(false);
    };

    const fetchCourseTracking = async () => {
      if (!user) return;
      const { data } = await supabase.from("manager_course_tracking").select("*").eq("user_id", user.id);
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

    fetchProfileAndCourses();
  }, [user]);

  const toggleFavorite = async (courseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    const currentStatus = courseTracking[courseId]?.is_favorite || false;
    const newStatus = !currentStatus;

    await supabase
      .from("manager_course_tracking")
      .upsert(
        {
          user_id: user.id,
          course_id: courseId,
          is_favorite: newStatus,
          is_completed: courseTracking[courseId]?.is_completed || false,
        },
        { onConflict: "user_id,course_id" },
      );

    setCourseTracking((prev) => ({
      ...prev,
      [courseId]: { ...prev[courseId], is_favorite: newStatus },
    }));
  };

  const toggleCompleted = async (courseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    const currentStatus = courseTracking[courseId]?.is_completed || false;
    const newStatus = !currentStatus;

    await supabase
      .from("manager_course_tracking")
      .upsert(
        {
          user_id: user.id,
          course_id: courseId,
          is_favorite: courseTracking[courseId]?.is_favorite || false,
          is_completed: newStatus,
          completed_at: newStatus ? new Date().toISOString() : null,
        },
        { onConflict: "user_id,course_id" },
      );

    setCourseTracking((prev) => ({
      ...prev,
      [courseId]: { ...prev[courseId], is_completed: newStatus },
    }));
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );

  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(allCourses.map((c) => c.category || "Geral")))];
  const favoriteCount = Object.values(courseTracking).filter((t) => t.is_favorite).length;
  const completedCount = Object.values(courseTracking).filter((t) => t.is_completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">FinHero</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <User className="mr-2 h-4 w-4" /> Minha Conta
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="text-sm font-medium">{profile?.name}</p>
                <p className="text-xs text-muted-foreground">{profile?.company_name}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setActiveView("courses")}>
                <BookOpen className="mr-2 h-4 w-4" /> Cursos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveView("profile")}>
                <Settings className="mr-2 h-4 w-4" /> Cadastro
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveView("employees")}>
                <Users className="mr-2 h-4 w-4" /> Colaboradores
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Cards resumo */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Total de Cursos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allCourses.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Favoritos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{favoriteCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Concluídos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Colaboradores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.employee_count || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo cursos */}
        {activeView === "courses" && (
          <Tabs defaultValue="courses">
            <TabsList className="mb-6">
              <TabsTrigger value="courses">Todos os Cursos</TabsTrigger>
              <TabsTrigger value="favorites">Favoritos</TabsTrigger>
              <TabsTrigger value="completed">Concluídos</TabsTrigger>
            </TabsList>

            <TabsContent value="courses">
              <div className="mb-4">
                <Input
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((c) => (
                  <Badge
                    key={c}
                    variant={selectedCategory === c ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(c)}
                  >
                    {c}
                  </Badge>
                ))}
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
          </Tabs>
        )}

        {activeView === "profile" && <div>Perfil</div>}
        {activeView === "employees" && <div>Colaboradores</div>}

        {selectedCourse && <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />}
      </div>
    </div>
  );
};

export default ManagerDashboard;

// CourseCard
const CourseCard = ({ course, courseTracking, toggleFavorite, toggleCompleted, setSelectedCourse }: any) => {
  const isFavorite = courseTracking[course.id]?.is_favorite;
  const isCompleted = courseTracking[course.id]?.is_completed;

  return (
    <Card className="cursor-pointer" onClick={() => setSelectedCourse(course)}>
      <img src={course.image || "/placeholder.png"} className="h-40 w-full object-cover rounded-t-md" />
      <CardContent>
        <div className="flex justify-between">
          <div>
            <CardTitle>{course.title}</CardTitle>
            <CardDescription>{course.description}</CardDescription>
          </div>
          <div className="flex flex-col gap-1">
            <Button size="icon" variant="ghost" onClick={(e) => toggleFavorite(course.id, e)}>
              <Heart className={`${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button size="icon" variant="ghost" onClick={(e) => toggleCompleted(course.id, e)}>
              <CheckCircle2 className={`${isCompleted ? "text-green-500" : ""}`} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// CourseModal
const CourseModal = ({ course, onClose }: any) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-background p-6 rounded-lg max-w-xl w-full relative">
      <button onClick={onClose} className="absolute top-2 right-2">
        Fechar
      </button>
      <h2 className="text-xl font-bold mb-2">{course.title}</h2>
      <p className="mb-4">{course.description}</p>
      {course.video_url && <iframe className="w-full aspect-video" src={course.video_url} title={course.title} />}
    </div>
  </div>
);
