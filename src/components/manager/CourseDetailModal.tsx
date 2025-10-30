/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Download, Share2, Linkedin, Check } from "lucide-react";
import { sanitizeHtml } from "@/lib/sanitize";
import { toast } from "@/hooks/use-toast";
import { generateCertificate, generateCertificateImage } from "@/lib/certificateGenerator";



interface CourseDetailModalProps {
  course: any;
  allCourses?: any[];
  onSelectCourse?: (course: any) => void;
  isOpen?: boolean;
  onClose?: () => void;
  isPage?: boolean;
  courseTracking?: { is_favorite: boolean; is_completed: boolean };
  userName?: string;
  onToggleCompleted?: (courseId: string) => void;
}

export const CourseDetailModal = React.memo(({
  course,
  allCourses = [],
  onSelectCourse = () => {},
  isOpen = true,
  onClose = () => {},
  isPage = false,
  courseTracking,
  userName,
  onToggleCompleted = () => {},
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







  const handleShare = () => {
    const shareUrl = `${window.location.origin}/curso/${course.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copiado!",
      description: "Compartilhe com sua equipe ✨",
    });
  };

  const handleDownloadCertificate = () => {
    if (!userName) {
      toast({
        title: "Erro",
        description: "Nome de usuário não encontrado",
        variant: "destructive"
      });
      return;
    }

    generateCertificate({
      courseName: course.title,
      category: course.category || "Geral",
      skills: course.skills || [],
      userName: userName,
      completionDate: new Date()
    });

    toast({
      title: "Certificado gerado! 🎓",
      description: "Download iniciado com sucesso"
    });
  };

  const handleShareLinkedIn = async () => {
    if (!userName) {
      toast({
        title: "Erro",
        description: "Nome do usuário não encontrado",
        variant: "destructive"
      });
      return;
    }

    // Gerar imagem do certificado
    const imageDataUrl = await generateCertificateImage({
      courseName: course.title,
      category: course.category || "Geral",
      skills: course.skills || [],
      userName: userName,
      completionDate: new Date(),
    });

    // Baixar imagem automaticamente
    const link = document.createElement('a');
    link.download = `Certificado_${course.title.replace(/[^a-zA-Z0-9]/g, "_")}.jpg`;
    link.href = imageDataUrl;
    link.click();

    // Preparar texto do post
    const skillsText = course.skills && course.skills.length > 0 
      ? `\n\nCompetências desenvolvidas: ${course.skills.join(', ')}` 
      : '';
    
    const postText = `Acabo de concluir o curso "${course.title}" na plataforma de educação corporativa trainingpass.com.br 🎓${skillsText}\n\n#EducaçãoCorporativa #DesenvolvimentoProfissional #TrainingPass`;

    // Copiar texto para clipboard
    try {
      await navigator.clipboard.writeText(postText);
      
      toast({
        title: "Texto copiado! 📋",
        description: "Cole no LinkedIn (Ctrl+V) e anexe o certificado baixado",
        duration: 6000,
      });
    } catch (err) {
      console.error('Erro ao copiar texto:', err);
      toast({
        title: "Imagem baixada! 📥",
        description: "Copie o texto manualmente e anexe o certificado no LinkedIn",
        duration: 6000,
      });
    }

    // Abrir compartilhamento do LinkedIn (após 1 segundo para dar tempo de ver o toast)
    setTimeout(() => {
      const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://trainingpass.com.br')}`;
      window.open(linkedInShareUrl, '_blank', 'width=600,height=600');
    }, 1000);
  };


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

          {/* ✅ Recursos para download */}
          {(course.resourceFiles?.length > 0 || course.resources?.length > 0) && (
            <div className="border-t pt-4">
              <h4 className="mb-3 font-semibold flex items-center gap-2">
                <Download className="h-4 w-4" />
                Materiais de Apoio
              </h4>
              <div className="space-y-2">
                {(course.resourceFiles || course.resources)?.map((resource: any, i: number) => {
                  const resourceUrl = resource.url || resource.data;
                  const resourceName = resource.name || resource.title || `Recurso ${i + 1}`;
                  const resourceType = resource.type || 'Arquivo';
                  
                  return (
                    <Button
                      key={i}
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <a
                        href={resourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                      >
                        <Download className="mr-2 h-4 w-4" />
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{resourceName}</span>
                          <span className="text-xs text-muted-foreground">{resourceType}</span>
                        </div>
                      </a>
                    </Button>
                  );
                })}
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
                      decoding="async"
                      width={180}
                      height={96}
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
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartilhar
                </Button>

                {!courseTracking?.is_completed && (
                  <Button 
                    variant="outline" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleCompleted(course.id);
                    }}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Concluir Curso
                  </Button>
                )}

                {courseTracking?.is_completed && (
                  <>
                    <Button variant="outline" onClick={handleDownloadCertificate}>
                      <Download className="mr-2 h-4 w-4" />
                      Certificado
                    </Button>

                    <Button variant="outline" onClick={handleShareLinkedIn}>
                      <Linkedin className="mr-2 h-4 w-4" />
                      LinkedIn
                    </Button>
                  </>
                )}

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
});
