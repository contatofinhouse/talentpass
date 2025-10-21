import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase";
import { toast } from "@/hooks/use-toast";
import { Flame, Star, Heart, Award, Trophy, LucideIcon } from "lucide-react";

export interface Badge {
  type: string;
  name: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  condition: (stats: { completedCount: number; favoriteCount: number }) => boolean;
  earned: boolean;
  earnedAt?: string;
}

export const useBadges = (
  userId: string | undefined,
  completedCount: number,
  favoriteCount: number
) => {
  const [earnedBadges, setEarnedBadges] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Definição dos 5 badges
  const badgeDefinitions: Omit<Badge, "earned" | "earnedAt">[] = [
    {
      type: "first_complete",
      name: "Primeiro Passo",
      description: "Complete seu primeiro curso",
      icon: Flame,
      iconColor: "text-orange-500",
      condition: (stats) => stats.completedCount >= 1,
    },
    {
      type: "dedicated",
      name: "Dedicado",
      description: "Complete 3 cursos",
      icon: Star,
      iconColor: "text-yellow-500",
      condition: (stats) => stats.completedCount >= 3,
    },
    {
      type: "learning_lover",
      name: "Apaixonado por Aprender",
      description: "Favorite 5 cursos",
      icon: Heart,
      iconColor: "text-red-500",
      condition: (stats) => stats.favoriteCount >= 5,
    },
    {
      type: "expert",
      name: "Expert",
      description: "Complete 10 cursos",
      icon: Award,
      iconColor: "text-blue-500",
      condition: (stats) => stats.completedCount >= 10,
    },
    {
      type: "knowledge_master",
      name: "Mestre do Conhecimento",
      description: "Complete 20 cursos",
      icon: Trophy,
      iconColor: "text-purple-500",
      condition: (stats) => stats.completedCount >= 20,
    },
  ];

  // Busca badges conquistados do usuário
  const fetchEarnedBadges = useCallback(async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("user_badges")
      .select("badge_type, earned_at")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching badges:", error);
      return;
    }

    const earnedSet = new Set(data?.map((b) => b.badge_type) || []);
    setEarnedBadges(earnedSet);
  }, [userId]);

  // Concede um novo badge
  const awardBadge = useCallback(
    async (badgeType: string) => {
      if (!userId) return;

      const { error } = await supabase.from("user_badges").insert({
        user_id: userId,
        badge_type: badgeType,
      });

      if (error) {
        console.error("Error awarding badge:", error);
        return;
      }

      setEarnedBadges((prev) => new Set([...prev, badgeType]));

      const badge = badgeDefinitions.find((b) => b.type === badgeType);
      toast({
        title: "🎉 Novo Badge Conquistado!",
        description: `Você ganhou o badge "${badge?.name}"!`,
        duration: 5000,
      });
    },
    [userId, badgeDefinitions]
  );

  // Verifica e concede novos badges
  const checkAndAwardBadges = useCallback(async () => {
    if (!userId || loading) return;

    setLoading(true);

    const stats = { completedCount, favoriteCount };

    for (const badge of badgeDefinitions) {
      const shouldHave = badge.condition(stats);
      const hasIt = earnedBadges.has(badge.type);

      if (shouldHave && !hasIt) {
        await awardBadge(badge.type);
      }
    }

    setLoading(false);
  }, [userId, completedCount, favoriteCount, earnedBadges, awardBadge, loading, badgeDefinitions]);

  // Carrega badges ao montar
  useEffect(() => {
    fetchEarnedBadges();
  }, [fetchEarnedBadges]);

  // Monta lista completa de badges com status
  const badges: Badge[] = badgeDefinitions.map((def) => ({
    ...def,
    earned: earnedBadges.has(def.type),
  }));

  const earnedCount = earnedBadges.size;

  return {
    badges,
    earnedCount,
    checkAndAwardBadges,
    fetchEarnedBadges,
  };
};
