/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Download, Share2 } from "lucide-react";
import { sanitizeHtml } from "@/lib/sanitize";
import { toast } from "@/hooks/use-toast";


interface CourseDetailModalProps {
  course: any;
  allCourses?: any[];
  onSelectCourse?: (course: any) => void;
  isOpen?: boolean;
  onClose?: () => void;
  isPage?: boolean;
}

export const CourseDetailModal = ({
  course,
  allCourses = [],
  onSelectCourse = () => {},
  isOpen = true,
  onClose = () => {},
  isPage = false, 
}: CourseDetailModalProps) => {



// ✅ Hooks sempre no topo
const relatedCourses = useMemo(() => {
  if (!course) return [];
  return allCourses
    .filter((c) => c.id !== course.id)
    .filter((c) => c.category === course.category)
    .slice(0, 3);
}, [course, allCourses]);

if (!course) return null;
if (!isPage && !isOpen) return null;



const Wrapper = isPage ? "div" : "div";
const videoSrc = course?.videoUrl ?? course?.video_url;
const posterSrc = course?.image ?? "/placeholder.svg";


  return (
    <Wrapper
      className={
        isPage
          ? "w-full flex justify-center py-8"
          : "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      }
      onClick={isPage ? undefined : onClose}
    >
      <Card
        className={
          isPage
            ? "w-full max-w-3xl overflow-y-auto"
            : "max-h-[90vh] w-full max-w-3xl overflow-y-auto"
        }
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader>
          <div className="mb-2 flex items-center justify-between">
            <Badge variant="secondary">{course.category || "Geral"}</Badge>
            {course.duration && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                {course.duration}
              </div>
            )}
          </div>

          <CardTitle className="text-2xl">{course.title}</CardTitle>
          {course.subtitle && <p className="text-sm text-muted-foreground">{course.subtitle}</p>}
          <CardDescription>{course.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
            <video
              src={videoSrc}
              className="w-full h-full object-cover"
              controls
              preload="metadata"
              playsInline
              poster={posterSrc}
            />
          </div>

         {isOpen && course.content && (
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(course.content) }}
            />
          )}

          {course.skills?.length > 0 && (
            <div>
              <h4 className="mb-2 font-semibold">Skills desenvolvidas</h4>
              <div className="flex flex-wrap gap-2">
                {course.skills.map((skill: string, i: number) => (
                  <Badge key={i} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* ✅ Carrossel de cursos relacionados */}
          {relatedCourses.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="mb-3 font-semibold">Cursos Relacionados</h4>

              <div className="flex gap-4 overflow-x-auto pb-2">
                {relatedCourses.map((rc) => (
                  <div
                    key={rc.id}
                    className="min-w-[180px] bg-card rounded-lg cursor-pointer hover:scale-[1.03] transition shadow-sm"
                    onClick={() => {
                      onClose?.();
                      setTimeout(() => onSelectCourse?.(rc), 50);
                    }}
                  >
                    <img
                      src={rc.image}
                      loading="lazy"
                      className="w-full h-24 object-cover rounded-t-lg"
                      alt={rc.title}
                    />
                    <div className="p-2">
                      <p className="text-xs font-medium line-clamp-2">{rc.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ✅ Botões */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                const shareUrl = `${window.location.origin}/curso/${course.id}`;
                navigator.clipboard.writeText(shareUrl);
                toast({
                  title: "Link copiado!",
                  description: "Compartilhe com sua equipe ✨",
                });
              }}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Compartilhar
            </Button>

            {!isPage && (
              <Button onClick={onClose} className="flex-1">
                Fechar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Wrapper>
  );
};
