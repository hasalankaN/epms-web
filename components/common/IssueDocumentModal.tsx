"use client";

import React, { useState } from "react";

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
import { BUTTON_STYLES } from "@/lib/constants/theme";

// ===== TYPES =====

export interface DocumentTypeOption {
  id: string;
  label: string;
}

export type IssueType = "email" | "print" | "both" | "student-dashboard";

export interface IssueDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIssue?: (data: { documentTypes: string[]; issueType: IssueType }) => void;

  /** Document type options to display as checkboxes */
  documentTypes?: DocumentTypeOption[];

  /** Title of the modal */
  title?: string;
}

const DEFAULT_DOCUMENT_TYPES: DocumentTypeOption[] = [
  { id: "recommendation-letter", label: "Recommendation Letter" },
  { id: "diploma-completion-letter", label: "Diploma Completion Letter" },
  { id: "document-type-01", label: "Document Type 01" },
  { id: "document-type-02", label: "Document Type 02" },
];

const ISSUE_TYPE_OPTIONS: { value: IssueType; label: string }[] = [
  { value: "email", label: "Email" },
  { value: "print", label: "Print" },
  { value: "both", label: "Both" },
  { value: "student-dashboard", label: "Student Dashboard" },
];

// ===== COMPONENT =====

export function IssueDocumentModal({
  open,
  onOpenChange,
  onIssue,
  documentTypes = DEFAULT_DOCUMENT_TYPES,
  title = "Issuing Documents",
}: IssueDocumentModalProps) {
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [issueType, setIssueType] = useState<IssueType>("email");

  const handleDocumentToggle = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedDocuments((prev) => [...prev, id]);
    } else {
      setSelectedDocuments((prev) => prev.filter((docId) => docId !== id));
    }
  };

  const handleIssue = () => {
    onIssue?.({ documentTypes: selectedDocuments, issueType });
    onOpenChange(false);

    // Reset form
    setSelectedDocuments([]);
    setIssueType("email");
  };

  const handleClose = () => {
    onOpenChange(false);
    setSelectedDocuments([]);
    setIssueType("email");
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
          
          {/* Document Type */}
          <div className="flex flex-col gap-3">
            <Label className="text-xs font-medium leading-4 text-[#45556C]">Document Type</Label>
            <div className="flex flex-col gap-3">
              {documentTypes.map((doc) => (
                <label
                  key={doc.id}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <Checkbox
                    checked={selectedDocuments.includes(doc.id)}
                    onCheckedChange={(checked) => handleDocumentToggle(doc.id, !!checked)}
                    className="data-[state=checked]:bg-[#0F172B] data-[state=checked]:border-[#0F172B]"
                  />
                  <span className="text-sm font-medium text-[#0F172B]">{doc.label}</span>
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
                    name="issueType"
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
            disabled={selectedDocuments.length === 0}
            className={cn(BUTTON_STYLES.primary.md, "bg-[#E60076] hover:bg-[#D6006D] text-white disabled:opacity-50")}
          >
            Issue Document
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
