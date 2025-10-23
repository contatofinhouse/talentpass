import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Clock, GraduationCap } from "lucide-react";
import { CourseVideoPlayer } from "@/components/CourseVideoPlayer";
import { PublicNavbar } from "@/components/PublicNavbar";
import NotFound from "./NotFound";

const PublicCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching course:", error);
        setCourse(null);
      } else {
        setCourse(data);
      }
      setLoading(false);
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />

      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">{course.category || "Geral"}</Badge>
              {course.duration && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {course.duration}
                </div>
              )}
            </div>
            <CardTitle className="text-3xl">{course.title}</CardTitle>
            {course.subtitle && (
              <p className="text-lg text-muted-foreground">{course.subtitle}</p>
            )}
            <CardDescription className="text-base mt-2">
              {course.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Video Player */}
            {course.videoUrl && (
              <CourseVideoPlayer
                videoUrl={course.videoUrl}
                posterImage={course.image || "/placeholder.svg"}
                title={course.title}
                isPublicView={true}
              />
            )}

            {/* Skills */}
            {course.skills && course.skills.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  🎯 Skills que você vai desenvolver:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {course.skills.map((skill: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Footer */}
            <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border">
              <div className="flex items-start gap-4">
                <GraduationCap className="h-8 w-8 text-primary flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-2">
                    Gostou? Acesse centenas de cursos gratuitamente!
                  </h4>
                  <p className="text-muted-foreground mb-4">
                    Aprenda no seu ritmo com conteúdo de qualidade e certificados reconhecidos
                  </p>
                  <Button size="lg" onClick={() => navigate("/signup")}>
                    Criar Conta Grátis
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PublicCourse;
