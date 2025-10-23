import { useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { CTAModal } from "./CTAModal";

interface CourseVideoPlayerProps {
  videoUrl: string;
  posterImage: string;
  title: string;
  isPublicView?: boolean;
}

export const CourseVideoPlayer = ({
  videoUrl,
  posterImage,
  title,
  isPublicView = false,
}: CourseVideoPlayerProps) => {
  const { user } = useAuth();
  const [showCTA, setShowCTA] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayAttempt = () => {
    if (!user && isPublicView) {
      // Bloqueia o play e mostra CTA
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      setShowCTA(true);
    }
    // Se logado, deixa tocar normalmente
  };

  return (
    <>
      <video
        ref={videoRef}
        poster={posterImage}
        controls
        className="w-full aspect-video rounded-lg"
        onPlay={handlePlayAttempt}
        preload="metadata"
      >
        <source src={videoUrl} type="video/mp4" />
        Seu navegador não suporta a reprodução de vídeos.
      </video>

      <CTAModal open={showCTA} onOpenChange={setShowCTA} />
    </>
  );
};
