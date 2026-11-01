import React from "react";
import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";
import { EmployeeRegisterForm } from "@/components/admin/UserAccounts/EmployeeRegisterForm";

export default function HrAddEmployeePage() {
  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950">
      {/* Page Header */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto max-w-5xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/hr-panel/employees"
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Employee Directory
            </Link>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#E60076]">
                <UserPlus className="h-3.5 w-3.5 text-white" />
              </div>
              <h1 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                New Employee Account Request
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center rounded-full border border-pink-200 bg-pink-50 px-2.5 py-0.5 text-[11px] font-medium text-[#E60076] dark:border-pink-800 dark:bg-pink-950 dark:text-pink-300">
              HR Action · Pending Admin Approval
            </span>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="mx-auto max-w-5xl px-6 py-8">
        <EmployeeRegisterForm mode="hr" onSuccessRedirect="/hr-panel/employees" />
      </div>
    </div>
  );
}

