/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";

export type CourseViewType = "all" | "favorites" | "completed";

export const useCourseFilters = (allCourses: any[], courseTracking: Record<string, any>) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [viewType, setViewType] = useState<CourseViewType>("all");

  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.skills?.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
      const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
      
      const matchesViewType = 
        viewType === "all" || 
        (viewType === "favorites" && courseTracking[course.id]?.is_favorite) ||
        (viewType === "completed" && courseTracking[course.id]?.is_completed);

      return matchesSearch && matchesCategory && matchesLevel && matchesViewType;
    });
  }, [allCourses, searchQuery, selectedCategory, selectedLevel, viewType, courseTracking]);

  const categories = useMemo(() => {
    return ["all", ...Array.from(new Set(allCourses.map((c) => c.category || "Geral")))];
  }, [allCourses]);

  const levels = useMemo(() => {
    return ["all", ...Array.from(new Set(allCourses.map((c) => c.level).filter(Boolean)))];
  }, [allCourses]);

  return {
    filteredCourses,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedLevel,
    setSelectedLevel,
    viewType,
    setViewType,
    categories,
    levels,
  };
};
