/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";

export type CourseViewType = "all" | "favorites" | "completed";

export const useCourseFilters = (allCourses: any[], courseTracking: Record<string, any>) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [viewType, setViewType] = useState<CourseViewType>("all");

 const filteredCourses = useMemo(() => {
  const normalizedSearch = searchQuery.toLowerCase();

  return allCourses.filter((course) => {
    const tracking = courseTracking[course.id];

    const matchesSearch =
      normalizedSearch === "" ||
      course.title.toLowerCase().includes(normalizedSearch) ||
      course.description.toLowerCase().includes(normalizedSearch) ||
      course.skills?.some((skill: string) =>
        skill.toLowerCase().includes(normalizedSearch)
      );

    const matchesCategory =
      selectedCategory === "all" || course.category === selectedCategory;

    const matchesLevel =
      selectedLevel === "all" || course.level === selectedLevel;

    const matchesViewType =
      viewType === "all" ||
      (viewType === "favorites" && tracking?.is_favorite) ||
      (viewType === "completed" && tracking?.is_completed);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesLevel &&
      matchesViewType
    );
  });
}, [
  allCourses,
  searchQuery,
  selectedCategory,
  selectedLevel,
  viewType,
  courseTracking // ✅ continua, mas com menos operações
]);


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
