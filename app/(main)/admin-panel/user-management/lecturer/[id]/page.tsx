"use client";

import React from "react";

import { BackButton } from "@/components/common/BackButton";
import { LecturerGeneralDetails } from "@/components/admin-panel/user-management/view/lecturer/LecturerGeneralDetails";
import { LecturerAssignedCourses } from "@/components/admin-panel/user-management/view/lecturer/LecturerAssignedCourses";
import { LecturerAssignedBatches } from "@/components/admin-panel/user-management/view/lecturer/LecturerAssignedBatches";

export default function ViewLecturerPage() {
  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex items-center justify-between px-4 pt-6 md:px-6">
        <BackButton 
            href="/admin-panel/user-management?tab=lecturers" 
            label="Back" 
        />
      </div>

      <div className="px-4 md:px-6 pb-10 mt-4">
        <LecturerGeneralDetails
          name="Lecturer Name"
          lecturerId={`Lec ID`}
          enrolledDate="2025/01/01"
          mobileNumber="+70 XXX XXXX"
          whatsAppNumber="+70 XXX XXXX"
          gender="XXXX"
          emailAddress="user@gmail.com"
          profileImageUrl="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop"
        />
        
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
