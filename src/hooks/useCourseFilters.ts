import { useState, useMemo } from "react";

export const useCourseFilters = (allCourses: any[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.skills?.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [allCourses, searchQuery, selectedCategory]);

  const categories = useMemo(() => {
    return ["all", ...Array.from(new Set(allCourses.map((c) => c.category || "Geral")))];
  }, [allCourses]);

  return {
    filteredCourses,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
  };
};
