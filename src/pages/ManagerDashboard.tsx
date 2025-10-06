import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Clock, Users, LogOut, Download } from "lucide-react";
import { courses as defaultCourses } from "@/data/courses";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const manager = JSON.parse(localStorage.getItem("manager") || "{}");
  const employees = JSON.parse(localStorage.getItem("employees") || "[]");

  useEffect(() => {
    const adminCourses = JSON.parse(localStorage.getItem("adminCourses") || "[]");
    setAllCourses([...defaultCourses, ...adminCourses]);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userType");
    navigate("/");
  };

  const handleDownloadResource = () => {
    if (selectedCourse?.resourceFile) {
      const link = document.createElement('a');
      link.href = selectedCourse.resourceFile.data;
      link.download = selectedCourse.resourceFile.name;
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div>
            <h1 className="text-xl font-bold">MicroLearn</h1>
            <p className="text-sm text-muted-foreground">Painel do Gestor</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{manager.managerName}</p>
              <p className="text-xs text-muted-foreground">{manager.companyName}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 grid gap-4 md:grid-cols-3">
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
              <CardTitle className="text-sm font-medium">Colaboradores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div className="text-2xl font-bold">{employees.length}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Categorias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(allCourses.map((c) => c.category || "Geral")).size}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="courses">
          <TabsList className="mb-6">
            <TabsTrigger value="courses">Todos os Cursos</TabsTrigger>
            <TabsTrigger value="employees">Colaboradores</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allCourses.map((course) => (
                <Card
                  key={course.id}
                  className="group cursor-pointer transition-shadow hover:shadow-lg overflow-hidden"
                  onClick={() => setSelectedCourse(course)}
                >
                  {course.image && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={course.image} 
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
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
                    {course.subtitle && (
                      <p className="text-sm text-muted-foreground">{course.subtitle}</p>
                    )}
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

          <TabsContent value="employees">
            <Card>
              <CardHeader>
                <CardTitle>Lista de Colaboradores</CardTitle>
                <CardDescription>
                  {employees.length} colaboradores cadastrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {employees.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Nenhum colaborador cadastrado ainda.
                    </p>
                  ) : (
                    employees.map((email: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <span className="text-sm">{email}</span>
                        <Badge variant="outline">Ativo</Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {selectedCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={() => setSelectedCourse(null)}
        >
          <Card
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
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
              {selectedCourse.subtitle && (
                <p className="text-sm text-muted-foreground">{selectedCourse.subtitle}</p>
              )}
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
                  <div dangerouslySetInnerHTML={{ __html: selectedCourse.content }} />
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

              {selectedCourse.resourceFile && (
                <div className="border-t pt-4">
                  <Button 
                    onClick={handleDownloadResource} 
                    variant="outline" 
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Baixar {selectedCourse.resourceFile.name}
                  </Button>
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
