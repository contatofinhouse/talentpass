import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Download } from "lucide-react";
import { sanitizeHtml } from "@/lib/sanitize";

interface CourseDetailModalProps {
  course: any;
  isOpen: boolean;
  onClose: () => void;
}

export const CourseDetailModal = ({ course, isOpen, onClose }: CourseDetailModalProps) => {
  if (!isOpen || !course) return null;

  const handleDownloadResource = (file: { name: string; data: string }) => {
    const link = document.createElement("a");
    link.href = file.data;
    link.download = file.name;
    link.click();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <Card className="max-h-[90vh] w-full max-w-3xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
            <iframe
              width="100%"
              height="100%"
              src={course.videoUrl}
              title={course.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {course.summary && (
            <div className="prose prose-sm max-w-none">
              <h4 className="font-semibold mb-2">Resumo Completo:</h4>
              <p className="whitespace-pre-wrap">{course.summary}</p>
            </div>
          )}

          {course.content && (
            <div className="prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(course.content) }} />
            </div>
          )}

          <div>
            <h4 className="mb-2 font-semibold">Skills desenvolvidas:</h4>
            <div className="flex flex-wrap gap-2">
              {course.skills?.map((skill: string, index: number) => (
                <Badge key={index} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {course.resourceFiles && course.resourceFiles.length > 0 && (
            <div className="border-t pt-4 space-y-3">
              <h4 className="font-semibold">Recursos adicionais</h4>
              <div className="space-y-2">
                {course.resourceFiles.map(
                  (file: { name: string; data: string; type: string }, index: number) => (
                    <Button
                      key={index}
                      onClick={() => handleDownloadResource(file)}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {file.name}
                    </Button>
                  ),
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={onClose} className="flex-1">
              Fechar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
