"use client";

import React, { useState } from "react";

import { UserCheck, Check, X, Eye, FileEdit } from "lucide-react";

import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ProfileUpdateRequest } from "@/types/hrDashboard";
import { ReviewProfileUpdateModal } from "./modals/ReviewProfileUpdateModal";

interface PendingProfileUpdatesWidgetProps {
  requests: ProfileUpdateRequest[];
  onApprove: (id: string, notes?: string) => void;
  onReject: (id: string, notes?: string) => void;
}

export function PendingProfileUpdatesWidget({
  requests,
  onApprove,
  onReject,
}: PendingProfileUpdatesWidgetProps) {
  const [selectedRequest, setSelectedRequest] =
    useState<ProfileUpdateRequest | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const pendingList = requests.filter((r) => r.status === "PENDING");

  const handleReviewClick = (req: ProfileUpdateRequest) => {
    setSelectedRequest(req);
    setIsModalOpen(true);
  };

  const handleQuickApprove = (req: ProfileUpdateRequest) => {
    onApprove(req.id);
    toast.success(`Profile update for ${req.employeeName} approved! (#30)`);
  };

  const handleQuickReject = (req: ProfileUpdateRequest) => {
    onReject(req.id);
    toast.error(`Profile update for ${req.employeeName} rejected.`);
  };

  return (
    <>
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                <FileEdit className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                    Pending Profile Update Requests
                  </h3>
                  <Badge variant="Pending" className="text-[10px] h-5 px-1.5 font-bold">
                    {pendingList.length} Pending
                  </Badge>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-semibold">
                    #30
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Employee self-service record change submissions awaiting HR approval
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
            {pendingList.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                <UserCheck className="h-6 w-6 mx-auto mb-1 opacity-40 text-emerald-500" />
                All employee profile update requests have been reviewed!
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
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {req.department}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {req.changes.map((c, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 px-1.5 py-0.5 rounded font-medium"
                        >
                          {c.field}
                        </span>
                      ))}
                    </div>

                    <p className="text-[10px] text-slate-400">
                      Requested {req.requestDate}
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
          <span>Approve employee edit request workflow</span>
          <span className="font-mono text-[10px] text-slate-500">ISO 27001 Audit Ready</span>
        </div>
      </div>

      <ReviewProfileUpdateModal
        request={selectedRequest}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onApprove={onApprove}
        onReject={onReject}
      />
    </>
  );
}
