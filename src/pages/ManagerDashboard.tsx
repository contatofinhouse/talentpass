import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heart, CheckCircle2, Search, Users, Loader2, BookOpen, Key } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { fetchCoursesFromSupabase } from "@/data/courses";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase";
import { ManagerHeader } from "@/components/manager/ManagerHeader";
import { MetricCard } from "@/components/manager/MetricCard";
import { CourseCard } from "@/components/manager/CourseCard";
import { CourseDetailModal } from "@/components/manager/CourseDetailModal";
import { EmptyState } from "@/components/manager/EmptyState";
import { EmployeeManagement } from "@/components/manager/EmployeeManagement";
import { useCourseFilters } from "@/hooks/useCourseFilters";
import { useCourseTracking } from "@/hooks/useCourseTracking";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<"courses" | "profile" | "employees">("courses");
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);

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

  const fetchEmployees = async () => {
    if (!user) return;

    try {
      // Buscar os employees através da tabela de vínculo
      const { data, error } = await supabase
        .from("employees")
        .select(`
          employee_id,
          created_at,
          profiles!employees_employee_id_fkey (
            id,
            name,
            email
          )
        `)
        .eq("manager_id", user.id);

      if (error) throw error;

      // Transformar os dados para o formato esperado
      const employeesData = data?.map((item: any) => ({
        id: item.profiles.id,
        name: item.profiles.name,
        email: item.profiles.email,
        created_at: item.created_at,
      })) || [];

      setEmployees(employeesData);
    } catch (error) {
      console.error("Erro ao buscar colaboradores:", error);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      // Busca dados do profile (name, email, status)
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
      }

      // Combina dados do profile com metadata do user
      const combinedProfile = {
        ...profileData,
        name: profileData?.name || user.user_metadata?.name || "",
        email: user.email || profileData?.email || "",
        company_name: user.user_metadata?.company_name || "",
        cnpj: user.user_metadata?.cnpj || "",
        phone: user.user_metadata?.phone || "",
        employee_count: user.user_metadata?.employee_count || "",
        status: profileData?.status || "trial",
      };

      setProfile(combinedProfile);

      const supabaseCourses = await fetchCoursesFromSupabase();
      setAllCourses(supabaseCourses);

      await fetchTracking();
      await fetchEmployees();

      setLoading(false);
    };

    fetchProfile();
  }, [user, fetchTracking]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleChangePassword = async () => {
    // Validações
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Erro",
        description: "A nova senha deve ter no mínimo 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    setPasswordLoading(true);

    try {
      // Primeiro verifica a senha atual fazendo login
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: currentPassword,
      });

      if (signInError) {
        toast({
          title: "Erro",
          description: "Senha atual incorreta",
          variant: "destructive",
        });
        setPasswordLoading(false);
        return;
      }

      // Atualiza a senha
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        toast({
          title: "Erro",
          description: updateError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sucesso",
          description: "Senha alterada com sucesso",
        });
        setIsChangePasswordOpen(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao alterar senha",
        variant: "destructive",
      });
    } finally {
      setPasswordLoading(false);
    }
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
          <div className="space-y-4">
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

            <Card>
              <CardHeader>
                <CardTitle>Segurança</CardTitle>
                <CardDescription>Configurações de segurança da conta</CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Key className="mr-2 h-4 w-4" />
                      Alterar Senha
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Alterar Senha</DialogTitle>
                      <DialogDescription>
                        Insira sua senha atual e escolha uma nova senha
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Senha Atual</Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Digite sua senha atual"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Nova Senha</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Digite a nova senha (mínimo 6 caracteres)"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirme a nova senha"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsChangePasswordOpen(false);
                          setCurrentPassword("");
                          setNewPassword("");
                          setConfirmPassword("");
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleChangePassword} disabled={passwordLoading}>
                        {passwordLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Alterar Senha
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        )}

        {activeView === "employees" && (
          <>
            {profile?.status === "trial" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Colaboradores</CardTitle>
                  <CardDescription>
                    Ative seu plano para gerenciar colaboradores
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <p className="text-center text-muted-foreground mb-4">
                    Você está no plano trial. Para adicionar e gerenciar colaboradores, ative seu plano.
                  </p>
                  <Button
                    onClick={() => {
                      const phoneNumber = "5511955842951";
                      const message = "Olá! Gostaria de ativar o plano para gerenciar colaboradores.";
                      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                      window.open(whatsappUrl, "_blank");
                    }}
                  >
                    Ativar Plano
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <EmployeeManagement 
                employees={employees} 
                onRefresh={fetchEmployees}
              />
            )}
          </>
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
