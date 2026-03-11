"use client";

import React, { useState, useEffect, useRef } from "react";

import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";

interface AddDocumentPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const Portal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(children, document.body);
};

const FieldLabel = ({
  children,
  required = false,
  className,
}: {
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) => (
  <Label className={cn(AUTH_TYPOGRAPHY.label, "mb-1.5 block", className)}>
    {children}
    {required && <span className="ml-0.5 text-red-500">*</span>}
  </Label>
);

export function AddDocumentPanel({ isOpen, onClose }: AddDocumentPanelProps) {
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setIsDirty(false);
      setShowDiscardModal(false);
      setPreviewUrl(null);
      setFileType(null);
      setSelectedFileName("");
    }
  }, [isOpen]);

  const handleCloseAttempt = () => {
    if (isDirty) {
      setShowDiscardModal(true);
    } else {
      onClose();
    }
  };

  const handleConfirmDiscard = () => {
    setShowDiscardModal(false);
    onClose();
  };

  const handleInputChange = () => {
    if (!isDirty) setIsDirty(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFileName(file.name);
    setFileType(file.type);
    handleInputChange();

    const objectUrl = URL.createObjectURL(file);

    setPreviewUrl(objectUrl);
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleCreate = () => {
    toast.success("Document template created successfully");
    onClose();
  };

  return (
    <>
      <Portal>
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseAttempt}
                className="fixed inset-0 z-[99999] bg-black/20 backdrop-blur-sm"
              />

              {/* Side Panel */}
              <motion.div
                key="panel"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 z-[99999] flex h-screen w-full max-w-[500px] flex-col bg-white shadow-2xl"
                style={{
                  borderLeft: "1px solid #E2E8F0",
                  borderRadius: "8px 0 0 8px",
                  boxShadow:
                    "0 4px 6px -4px rgba(16, 24, 40, 0.10), 0 10px 15px -3px rgba(0, 0, 0, 0.10)",
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4">
                  <h2 className="text-lg font-semibold leading-[30px] text-[#0F172B]">
                    New Document
                  </h2>
                  <button
                    title="close"
                    onClick={handleCloseAttempt}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-transparent shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-slate-50"
                  >
                    <X className="h-4 w-4 text-[#64748B]" />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
                  <div className="flex flex-col gap-6">

                    {/* Document Name */}
                    <div className="space-y-1">
                      <FieldLabel required>Document Name</FieldLabel>
                      <Input
                        className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                        placeholder="lorem ipsum"
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Document Type */}
                    <div className="space-y-1">
                      <FieldLabel required>Document Type</FieldLabel>
                      <Select onValueChange={handleInputChange}>
                        <SelectTrigger
                          className={cn(
                            AUTH_INPUT.base,
                            "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic"
                          )}
                        >
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="z-[99999999]">
                          <SelectItem value="enrollment-letter">Enrollment Letter</SelectItem>
                          <SelectItem value="completion-letter">Completion Letter</SelectItem>
                          <SelectItem value="recommendation-letter">Recommendation Letter</SelectItem>
                          <SelectItem value="transcript">Transcript</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Assign Batch / Course */}
                    <div className="space-y-1">
                      <FieldLabel required>Assign Batch/Course</FieldLabel>
                      <Select onValueChange={handleInputChange}>
                        <SelectTrigger
                          className={cn(
                            AUTH_INPUT.base,
                            "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic"
                          )}
                        >
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="z-[99999999]">
                          <SelectItem value="batch-a">Batch A — Digital Marketing</SelectItem>
                          <SelectItem value="batch-b">Batch B — UI/UX Design</SelectItem>
                          <SelectItem value="batch-c">Batch C — Web Development</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Upload the template */}
                    <div className="space-y-1">
                      <FieldLabel required>Upload the template</FieldLabel>
                      <button
                        type="button"
                        onClick={handleChooseFile}
                        className={cn(
                          "flex h-10 w-full items-center rounded-md border border-[#E2E8F0] bg-white px-4 text-sm font-medium text-[#0F172B] shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-slate-50 text-left"
                        )}
                      >
                        {selectedFileName ? (
                          <span className="truncate text-[#0F172B]">{selectedFileName}</span>
                        ) : (
                          "Choose file"
                        )}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,.pdf"
                        className="hidden"
                        onChange={handleFileChange}
                        aria-label="Upload document template"
                        title="Upload document template"
                      />
                    </div>

                    {/* Preview */}
                    <div className="space-y-2">
                      <FieldLabel>Preview</FieldLabel>
                      <div
                        style={{
                          display: "flex",
                          height: "180px",
                          padding: fileType === "application/pdf" ? "0px" : "10px",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "10px",
                          alignSelf: "stretch",
                          borderRadius: "0.375rem",
                          border: "1px dashed #E2E8F0",
                          overflow: "hidden",
                          ...(previewUrl && fileType !== "application/pdf"
                            ? {
                                background: `url(${previewUrl}) lightgray 50% / contain no-repeat`,
                              }
                            : {
                                backgroundColor: fileType === "application/pdf" ? "transparent" : "#F8FAFC",
                              }),
                        }}
                      >
                        {!previewUrl && (
                          <p className="text-[13px] italic text-[#90A1B9] text-center">
                            Upload a template to see a preview here
                          </p>
                        )}
                        {previewUrl && fileType === "application/pdf" && (
                          <iframe
                            src={previewUrl}
                            className="w-full h-full border-none rounded-md"
                            title="PDF Preview"
                          />
                        )}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-[#E2E8F0] px-6 py-4">
                  <Button
                    onClick={handleCreate}
                    className={cn(
                      BUTTON_STYLES.primary.full,
                      "w-auto px-[38.5px] text-sm font-semibold text-white"
                    )}
                  >
                    Create
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </Portal>

      {/* Discard Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onConfirm={handleConfirmDiscard}
        title="Save Your Edits First"
        description="Unsaved changes detected, remember to save your edits before you close!"
        confirmText="Proceed Without Saving"
        cancelText="Go Back and Save"
      />
    </>
  );
}
