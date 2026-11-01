import React from "react";

export function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse p-4">
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/4" />
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>
      <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
    </div>
  );
}

export default PageSkeleton;

