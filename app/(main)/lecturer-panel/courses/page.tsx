"use client";

import { useMemo } from "react";

import { motion } from "framer-motion";

import { useGetCourses } from "@/hooks/api/courses/useGetCourses";
import { useGetLecturerProfile } from "@/hooks/api/lecturers/useGetLecturerProfile";
import { Skeleton } from "@/components/ui/skeleton";

import { CourseCategorySection } from "@/components/lecturer-panel/courses/CourseCategorySection";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function CoursesPage() {
  const { data: profile, isLoading: isProfileLoading } = useGetLecturerProfile();
  
  const { data: coursesData, isLoading: isCoursesLoading } = useGetCourses({
    lecturer_id: profile?.userId, // Using userId as lecturer_id
    size: 100, // Fetch a large enough sample to group
  });

  const isLoading = isProfileLoading || isCoursesLoading;

  // Group courses by category
  const groupedCourses = useMemo(() => {
    if (!coursesData?.results) return {};

    return coursesData.results.reduce((acc, course) => {
      const category = course.category_name || "Uncategorized";

      if (!acc[category]) {
        acc[category] = [];
      }

      acc[category].push({
        id: course.id,
        title: course.name,
        description: course.short_description || "No description available.",
        thumbnail: course.cover_image_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60",
        duration: "N/A",
        progress: 0,
      });

      return acc;
    }, {} as Record<string, any[]>);
  }, [coursesData]);

  const categoryNames = Object.keys(groupedCourses);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-10 p-6 lg:p-10">
        {[1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-4">
            <Skeleton className="h-8 w-48" />
            <div className="flex gap-6 overflow-hidden">
              {[1, 2, 3].map((j) => (
                <Skeleton key={j} className="h-[305px] w-[288px] rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-10 p-6 lg:p-10"
    >
      <motion.div variants={itemVariants} className="flex flex-col gap-12">
        {categoryNames.length > 0 ? (
          categoryNames.map((category) => (
            <CourseCategorySection 
              key={category}
              title={category} 
              courses={groupedCourses[category]} 
            />
          ))
        ) : (
          <div className="flex h-[400px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#E2E8F0] bg-white p-10 text-center">
            <h3 className="text-xl font-semibold text-[#0F172B]">No Courses Found</h3>
            <p className="text-[#64748B]">You haven&apos;t been assigned any courses yet.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
