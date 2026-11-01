"use client";

import React, { Suspense } from "react";
import { SupervisorApprovalsView } from "@/components/supervisor/approvals/SupervisorApprovalsView";
import { PageSkeleton } from "@/components/common/PageSkeleton";

export default function SupervisorApprovalsPage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Team Approvals Authorization Center
        </h1>
        <p className="text-xs text-slate-500">
          Decide on direct report leave applications, escalate special cases to HR, and approve biometric punch corrections.
        </p>
      </div>

      <Suspense fallback={<PageSkeleton />}>
        <SupervisorApprovalsView />
      </Suspense>
    </div>
  );
}

