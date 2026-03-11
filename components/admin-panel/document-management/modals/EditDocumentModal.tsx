"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

import { X, Grid3X3 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";

import { cn } from "@/lib/utils";
import { AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";
import type { DocumentTemplateRow } from "@/types/document";

interface EditDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentTemplateRow | null;
}

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
    {required && <span className="ml-0.5 text-[#E60076] font-bold">*</span>}
  </Label>
);

export function EditDocumentModal({ isOpen, onClose, document }: EditDocumentModalProps) {
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [batchId, setBatchId] = useState("");
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  useEffect(() => {
    if (isOpen && document) {
      setDocumentName(document.documentName || "");
      setDocumentType(document.documentType || "");
      setBatchId(String(document.assignedCoursesBatches || ""));
      
      setPreviewUrl("https://placehold.co/800x1131/f8fafc/94a3b8?text=Document+Template");
      setFileType("image/png");
      setSelectedFileName(`${document.documentName || "Existing"} Template.pdf`);
      
      setIsDirty(false);
      setShowDiscardModal(false);
    }
  }, [isOpen, document]);

  const markDirty = useCallback(() => {
    setIsDirty((prev) => (prev ? prev : true));
  }, []);

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

  const handleUpdate = () => {
    toast.success("Document template updated successfully");
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    
    setSelectedFileName(file.name);
    setFileType(file.type);
    markDirty();

    const objectUrl = URL.createObjectURL(file);

    setPreviewUrl(objectUrl);
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen || !document) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseAttempt()}>
        <DialogContent className="flex max-h-[90vh] w-[95%] max-w-[900px] flex-col gap-4 overflow-hidden rounded-lg sm:rounded-[12px] border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] [&>button]:hidden">
          
          {/* Header */}
          <div className="flex flex-col gap-4 shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex-1 text-lg font-bold leading-[30px] text-[#0F172B]">
                Edit Document
              </DialogTitle>
              <button
                title="Close"
                onClick={handleCloseAttempt}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-transparent shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-slate-50"
              >
                <X className="h-4 w-4 text-[#64748B]" />
              </button>
            </div>
            <div className="border-b border-[#E2E8F0]" />
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto pr-1 py-1 scrollbar-hide">
            <div className="flex flex-col gap-6">

              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1">
                  <FieldLabel required>Document Name</FieldLabel>
                  <Input
                    value={documentName}
                    onChange={(e) => { setDocumentName(e.target.value); markDirty(); }}
                    className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                  />
                </div>

                <div className="space-y-1">
                  <FieldLabel required>Document Type</FieldLabel>
                  <Select value={documentType} onValueChange={(v) => { setDocumentType(v); markDirty(); }}>
                    <SelectTrigger className={cn(AUTH_INPUT.base, "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic")}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="z-[99999999]">
                      {documentType && !["type-1", "type-2"].includes(documentType) && (
                        <SelectItem value={documentType}>{documentType}</SelectItem>
                      )}
                      <SelectItem value="type-1">Type 01</SelectItem>
                      <SelectItem value="type-2">Type 02</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1">
                  <FieldLabel required>Assign Batch/Course</FieldLabel>
                  <Select value={batchId} onValueChange={(v) => { setBatchId(v); markDirty(); }}>
                    <SelectTrigger className={cn(AUTH_INPUT.base, "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic")}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="z-[99999999]">
                      {batchId && !["batch-1", "batch-2"].includes(batchId) && (
                        <SelectItem value={batchId}>{batchId}</SelectItem>
                      )}
                      <SelectItem value="batch-1">Batch 01</SelectItem>
                      <SelectItem value="batch-2">Batch 02</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <FieldLabel required>Upload the template</FieldLabel>
                  <div className="relative flex items-center h-10 w-full rounded-md border border-[#E2E8F0] bg-white overflow-hidden shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] focus-within:ring-1 focus-within:ring-slate-950 focus-within:border-slate-950">
                    <button
                      type="button"
                      onClick={handleChooseFile}
                      className="h-full px-4 text-sm font-semibold text-[#0F172B] hover:bg-slate-50 transition-colors border-r border-[#E2E8F0] whitespace-nowrap"
                    >
                      Choose file
                    </button>
                    <div className="flex-1 px-3 truncate text-sm text-[#45556C]">
                      {selectedFileName || "No file chosen"}
                    </div>
                  </div>
                  <input
                    title="Choose File"
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    accept="image/png,image/jpeg,image/webp,.html,.pdf"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

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
                    <p className="text-[13px] italic text-[#90A1B9] text-center w-full flex flex-col items-center gap-2">
                      <Grid3X3 className="h-8 w-8 text-[#CBD5E1]" />
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
          <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0] shrink-0">
            <Button
              type="button"
              onClick={handleUpdate}
              className={cn(BUTTON_STYLES.primary.md)}
            >
              Update
            </Button>
          </div>

        </DialogContent>
      </Dialog>
      
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
