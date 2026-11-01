"use client";

import React, { useState } from "react";
import { DollarSign, Download, Eye, EyeOff, ShieldCheck, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/common/table/DataTable";
import { useMySalaryQuery, useMySalarySlipsQuery } from "@/hooks/api/salary/useSalary";
import { toast } from "sonner";
import type { SalarySlip } from "@/types/dto/salary.dto";

export function EmployeeSalaryView() {
  const [hideAmounts, setHideAmounts] = useState(false);
  const { data: salarySummary } = useMySalaryQuery();
  const { data: slips = [] } = useMySalarySlipsQuery();

  const formatLKR = (val: number) => {
    if (hideAmounts) return "LKR ••••••";
    return `LKR ${val.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleDownloadSlip = (slip: SalarySlip) => {
    toast.success(`Downloading salary slip for ${slip.month}...`);
  };

  const columns: Column<SalarySlip>[] = [
    {
      header: "Salary Period",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#E60076]" />
          <div>
            <p className="font-bold text-xs text-slate-900 dark:text-white">{item.month}</p>
            <p className="text-[10px] text-slate-400">Generated on {item.generatedOn}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Basic",
      cell: (item) => <span className="text-xs font-mono">{formatLKR(item.basic)}</span>,
    },
    {
      header: "Allowances",
      cell: (item) => <span className="text-xs font-mono">{formatLKR(item.allowances)}</span>,
    },
    {
      header: "Overtime",
      cell: (item) => <span className="text-xs font-mono text-emerald-600">{formatLKR(item.overtime)}</span>,
    },
    {
      header: "Deductions",
      cell: (item) => <span className="text-xs font-mono text-rose-600">-{formatLKR(item.deductions)}</span>,
    },
    {
      header: "Net Disbursed",
      cell: (item) => (
        <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
          {formatLKR(item.net)}
        </span>
      ),
    },
    {
      header: "Action",
      cell: (item) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDownloadSlip(item)}
          className="h-7 text-xs gap-1.5"
        >
          <Download className="h-3 w-3" />
          PDF
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hide amounts toggle */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Statutory allowances & deductions calculated according to Sri Lanka Inland Revenue & EPF/ETF guidelines.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setHideAmounts(!hideAmounts)}
          className="text-xs gap-1.5"
        >
          {hideAmounts ? (
            <>
              <Eye className="h-3.5 w-3.5" /> Show Amounts
            </>
          ) : (
            <>
              <EyeOff className="h-3.5 w-3.5" /> Hide Amounts
            </>
          )}
        </Button>
      </div>

      {/* Main Salary Structure Card */}
      {salarySummary && (
        <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Monthly Compensation Package
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                Effective revision date: {salarySummary.effectiveDate}
              </p>
            </div>
            <div className="text-left md:text-right">
              <span className="text-xs font-semibold text-slate-500">Net Monthly Remuneration</span>
              <p className="text-3xl font-extrabold text-[#E60076] tracking-tight font-mono mt-0.5">
                {formatLKR(salarySummary.netSalary)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl space-y-1">
              <span className="text-slate-400 font-medium">Basic Salary</span>
              <p className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                {formatLKR(salarySummary.basicSalary)}
              </p>
            </div>
            <div className="bg-emerald-50/60 dark:bg-emerald-950/20 p-4 rounded-xl space-y-1">
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">Total Allowances</span>
              <p className="text-lg font-bold font-mono text-emerald-700 dark:text-emerald-300">
                +{formatLKR(salarySummary.totalAllowances)}
              </p>
            </div>
            <div className="bg-rose-50/60 dark:bg-rose-950/20 p-4 rounded-xl space-y-1">
              <span className="text-rose-700 dark:text-rose-400 font-medium">Total Deductions</span>
              <p className="text-lg font-bold font-mono text-rose-700 dark:text-rose-300">
                -{formatLKR(salarySummary.totalDeductions)}
              </p>
            </div>
          </div>

          {/* Breakdown Tables Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Allowances */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Fixed Allowances Breakdown
              </h4>
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {salarySummary.allowances.map((al) => (
                      <tr key={al.id} className="hover:bg-slate-50/50">
                        <td className="p-3 text-slate-700 dark:text-slate-300">{al.description}</td>
                        <td className="p-3 text-right font-mono font-semibold text-emerald-600">
                          {formatLKR(al.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Deductions */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500" /> Statutory Deductions Breakdown
              </h4>
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {salarySummary.deductions.map((dd) => (
                      <tr key={dd.id} className="hover:bg-slate-50/50">
                        <td className="p-3 text-slate-700 dark:text-slate-300">{dd.description}</td>
                        <td className="p-3 text-right font-mono font-semibold text-rose-600">
                          -{formatLKR(dd.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Salary Slips History Table */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Salary Slips Archive
        </h3>
        <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 shadow-sm overflow-hidden">
          <DataTable
            data={slips}
            columns={columns}
            keyExtractor={(item) => item.id}
          />
        </div>
      </div>
    </div>
  );
}

