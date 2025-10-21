import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/hooks/useBadges";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgeCardProps {
  badge: Badge;
}

export const BadgeCard = ({ badge }: BadgeCardProps) => {
  const Icon = badge.icon;

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        badge.earned
          ? "bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 shadow-md hover:shadow-lg hover:scale-105"
          : "bg-muted/50 opacity-60 grayscale"
      )}
    >
      <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
        {/* Ícone do Badge */}
        <div
          className={cn(
            "relative rounded-full p-4 transition-all duration-300",
            badge.earned
              ? "bg-gradient-to-br from-primary/20 to-accent/20"
              : "bg-muted"
          )}
        >
          <Icon
            className={cn(
              "h-10 w-10 transition-all duration-300",
              badge.earned ? badge.iconColor : "text-muted-foreground"
            )}
          />
          
          {/* Cadeado para badges bloqueados */}
          {!badge.earned && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
              <Lock className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Nome do Badge */}
        <h3
          className={cn(
            "font-semibold text-lg",
            badge.earned ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {badge.name}
        </h3>

        {/* Descrição */}
        <p
          className={cn(
            "text-sm",
            badge.earned ? "text-muted-foreground" : "text-muted-foreground/70"
          )}
        >
          {badge.description}
        </p>

        {/* Data de conquista */}
        {badge.earned && badge.earnedAt && (
          <p className="text-xs text-muted-foreground/70 mt-2">
            Conquistado em {new Date(badge.earnedAt).toLocaleDateString("pt-BR")}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
