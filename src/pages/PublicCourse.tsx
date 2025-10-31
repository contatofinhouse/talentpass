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
      const { data } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        // ✅ Corrige arquivos de recurso, se existirem
        if (data.resources) {
          data.resourceFiles = data.resources.map((file: any) => ({
            name: file.title ?? file.name,
            url: file.url ?? file.data,
            type: file.type,
          }));
        }

        // ✅ Corrige imagem (funciona em todos os ambientes)
        const baseUrl =
          import.meta.env.VITE_SUPABASE_URL ||
          "https://tpwafkhuetbrdlykyegy.supabase.co";

        if (!data.image && data.image_url) data.image = data.image_url;
        if (!data.image && data.thumbnail) data.image = data.thumbnail;

        if (data.image) {
          // Se já vier URL completa
          if (!data.image.startsWith("http")) {
            // remove barras duplas e prefixos redundantes
            const cleanPath = data.image
              .replace(/^\/+/, "")
              .replace(/^storage\/v1\/object\/public\//, "");

            data.image = `${baseUrl}/storage/v1/render/image/public/${cleanPath}`;
          } else if (data.image.includes("/storage/v1/object/public/")) {
            // converte para endpoint de render otimizado
            data.image = data.image.replace(
              "/storage/v1/object/public/",
              "/storage/v1/render/image/public/"
            );
          }
        }

        console.log("🖼️ Imagem final normalizada:", data.image);
        setCourse(data);
      } else {
        // Fallback — cursos hardcoded
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
