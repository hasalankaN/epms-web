"use client";

import React, { Suspense } from "react";
import { SupervisorKpisView } from "@/components/supervisor/kpis/SupervisorKpisView";
import { PageSkeleton } from "@/components/common/PageSkeleton";

export default function SupervisorKpisPage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Team Appraisals, KPIs & Meetings
        </h1>
        <p className="text-xs text-slate-500">
          Conduct quarterly appraisals, evaluate self-ratings, manage 1-on-1 review meetings, and approve production deliverables.
        </p>
      </div>

      <Suspense fallback={<PageSkeleton />}>
        <SupervisorKpisView />
      </Suspense>
    </div>
  );
}

