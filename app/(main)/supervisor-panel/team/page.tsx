"use client";

import React, { Suspense } from "react";
import { SupervisorTeamView } from "@/components/supervisor/team/SupervisorTeamView";
import { PageSkeleton } from "@/components/common/PageSkeleton";

export default function SupervisorTeamPage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          My Direct Reports & Team Directory
        </h1>
        <p className="text-xs text-slate-500">
          Manage direct subordinates, track daily status, delegate tasks, and conduct appraisals.
        </p>
      </div>

      <Suspense fallback={<PageSkeleton />}>
        <SupervisorTeamView />
      </Suspense>
    </div>
  );
}

