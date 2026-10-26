"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Building2, Briefcase } from "lucide-react";
import { DepartmentManagementTable } from "@/components/admin/Departments/DepartmentManagementTable";
import { PositionManagementTable } from "@/components/admin/Positions/PositionManagementTable";

function DepartmentsAndRolesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentTab = searchParams.get("tab") || "departments";

  const handleTabChange = (tab: "departments" | "roles") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`/admin-panel/departments?${params.toString()}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => handleTabChange("departments")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-all ${
            currentTab === "departments"
              ? "bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 shadow-sm border border-indigo-200/60 dark:border-indigo-800/60"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Departments</span>
        </button>

        <button
          onClick={() => handleTabChange("roles")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-all ${
            currentTab === "roles"
              ? "bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 shadow-sm border border-purple-200/60 dark:border-purple-800/60"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
          }`}
        >
          <Briefcase className="h-4 w-4" />
          <span>Roles & Positions</span>
        </button>
      </div>

      {/* Active Tab View */}
      {currentTab === "roles" ? (
        <PositionManagementTable />
      ) : (
        <DepartmentManagementTable />
      )}
    </div>
  );
}

export default function DepartmentsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Loading...</div>}>
      <DepartmentsAndRolesContent />
    </Suspense>
  );
}
