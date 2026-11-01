"use client";

import React, { useState } from "react";

import { AlertTriangle, Calendar, Check, X, Eye } from "lucide-react";

import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { EscalatedLeaveRequest } from "@/types/hrDashboard";
import { ReviewEscalatedLeaveModal } from "./modals/ReviewEscalatedLeaveModal";

interface EscalatedLeaveRequestsWidgetProps {
  requests: EscalatedLeaveRequest[];
  onApprove: (id: string, notes?: string) => void;
  onReject: (id: string, notes?: string) => void;
}

export function EscalatedLeaveRequestsWidget({
  requests,
  onApprove,
  onReject,
}: EscalatedLeaveRequestsWidgetProps) {
  const [selectedRequest, setSelectedRequest] =
    useState<EscalatedLeaveRequest | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const pendingList = requests.filter((r) => r.status === "PENDING");

  const handleReviewClick = (req: EscalatedLeaveRequest) => {
    setSelectedRequest(req);
    setIsModalOpen(true);
  };

  const handleQuickApprove = (req: EscalatedLeaveRequest) => {
    onApprove(req.id);
    toast.success(`Escalated leave for ${req.employeeName} approved! (#41, #43)`);
  };

  const handleQuickReject = (req: EscalatedLeaveRequest) => {
    onReject(req.id);
    toast.error(`Escalated leave for ${req.employeeName} rejected.`);
  };

  return (
    <>
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                    Escalated & Special Leave Requests
                  </h3>
                  <Badge variant="Pending" className="text-[10px] h-5 px-1.5 font-bold">
                    {pendingList.length} Action Needed
                  </Badge>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-semibold">
                    #41, #43
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Supervisor escalations exceeding limits or requiring HR Director discretion
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
            {pendingList.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                <Calendar className="h-6 w-6 mx-auto mb-1 opacity-40 text-emerald-500" />
                No escalated leave requests pending HR decision.
              </div>
            ) : (
              pendingList.map((req) => (
                <div
                  key={req.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-lg transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">
                        {req.employeeName}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        ({req.employeeId})
                      </span>
                      <Badge
                        variant={
                          req.priority === "URGENT"
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-[10px] py-0 px-1.5 h-4"
                      >
                        {req.priority}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                      <span>{req.leaveType}</span>
                      <span>•</span>
                      <span className="text-indigo-600 dark:text-indigo-400">
                        {req.days} Days ({req.startDate} to {req.endDate})
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-1">
                      <span className="font-semibold not-italic text-slate-600 dark:text-slate-300">
                        Escalated by {req.escalatedBy.split(" ")[0]}:
                      </span>{" "}
                      &ldquo;{req.escalationReason}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleReviewClick(req)}
                      className="h-7 text-xs gap-1 border-slate-200 dark:border-slate-700"
                    >
                      <Eye className="h-3 w-3" />
                      <span>Review</span>
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleQuickApprove(req)}
                      className="h-7 w-7 p-0 bg-emerald-600 hover:bg-emerald-700 text-white"
                      title="Quick Approve"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickReject(req)}
                      className="h-7 w-7 p-0 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900"
                      title="Quick Reject"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between mt-2">
          <span>Supervisor Escalation Clause #41 & #43</span>
          <span className="font-medium text-slate-500">Auto-logged in Employee Master</span>
        </div>
      </div>

      <ReviewEscalatedLeaveModal
        request={selectedRequest}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onApprove={onApprove}
        onReject={onReject}
      />
    </>
  );
}
