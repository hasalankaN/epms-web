"use client";

import React, { useState, useEffect } from "react";

import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BUTTON_STYLES, AUTH_TYPOGRAPHY } from "@/lib/constants/theme";

// ===== TYPES =====

export interface BatchOption {
  id: string;
  name: string;
}

export type CertificateIssueType = "email" | "print" | "both" | "student-dashboard";
export type CertificateType = "free" | "uk" | "type-01" | "type-02";

export interface IssueCertificateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIssue?: (data: { batchId: string; issueType: CertificateIssueType; certificateTypes: string[] }) => void;

  /** Batch options to display in dropdown */
  batches?: BatchOption[];

  /** Default batch ID to pre-select (useful when opening from batch view) */
  defaultBatchId?: string;

  /** Title of the modal */
  title?: string;
}

const DEFAULT_BATCHES: BatchOption[] = [
  { id: "batch-01", name: "Diploma in Computing – Batch 01" },
  { id: "batch-02", name: "Diploma in Computing – Batch 02" },
  { id: "batch-03", name: "Diploma in Computing – Batch 03" },
];

const ISSUE_TYPE_OPTIONS: { value: CertificateIssueType; label: string }[] = [
  { value: "email", label: "Email" },
  { value: "print", label: "Print" },
  { value: "both", label: "Both" },
  { value: "student-dashboard", label: "Student Dashboard" },
];

const CERTIFICATE_TYPE_OPTIONS: { value: CertificateType; label: string }[] = [
  { value: "free", label: "Free Certificate" },
  { value: "uk", label: "UK Certificate" },
  { value: "type-01", label: "Certificate Type 01" },
  { value: "type-02", label: "Certificate Type 02" },
];

// ===== COMPONENT =====

export function IssueCertificateModal({
  open,
  onOpenChange,
  onIssue,
  batches = DEFAULT_BATCHES,
  defaultBatchId,
  title = "Issue Certificate",
}: IssueCertificateModalProps) {
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const [issueType, setIssueType] = useState<CertificateIssueType>("email");
  const [selectedCertificateTypes, setSelectedCertificateTypes] = useState<string[]>(["uk"]);

  // Auto-select batch when defaultBatchId changes or modal opens
  useEffect(() => {
    if (open && defaultBatchId) {
      setSelectedBatchId(defaultBatchId);
    }
  }, [open, defaultBatchId]);
  
  const handleCertificateToggle = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedCertificateTypes((prev) => [...prev, id]);
    } else {
      setSelectedCertificateTypes((prev) => prev.filter((typeId) => typeId !== id));
    }
  };

  const handleIssue = () => {
    if (!selectedBatchId) return;

    onIssue?.({ batchId: selectedBatchId, issueType, certificateTypes: selectedCertificateTypes });
    onOpenChange(false);

    // Reset form
    setSelectedBatchId(defaultBatchId || "");
    setIssueType("email");
    setSelectedCertificateTypes(["uk"]);
  };

  const handleClose = () => {
    onOpenChange(false);
    setSelectedBatchId(defaultBatchId || "");
    setIssueType("email");
    setSelectedCertificateTypes(["uk"]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex w-[95%] max-h-[90vh] max-w-[500px] flex-col rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] gap-4 sm:rounded-xl overflow-hidden [&>button]:hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <DialogTitle className="text-lg font-semibold leading-[30px] text-[#0F172B]">
            {title}
          </DialogTitle>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-transparent shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-slate-50"
          >
            <X className="h-4 w-4 text-[#64748B]" />
          </button>
        </div>

        {/* Separator */}
        <div className="h-[1px] bg-[#E2E8F0] w-full" />

        {/* Body */}
        <div className="flex flex-col gap-4 flex-1 overflow-y-auto pr-2">
          
          {/* Batch Name */}
          <div className="flex flex-col gap-3">
            <Label className={AUTH_TYPOGRAPHY.label}>
              Batch Name <span className="text-red-500">*</span>
            </Label>
            <Select value={selectedBatchId} onValueChange={setSelectedBatchId}>
              <SelectTrigger className="w-full h-10 border-[#E2E8F0] focus:ring-[#E60076]">
                <SelectValue placeholder="Select a batch" />
              </SelectTrigger>
              <SelectContent className="z-[99999999]">
                {batches.map((batch) => (
                  <SelectItem key={batch.id} value={batch.id}>
                    {batch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Certificate Type */}
          <div className="flex flex-col gap-3">
            <Label className="text-xs font-medium leading-4 text-[#45556C]">Select Certificate Type</Label>
            <div className="flex flex-col gap-3">
              {CERTIFICATE_TYPE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <Checkbox
                    checked={selectedCertificateTypes.includes(option.value)}
                    onCheckedChange={(checked) => handleCertificateToggle(option.value, !!checked)}
                    className="data-[state=checked]:bg-[#0F172B] data-[state=checked]:border-[#0F172B]"
                  />
                  <span className="text-sm font-medium text-[#0F172B]">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Issue Type */}
          <div className="flex flex-col gap-3">
            <Label className="text-xs font-medium leading-4 text-[#45556C]">Issue Type</Label>
            <div className="flex flex-col gap-3">
              {ISSUE_TYPE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="certificateIssueType"
                    value={option.value}
                    checked={issueType === option.value}
                    onChange={() => setIssueType(option.value)}
                    className="h-4 w-4 accent-[#0F172B] cursor-pointer"
                  />
                  <span className="text-sm font-medium text-[#0F172B]">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-[#E2E8F0] pt-4">
          <Button
            type="button"
            onClick={handleIssue}
            disabled={!selectedBatchId}
            className={cn(BUTTON_STYLES.primary.md, "bg-[#E60076] hover:bg-[#D6006D] text-white disabled:opacity-50")}
          >
            Issue Certificate
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
