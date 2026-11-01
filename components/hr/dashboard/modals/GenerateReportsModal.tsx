"use client";

import React, { useState } from "react";

import { toast } from "sonner";

import { FileSpreadsheet, FileText, Download, CheckCircle2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GenerateReportsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GenerateReportsModal({
  open,
  onOpenChange,
}: GenerateReportsModalProps) {
  const [reportType, setReportType] = useState("leave");
  const [format, setFormat] = useState<"PDF" | "EXCEL">("PDF");
  const [period, setPeriod] = useState("this-month");
  const [department, setDepartment] = useState("all");
  const [isGenerating, setIsGenerating] = useState(false);

  const reportDescriptions: Record<string, string> = {
    leave:
      "Leave utilization, pending balances, escalated special leaves, and departmental absence patterns.",
    training:
      "Training session attendance, completed certifications, skill acquisition rates, and budget expenditures.",
    production:
      "Shift-wise attendance, punch-in variances, production floor overtime, and workforce productivity metrics.",
    salary:
      "Payroll adjustments, unpaid leave deductions, attendance incentives, and department compensation breakdown.",
  };

  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      onOpenChange(false);

      const reportName =
        reportType.charAt(0).toUpperCase() + reportType.slice(1);

      toast.success(
        `${reportName} Report (${format}) successfully compiled and exported!`,
        {
          description: `Period: ${period.replace("-", " ")} | Dept: ${department.toUpperCase()}`,
        }
      );
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>Generate HR Analytics Reports</DialogTitle>
              <DialogDescription>
                Export certified audit reports for Leave, Training, Production & Salary.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Report Category Select */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Select Report Type</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "leave", label: "Leave", icon: FileText },
                { id: "training", label: "Training", icon: FileText },
                { id: "production", label: "Production", icon: FileSpreadsheet },
                { id: "salary", label: "Salary", icon: FileSpreadsheet },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = reportType === item.id;

                
return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setReportType(item.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      isSelected
                        ? "border-purple-600 bg-purple-50 text-purple-900 font-semibold shadow-xs dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-500"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                    }`}
                  >
                    <Icon className="h-4 w-4 mb-1" />
                    <span className="text-xs">{item.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
              {reportDescriptions[reportType]}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Reporting Period</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today (Real-time)</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">Current Month (October)</SelectItem>
                  <SelectItem value="q3">Q3 2026 Quarter</SelectItem>
                  <SelectItem value="ytd">Year-to-Date (2026)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Department Filter</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="quality-assurance">Quality Assurance</SelectItem>
                  <SelectItem value="logistics">Logistics & Store</SelectItem>
                  <SelectItem value="hr-admin">HR & Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Export File Format</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat("PDF")}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all ${
                  format === "PDF"
                    ? "border-purple-600 bg-purple-50 text-purple-900 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-500"
                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50"
                }`}
              >
                <FileText className="h-4 w-4 text-red-500" />
                <span>Adobe PDF (.pdf)</span>
              </button>
              <button
                type="button"
                onClick={() => setFormat("EXCEL")}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all ${
                  format === "EXCEL"
                    ? "border-purple-600 bg-purple-50 text-purple-900 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-500"
                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50"
                }`}
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                <span>Excel Spreadsheet (.xlsx)</span>
              </button>
            </div>
          </div>

          <div className="p-3 bg-purple-50/50 dark:bg-purple-950/20 rounded-lg border border-purple-100 dark:border-purple-900/30 flex items-start gap-2 text-xs text-purple-900 dark:text-purple-300">
            <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" />
            <p>
              Reports include tamper-proof cryptographic audit stamps & HR system signature.
            </p>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            type="button"
            disabled={isGenerating}
            onClick={handleGenerate}
            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1.5"
          >
            <Download className="h-4 w-4" />
            {isGenerating ? "Compiling Report..." : `Export ${format} Report`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
