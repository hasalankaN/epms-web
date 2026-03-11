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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BUTTON_STYLES, AUTH_TYPOGRAPHY, AUTH_INPUT } from "@/lib/constants/theme";

// ===== TYPES =====
export type IssueMethod = "email" | "print" | "both";

export interface IssueTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateName?: string;
  onIssue?: (data: any) => void;
}

// ===== COMPONENT =====
export function IssueTemplateModal({
  isOpen,
  onClose,
  templateName,
  onIssue,
}: IssueTemplateModalProps) {
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [issueMethod, setIssueMethod] = useState<IssueMethod>("email");

  // Email fields
  const [recipientsEmail, setRecipientsEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [attachPdf, setAttachPdf] = useState(false);

  // Initialize subject when template name changes
  useEffect(() => {
    if (isOpen && templateName) {
      setEmailSubject(templateName);
    }
  }, [isOpen, templateName]);

  const handleClearAll = () => {
    setSelectedBatchId("");
    setSelectedStudentId("");
    setIssueMethod("email");
    setRecipientsEmail("");
    setEmailSubject(templateName || "");
    setEmailBody("");
    setAttachPdf(false);
  };

  const handleIssue = () => {
    if (onIssue) {
      onIssue({
        batchId: selectedBatchId,
        studentId: selectedStudentId,
        issueMethod,
        emailDetails:
          issueMethod === "email" || issueMethod === "both"
            ? {
                recipientsEmail,
                subject: emailSubject,
                body: emailBody,
                attachPdf,
              }
            : null,
      });
    }

    handleClose();
  };

  const handleClose = () => {
    handleClearAll();
    onClose();
  };

  const FieldLabel = ({
    children,
    required = false,
  }: {
    children: React.ReactNode;
    required?: boolean;
  }) => (
    <Label className={cn(AUTH_TYPOGRAPHY.label, "mb-1.5 block")}>
      {children}
      {required && <span className="text-[#FB2C36] ml-0.5">*</span>}
    </Label>
  );

  const showEmailSection = issueMethod === "email" || issueMethod === "both";

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && handleClose()}>
      <DialogContent
        className="flex w-[95%] max-h-[90vh] max-w-[704px] flex-col rounded-[12px] border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] gap-0 sm:rounded-[12px] overflow-hidden [&>button]:hidden"
      >
        {/* Header (Static) */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#E2E8F0] pb-4">
          <DialogTitle className="text-lg font-semibold leading-[30px] text-[#0F172B]">
            Issue Certificate
          </DialogTitle>
          <button
            title="close"
            type="button"
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-transparent shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-slate-50"
          >
            <X className="h-4 w-4 text-[#64748B]" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto pr-1 py-4 scrollbar-hide">
          <div className="flex flex-col gap-6">
            
            {/* Row 1: Batch & Student Select */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <FieldLabel required>Batch/Course Name</FieldLabel>
                <Select value={selectedBatchId} onValueChange={setSelectedBatchId}>
                  <SelectTrigger className={cn(AUTH_INPUT.base, "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic")}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="z-[99999999]">
                    <SelectItem value="batch-1">Batch 01</SelectItem>
                    <SelectItem value="batch-2">Batch 02</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <FieldLabel>Select Student</FieldLabel>
                <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                  <SelectTrigger className={cn(AUTH_INPUT.base, "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic")}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="z-[99999999]">
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="student-1">Kalpa Perera</SelectItem>
                    <SelectItem value="student-2">Saduni</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 2: Issue Method */}
            <div className="space-y-3">
              <FieldLabel>Issue Method</FieldLabel>
              <div className="flex items-center gap-6">
                {(["email", "print", "both"] as const).map((method) => (
                  <label key={method} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="issueMethod"
                      value={method}
                      checked={issueMethod === method}
                      onChange={() => setIssueMethod(method)}
                      className="h-4 w-4 accent-[#0F172B] cursor-pointer"
                    />
                    <span className="text-sm font-normal text-[#314158] leading-5 font-inter capitalize">
                      {method}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Separator conditionally rendered if email is shown */}
            {showEmailSection && (
              <div className="h-[1px] bg-[#E2E8F0] w-full my-2" />
            )}

            {/* For Emails Block */}
            {showEmailSection && (
              <div className="flex flex-col gap-4 pb-2">
                <h4 className="text-base font-semibold text-[#0F172B] leading-6 font-inter">
                  For Emails
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <FieldLabel required>Recipients Email</FieldLabel>
                    <Input
                      value={recipientsEmail}
                      onChange={(e) => setRecipientsEmail(e.target.value)}
                      placeholder="User@gmail.com"
                      className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                    />
                  </div>
                  <div>
                    <FieldLabel required>Subject</FieldLabel>
                    <Input
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Certificate Name"
                      className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel required>Email Body</FieldLabel>
                  <Textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    placeholder="Lorem ipsum dolor sit amet consectetur. Elementum montes laoreet aliquam nibh adipiscing..."
                    className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "h-24 resize-none")}
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Checkbox
                    id="attachPdf"
                    checked={attachPdf}
                    onCheckedChange={(checked) => setAttachPdf(!!checked)}
                    className="border-[#94A3B8] data-[state=checked]:bg-[#0F172B] data-[state=checked]:border-[#0F172B]"
                  />
                  <label
                    htmlFor="attachPdf"
                    className="text-sm font-medium text-[#1D293D] cursor-pointer select-none"
                  >
                    Attach as PDF
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer (Static) */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            className={cn(BUTTON_STYLES.secondary.md)}
          >
            Clear All
          </Button>
          <Button
            type="button"
            onClick={handleIssue}
            className={cn(BUTTON_STYLES.primary.md)}
          >
            Issue Certificate
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
