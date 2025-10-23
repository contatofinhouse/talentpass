/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase";
import { Loader2 } from "lucide-react";
import { PublicNavbar } from "@/components/PublicNavbar";
import { CourseDetailModal } from "@/components/manager/CourseDetailModal";

const PublicCourse = () => {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single()
    .then(({ data }) => {
      if (data?.resources) {
        data.resourceFiles = data.resources.map((file: any) => ({
          name: file.title ?? file.name,
          url: file.url ?? file.data,
        }));
      }
      setCourse(data);
      setLoading(false);
    });
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
