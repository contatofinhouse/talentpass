import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/hooks/useBadges";
import { BadgeCard } from "./BadgeCard";
import { Progress } from "@/components/ui/progress";

interface BadgesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  badges: Badge[];
  earnedCount: number;
}

export const BadgesModal = ({
  open,
  onOpenChange,
  badges,
  earnedCount,
}: BadgesModalProps) => {
  const totalBadges = badges.length;
  const progressPercentage = (earnedCount / totalBadges) * 100;

  // Ordena: conquistados primeiro
  const sortedBadges = [...badges].sort((a, b) => {
    if (a.earned && !b.earned) return -1;
    if (!a.earned && b.earned) return 1;
    return 0;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            🏆 Seus Badges
          </DialogTitle>
          <DialogDescription>
            Conquiste badges ao completar cursos e explorar a plataforma
          </DialogDescription>
        </DialogHeader>

        {/* Progresso */}
        <div className="space-y-2 py-4">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Progresso</span>
            <span className="text-muted-foreground">
              {earnedCount} de {totalBadges} badges conquistados
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Grid de Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
          {sortedBadges.map((badge) => (
            <BadgeCard key={badge.type} badge={badge} />
          ))}
        </div>

        {/* Mensagem de incentivo */}
        {earnedCount < totalBadges && (
          <div className="text-center text-sm text-muted-foreground py-2">
            Continue aprendendo para desbloquear mais badges! 🚀
          </div>
        )}

        {earnedCount === totalBadges && (
          <div className="text-center text-sm font-semibold text-primary py-2">
            🎉 Parabéns! Você conquistou todos os badges disponíveis!
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
