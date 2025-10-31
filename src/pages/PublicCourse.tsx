/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase";
import { Loader2 } from "lucide-react";
import { PublicNavbar } from "@/components/PublicNavbar";
import { CourseDetailModal } from "@/components/manager/CourseDetailModal";
import { courses as hardcodedCourses } from "@/data/courses";

const PublicCourse = () => {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchCourse = async () => {
    // Primeiro tenta buscar do Supabase
    const { data } = await supabase
      .from("courses")
      .select("*")
      .eq("id", id)
      .single();

    if (data) {
      // 🔧 Normaliza imagem pública
      if (data.image && !data.image.startsWith("http")) {
        data.image = `https://tpwafkhuetbrdlykyegy.supabase.co/storage/v1/object/public/${data.image.replace(/^\/+/, "")}`;
      }

      // 🔧 Corrige compatibilidade entre videoUrl / video_url
      if (!data.videoUrl && data.video_url) {
        data.videoUrl = data.video_url;
      }

      // 🔧 Normaliza recursos (igual ao modal)
      if (data.resources) {
        data.resourceFiles = data.resources.map((file: any) => ({
          name: file.title ?? file.name,
          url: file.url ?? file.data,
          type: file.type,
        }));
      }

      setCourse(data);
    } else {
      // Se não encontrar no Supabase, busca nos cursos hardcoded
      const hardcodedCourse = hardcodedCourses.find((c) => c.id === id);
      setCourse(hardcodedCourse || null);
    }

    setLoading(false);
  };

  fetchCourse();
}, [id]);


  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );

  if (!course)
    return (
      <div className="min-h-screen bg-background">
        <PublicNavbar />
        <div className="text-center p-20 opacity-60">Curso não encontrado</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />
      <CourseDetailModal course={course} isPage />
    </div>
  );
};

export default PublicCourse;
