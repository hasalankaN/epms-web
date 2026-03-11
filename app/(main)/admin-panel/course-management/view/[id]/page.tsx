"use client";

import React from "react";

import { useParams } from "next/navigation";

import { FileText } from "lucide-react";

import { BackButton } from "@/components/common/BackButton";

import { BUTTON_STYLES } from "@/lib/constants/theme";

import { CourseDetailsView } from "@/components/admin-panel/course-management/view/CourseDetailsView";

export default function ViewCoursePage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex items-center justify-between px-4 pt-6 md:px-6">
        <BackButton 
            href="/admin-panel/course-management" 
            label="Go to Course Management" 
        />
        
        <button className={BUTTON_STYLES.primary.responsive}>
           <FileText className="h-5 w-5 sm:hidden" />
           <span className="hidden sm:inline">Generate Report</span>
        </button>
      </div>

      <div className="pb-10">
        <CourseDetailsView courseId={id} />
      </div>
    </div>
  );
}
