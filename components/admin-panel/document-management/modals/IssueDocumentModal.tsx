"use client";

import React, { useState, useEffect, useMemo } from "react";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { useGetStudents } from "@/hooks/api/user-management/useGetStudents";
import { useGetCourses } from "@/hooks/api/courses/useGetCourses";
import { useGetBatches } from "@/hooks/api/batches/useGetBatches";
import { useIssueDocument } from "@/hooks/api/documents/useIssueDocument";
import { SearchableSelect } from "@/components/ui/searchable-select";
import type { ApiDocumentType } from "@/types/document";
import { DOCUMENT_TYPE_LABELS } from "@/types/document";

// ===== TYPES =====
export type IssueMethod = "email" | "print" | "both" | "student-dashboard";

export interface IssueDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateId?: string;
  documentName?: string;
  documentType?: ApiDocumentType;
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

// ===== COMPONENT =====
export function IssueDocumentModal({
  isOpen,
  onClose,
  templateId,
  documentName = "",
  documentType,
}: IssueDocumentModalProps) {
  const [selectedDocType, setSelectedDocType] = useState<string>("");
  const [selectedInterestId, setSelectedInterestId] = useState<string>("");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [issueMethod, setIssueMethod] = useState<IssueMethod>("email");

  const [studentSearch, setStudentSearch] = useState("");
  const [interestSearch, setInterestSearch] = useState("");

  // Email fields
  const [recipientsEmail, setRecipientsEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  // ── API hooks ─────────────────────────────────────────────────────────────────
  const { data: studentsData, isLoading: studentsLoading } = useGetStudents({
    search: studentSearch,
    size: 50,
  });

  const { data: coursesData, isLoading: coursesLoading } = useGetCourses({
    search: interestSearch,
    size: 50,
  });

  const { data: batchesData, isLoading: batchesLoading } = useGetBatches({
    search: interestSearch,
    size: 50,
  });

  const { mutateAsync: issueDocument, isPending: isIssuing } = useIssueDocument();

  // Format Interest Options (Courses + Batches)
  const interestOptions = useMemo(() => {
    const courses = coursesData?.results?.map((c) => ({
      value: `course:${c.id}`,
      label: c.name,
      subLabel: "Course",
    })) || [];

    const batches = batchesData?.results?.map((b) => ({
      value: `batch:${b.id}`,
      label: b.name,
      subLabel: `Batch • ${b.category}`,
    })) || [];

    return [...batches, ...courses];
  }, [coursesData, batchesData]);

  // Format Student Options
  const studentOptions = useMemo(() => {
    return studentsData?.results?.map((s) => ({
      value: s.user_id,
      label: s.full_name,
      subLabel: s.email,
      avatarInitials: s.full_name.charAt(0).toUpperCase(),
    })) || [];
  }, [studentsData]);

  // Sync document type from props if available
  useEffect(() => {
    if (documentType) {
      setSelectedDocType(documentType);
    }
  }, [documentType]);

  // Initialize subject when document name changes
  useEffect(() => {
    if (isOpen && documentName) {
      setEmailSubject(documentName);
    }
  }, [isOpen, documentName]);

  // Auto-fill email when student is selected
  useEffect(() => {
    if (selectedStudentId) {
      const student = studentsData?.results?.find((s) => s.user_id === selectedStudentId);

      if (student?.email) {
        setRecipientsEmail(student.email);
      }
    }
  }, [selectedStudentId, studentsData]);

  const handleClearAll = () => {
    setSelectedDocType(documentType || "");
    setSelectedInterestId("");
    setSelectedStudentId("");
    setIssueMethod("email");
    setRecipientsEmail("");
    setEmailSubject(documentName);
    setEmailBody("");
    setStudentSearch("");
    setInterestSearch("");
  };

  const handleIssue = async () => {
    if (!templateId || !selectedStudentId) return;

    let batchId = undefined;
    let courseId = undefined;

    if (selectedInterestId.startsWith("batch:")) {
      batchId = selectedInterestId.replace("batch:", "");
    } else if (selectedInterestId.startsWith("course:")) {
      courseId = selectedInterestId.replace("course:", "");
    }

    const methodMap: Record<IssueMethod, "EMAIL" | "PRINT" | "BOTH" | "DASHBOARD"> = {
      email: "EMAIL",
      print: "PRINT",
      both: "BOTH",
      "student-dashboard": "DASHBOARD",
    };

    try {
      await issueDocument({
        template_id: templateId,
        student_user_id: selectedStudentId,
        batch_id: batchId,
        course_id: courseId,
        issued_method: methodMap[issueMethod],
        email_recipient: recipientsEmail || undefined,
        email_subject: emailSubject || undefined,
        email_body: emailBody || undefined,
      });
      handleClose();
    } catch {
      // toast handled in hook
    }
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
        animateChildren
        className="flex w-[95%] max-h-[90vh] max-w-[704px] flex-col rounded-[12px] border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] gap-0 sm:rounded-[12px] overflow-hidden [&>button]:hidden"
      >
        {/* Header (Static) */}
        <motion.div
          variants={itemVariants}
          className="flex shrink-0 items-center justify-between border-b border-[#E2E8F0] pb-4"
        >
          <DialogTitle className="text-lg font-semibold leading-[30px] text-[#0F172B]">
            Issue Document
          </DialogTitle>
          <button
            title="Close"
            type="button"
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-transparent shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-slate-50"
          >
            <X className="h-4 w-4 text-[#64748B]" />
          </button>
        </motion.div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto pr-1 py-4 scrollbar-hide">
          <div className="flex flex-col gap-6">
            
            {/* Row 1: Document Name & Type */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <FieldLabel required>Document Name</FieldLabel>
                <Input
                  value={documentName}
                  readOnly
                  className={cn(AUTH_INPUT.base, "bg-[#F8FAFC] border-transparent cursor-default pointer-events-none text-[#45556C]")}
                />
              </div>

              <div>
                <FieldLabel required>Document Type</FieldLabel>
                <Select value={selectedDocType} onValueChange={setSelectedDocType}>
                  <SelectTrigger className={cn(AUTH_INPUT.base, "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic")}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="z-[99999999]">
                    {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>

            {/* Row 2: Batch & Student Select */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <FieldLabel required>Batch/Course Name</FieldLabel>
                <SearchableSelect
                  options={interestOptions}
                  value={selectedInterestId}
                  onChange={setSelectedInterestId}
                  onSearchChange={setInterestSearch}
                  searchValue={interestSearch}
                  placeholder="Select Batch/Course"
                  isLoading={batchesLoading || coursesLoading}
                />
              </div>

              <div>
                <FieldLabel required>Select Student</FieldLabel>
                <SearchableSelect
                  options={studentOptions}
                  value={selectedStudentId}
                  onChange={setSelectedStudentId}
                  onSearchChange={setStudentSearch}
                  searchValue={studentSearch}
                  placeholder="Select Student"
                  isLoading={studentsLoading}
                />
              </div>
            </motion.div>

            {/* Row 3: Issue Method */}
            <motion.div variants={itemVariants} className="space-y-3">
              <FieldLabel>Issue Method</FieldLabel>
              <div className="flex items-center gap-6">
                {(["email", "print", "both", "student dashboard"] as const).map((method) => {
                  const methodValue = method === "student dashboard" ? "student-dashboard" : method;
                  
                  return (
                    <label key={methodValue} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="issueMethod"
                        value={methodValue}
                        checked={issueMethod === methodValue}
                        onChange={() => setIssueMethod(methodValue as IssueMethod)}
                        className="h-4 w-4 accent-[#0F172B] cursor-pointer"
                      />
                      <span className="text-sm font-normal text-[#314158] leading-5 font-inter capitalize">
                        {method}
                      </span>
                    </label>
                  );
                })}
              </div>
            </motion.div>

            {/* Separator conditionally rendered if email is shown */}
            <AnimatePresence>
              {showEmailSection && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="h-[1px] bg-[#E2E8F0] w-full my-2" />
                  
                  {/* For Emails Block */}
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

                    {/* Attach as PDF removed - no backend mapping */}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer (Static) */}
        <motion.div
          variants={itemVariants}
          className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]"
        >
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
            disabled={isIssuing || !selectedStudentId}
            className={cn(BUTTON_STYLES.primary.md)}
          >
            {isIssuing ? "Issuing..." : "Issue Document"}
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
