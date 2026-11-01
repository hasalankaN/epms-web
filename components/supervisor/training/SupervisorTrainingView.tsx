"use client";

import React, { useState } from "react";
import { GraduationCap, Users, Calendar, Clock, CheckCircle2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable, type Column } from "@/components/common/table/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTeamTrainingAttendanceQuery } from "@/hooks/api/training/useTraining";
import type { TrainingItem } from "@/types/dto/training.dto";

export function SupervisorTrainingView() {
  const { data: trainings = [], isLoading } = useTeamTrainingAttendanceQuery();
  const [selectedTraining, setSelectedTraining] = useState<TrainingItem | null>(null);

  const columns: Column<TrainingItem>[] = [
    {
      header: "Program Title",
      cell: (item) => (
        <div>
          <p className="font-bold text-xs text-slate-900 dark:text-white">{item.name}</p>
          <p className="text-[11px] text-slate-400">{item.mode} · {item.venue}</p>
        </div>
      ),
    },
    {
      header: "Session Date",
      cell: (item) => (
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {item.date}
        </span>
      ),
    },
    {
      header: "My Team Enrolled",
      cell: (item) => (
        <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
          {item.participants?.length || 2} members
        </span>
      ),
    },
    {
      header: "Attendance Verified",
      cell: (item) => {
        const attended = item.participants?.filter((p) => p.attendance === "ATTENDED").length || 0;
        return (
          <span className="text-xs font-bold text-emerald-600">
            {attended} attended
          </span>
        );
      },
    },
    {
      header: "Pending Evaluations",
      cell: (item) => {
        const pending = item.participants?.filter((p) => !p.evaluated).length || 0;
        return (
          <span className="text-xs font-bold text-amber-500">
            {pending} pending
          </span>
        );
      },
    },
    {
      header: "Status",
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: "Action",
      cell: (item) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setSelectedTraining(item)}
          className="h-7 text-xs font-semibold text-[#E60076] hover:bg-pink-50"
        >
          View Team Roll
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 shadow-sm overflow-hidden">
        <DataTable
          data={trainings}
          columns={columns}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
        />
      </div>

      {/* Participant Attendance Drawer */}
      <Dialog open={!!selectedTraining} onOpenChange={() => setSelectedTraining(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
              Team Training Attendance Roll
            </DialogTitle>
            <p className="text-xs text-slate-500">{selectedTraining?.name}</p>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Team Member</th>
                    <th className="p-3">Attendance</th>
                    <th className="p-3">Evaluated?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {selectedTraining?.participants?.map((p) => (
                    <tr key={p.employeeId}>
                      <td className="p-3">
                        <p className="font-bold text-slate-900 dark:text-white">{p.employeeName}</p>
                        <p className="text-[10px] text-slate-400">{p.employeeCode}</p>
                      </td>
                      <td className="p-3">
                        <StatusBadge status={p.attendance} />
                      </td>
                      <td className="p-3">
                        <span className={`font-semibold ${p.evaluated ? "text-emerald-600" : "text-amber-500"}`}>
                          {p.evaluated ? "Yes (Submitted)" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {(!selectedTraining?.participants || selectedTraining.participants.length === 0) && (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-slate-400">
                        No team members registered for this program.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

