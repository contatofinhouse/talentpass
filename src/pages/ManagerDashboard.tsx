import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Heart, CheckCircle2, Search, Users, Loader2 } from "lucide-react";
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
    categories,
  } = useCourseFilters(allCourses);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
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

  const favoriteCourses = filteredCourses.filter((course) => courseTracking[course.id]?.is_favorite);
  const completedCourses = filteredCourses.filter((course) => courseTracking[course.id]?.is_completed);

  const { displayedItems: displayedAllCourses, hasMore: hasMoreAll, loadMoreRef: loadMoreAllRef } = useInfiniteScroll(filteredCourses);
  const { displayedItems: displayedFavorites, hasMore: hasMoreFav, loadMoreRef: loadMoreFavRef } = useInfiniteScroll(favoriteCourses);
  const { displayedItems: displayedCompleted, hasMore: hasMoreComp, loadMoreRef: loadMoreCompRef } = useInfiniteScroll(completedCourses);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <ManagerHeader profile={profile} onNavigate={setActiveView} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <MetricCard title="Total de Cursos" value={allCourses.length} />
          <MetricCard
            title="Favoritos"
            value={favoriteCount}
            icon={Heart}
            iconColor="text-red-500 fill-red-500"
          />
          <MetricCard title="Concluídos" value={completedCount} icon={CheckCircle2} iconColor="text-green-500" />
          <MetricCard
            title="Colaboradores"
            value={profile?.employee_count || "0"}
            icon={Users}
          />
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
                {displayedAllCourses.map((course) => (
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
              {hasMoreAll && <div ref={loadMoreAllRef} className="h-20 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>}
            </TabsContent>

            <TabsContent value="favorites" className="space-y-4">
              {favoriteCourses.length === 0 ? (
                <EmptyState icon={Heart} message="Nenhum curso favoritado ainda" />
              ) : (
                <>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {displayedFavorites.map((course) => (
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
                  {hasMoreFav && <div ref={loadMoreFavRef} className="h-20 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>}
                </>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {completedCourses.length === 0 ? (
                <EmptyState icon={CheckCircle2} message="Nenhum curso concluído ainda" />
              ) : (
                <>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {displayedCompleted.map((course) => (
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
                  {hasMoreComp && <div ref={loadMoreCompRef} className="h-20 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>}
                </>
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

      <CourseDetailModal
        course={selectedCourse}
        isOpen={!!selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />
    </div>
  );
};

export default ManagerDashboard;
