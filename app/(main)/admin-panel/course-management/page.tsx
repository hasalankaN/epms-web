"use client";

import React, { useState, useCallback } from "react";

import Link from "next/link";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { TAB_STYLES, BUTTON_STYLES } from "@/lib/constants/theme";

import { AllCourses } from "@/components/admin-panel/course-management/AllCourses";
import { AllCategories } from "@/components/admin-panel/course-management/AllCategories";
import { AddCategoryModal } from "@/components/admin-panel/course-management/modals/AddCategoryModal";

export type CourseTabType = "course" | "category";

const tabs = [
  { value: "course", label: "Course", mobileLabel: "Course", icon: "book-open-text" },
  { value: "category", label: "Category", mobileLabel: "Category", icon: "shapes" },
] as const;

export default function CourseManagementPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{ id: string; categoryName: string } | null>(null);

  const handleRename = useCallback((category: { id: string; categoryName: string }) => {
    setSelectedCategory(category);
    setIsAddCategoryOpen(true);
  }, []);

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsAddCategoryOpen(true);
  };

  const currentTab = searchParams.get("tab") as CourseTabType;

  const activeTab = tabs.some((t) => t.value === currentTab)
    ? currentTab
    : "course";

  const handleTabChange = (tabValue: CourseTabType) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("tab", tabValue);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-4 p-4 md:p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between gap-4 flex-nowrap">
        {/* Tabs */}
        <div className={TAB_STYLES.container}>
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={cn(
                TAB_STYLES.triggerBase,
                "w-auto px-4",
                activeTab === tab.value
                  ? TAB_STYLES.active
                  : TAB_STYLES.inactive
              )}
            >
              <span className={cn(tab.icon, "h-4 w-4")} />
              <span className="hidden md:inline">{tab.label}</span>
              <span className="md:hidden">{tab.mobileLabel}</span>
            </button>
          ))}
        </div>

        {/* Add Course Button */}
        {/* Add Button */}
        {activeTab === "course" ? (
          <Link
            href="/admin-panel/course-management/add-new-course"
            className={cn(
              BUTTON_STYLES.primary.md,
              "text-sm font-semibold text-white px-3 md:px-4"
            )}
          >
            <Plus className="h-5 w-5 md:hidden" />
            <span className="hidden md:inline">Add New Course</span>
          </Link>
        ) : (
          <button
            type="button"
            className={cn(
              BUTTON_STYLES.primary.md,
              "text-sm font-semibold text-white px-3 md:px-4"
            )}
            onClick={handleAddCategory}
          >
            <Plus className="h-5 w-5 md:hidden" />
            <span className="hidden md:inline">Add New Category</span>
          </button>
        )}
      </div>

      {/* Content Area */}
      {activeTab === "course" && <AllCourses />}
      {activeTab === "category" && <AllCategories onRename={handleRename} />}

      {/* Modals */}
      <AddCategoryModal 
        isOpen={isAddCategoryOpen} 
        onClose={() => setIsAddCategoryOpen(false)} 
        category={selectedCategory}
      />
    </div>
  );
}
