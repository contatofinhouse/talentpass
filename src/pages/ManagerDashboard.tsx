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

  // Campos temporários para adicionar employee
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeeEmail, setNewEmployeeEmail] = useState("");
  const [addingEmployee, setAddingEmployee] = useState(false);

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
      const { data: userData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(newEmployeeEmail, {
        data: { name: newEmployeeName, user_role: "employee" },
      });

      if (inviteError) throw inviteError;

      await supabase.from("profiles").insert({
        id: userData.user.id,
        name: newEmployeeName,
        email: newEmployeeEmail,
        user_role: "employee",
        manager_id: user.id,
      });

      toast({
        title: "Sucesso",
        description: "Colaborador adicionado e convite enviado",
      });

      setNewEmployeeName("");
      setNewEmployeeEmail("");
      fetchEmployees();
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível adicionar colaborador",
        variant: "destructive",
      });
    } finally {
      setAddingEmployee(false);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      await supabase.from("profiles").delete().eq("id", id).eq("manager_id", user.id);

      toast({
        title: "Sucesso",
        description: "Colaborador removido",
      });
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

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;

      const { data: profileData, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();

      if (error) {
        console.error("Erro ao buscar profile:", error);
      }

      const combinedProfile = {
        ...profileData,
        name: profileData?.name || user.user_metadata?.name || "",
        email: user.email || profileData?.email || "",
        company_name: user.user_metadata?.company_name || "",
        cnpj: user.user_metadata?.cnpj || "",
        phone: user.user_metadata?.phone || "",
        employee_count: user.user_metadata?.employee_count || "",
        status: profileData?.status ? profileData.status.toLowerCase().trim() : "trial",
      };

      setProfile(combinedProfile);

      const supabaseCourses = await fetchCoursesFromSupabase();
      setAllCourses(supabaseCourses);

      await fetchTracking();
      await fetchEmployees();

      setLoading(false);
    };

    fetchProfileData();
  }, [user, fetchTracking]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleChangePassword = async () => {
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
          <MetricCard title="Colaboradores" value={profile?.employee_count || "0"} icon={Users} />
        </div>

        {activeView === "courses" && <>{/* Conteúdo de cursos (igual seu código) */}</>}

        {activeView === "profile" && <>{/* Conteúdo de profile (igual seu código) */}</>}

        {activeView === "employees" && (
          <>
            {profile?.status === "trial" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Colaboradores</CardTitle>
                  <CardDescription>Ative seu plano para gerenciar colaboradores</CardDescription>
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
              <Card>
                <CardHeader>
                  <CardTitle>Colaboradores</CardTitle>
                  <CardDescription>Gerencie seus colaboradores</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      <CourseDetailModal course={selectedCourse} isOpen={!!selectedCourse} onClose={() => setSelectedCourse(null)} />
    </div>
  );
};

export default ManagerDashboard;
