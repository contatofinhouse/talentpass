/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Play,
  Clock,
  Eye,
  Heart,
  CheckCircle2,
} from "lucide-react";

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

// ✅ React.memo mantém o mesmo comportamento, evitando re-render
export const CourseCard = React.memo(
  ({
    course,
    courseTracking,
    onToggleFavorite,
    onToggleCompleted,
    onClick,
  }: CourseCardProps) => {
    const imageUrl = React.useMemo(() => {
      if (!course?.image) return null;
      return course.image.replace(/\.jpg|\.png|\.jpeg/gi, ".webp");
    }, [course.image]);

    return (
      <Card
        className="group cursor-pointer transition-shadow hover:shadow-lg overflow-hidden"
        onClick={onClick}
        // ✅ isola layout sem adiar render (mantém fluidez e UX)
        style={{
          contain: "layout paint",
          willChange: "transform",
          backfaceVisibility: "hidden",
        }}
      >
  {course.image && (
  <div className="w-full h-[160px] relative rounded-md overflow-hidden">
    {(course.views ?? 0) > 150 && (
      <div className="absolute top-2 left-2 z-20">
        <Badge
          variant="default"
          className="bg-primary text-white px-2 py-0.5 text-xs rounded-md shadow"
        >
          Destaque 🔥
        </Badge>
      </div>
    )}

    {/* 🔹 Botões de ação: favoritar / concluir */}
    <div className="absolute top-2 right-2 z-20 flex flex-col gap-2">
      <button
        onClick={(e) => onToggleFavorite(course.id, e)}
        className={`p-1.5 rounded-full shadow transition transform hover:scale-110 ${
          courseTracking?.is_favorite
            ? "bg-red-500 text-white"
            : "bg-white/80 text-gray-700"
        }`}
        title={
          courseTracking?.is_favorite ? "Remover dos favoritos" : "Favoritar curso"
        }
      >
        <Heart
          className="h-4 w-4"
          fill={courseTracking?.is_favorite ? "white" : "none"}
        />
      </button>

      <button
        onClick={(e) => onToggleCompleted(course.id, e)}
        className={`p-1.5 rounded-full shadow transition transform hover:scale-110 ${
          courseTracking?.is_completed
            ? "bg-green-500 text-white"
            : "bg-white/80 text-gray-700"
        }`}
        title={
          courseTracking?.is_completed
            ? "Marcar como não concluído"
            : "Marcar como concluído"
        }
      >
        <CheckCircle2
          className="h-4 w-4"
          fill={courseTracking?.is_completed ? "white" : "none"}
        />
      </button>
    </div>

    {/* 🔹 Fundo desfocado leve para destaque visual */}
    <img
      src={course.image}
      alt=""
      aria-hidden="true"
      className="absolute inset-0 w-full h-full object-cover blur-[6px] scale-110 opacity-[0.18]"
      draggable={false}
      decoding="auto"
    />

    {/* 🔹 Imagem principal */}
    <img
      src={imageUrl || course.image}
      alt={course.title}
      className="relative mx-auto h-full object-contain z-10 transition-transform duration-300 group-hover:scale-[1.03]"
      draggable={false}
      decoding="auto"
    />
  </div>
)}


        <CardHeader>
          <div className="mb-2 flex items-start justify-between flex-wrap gap-1">
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

          <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
          {course.subtitle && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {course.subtitle}
            </p>
          )}
          {course.description && (
            <CardDescription className="line-clamp-3">
              {course.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent>
          <Button
            variant="outline"
            size="sm"
           className="w-full transition-all hover:bg-primary hover:text-white"
            onClick={(e) => {
              e.stopPropagation(); // ✅ evita clicar 2x no card
              onClick();
            }}
          >
            <Play className="mr-2 h-4 w-4" />
            Ver Detalhes
          </Button>
        </CardContent>
      </Card>
    );
  }
);

CourseCard.displayName = "CourseCard";
