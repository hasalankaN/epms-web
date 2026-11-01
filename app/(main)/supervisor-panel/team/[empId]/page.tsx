"use client";

import React, { Suspense, use } from "react";
import { SupervisorMemberDetailView } from "@/components/supervisor/team/SupervisorMemberDetailView";
import { PageSkeleton } from "@/components/common/PageSkeleton";

export default function SupervisorMemberDetailPage({
  params,
}: {
  params: Promise<{ empId: string }>;
}) {
  const resolvedParams = use(params);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <Suspense fallback={<PageSkeleton />}>
        <SupervisorMemberDetailView empId={resolvedParams.empId} />
      </Suspense>
    </div>
  );
}

