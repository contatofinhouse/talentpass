/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Download, Share2 } from "lucide-react";
import { sanitizeHtml } from "@/lib/sanitize";
import { toast } from "@/hooks/use-toast";

interface CourseDetailModalProps {
  course: any;
  isOpen?: boolean;
  onClose?: () => void;
  isPage?: boolean; // ✅ novo
}

export const CourseDetailModal = ({
  course,
  isOpen = true,
  onClose = () => {},
  isPage = false,
}: CourseDetailModalProps) => {
  if (!course) return null;
  if (!isPage && !isOpen) return null;

  const Wrapper = isPage ? "div" : "div"; // ✅ conserva div, muda estilos
  const videoSrc = course.videoUrl ?? course.video_url;
  const posterSrc = course.image_url ?? course.image ?? "/placeholder.svg";

  return (
    <Wrapper
      className={
        isPage
          ? "w-full flex justify-center py-8" // ✅ página normal
          : "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" // ✅ modal
      }
      onClick={isPage ? undefined : onClose}
    >
      <Card
        className={
          isPage
            ? "w-full max-w-3xl overflow-y-auto" // ✅ página
            : "max-h-[90vh] w-full max-w-3xl overflow-y-auto" // ✅ modal
        }
        onClick={(e) => e.stopPropagation()}
      >
        {/* === CONTEÚDO DO CARD === */}
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

          {course.content && (
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(course.content) }}
            />
          )}

          {course.skills?.length > 0 && (
            <div>
              <h4 className="mb-2 font-semibold">Skills desenvolvidas:</h4>
              <div className="flex flex-wrap gap-2">
                {course.skills.map((skill: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {course.resourceFiles && course.resourceFiles.length > 0 && (
            <div className="border-t pt-4 space-y-3">
              <h4 className="font-semibold">Recursos adicionais</h4>
              {course.resourceFiles.map((file: any, index: number) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.open(file.data, "_blank")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {file.name}
                </Button>
              ))}
            </div>
          )}
{/* ✅ Botões Always visible - exceto fechar na página */}
<div className="flex gap-3">
  <Button variant="outline"
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
