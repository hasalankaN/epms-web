"use client";

import React, { Suspense } from "react";
import { ProfileView } from "@/components/employee/profile/ProfileView";
import { PageSkeleton } from "@/components/common/PageSkeleton";

export default function EmployeeProfilePage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <Suspense fallback={<PageSkeleton />}>
        <ProfileView />
      </Suspense>
    </div>
  );
}

