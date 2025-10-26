/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Clock, Heart, CheckCircle2, Share2, Eye } from "lucide-react";
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
  const webpUrl = course.image?.replace(/\.jpg|\.png|\.jpeg/gi, ".webp");
  const fallbackUrl = course.image;

  return (
    <Card
      className="group cursor-pointer transition-shadow hover:shadow-lg overflow-hidden"
      onClick={onClick}
    >
      {course.image && (
<div className="w-full h-[160px] relative rounded-md overflow-hidden">
  {/* 🔹 Fundo com blur bem leve e mais transparente */}
  <img
    src={fallbackUrl}
    alt=""
    aria-hidden="true"
    className="absolute inset-0 w-full h-full object-cover blur-[6px] scale-110 opacity-[0.18]"
  />

  {/* 🔹 Imagem principal */}
  <img
    src={fallbackUrl}
    alt={course.title}
    loading="lazy"
    className="relative mx-auto h-full object-contain z-10 transition-transform group-hover:scale-[1.03]"
  />
</div>




      )}

      <CardHeader>
        <div className="mb-2 flex items-start justify-between">
          <Badge variant="secondary">{course.category || "Geral"}</Badge>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Eye className="h-3 w-3" />
            {course.views ?? 0}
          </div>

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
