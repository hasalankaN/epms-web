"use client";

import { use } from "react";

import { BackButton } from "@/components/common/BackButton";
import { LecturerGeneralDetails } from "@/components/admin-panel/user-management/view/lecturer/LecturerGeneralDetails";
import { LecturerAssignedCourses } from "@/components/admin-panel/user-management/view/lecturer/LecturerAssignedCourses";
import { LecturerAssignedBatches } from "@/components/admin-panel/user-management/view/lecturer/LecturerAssignedBatches";
import { useGetLecturerById } from "@/hooks/api/lecturers/useGetLecturerById";

export default function ViewLecturerPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const lecturerId = unwrappedParams.id;

  const { data: lecturer, isLoading } = useGetLecturerById(lecturerId);

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex items-center justify-between px-4 pt-6 md:px-6">
        <BackButton 
            href="/admin-panel/user-management?tab=lecturers" 
            label="Go to User Management" 
        />
      </div>

      <div className="px-4 md:px-6 pb-10 mt-4">
        {isLoading ? (
          <div
            className="flex w-full animate-pulse flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 rounded-[8px] border border-[#E2E8F0] bg-white p-6"
            style={{ boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)" }}
          >
            <div className="flex items-center gap-6 shrink-0 md:border-r border-[#F1F5F9] md:pr-12">
              <div className="h-[108px] w-[108px] rounded-full bg-slate-200" />
              <div className="flex flex-col gap-2">
                <div className="h-6 w-32 rounded bg-slate-200" />
                <div className="h-4 w-24 rounded bg-slate-200" />
                <div className="h-5 w-20 rounded-full bg-slate-200" />
              </div>
            </div>
            <div className="grid flex-1 grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="h-5 w-24 rounded bg-slate-100" />
                  <div className="h-4 w-32 rounded bg-slate-50" />
                </div>
              ))}
            </div>
          </div>
        ) : !lecturer ? (
          <div
             className="flex w-full items-center justify-center rounded-[8px] border border-[#E2E8F0] bg-white p-6"
             style={{ boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)" }}
          >
            <p className="text-[#90A1B9]">Lecturer details not found.</p>
          </div>
        ) : (
          <LecturerGeneralDetails
            name={`${lecturer.first_name} ${lecturer.last_name}`}
            publicId={lecturer.public_id}
            enrolledDate={new Date(lecturer.created_at).toISOString().split('T')[0].replace(/-/g, '/')}
            mobileNumber={lecturer.mobile_number}
            whatsAppNumber={lecturer.whatsapp_number || "-"}
            gender={lecturer.gender === "MALE" ? "Male" : lecturer.gender === "FEMALE" ? "Female" : "-"}
            emailAddress={lecturer.email}
            profileImageUrl={lecturer.profile_image_url || undefined}
          />
        )}
        
        <div className="mt-6">
          <LecturerAssignedCourses />
        </div>

        <div className="mt-6">
          <LecturerAssignedBatches />
        </div>
      </div>
    </div>
  );
}
