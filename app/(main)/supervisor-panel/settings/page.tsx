"use client";

import React, { Suspense } from "react";
import { SupervisorSettingsView } from "@/components/supervisor/settings/SupervisorSettingsView";
import { PageSkeleton } from "@/components/common/PageSkeleton";

export default function SupervisorSettingsPage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Account Settings & Security
        </h1>
        <p className="text-xs text-slate-500">
          Manage your supervisor personal details, password authentication, and supervisory notification preferences.
        </p>
      </div>

      <Suspense fallback={<PageSkeleton />}>
        <SupervisorSettingsView />
      </Suspense>
    </div>
  );
}

