"use client";

import React, { Suspense } from "react";
import { EmployeeSalaryView } from "@/components/employee/salary/EmployeeSalaryView";
import { PageSkeleton } from "@/components/common/PageSkeleton";

export default function EmployeeSalaryPage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Salary & Compensation Breakdown
        </h1>
        <p className="text-xs text-slate-500">
          Monthly basic salary, allowances, tax & EPF statutory deductions, and downloadable PDF payslips.
        </p>
      </div>

      <Suspense fallback={<PageSkeleton />}>
        <EmployeeSalaryView />
      </Suspense>
    </div>
  );
}
