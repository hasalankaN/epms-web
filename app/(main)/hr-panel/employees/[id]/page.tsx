"use client";

import React, { Suspense, use } from "react";
import { HrEmployeeDetailView } from "@/components/hr/employees/HrEmployeeDetailView";
import { PageSkeleton } from "@/components/common/PageSkeleton";

export default function HrEmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <Suspense fallback={<PageSkeleton />}>
        <HrEmployeeDetailView id={resolvedParams.id} />
      </Suspense>
    </div>
  );
}

