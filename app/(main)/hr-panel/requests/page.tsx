"use client";

import React, { Suspense } from "react";
import { HrProfileRequestsView } from "@/components/hr/requests/HrProfileRequestsView";
import { PageSkeleton } from "@/components/common/PageSkeleton";

export default function HrRequestsPage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Employee Profile Update Requests
        </h1>
        <p className="text-xs text-slate-500">
          Review employee-submitted modifications to residential addresses, mobile contacts, emergency relatives, and educational qualifications.
        </p>
      </div>

      <Suspense fallback={<PageSkeleton />}>
        <HrProfileRequestsView />
      </Suspense>
    </div>
  );
}

