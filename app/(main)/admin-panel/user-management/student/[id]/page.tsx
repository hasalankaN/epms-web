"use client";

import React from "react";

import { useParams } from "next/navigation";

import { BackButton } from "@/components/common/BackButton";
import { StudentGeneralDetails } from "@/components/admin-panel/user-management/view/student/StudentGeneralDetails";
import { StudentEnrolledCourses } from "@/components/admin-panel/user-management/view/student/StudentEnrolledCourses";
import { StudentEnrolledBatches } from "@/components/admin-panel/user-management/view/student/StudentEnrolledBatches";
import { StudentProductPurchases } from "@/components/admin-panel/user-management/view/student/StudentProductPurchases";
import { StudentReferralDetails } from "@/components/admin-panel/user-management/view/student/StudentReferralDetails";
import { useGetStudentById } from "@/hooks/api/user-management/useGetStudentById";


export default function ViewStudentPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading } = useGetStudentById(id);

  const profile = data?.profile;

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
          isLoading={isLoading}
          name={profile?.full_name}
          studentId={profile?.public_id ? `#${profile.public_id}` : undefined}
          enrolledDate={profile?.created_at}
          address={profile?.address ?? undefined}
          mobileNumber={profile?.mobile_number}
          whatsAppNumber={profile?.whatsapp_number ?? undefined}
          gender={profile?.gender ?? undefined}
          emailAddress={profile?.email}
          progressPercent={profile?.overall_progress_percentage}
          paymentPending={profile?.total_pending_amount}
          paymentPaid={profile?.total_paid_amount}
          profileImageUrl={profile?.profile_image_url ?? undefined}
        />
        
        <div className="mt-6">
          <StudentEnrolledCourses 
            data={data?.enrolledCourses.data} 
            total={data?.enrolledCourses.total}
            isLoading={isLoading}
          />
        </div>
        
        <div className="mt-4">
          <StudentEnrolledBatches 
            data={data?.enrolledBatches.data}
            total={data?.enrolledBatches.total}
            isLoading={isLoading}
          />
        </div>
        
        <div className="mt-4">
          <StudentProductPurchases 
            data={data?.productPurchases.data}
            total={data?.productPurchases.total}
            isLoading={isLoading}
          />
        </div>
        
        <div className="mt-4">
          <StudentReferralDetails 
            profile={profile}
            commissions={data?.referralCommissions.data}
            totalCommissions={data?.referralCommissions.total}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

