import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heart, CheckCircle2, Search, Users, Loader2, BookOpen, Key, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeeEmail, setNewEmployeeEmail] = useState("");
  const [addingEmployee, setAddingEmployee] = useState(false);

  const EDGE_FUNCTION_URL = "https://tpwafkhuetbrdlykyegy.supabase.co/functions/v1/hyper-endpoint";

  const { courseTracking, toggleFavorite, toggleCompleted, fetchTracking, favoriteCount, completedCount } =
    useCourseTracking(user?.id);

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

  // === Fetch employees ===
  const fetchEmployees = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("employees")
        .select(
          `
          employee_id,
          created_at,
          profiles!employees_employee_id_fkey (
            id,
            name,
            email
          )
        `,
        )
        .eq("manager_id", user.id);

      if (error) throw error;

      const employeesData =
        data?.map((item: any) => ({
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

  // === Add employee ===
  const handleAddEmployee = async () => {
    if (!newEmployeeName || !newEmployeeEmail) {
      toast({
        title: "Erro",
        description: "Preencha nome e e-mail",
        variant: "destructive",
      });
      return;
    }

    setAddingEmployee(true);
    try {
      const res = await fetch(EDGE_FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newEmployeeName,
          email: newEmployeeEmail,
          manager_id: user.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Erro ao adicionar colaborador:", data);
        toast({
          title: "Erro ao adicionar colaborador",
          description: data.error || JSON.stringify(data),
          variant: "destructive",
        });
        return;
      }

      toast({ title: "Sucesso", description: "Colaborador adicionado e convite enviado" });
      setNewEmployeeName("");
      setNewEmployeeEmail("");
      fetchEmployees();
    } catch (err: any) {
      console.error("Erro inesperado ao adicionar colaborador:", err);
      toast({
        title: "Erro inesperado",
        description: err.message || JSON.stringify(err),
        variant: "destructive",
      });
    } finally {
      setAddingEmployee(false);
    }
  };

  // === Delete employee ===
  const handleDeleteEmployee = async (id: string) => {
    try {
      await supabase.from("profiles").delete().eq("id", id).eq("manager_id", user.id);
      toast({ title: "Sucesso", description: "Colaborador removido" });
      fetchEmployees();
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Não foi possível remover colaborador",
        variant: "destructive",
      });
    }
  };

  // === Load profile and data ===
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        console.log("❌ ManagerDashboard: Sem usuário");
        return;
      }

      console.log("🔄 ManagerDashboard: Iniciando carregamento para user:", user.id);
      setLoading(true);
      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        console.log("📊 Profile Data do Supabase:", profileData);
        console.log("📊 User Metadata:", user.user_metadata);
        console.log("❌ Profile Error:", profileError);

        const combinedProfile = {
          id: user.id,
          ...profileData,
          name: profileData?.name || user.user_metadata?.name || "",
          email: user.email || profileData?.email || "",
          company_name: profileData?.company_name || user.user_metadata?.company_name || "",
          cnpj: profileData?.cnpj || user.user_metadata?.cnpj || "",
          phone: profileData?.phone || user.user_metadata?.phone || "",
          employee_count: profileData?.employee_count || user.user_metadata?.employee_count || "",
          status: (profileData?.status ?? user.user_metadata?.status ?? "trial") || "trial",
        };

        console.log("✅ Combined Profile:", combinedProfile);
        setProfile(combinedProfile);

        const supabaseCourses = await fetchCoursesFromSupabase();
        console.log("📚 Cursos carregados:", supabaseCourses.length);
        setAllCourses(supabaseCourses);

        await fetchTracking();
        await fetchEmployees();

        console.log("✅ ManagerDashboard: Carregamento concluído");
      } catch (e) {
        console.error("❌ Erro ao carregar perfil:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, fetchTracking]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({ title: "Erro", description: "Preencha todos os campos", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Erro", description: "Senha mínima de 6 caracteres", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Erro", description: "Senhas não coincidem", variant: "destructive" });
      return;
    }

    setPasswordLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: currentPassword,
      });
      if (signInError) {
        toast({ title: "Erro", description: "Senha atual incorreta", variant: "destructive" });
        setPasswordLoading(false);
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) {
        toast({ title: "Erro", description: updateError.message, variant: "destructive" });
      } else {
        toast({ title: "Sucesso", description: "Senha alterada com sucesso" });
        setIsChangePasswordOpen(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      toast({ title: "Erro", description: "Erro ao alterar senha", variant: "destructive" });
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

  if (!profile) {
    console.error("❌ Profile é null mesmo após loading!");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Erro ao carregar perfil</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Recarregar
          </Button>
        </div>
      </div>
    );
  }

  // ======================================
  // PAGE START
  // ======================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <ManagerHeader profile={profile} onNavigate={setActiveView} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        {/* === Métricas === */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <MetricCard title="Total de Cursos" value={allCourses.length} icon={BookOpen} iconColor="text-primary" />
          <MetricCard title="Favoritos" value={favoriteCount} icon={Heart} iconColor="text-red-500 fill-red-500" />
          <MetricCard title="Concluídos" value={completedCount} icon={CheckCircle2} iconColor="text-green-500" />
          <MetricCard title="Colaboradores" value={employees.length.toString()} icon={Users} />
        </div>

        {/* === Cursos === */}
        {activeView === "courses" && (
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por título, descrição ou skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {displayedCourses.length === 0 ? (
              <EmptyState
                icon={Search}
                message={
                  viewType === "favorites"
                    ? "Nenhum curso favoritado ainda"
                    : viewType === "completed"
                      ? "Nenhum curso concluído ainda"
                      : "Nenhum curso encontrado"
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

        {/* === Perfil === */}
        {activeView === "profile" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Meu Cadastro</CardTitle>
                <CardDescription>Dados cadastrais da empresa</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <b>Nome:</b> {profile?.name}
                  </p>
                  <p>
                    <b>Empresa:</b> {profile?.company_name}
                  </p>
                  <p>
                    <b>CNPJ:</b> {profile?.cnpj || "—"}
                  </p>
                  <p>
                    <b>Telefone:</b> {profile?.phone}
                  </p>
                  <p>
                    <b>Email:</b> {profile?.email}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Segurança</CardTitle>
                <CardDescription>Alterar senha de acesso</CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Key className="mr-2 h-4 w-4" /> Alterar Senha
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Alterar Senha</DialogTitle>
                      <DialogDescription>Digite a senha atual e a nova senha.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <Input
                        placeholder="Senha atual"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <Input
                        placeholder="Nova senha"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <Input
                        placeholder="Confirmar nova senha"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <DialogFooter>
                      <Button onClick={handleChangePassword} disabled={passwordLoading}>
                        {passwordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Alterar Senha
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        )}

        {/* === Colaboradores === */}
        {activeView === "employees" && (
          <Card>
            <CardHeader>
              <CardTitle>Colaboradores</CardTitle>
              {(profile?.status ?? "trial").toString().toLowerCase().trim() === "trial" ? (
                <CardDescription>
                  Sua conta está no modo de avaliação — explore tudo livremente e ative o plano para adicionar
                  colaboradores.
                </CardDescription>
              ) : (
                <CardDescription>Gerencie seus colaboradores</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {(profile?.status ?? "trial").toString().toLowerCase().trim() === "trial" ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <p className="text-center text-muted-foreground mb-4">
                    Aproveite os cursos e recursos. Para ativar colaboradores, fale conosco.
                  </p>
                  <Button
                    className="w-full sm:w-auto"
                    onClick={() => {
                      const phone = "5511955842951";
                      const msg = "Olá! Gostaria de ativar o plano para gerenciar colaboradores.";
                      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
                    }}
                  >
                    Ativar Plano
                  </Button>
                </div>
              ) : (
                <>
                  {/* Add employee form */}
                  <div className="flex gap-2 flex-wrap items-center">
                    <Input
                      placeholder="Nome"
                      value={newEmployeeName}
                      onChange={(e) => setNewEmployeeName(e.target.value)}
                      className="flex-1 min-w-[150px]"
                    />
                    <Input
                      placeholder="E-mail"
                      value={newEmployeeEmail}
                      onChange={(e) => setNewEmployeeEmail(e.target.value)}
                      className="flex-1 min-w-[150px]"
                    />
                    <Button onClick={handleAddEmployee} disabled={addingEmployee}>
                      {addingEmployee ? "..." : "Adicionar"}
                    </Button>
                  </div>

                  {/* Employee list */}
                  <div className="space-y-2 mt-4">
                    {employees.length === 0 ? (
                      <p className="text-muted-foreground text-sm">Nenhum colaborador adicionado ainda</p>
                    ) : (
                      employees.map((emp) => (
                        <div key={emp.id} className="flex justify-between items-center border rounded p-2">
                          <div>
                            <p className="font-medium">{emp.name}</p>
                            <p className="text-sm text-muted-foreground">{emp.email}</p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteEmployee(emp.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <CourseDetailModal course={selectedCourse} isOpen={!!selectedCourse} onClose={() => setSelectedCourse(null)} />
    </div>
  );
};

export default ManagerDashboard;
