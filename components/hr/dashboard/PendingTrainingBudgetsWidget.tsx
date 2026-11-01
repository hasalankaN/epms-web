"use client";

import React from "react";

import { Check, X, Wallet, CheckCircle2 } from "lucide-react";

import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TrainingBudgetRequest } from "@/types/hrDashboard";

interface PendingTrainingBudgetsWidgetProps {
  budgets: TrainingBudgetRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function PendingTrainingBudgetsWidget({
  budgets,
  onApprove,
  onReject,
}: PendingTrainingBudgetsWidgetProps) {
  const pendingBudgets = budgets.filter((b) => b.status === "PENDING");

  const totalAmount = pendingBudgets.reduce(
    (sum, b) => sum + b.estimatedBudget,
    0
  );

  const handleApprove = (item: TrainingBudgetRequest) => {
    onApprove(item.id);
    toast.success(
      `Training budget for "${item.programTitle}" (${item.currency} ${item.estimatedBudget.toLocaleString()}) approved! (#38)`
    );
  };

  const handleReject = (item: TrainingBudgetRequest) => {
    onReject(item.id);
    toast.error(`Training budget request for "${item.programTitle}" rejected.`);
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Wallet className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                  Pending Training Budgets
                </h3>
                <Badge variant="Pending" className="text-[10px] h-5 px-1.5 font-bold">
                  {pendingBudgets.length} Proposals
                </Badge>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                  #38
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Departmental upskilling budget clearance requests
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
              Total Requested
            </span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              LKR {totalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
          {pendingBudgets.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <CheckCircle2 className="h-6 w-6 mx-auto mb-1 opacity-40 text-emerald-500" />
              All training program budgets have been reviewed & disbursed!
            </div>
          ) : (
            pendingBudgets.map((b) => (
              <div
                key={b.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-lg transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      {b.programTitle}
                    </span>
                    <Badge variant="outline" className="text-[10px] py-0 px-1 font-mono">
                      {b.id}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {b.department}
                    </span>
                    <span>•</span>
                    <span>{b.participantsCount} Enrolled</span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400 font-mono">
                      {b.currency} {b.estimatedBudget.toLocaleString()}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 truncate max-w-md">
                    Provider: {b.trainer} | By {b.requestedBy}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleApprove(b)}
                    className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Approve Budget</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleReject(b)}
                    className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900"
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
        <span>Approve Training Budget (#38)</span>
        <span className="font-mono text-[10px] text-slate-500">Finance Ledger Synced</span>
      </div>
    </div>
  );
}
