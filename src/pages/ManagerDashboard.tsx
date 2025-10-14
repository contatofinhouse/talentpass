import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Heart, CheckCircle2, Search, Users, Loader2, BookOpen } from "lucide-react";
import { fetchCoursesFromSupabase } from "@/data/courses";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase";
import { ManagerHeader } from "@/components/manager/ManagerHeader";
import { MetricCard } from "@/components/manager/MetricCard";
import { CourseCard } from "@/components/manager/CourseCard";
import { CourseDetailModal } from "@/components/manager/CourseDetailModal";
import { EmptyState } from "@/components/manager/EmptyState";
import { useCourseFilters } from "@/hooks/useCourseFilters";
import { useCourseTracking } from "@/hooks/useCourseTracking";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<"courses" | "profile" | "employees">("courses");

  const {
    courseTracking,
    toggleFavorite,
    toggleCompleted,
    fetchTracking,
    favoriteCount,
    completedCount,
  } = useCourseTracking(user?.id);

  const {
    filteredCourses,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedLevel,
    setSelectedLevel,
    viewType,
    setViewType,
    categories,
    levels,
  } = useCourseFilters(allCourses, courseTracking);

  const { displayedItems: displayedCourses, hasMore, loadMoreRef } = useInfiniteScroll(filteredCourses);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      console.log("🔍 Buscando profile para user.id:", user.id);
      
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();

      console.log("📊 Resposta do Supabase - data:", data);
      console.log("❌ Resposta do Supabase - error:", error);

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        console.log("✅ Dados do profile que serão salvos no state:", data);
        setProfile(data);
      }

      const supabaseCourses = await fetchCoursesFromSupabase();
      setAllCourses(supabaseCourses);

      await fetchTracking();

      setLoading(false);
    };

    fetchProfile();
  }, [user, fetchTracking]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <ManagerHeader profile={profile} onNavigate={setActiveView} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <MetricCard 
            title="Total de Cursos" 
            value={allCourses.length}
            icon={BookOpen}
            iconColor="text-primary"
            onClick={() => setViewType("all")}
            isActive={viewType === "all"}
          />
          <MetricCard
            title="Favoritos"
            value={favoriteCount}
            icon={Heart}
            iconColor="text-red-500 fill-red-500"
            onClick={() => setViewType("favorites")}
            isActive={viewType === "favorites"}
          />
          <MetricCard 
            title="Concluídos" 
            value={completedCount} 
            icon={CheckCircle2} 
            iconColor="text-green-500"
            onClick={() => setViewType("completed")}
            isActive={viewType === "completed"}
          />
          <MetricCard
            title="Colaboradores"
            value={profile?.employee_count || "0"}
            icon={Users}
          />
        </div>

        {activeView === "courses" && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título, descrição ou skill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Categoria</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      className="cursor-pointer whitespace-nowrap"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category === "all" ? "Todas" : category}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Nível</p>
                <div className="flex flex-wrap gap-2">
                  {levels.map((level) => (
                    <Badge
                      key={level}
                      variant={selectedLevel === level ? "default" : "outline"}
                      className="cursor-pointer whitespace-nowrap"
                      onClick={() => setSelectedLevel(level)}
                    >
                      {level === "all" ? "Todos" : level.charAt(0).toUpperCase() + level.slice(1)}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {displayedCourses.length === 0 ? (
              <EmptyState 
                icon={viewType === "favorites" ? Heart : viewType === "completed" ? CheckCircle2 : Search} 
                message={
                  viewType === "favorites" ? "Nenhum curso favoritado ainda" :
                  viewType === "completed" ? "Nenhum curso concluído ainda" :
                  "Nenhum curso encontrado"
                } 
              />
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {displayedCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      courseTracking={courseTracking[course.id]}
                      onToggleFavorite={toggleFavorite}
                      onToggleCompleted={toggleCompleted}
                      onClick={() => setSelectedCourse(course)}
                    />
                  ))}
                </div>
                {hasMore && (
                  <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                )}
              </>
            )}
          </div>
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
                  <p className="text-sm font-medium">Nome</p>
                  <p className="text-sm text-muted-foreground">{profile?.name || ""}</p>
                </div>
                <div className="grid gap-2">
                  <p className="text-sm font-medium">Empresa</p>
                  <p className="text-sm text-muted-foreground">{profile?.company_name || ""}</p>
                </div>
                <div className="grid gap-2">
                  <p className="text-sm font-medium">CNPJ</p>
                  <p className="text-sm text-muted-foreground">{profile?.cnpj || ""}</p>
                </div>
                <div className="grid gap-2">
                  <p className="text-sm font-medium">Telefone</p>
                  <p className="text-sm text-muted-foreground">{profile?.phone || ""}</p>
                </div>
                <div className="grid gap-2">
                  <p className="text-sm font-medium">E-mail</p>
                  <p className="text-sm text-muted-foreground">{profile?.email || ""}</p>
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

      <CourseDetailModal
        course={selectedCourse}
        isOpen={!!selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />
    </div>
  );
};

export default ManagerDashboard;
