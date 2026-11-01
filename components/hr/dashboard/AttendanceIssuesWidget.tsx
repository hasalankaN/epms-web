"use client";

import React, { useState } from "react";

import { AlertCircle, Bell } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AttendanceIssueEmployee } from "@/types/hrDashboard";
import { NotifyAttendanceIssueModal } from "./modals/NotifyAttendanceIssueModal";

interface AttendanceIssuesWidgetProps {
  issues: AttendanceIssueEmployee[];
  onNoticeSent?: (employeeId: string, type: string) => void;
}

export function AttendanceIssuesWidget({
  issues,
  onNoticeSent,
}: AttendanceIssuesWidgetProps) {
  const [selectedEmployee, setSelectedEmployee] =
    useState<AttendanceIssueEmployee | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNotifyClick = (emp: AttendanceIssueEmployee) => {
    setSelectedEmployee(emp);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                    Attendance Issues & Violations
                  </h3>
                  <Badge variant="destructive" className="text-[10px] h-5 px-1.5 font-bold">
                    {issues.length} Flagged
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-500">
                  Employees exceeding monthly lateness or unnotified absence limits
                </p>
              </div>
            </div>
          </div>

          {/* List of Issue items */}
          <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
            {issues.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No attendance violations recorded this period.
              </div>
            ) : (
              issues.slice(0, 4).map((emp) => (
                <div
                  key={emp.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-lg transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">
                        {emp.name}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        ({emp.employeeId})
                      </span>
                      <Badge
                        variant={
                          emp.severity === "CRITICAL"
                            ? "destructive"
                            : "Pending"
                        }
                        className="text-[10px] py-0 px-1.5 h-4"
                      >
                        {emp.severity}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>{emp.department}</span>
                      <span>•</span>
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        {emp.lateCount}x Late
                      </span>
                      <span>•</span>
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        {emp.absentCount}x Absent
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 italic">
                      {emp.lastOccurrence}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleNotifyClick(emp)}
                    className="h-7 text-xs border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:hover:bg-red-950/40 shrink-0 self-start sm:self-auto gap-1"
                  >
                    <Bell className="h-3 w-3" />
                    <span>Notify</span>
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between mt-2">
          <span>Threshold: &gt;3 Lates or &gt;2 Absences</span>
          <span className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
            Compliance Policy
          </span>
        </div>
      </div>

      <NotifyAttendanceIssueModal
        employee={selectedEmployee}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onNoticeSent={onNoticeSent}
      />
    </>
  );
}
