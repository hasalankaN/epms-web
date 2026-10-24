import { ArrowUpRight } from "lucide-react";
import { adminQuickActions } from "../../../data/adminDashboardData";

export function QuickActions() {
  return (
    <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-base font-semibold text-slate-900 dark:text-white">
        System Administration Quickstart
      </h2>
      <p className="text-sm text-slate-500 mt-1">
        This EPMS project is ready for building your custom administrative views.
      </p>
      <div className="mt-6 space-y-3">
        {adminQuickActions.map((action, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-100 transition-colors dark:border-slate-800/80 dark:bg-slate-800/30 dark:hover:bg-slate-800/60 cursor-pointer"
          >
            <div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {action.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {action.desc}
              </p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-slate-400" />
          </div>
        ))}
      </div>
    </div>
  );
}