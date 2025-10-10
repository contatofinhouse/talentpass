import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  iconColor?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export const MetricCard = ({ title, value, icon: Icon, iconColor, onClick, isActive }: MetricCardProps) => {
  return (
    <Card 
      className={cn(
        "transition-all duration-200",
        onClick && "cursor-pointer hover:shadow-lg hover:scale-105",
        isActive && "ring-2 ring-primary shadow-lg"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2 md:pb-3">
        <CardTitle className="text-xs md:text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-3 md:pb-4">
        <div className="flex items-center gap-2">
          {Icon && <Icon className={cn("h-4 w-4 md:h-5 md:w-5", iconColor || "text-muted-foreground")} />}
          <div className="text-xl md:text-2xl font-bold">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
};
