import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Clock, Heart, CheckCircle2, Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CourseCardProps {
  course: any;
  courseTracking?: {
    is_favorite: boolean;
    is_completed: boolean;
  };
  onToggleFavorite: (courseId: string, e: React.MouseEvent) => void;
  onToggleCompleted: (courseId: string, e: React.MouseEvent) => void;
  onClick: () => void;
}

export const CourseCard = ({
  course,
  courseTracking,
  onToggleFavorite,
  onToggleCompleted,
  onClick,
}: CourseCardProps) => {
  return (
    <Card
      className="group cursor-pointer transition-shadow hover:shadow-lg overflow-hidden"
      onClick={onClick}
    >
      {course.image && (
        <div className="aspect-video w-full overflow-hidden relative">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                const shareUrl = `${window.location.origin}/curso/${course.id}`;
                navigator.clipboard.writeText(shareUrl);
                toast({
                  title: "Link copiado! 🔗",
                  description: "Compartilhe este curso com sua equipe",
                });
              }}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8"
              onClick={(e) => onToggleFavorite(course.id, e)}
            >
              <Heart
                className={`h-4 w-4 ${
                  courseTracking?.is_favorite ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8"
              onClick={(e) => onToggleCompleted(course.id, e)}
            >
              <CheckCircle2
                className={`h-4 w-4 ${
                  courseTracking?.is_completed ? "fill-green-500 text-green-500" : ""
                }`}
              />
            </Button>
          </div>
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
        {course.subtitle && <p className="text-sm text-muted-foreground">{course.subtitle}</p>}
        <CardDescription>{course.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" size="sm" className="w-full">
          <Play className="mr-2 h-4 w-4" />
          Ver Detalhes
        </Button>
      </CardContent>
    </Card>
  );
};
