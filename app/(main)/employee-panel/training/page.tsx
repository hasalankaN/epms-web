"use client";

import React, { Suspense } from "react";
import { EmployeeTrainingView } from "@/components/employee/training/EmployeeTrainingView";
import { PageSkeleton } from "@/components/common/PageSkeleton";

export default function EmployeeTrainingPage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Training & Professional Development
        </h1>
        <p className="text-xs text-slate-500">
          Enrolled corporate training sessions, downloadable materials, and post-training evaluations.
        </p>
      </div>

      <Suspense fallback={<PageSkeleton />}>
        <EmployeeTrainingView />
      </Suspense>
    </div>
  );
}
