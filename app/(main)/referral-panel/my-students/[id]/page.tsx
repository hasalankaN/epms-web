"use client";

import React from "react";

import { useParams } from "next/navigation";

import { BackButton } from "@/components/common/BackButton";
import { MyStudentGeneralDetails } from "@/components/referral-panel/my-students/view/MyStudentGeneralDetails";
import { MyStudentEnrolledCourses } from "@/components/referral-panel/my-students/view/MyStudentEnrolledCourses";
import { MyStudentEnrolledBatches } from "@/components/referral-panel/my-students/view/MyStudentEnrolledBatches";
import { MyStudentProductPurchases } from "@/components/referral-panel/my-students/view/MyStudentProductPurchases";

export default function ViewMyStudentPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex items-center justify-between px-4 pt-6 md:px-6">
        <BackButton
          href="/referral-panel/my-students"
          label="Go to My Students"
        />
      </div>

      <div className="px-4 md:px-6 pb-10 mt-4">
        <MyStudentGeneralDetails
          name="Dilshan Perera"
          studentId={`#${id}`}
          enrolledDate="2025/01/01"
          address="no: XX/1, Schol Lane, City, Post office, Postal code"
          mobileNumber="+70 XXX XXXX"
          whatsAppNumber="+70 XXX XXXX"
          gender="Male"
          emailAddress="user@gmail.com"
          profileImageUrl="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop"
        />
        <div className="mt-6">
          <MyStudentEnrolledCourses />
        </div>
        <div className="mt-4">
          <MyStudentEnrolledBatches />
        </div>
        <div className="mt-4">
          <MyStudentProductPurchases />
        </div>
      </div>
    </div>
  );
}
