"use client";

import React from "react";

import { useParams } from "next/navigation";

import { BackButton } from "@/components/common/BackButton";
import { StudentGeneralDetails } from "@/components/admin-panel/user-management/view/student/StudentGeneralDetails";
import { StudentEnrolledCourses } from "@/components/admin-panel/user-management/view/student/StudentEnrolledCourses";
import { StudentEnrolledBatches } from "@/components/admin-panel/user-management/view/student/StudentEnrolledBatches";
import { StudentProductPurchases } from "@/components/admin-panel/user-management/view/student/StudentProductPurchases";
import { StudentReferralDetails } from "@/components/admin-panel/user-management/view/student/StudentReferralDetails";

export default function ViewStudentPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex items-center justify-between px-4 pt-6 md:px-6">
        <BackButton 
            href="/admin-panel/user-management?tab=student" 
            label="Go to User Management" 
        />
      </div>

      <div className="px-4 md:px-6 pb-10 mt-4">
        <StudentGeneralDetails
          name="Dilshan Perera"
          studentId={`#${id}`}
          enrolledDate="2025/01/01"
          address="no: XX/1, Schol Lane, City, Post office, Postal code"
          mobileNumber="+70 XXX XXXX"
          whatsAppNumber="+70 XXX XXXX"
          gender="Male"
          emailAddress="user@gmail.com"
          progressPercent={70}
          paymentPending="5,000.00"
          paymentPaid="5,000.00"
          profileImageUrl="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop"
        />
        <div className="mt-6">
          <StudentEnrolledCourses />
        </div>
        <div className="mt-4">
          <StudentEnrolledBatches />
        </div>
        <div className="mt-4">
          <StudentProductPurchases />
        </div>
        <div className="mt-4">
          <StudentReferralDetails />
        </div>
      </div>
    </div>
  );
}
