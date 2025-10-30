/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Heart, CheckCircle2, Search, Users, BookOpen, Key, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useCourseFilters, CourseViewType } from "@/hooks/useCourseFilters"; // ✅ importa tipo aqui
import { useCourseTracking } from "@/hooks/useCourseTracking";
import { fetchCoursesFromSupabase, Course } from "@/data/courses";
import { useEmployeeActions } from "@/hooks/useEmployeeActions";
import { ManagerHeader } from "@/components/manager/ManagerHeader";
import { MetricCard } from "@/components/manager/MetricCard";
import { CourseCard } from "@/components/manager/CourseCard";
import { CourseDetailModal } from "@/components/manager/CourseDetailModal";
import { EmptyState } from "@/components/manager/EmptyState";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SelectAreaRole } from "@/components/manager/SelectAreaRole";
import { useDeferredValue } from "react";
import { useTransition } from "react";



import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

export default function ManagerDashboard({ isEmployee = false }: { isEmployee?: boolean }) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { profile, role, loading } = useProfile();

  // === Estados locais ===
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [activeView, setActiveView] = useState<"courses" | "profile" | "employees">("courses");
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "", loading: false });
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [employeeForm, setEmployeeForm] = useState({ name: "", email: "" });

  // === Hooks customizados ===
  const { employees, fetchEmployees, addEmployee, deleteEmployee, loading: employeesLoading } =
    useEmployeeActions({ userId: user?.id, role });

  const { courseTracking, toggleFavorite, toggleCompleted, fetchTracking, favoriteCount, completedCount } =
    useCourseTracking(user?.id);

const {
  filteredCourses,
  searchQuery,
  setSearchQuery,
  viewType,
  setViewType,
  selectedCategory,
  setSelectedCategory,
  categories,
} = useCourseFilters(allCourses, courseTracking);

  const deferredCourses = useDeferredValue(filteredCourses);
  

