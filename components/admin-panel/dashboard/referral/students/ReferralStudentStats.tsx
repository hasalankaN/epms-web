"use client";

import React from "react";

import { useRouter } from "next/navigation";

import type { StudentItem } from "@/hooks/api/dashboard/useGetDashboardReferral";
import { StudentListCard } from "./StudentListCard";

interface Props {
  recentlyReferralStudents?: StudentItem[];
  recentlyReferredStudents?: StudentItem[];
}

export function ReferralStudentStats({
  recentlyReferralStudents,
  recentlyReferredStudents,
}: Props) {
  const router = useRouter();

  const handleViewProfile = (studentId: string) => {
    router.push(`/admin-panel/user-management/student/${studentId}`);
  };

  return (
    <div className="flex w-full flex-col gap-4 md:flex-row">
      <StudentListCard
        title="Recently Referral Student"
        students={recentlyReferralStudents ?? []}
      />
      <StudentListCard
        title="Recently Referred Student"
        students={recentlyReferredStudents ?? []}
        showButton
        buttonLabel="View Profile"
        onButtonClick={handleViewProfile}
      />
    </div>
  );
}
