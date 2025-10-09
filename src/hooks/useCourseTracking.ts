import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase";
import { toast } from "@/hooks/use-toast";

interface CourseTracking {
  course_id: string;
  is_favorite: boolean;
  is_completed: boolean;
}

export const useCourseTracking = (userId: string | undefined) => {
  const [courseTracking, setCourseTracking] = useState<Record<string, CourseTracking>>({});

  const fetchTracking = useCallback(async () => {
    if (!userId) return;

    const { data, error } = await supabase.from("manager_course_tracking").select("*").eq("user_id", userId);

    if (error) {
      console.error("Error fetching course tracking:", error);
      return;
    }

    const trackingMap: Record<string, CourseTracking> = {};
    data?.forEach((item) => {
      trackingMap[item.course_id] = {
        course_id: item.course_id,
        is_favorite: item.is_favorite,
        is_completed: item.is_completed,
      };
    });
    setCourseTracking(trackingMap);
  }, [userId]);

  const toggleFavorite = useCallback(
    async (courseId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (!userId) return;

      const currentStatus = courseTracking[courseId]?.is_favorite || false;
      const newStatus = !currentStatus;

      const { error } = await supabase.from("manager_course_tracking").upsert(
        {
          user_id: userId,
          course_id: courseId,
          is_favorite: newStatus,
          is_completed: courseTracking[courseId]?.is_completed || false,
        },
        {
          onConflict: "user_id,course_id",
        },
      );

      if (error) {
        console.error("Error toggling favorite:", error);
        toast({
          title: "Erro",
          description: "Não foi possível atualizar favorito",
          variant: "destructive",
        });
        return;
      }

      setCourseTracking({
        ...courseTracking,
        [courseId]: {
          course_id: courseId,
          is_favorite: newStatus,
          is_completed: courseTracking[courseId]?.is_completed || false,
        },
      });

      toast({
        title: newStatus ? "Favoritado!" : "Removido dos favoritos",
        description: newStatus ? "Curso adicionado aos favoritos" : "Curso removido dos favoritos",
      });
    },
    [userId, courseTracking],
  );

  const toggleCompleted = useCallback(
    async (courseId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (!userId) return;

      const currentStatus = courseTracking[courseId]?.is_completed || false;
      const newStatus = !currentStatus;

      const { error } = await supabase.from("manager_course_tracking").upsert(
        {
          user_id: userId,
          course_id: courseId,
          is_favorite: courseTracking[courseId]?.is_favorite || false,
          is_completed: newStatus,
          completed_at: newStatus ? new Date().toISOString() : null,
        },
        {
          onConflict: "user_id,course_id",
        },
      );

      if (error) {
        console.error("Error toggling completed:", error);
        toast({
          title: "Erro",
          description: "Não foi possível atualizar status",
          variant: "destructive",
        });
        return;
      }

      setCourseTracking({
        ...courseTracking,
        [courseId]: {
          course_id: courseId,
          is_favorite: courseTracking[courseId]?.is_favorite || false,
          is_completed: newStatus,
        },
      });

      toast({
        title: newStatus ? "Concluído!" : "Marcado como não concluído",
        description: newStatus ? "Parabéns por concluir o curso!" : "Status atualizado",
      });
    },
    [userId, courseTracking],
  );

  const favoriteCount = Object.values(courseTracking).filter((t) => t.is_favorite).length;
  const completedCount = Object.values(courseTracking).filter((t) => t.is_completed).length;

  return {
    courseTracking,
    toggleFavorite,
    toggleCompleted,
    fetchTracking,
    favoriteCount,
    completedCount,
  };
};
