"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Download, FileSpreadsheet, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface ProductionReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductionReportModal({
  open,
  onOpenChange,
}: ProductionReportModalProps) {
  const [format, setFormat] = useState<"PDF" | "EXCEL">("PDF");
  const [month, setMonth] = useState("2026-03");
  const [department, setDepartment] = useState("ALL");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onOpenChange(false);
      toast.success(
        `Production Report (${format}) for ${month} downloaded successfully!`
      );
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Production Output Report</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Select Month</Label>
            <Input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Department / Production Line</Label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="ALL">All Production Lines</option>
              <option value="Line A">Line A - Active Wear</option>
              <option value="Line B">Line B - Denim & Trousers</option>
              <option value="Line C">Line C - Outerwear & Jackets</option>
              <option value="Cutting">Cutting & Pattern Section</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label>Export Format</Label>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setFormat("PDF")}
                className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-colors ${
                  format === "PDF"
                    ? "border-[#E60076] bg-[#E60076]/5 text-[#E60076]"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <FileText className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm font-semibold">PDF Document</p>
                  <p className="text-[11px] text-muted-foreground">Executive summary</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormat("EXCEL")}
                className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-colors ${
                  format === "EXCEL"
                    ? "border-[#E60076] bg-[#E60076]/5 text-[#E60076]"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-semibold">Excel (XLSX)</p>
                  <p className="text-[11px] text-muted-foreground">Detailed raw data</p>
                </div>
              </button>
            </div>
          </div>

          <div className="p-3 bg-muted/40 rounded-lg text-xs space-y-1 text-muted-foreground">
            <p className="font-semibold text-foreground">Included In Report:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Expected vs Actual piece-rate target completion</li>
              <li>Line supervisor ratings and defect rates</li>
              <li>Under-performing lines and root cause remarks</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-[#E60076] hover:bg-[#c40064] text-white gap-2"
            onClick={handleDownload}
            disabled={isGenerating}
          >
            <Download className="w-4 h-4" />
            {isGenerating ? "Exporting..." : `Download ${format}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

