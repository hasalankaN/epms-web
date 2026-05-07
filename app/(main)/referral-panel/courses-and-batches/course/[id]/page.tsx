"use client";

import { useParams } from "next/navigation";

import { BackButton } from "@/components/common/BackButton";
import { CourseDetailsView } from "@/components/referral-panel/courses-and-batches/view/CourseDetailsView";

export default function ReferralCourseDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="space-y-6 bg-white min-h-screen">
      {/* Header Row */}
      <div className="flex items-center justify-between px-4 pt-6 md:px-6">
        <BackButton 
            href="/referral-panel/courses-and-batches" 
            label="Go to Courses and Batches" 
        />
      </div>

      <div className="pb-10">
        <CourseDetailsView courseId={id} />
      </div>
    </div>
  );
}
