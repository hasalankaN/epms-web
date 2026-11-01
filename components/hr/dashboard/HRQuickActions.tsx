"use client";

import React from "react";

import { useRouter } from "next/navigation";

import {
  UserPlus,
  GraduationCap,
  Briefcase,
  BellRing,
  FileSpreadsheet,
} from "lucide-react";

interface HRQuickActionsProps {
  onPlanTrainingClick: () => void;
  onCreateVacancyClick: () => void;
  onSendNotificationClick: () => void;
  onGenerateReportsClick: () => void;
}

export function HRQuickActions({
  onPlanTrainingClick,
  onCreateVacancyClick,
  onSendNotificationClick,
  onGenerateReportsClick,
}: HRQuickActionsProps) {
  const router = useRouter();

  const actions = [
    {
      id: "add-employee",
      title: "Add New Employee",
      code: "#31",
      icon: UserPlus,
      textColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/40",
      borderColor: "hover:border-blue-300 dark:hover:border-blue-700",
      description: "Register personnel record",
      onClick: () => {
        router.push("/admin-panel/user-accounts");
      },
    },
    {
      id: "plan-training",
      title: "Plan Training",
      code: "#35",
      icon: GraduationCap,
      textColor: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/40",
      borderColor: "hover:border-indigo-300 dark:hover:border-indigo-700",
      description: "Schedule skill program",
      onClick: onPlanTrainingClick,
    },
    {
      id: "create-vacancy",
      title: "Create Vacancy",
      code: "#60",
      icon: Briefcase,
      textColor: "text-teal-600 dark:text-teal-400",
      bgColor: "bg-teal-50 dark:bg-teal-950/40",
      borderColor: "hover:border-teal-300 dark:hover:border-teal-700",
      description: "Post new job position",
      onClick: onCreateVacancyClick,
    },
    {
      id: "send-notification",
      title: "Send Notification",
      code: "#63",
      icon: BellRing,
      textColor: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/40",
      borderColor: "hover:border-emerald-300 dark:hover:border-emerald-700",
      description: "Broadcast company notice",
      onClick: onSendNotificationClick,
    },
    {
      id: "generate-reports",
      title: "Generate Reports",
      code: "Audit",
      icon: FileSpreadsheet,
      textColor: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/40",
      borderColor: "hover:border-purple-300 dark:hover:border-purple-700",
      description: "Leave, Training, Salary",
      onClick: onGenerateReportsClick,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Quick Actions
        </h2>
        <span className="text-[11px] text-slate-400">
          Instant HR workflows & operations
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;

          
return (
            <button
              key={act.id}
              type="button"
              onClick={act.onClick}
              className={`group text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:shadow-md transition-all ${act.borderColor} flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`p-2 rounded-lg ${act.bgColor} ${act.textColor} transition-transform group-hover:scale-105`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                  {act.code}
                </span>
              </div>

              <div className="mt-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {act.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  {act.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
