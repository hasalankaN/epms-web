import { StatItem } from "../../../data/adminDashboardData";

interface MetricCardProps {
  stat: StatItem;
}

export function MetricCard({ stat }: MetricCardProps) {
  const Icon = stat.icon;

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {stat.title}
        </span>
        <div className={`p-2.5 rounded-lg bg-gradient-to-tr ${stat.color} text-white shadow-sm`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold text-slate-900 dark:text-white">
          {stat.value}
        </div>
        <div className="mt-1 flex items-center text-xs text-slate-500">
          <span className="text-emerald-600 font-medium inline-flex items-center">
            {stat.change}
          </span>
        </div>
      </div>
    </div>
  );
}