const [isPending, startTransition] = useTransition();


  // === Logout ===
  const handleLogout = useCallback(async () => {
    await signOut();
    navigate("/");
  }, [signOut, navigate]);

  // === Alterar Senha ===
  const handleChangePassword = useCallback(async () => {
    const { current, new: newPass, confirm } = passwordForm;
    if (!current || !newPass || !confirm) {
      toast({ title: "Erro", description: "Preencha todos os campos", variant: "destructive" });
      return;
    }
    if (newPass.length < 6) {
      toast({ title: "Erro", description: "Senha mínima de 6 caracteres", variant: "destructive" });
      return;
    }
    if (newPass !== confirm) {
      toast({ title: "Erro", description: "Senhas não coincidem", variant: "destructive" });
      return;
    }

    setPasswordForm((f) => ({ ...f, loading: true }));

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user?.email || "",
      password: current,
    });
    if (signInError) {
      toast({ title: "Erro", description: "Senha atual incorreta", variant: "destructive" });
      setPasswordForm((f) => ({ ...f, loading: false }));
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPass });
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sucesso", description: "Senha alterada com sucesso." });
      setIsChangePasswordOpen(false);
      setPasswordForm({ current: "", new: "", confirm: "", loading: false });
    }
  }, [passwordForm, toast, user]);

  // === Load inicial ===
 useEffect(() => {
  if (!user) return;

  (async () => {
    const courses = await fetchCoursesFromSupabase();
    setAllCourses(courses);

    fetchTracking();
    fetchEmployees();
  })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [user]);


  if (loading || !profile)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );

  const isTrial = String(profile.status ?? "trial").toLowerCase() === "trial";

  // ✅ Array de métricas com tipo explícito
  const metricCards: { title: string; value: number; icon: any; view: CourseViewType }[] = [
    { title: "Total de Cursos", value: allCourses.length, icon: BookOpen, view: "all" },
    { title: "Favoritos", value: favoriteCount, icon: Heart, view: "favorites" },
    { title: "Concluídos", value: completedCount, icon: CheckCircle2, view: "completed" },
  ];

  // === Render ===
  return (
<div className="relative min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <ManagerHeader profile={profile} onNavigate={setActiveView} onLogout={handleLogout} isEmployee={isEmployee} />
  


      <div className="container mx-auto px-4 py-8">

            <SelectAreaRole
  user={user}
  profile={profile}
  onUpdated={(newValue) => {
    
    // render imediato, sem refresh
  }}
/>
        {/* === Métricas === */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          {metricCards.map(({ title, value, icon, view }) => (
            <div
              key={title}
             onClick={() => {
  startTransition(() => {
    setActiveView("courses");
    setViewType(view);
  });
}}

              className="cursor-pointer hover:scale-105 transition"
            >
              <MetricCard title={title} value={value} icon={icon} />
            </div>
          ))}

          {!isEmployee && (
            <div onClick={() =>
  startTransition(() => setActiveView("employees"))
}
className="cursor-pointer hover:scale-105 transition">
              <MetricCard title="Colaboradores" value={employees.length} icon={Users} />
            </div>
          )}
        </div>

        {/* === Cursos === */}
        {activeView === "courses" && (
          <div className="space-y-6">
       {/* Campo de busca com ícone */}
<div className="relative">
  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
  <Input
    placeholder="Buscar cursos..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="pl-10"
  />
</div>

{/* Filtro de categorias abaixo */}
<div className="relative overflow-x-auto no-scrollbar -mx-2 px-2 py-2">
  <div className="inline-flex gap-2">
    {categories.map((category) => {
      const label = category === "all" ? "Todas" : category;
      const isSelected = selectedCategory === category;

      return (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`px-3 py-1 text-sm whitespace-nowrap rounded-full border transition-colors
            ${
              isSelected
                ? "bg-primary text-white border-primary"
                : "bg-background text-muted-foreground border-muted-foreground/20 hover:bg-muted"
            }`}
        >
          {label}
        </button>
      );
    })}
  </div>
</div>


           {deferredCourses.length === 0 ? (

              <EmptyState
                icon={Search}
                message={
                  viewType === "favorites"
                    ? "Nenhum curso favoritado"
                    : viewType === "completed"
                    ? "Nenhum curso concluído"
                    : "Nenhum curso encontrado"
                }
              />
            ) : (
         <div
  className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
  style={{
    contentVisibility: "auto",
    containIntrinsicSize: "1px 600px",
  }}
>
{deferredCourses.map((course) => (

    <CourseCard
      key={course.id}
      course={course}
      courseTracking={courseTracking[course.id]}
      onToggleFavorite={toggleFavorite}
      onToggleCompleted={toggleCompleted}
   onClick={() => {
  document.body.classList.add("overflow-hidden");

  const nextViews = (course.views ?? 0) + 1;

  // ✅ Abre modal imediatamente
  setSelectedCourse({
    ...course,
    views: nextViews,
  });

  // ✅ Atualiza views localmente sem bloquear UI
  setAllCourses((prev) =>
    prev.map((c) =>
      c.id === course.id ? { ...c, views: nextViews } : c
    )
  );

  // ✅ Atualiza Supabase em background (sem await)
  supabase
    .from("courses")
    .update({ views: nextViews })
    .eq("id", course.id);
}}

    />
  ))}
</div>

            )}
          </div>
        )}

        {/* === Perfil === */}
        {activeView === "profile" && (
          <Card>
            <CardHeader>
              <CardTitle>Meu Cadastro</CardTitle>
              <CardDescription>Dados cadastrais da empresa</CardDescription>
            </CardHeader>
            <CardContent>
              {(["name", "company_name", "cnpj", "phone", "email"] as const).map((f) => (
                <p key={f}>
                  <b>{f.replace("_", " ")}:</b> {(profile as any)[f] ?? "—"}
                </p>
              ))}

              <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="mt-4">
                    <Key className="mr-2 h-4 w-4" /> Alterar Senha
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Alterar Senha</DialogTitle>
                    <DialogDescription>Digite a senha atual e a nova senha</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    {(["current", "new", "confirm"] as const).map((field) => (
                      <Input
                        key={field}
                        type="password"
                        placeholder={
                          field === "current"
                            ? "Senha atual"
                            : field === "new"
                            ? "Nova senha"
                            : "Confirmar nova senha"
                        }
                        value={passwordForm[field]}
                        onChange={(e) => setPasswordForm((f) => ({ ...f, [field]: e.target.value }))}
                      />
                    ))}
                  </div>
                  <DialogFooter>
                    <Button onClick={handleChangePassword} disabled={passwordForm.loading}>
                      Alterar Senha
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}

        {/* === Colaboradores === */}
        {!isEmployee && activeView === "employees" && (
          <Card>
            <CardHeader>
              <CardTitle>Colaboradores</CardTitle>
              <CardDescription>
                {isTrial
                  ? "Modo avaliação — ative o plano para adicionar colaboradores."
                  : "Gerencie seus colaboradores"}
              </CardDescription>
            </CardHeader>
       <CardContent className="space-y-4">
  {(() => {
    const normalizedStatus = profile?.status?.trim()?.toLowerCase();
    const isTrial = normalizedStatus === "trial";

    if (isTrial) {
      return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center bg-primary/5 rounded-xl border border-primary/10">
  <h3 className="text-lg font-semibold mb-2 text-primary">Plano Teams</h3>
  <p className="text-sm text-muted-foreground mb-3 max-w-sm">
    Adicione até <strong>40 colaboradores</strong> e turbine o aprendizado da sua equipe.  
    Apenas <strong>R$ 49,90/mês</strong> + <strong>R$ 0,99</strong> por colaborador adicional.
  </p>
  <p className="text-xs text-muted-foreground mb-5 italic">
    Ative agora e libere todos os recursos de gestão de equipe.
  </p>
  <Button
    onClick={() => navigate("/ativar-plano")}
    className="w-full sm:w-auto bg-primary text-white text-base py-3 font-medium hover:bg-primary/90 transition-all rounded-lg shadow-md"
  >
    🚀 Ativar Plano Teams
  </Button>
</div>

      );
    }

    // 👇 exibe normalmente se plano ativo
    return (
      <>
        <div className="flex gap-2 flex-wrap items-center">
          <Input
            placeholder="Nome"
            value={employeeForm.name}
            onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
          />
          <Input
            placeholder="E-mail"
            value={employeeForm.email}
            onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
          />
          <Button
            onClick={() => addEmployee(employeeForm.name, employeeForm.email)}
            disabled={employeesLoading}
          >
            Adicionar
          </Button>
        </div>

        {employees.length === 0 ? (
          <p className="text-muted-foreground text-sm">Nenhum colaborador adicionado</p>
        ) : (
          employees.map((emp) => (
            <div key={emp.id} className="flex justify-between items-center border rounded p-2">
              <div>
                <p className="font-medium">{emp.name}</p>
                <p className="text-sm text-muted-foreground">{emp.email}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => deleteEmployee(emp.id)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))
        )}
      </>
    );
  })()}
</CardContent>

          </Card>
        )}
      </div>
{selectedCourse && (
  <CourseDetailModal
    course={selectedCourse}
    allCourses={allCourses}
    onSelectCourse={(c) => setSelectedCourse(c)}
    isOpen={true}
    onClose={() => {
      document.body.classList.remove("overflow-hidden");
      setSelectedCourse(null);
    }}
    courseTracking={courseTracking[selectedCourse.id]}
    userName={profile?.name}
  />
)}


    </div>
  );
}
