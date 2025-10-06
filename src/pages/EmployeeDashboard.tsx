import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Clock, Heart, CheckCircle2, Download, LogOut } from "lucide-react";
import { courses } from "@/data/courses";
import { useToast } from "@/hooks/use-toast";

interface CourseProgress {
  [key: string]: {
    completed: boolean;
    favorite: boolean;
  };
}

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [progress, setProgress] = useState<CourseProgress>({});

  useEffect(() => {
    const savedProgress = localStorage.getItem("courseProgress");
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  const saveProgress = (newProgress: CourseProgress) => {
    setProgress(newProgress);
    localStorage.setItem("courseProgress", JSON.stringify(newProgress));
  };

  const toggleComplete = (courseId: string) => {
    const newProgress = {
      ...progress,
      [courseId]: {
        ...progress[courseId],
        completed: !progress[courseId]?.completed,
      },
    };
    saveProgress(newProgress);
    
    if (!progress[courseId]?.completed) {
      toast({
        title: "Curso concluído!",
        description: "Parabéns por completar mais um conteúdo",
      });
    }
  };

  const toggleFavorite = (courseId: string) => {
    const newProgress = {
      ...progress,
      [courseId]: {
        ...progress[courseId],
        favorite: !progress[courseId]?.favorite,
      },
    };
    saveProgress(newProgress);
  };

  const generateCertificate = (courseId: string) => {
    if (!progress[courseId]?.completed) {
      toast({
        title: "Curso não concluído",
        description: "Complete o curso antes de emitir o certificado",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Certificado gerado!",
      description: "O certificado foi salvo em seus documentos",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("userType");
    navigate("/");
  };

  const selectedCourseData = courses.find((c) => c.id === selectedCourse);
  const completedCount = Object.values(progress).filter((p) => p.completed).length;
  const favoriteCourses = courses.filter((c) => progress[c.id]?.favorite);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div>
            <h1 className="text-xl font-bold">MicroLearn</h1>
            <p className="text-sm text-muted-foreground">Meu Aprendizado</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Cursos Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div className="text-2xl font-bold">{completedCount}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Favoritos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                <div className="text-2xl font-bold">{favoriteCourses.length}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">Todos os Cursos</TabsTrigger>
            <TabsTrigger value="favorites">Favoritos</TabsTrigger>
            <TabsTrigger value="completed">Concluídos</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className="group cursor-pointer transition-shadow hover:shadow-lg overflow-hidden"
                >
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <div className="mb-2 flex items-start justify-between">
                      <Badge variant="secondary">{course.category}</Badge>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {course.duration}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(course.id);
                          }}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              progress[course.id]?.favorite
                                ? "fill-red-500 text-red-500"
                                : "text-muted-foreground"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setSelectedCourse(course.id)}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Assistir
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant={progress[course.id]?.completed ? "default" : "outline"}
                        size="sm"
                        className="flex-1"
                        onClick={() => toggleComplete(course.id)}
                      >
                        {progress[course.id]?.completed ? (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Concluído
                          </>
                        ) : (
                          "Marcar como concluído"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {favoriteCourses.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="py-12 text-center">
                    <Heart className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Você ainda não favoritou nenhum curso
                    </p>
                  </CardContent>
                </Card>
              ) : (
                favoriteCourses.map((course) => (
                  <Card
                    key={course.id}
                    className="group cursor-pointer transition-shadow hover:shadow-lg overflow-hidden"
                    onClick={() => setSelectedCourse(course.id)}
                  >
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={course.image} 
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <CardHeader>
                      <div className="mb-2 flex items-start justify-between">
                        <Badge variant="secondary">{course.category}</Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {course.duration}
                        </div>
                      </div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" size="sm" className="w-full">
                        <Play className="mr-2 h-4 w-4" />
                        Assistir
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.filter((c) => progress[c.id]?.completed).length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="py-12 text-center">
                    <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Você ainda não concluiu nenhum curso
                    </p>
                  </CardContent>
                </Card>
              ) : (
                courses
                  .filter((c) => progress[c.id]?.completed)
                  .map((course) => (
                    <Card key={course.id} className="group transition-shadow hover:shadow-lg overflow-hidden">
                      <div className="aspect-video w-full overflow-hidden">
                        <img 
                          src={course.image} 
                          alt={course.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <CardHeader>
                        <div className="mb-2 flex items-start justify-between">
                          <Badge variant="secondary">{course.category}</Badge>
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </div>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription>{course.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => setSelectedCourse(course.id)}
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Revisar
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full"
                          onClick={() => generateCertificate(course.id)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Emitir Certificado
                        </Button>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {selectedCourseData && (
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
                <Badge variant="secondary">{selectedCourseData.category}</Badge>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {selectedCourseData.duration}
                  </div>
                  <button onClick={() => toggleFavorite(selectedCourseData.id)}>
                    <Heart
                      className={`h-5 w-5 ${
                        progress[selectedCourseData.id]?.favorite
                          ? "fill-red-500 text-red-500"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                </div>
              </div>
              <CardTitle className="text-2xl">{selectedCourseData.title}</CardTitle>
              <CardDescription>{selectedCourseData.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                <iframe
                  width="100%"
                  height="100%"
                  src={selectedCourseData.videoUrl}
                  title={selectedCourseData.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="prose prose-sm max-w-none">
                <div
                  dangerouslySetInnerHTML={{ __html: selectedCourseData.content }}
                />
              </div>

              <div>
                <h4 className="mb-2 font-semibold">Skills desenvolvidas:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCourseData.skills.map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant={
                    progress[selectedCourseData.id]?.completed ? "default" : "outline"
                  }
                  onClick={() => toggleComplete(selectedCourseData.id)}
                  className="flex-1"
                >
                  {progress[selectedCourseData.id]?.completed ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Concluído
                    </>
                  ) : (
                    "Marcar como concluído"
                  )}
                </Button>
                <Button onClick={() => setSelectedCourse(null)} variant="outline">
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

export default EmployeeDashboard;
