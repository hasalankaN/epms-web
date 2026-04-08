"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";

import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Maximize2, RotateCcw, Grid3X3, Loader2, Plus, Trash2 } from "lucide-react";
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
import { COLORS, AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";
import { useUploadFile } from "@/hooks/api/files/useUploadFile";
import { useCreateDocumentTemplate } from "@/hooks/api/documents/useCreateDocumentTemplate";
import { useGetCourses } from "@/hooks/api/courses/useGetCourses";
import { useGetBatches } from "@/hooks/api/batches/useGetBatches";
import type { ApiDocumentType, TemplateAssignmentDto } from "@/types/document";
import { DOCUMENT_TYPE_LABELS } from "@/types/document";
import { SearchableSelect } from "@/components/ui/searchable-select";

import {
  type DocFieldPositions,
  type DocFieldState,
  PREDEFINED_DOC_FIELDS,
  DEFAULT_SAMPLE_VALUES,
  createDefaultFieldState,
  generateCustomFieldKey,
  GRID_DENSITY_OPTIONS,
  ToggleSwitch,
  GridOverlay,
  DocPreviewFields,
  DocFieldPropertiesPanel,
} from "./document-editor-shared";
import { DocExpandedPreviewModal } from "./DocExpandedPreviewModal";

// ─── Sub-components ──────────────────────────────────────────────────────────

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

// ===== ANIMATION VARIANTS =====
const sidePanelVariants = {
  hidden: { x: "100%" },
  show: {
    x: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 200,
      staggerChildren: 0.08,
      delayChildren: 0.35,
    },
  },
  exit: { x: "100%" },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

// ===== DOCUMENT TYPE OPTIONS =====
const DOCUMENT_TYPE_OPTIONS: { value: ApiDocumentType; label: string }[] = Object.entries(
  DOCUMENT_TYPE_LABELS
).map(([value, label]) => ({ value: value as ApiDocumentType, label }));

export function AddDocumentPanel({ isOpen, onClose }: AddDocumentPanelProps) {
  // ── Form state ──────────────────────────────────────────────────────────────
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState<ApiDocumentType | "">("");
  const [price, setPrice] = useState("");
  const [assignments, setAssignments] = useState<TemplateAssignmentDto[]>([]);

  // ── Editor state ─────────────────────────────────────────────────────────────
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [loadingStep, setLoadingStep] = useState<"idle" | "template" | "creating">("idle");

  const [fieldPositions, setFieldPositions] = useState<DocFieldPositions>({});

  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [snapEnabled, setSnapEnabled] = useState(false);
  const [gridVisible, setGridVisible] = useState(true);
  const [gridDensity, setGridDensity] = useState(10);
  const [showSampleValues, setShowSampleValues] = useState(false);
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isExpandedPreviewOpen, setIsExpandedPreviewOpen] = useState(false);
  const [interestSearch, setInterestSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── API hooks ─────────────────────────────────────────────────────────────────
  const { mutateAsync: uploadFileAsync } = useUploadFile();
  const { mutateAsync: createTemplateAsync } = useCreateDocumentTemplate();

  const { data: coursesData, isLoading: coursesLoading } = useGetCourses({
    size: 50,
    search: interestSearch,
  });

  const { data: batchesData, isLoading: batchesLoading } = useGetBatches({
    size: 50,
    search: interestSearch,
  });

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

  // Track container width for proportional font scaling
  useEffect(() => {
    const el = containerRef.current;

    if (!el) return;

    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });

    ro.observe(el);

    return () => ro.disconnect();
  }, [previewUrl]);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setDocumentName("");
      setDocumentType("");
      setPrice("");
      setAssignments([]);
      setIsDirty(false);
      setShowDiscardModal(false);
      setPreviewUrl(null);
      setFileType(null);
      setSelectedFileName("");
      setTemplateFile(null);
      setLoadingStep("idle");
      setSelectedField(null);
      setSnapEnabled(false);
      setGridVisible(true);
      setGridDensity(10);
      setShowSampleValues(false);
      setImageAspectRatio(null);
      setFieldPositions({});
      setInterestSearch("");
    }
  }, [isOpen]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    setSelectedFileName(file.name);
    setFileType(file.type);
    setTemplateFile(file);
    markDirty();
    setImageAspectRatio(null);
    const objectUrl = URL.createObjectURL(file);

    setPreviewUrl(objectUrl);
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleCreate = async () => {
    // ── Validation ──────────────────────────────────────────────────────────
    if (!documentName.trim()) {
      toast.error("Please enter a document name");

      return;
    }

    if (!documentType) {
      toast.error("Please select a document type");

      return;
    }

    try {
      // ── 1. Upload template file (if present) ─────────────────────────────
      let templateImageUrl: string | undefined;

      if (templateFile) {
        setLoadingStep("template");
        const templateUpload = await uploadFileAsync({ file: templateFile });

        templateImageUrl = templateUpload.data.url;
      }

      // ── 2. Convert field positions to API format ─────────────────────────
      const fields = Object.entries(fieldPositions).map(([, state]) => ({
        field_type: state.field_type,
        label: state.label,
        x_position: Math.round(state.x * 10) / 10,
        y_position: Math.round(state.y * 10) / 10,
        font_size: state.fontSize,
      }));

      // ── 3. Create document template ──────────────────────────────────────
      setLoadingStep("creating");
      const parsedPrice = parseFloat(price);

      await createTemplateAsync({
        name: documentName.trim(),
        document_type: documentType,
        template_image_url: templateImageUrl,
        price: !isNaN(parsedPrice) && parsedPrice >= 0 ? parsedPrice : undefined,
        fields,
        assignments: assignments.length > 0 ? assignments : undefined,
      });

      onClose();
    } catch {
      // Errors already shown by the individual hooks via toast
    } finally {
      setLoadingStep("idle");
    }
  };

  const handlePositionChange = useCallback(
    (key: string, x: number, y: number) => {
      setFieldPositions((prev) => ({
        ...prev,
        [key]: { ...prev[key], x, y },
      }));
      markDirty();
    },
    [markDirty]
  );

  const handleFieldUpdate = useCallback(
    (key: string, updates: Partial<DocFieldState>) => {
      setFieldPositions((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          ...updates,
        },
      }));
      markDirty();
    },
    [markDirty]
  );

  const handleResetPositions = useCallback(() => {
    setFieldPositions({});
    setSelectedField(null);
    markDirty();
  }, [markDirty]);

  const handleDeselectField = useCallback(() => {
    setSelectedField(null);
  }, []);

  const handleTogglePredefinedField = useCallback((fieldKey: string) => {
    setFieldPositions((prev) => {
      const next = { ...prev };

      if (next[fieldKey]) {
        // Remove it if it exists
        delete next[fieldKey];
        if (selectedField === fieldKey) setSelectedField(null);
      } else {
        // Add it if it doesn't
        const predefined = PREDEFINED_DOC_FIELDS.find((f) => f.key === fieldKey);

        if (predefined) {
          next[fieldKey] = {
            ...createDefaultFieldState(predefined.field_type, predefined.label),
            sampleValue: DEFAULT_SAMPLE_VALUES[fieldKey] || "",
          };
          setSelectedField(fieldKey);
        }
      }

      return next;
    });
    markDirty();
  }, [selectedField, markDirty]);

  const handleAddCustomField = useCallback(() => {
    const customKey = generateCustomFieldKey();

    setFieldPositions((prev) => ({
      ...prev,
      [customKey]: createDefaultFieldState("CUSTOM", "Custom"),
    }));
    setSelectedField(customKey);
    markDirty();
  }, [markDirty]);

  const handleRemoveField = useCallback((fieldKey: string) => {
    setFieldPositions((prev) => {
      const next = { ...prev };

      delete next[fieldKey];

      return next;
    });
    if (selectedField === fieldKey) setSelectedField(null);
    markDirty();
  }, [selectedField, markDirty]);

  // ── Assignment helpers ────────────────────────────────────────────────────
  const handleAddAssignment = () => {
    setAssignments((prev) => [...prev, {}]);
    markDirty();
  };

  const handleRemoveAssignment = (index: number) => {
    setAssignments((prev) => prev.filter((_, i) => i !== index));
    markDirty();
  };

  const handleAssignmentChange = (index: number, combinedId: string) => {
    const isBatch = combinedId.startsWith("batch:");
    const actualId = combinedId.split(":")[1];

    setAssignments((prev) =>
      prev.map((a, i) =>
        i === index
          ? {
              ...a,
              course_id: isBatch ? undefined : actualId,
              batch_id: isBatch ? actualId : undefined,
            }
          : a
      )
    );
    markDirty();
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
                variants={sidePanelVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="fixed right-0 top-0 z-[99999] flex h-screen w-full max-w-[540px] flex-col bg-white shadow-2xl"
                style={{
                  borderLeft: "1px solid #E2E8F0",
                  borderRadius: "8px 0 0 8px",
                  boxShadow:
                    "0 4px 6px -4px rgba(16, 24, 40, 0.10), 0 10px 15px -3px rgba(0, 0, 0, 0.10)",
                }}
              >
                {/* Header */}
                <motion.div 
                  variants={itemVariants} 
                  className={`flex items-center justify-between border-b border-[${COLORS.line}] px-6 py-4 shrink-0`}
                >
                  <h2 className={`text-lg font-semibold leading-[30px] text-[${COLORS.slate900}]`}>
                    New Document
                  </h2>
                  <button
                    type="button"
                    title="close"
                    onClick={handleCloseAttempt}
                    className={`flex h-8 w-8 items-center justify-center rounded-md border border-[${COLORS.line}] bg-transparent shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-slate-50`}
                  >
                    <X className={`h-4 w-4 text-[${COLORS.slate600}]`} />
                  </button>
                </motion.div>

                {/* Scrollable Content */}
                <motion.div 
                  variants={itemVariants}
                  className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide"
                >
                  <div className="flex flex-col gap-6">
                    {/* Document Name */}
                    <div className="space-y-1">
                      <FieldLabel required>Document Name</FieldLabel>
                      <Input
                        className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                        placeholder="e.g. Enrollment Letter 2026"
                        value={documentName}
                        onChange={(e) => { setDocumentName(e.target.value); markDirty(); }}
                      />
                    </div>

                    {/* Document Type */}
                    <div className="space-y-1">
                      <FieldLabel required>Document Type</FieldLabel>
                      <Select
                        value={documentType}
                        onValueChange={(v) => { setDocumentType(v as ApiDocumentType); markDirty(); }}
                      >
                        <SelectTrigger
                          className={cn(
                            AUTH_INPUT.base,
                            "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic"
                          )}
                        >
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent className="z-[99999999]">
                          {DOCUMENT_TYPE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Assign Price */}
                    <div className="space-y-1">
                      <FieldLabel>Assign Price</FieldLabel>
                      <div className="relative">
                        <Input
                          className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "pr-16")}
                          placeholder="e.g. 5000"
                          type="number"
                          min={0}
                          value={price}
                          onChange={(e) => { setPrice(e.target.value); markDirty(); }}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <span className={`text-sm font-semibold text-[${COLORS.slate800}]`}>LKR</span>
                          <ChevronDown className={`h-3 w-3 text-[${COLORS.slate900}]`} />
                        </div>
                      </div>
                    </div>

                    {/* Assign Course/Batch */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FieldLabel>Assign Course/Batch</FieldLabel>
                        <button
                          type="button"
                          onClick={handleAddAssignment}
                          className={`flex items-center gap-1 text-xs font-medium text-[${COLORS.pink600}] hover:text-[${COLORS.pink500}] transition-colors`}
                        >
                          <Plus className="h-3.5 w-3.5" /> Add
                        </button>
                      </div>
                      {assignments.length === 0 && (
                        <p className={`text-[12px] italic text-[${COLORS.slate400}]`}>
                          No assignments added yet. Click &quot;Add&quot; to link to courses.
                        </p>
                      )}
                      {assignments.map((assignment, index) => {
                        const combinedValue = assignment.batch_id
                          ? `batch:${assignment.batch_id}`
                          : assignment.course_id
                            ? `course:${assignment.course_id}`
                            : "";

                        return (
                          <div key={index} className="flex w-full items-center gap-2">
                            <div className="flex-1 min-w-0">
                              <SearchableSelect
                                options={interestOptions}
                                value={combinedValue}
                                onChange={(val) => handleAssignmentChange(index, val)}
                                onSearchChange={setInterestSearch}
                                searchValue={interestSearch}
                                placeholder="Select Course or Batch"
                                searchPlaceholder="Search interested course or batch..."
                                isLoading={coursesLoading || batchesLoading}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveAssignment(index)}
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-red-200 bg-white text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Upload the template */}
                    <div className="space-y-1">
                      <FieldLabel required>Upload the template</FieldLabel>
                      <button
                        type="button"
                        onClick={handleChooseFile}
                        className={cn(
                          `flex h-10 w-full items-center rounded-md border border-[${COLORS.line}] bg-white px-4 text-sm font-medium text-[${COLORS.slate900}] shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-slate-50 text-left`
                        )}
                      >
                        {selectedFileName ? (
                          <span className={`truncate text-[${COLORS.slate900}]`}>{selectedFileName}</span>
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

                    {/* ───── Editor Controls Toolbar ───── */}
                    {previewUrl && fileType !== "application/pdf" && (
                      <div className={`rounded-lg border border-[${COLORS.line}] bg-white p-3 space-y-3`}>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold text-[${COLORS.slate900}] uppercase tracking-wide`}>
                            Editor Controls
                          </span>
                          <button
                            type="button"
                            onClick={handleResetPositions}
                            className={`flex items-center gap-1 text-xs font-medium text-[${COLORS.slate600}] hover:text-[${COLORS.pink600}] transition-colors`}
                          >
                            <RotateCcw className="h-3 w-3" />
                            Reset All
                          </button>
                        </div>

                        {/* Toggles row */}
                        <div className="flex flex-wrap items-center gap-4">
                          <ToggleSwitch
                            id="doc-grid-toggle"
                            checked={gridVisible}
                            onChange={setGridVisible}
                            label="Show Grid"
                          />
                          <ToggleSwitch
                            id="doc-snap-toggle"
                            checked={snapEnabled}
                            onChange={setSnapEnabled}
                            label="Align to Grid"
                          />
                          <ToggleSwitch
                            id="doc-preview-values-toggle"
                            checked={showSampleValues}
                            onChange={setShowSampleValues}
                            label="Preview Values"
                          />
                        </div>

                        {/* Grid density */}
                        {gridVisible && (
                          <div className="flex items-center gap-2">
                            <Grid3X3 className={`h-3.5 w-3.5 text-[${COLORS.slate600}]`} />
                            <span className={`text-xs text-[${COLORS.slate600}]`}>Density:</span>
                            <div className="flex gap-1">
                              {GRID_DENSITY_OPTIONS.map((opt) => (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => setGridDensity(opt.value)}
                                  className={cn(
                                    "px-2 py-0.5 rounded text-[10px] font-medium border transition-colors",
                                    gridDensity === opt.value
                                      ? `bg-[${COLORS.slate900}] text-white border-[${COLORS.slate900}]`
                                      : `bg-white text-[${COLORS.slate600}] border-[${COLORS.line}] hover:bg-slate-50`
                                  )}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Preview */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FieldLabel>Preview</FieldLabel>
                        {previewUrl && fileType !== "application/pdf" && (
                          <button
                            type="button"
                            onClick={() => setIsExpandedPreviewOpen(true)}
                            className={`hidden sm:flex items-center gap-1.5 text-[13px] font-medium text-[${COLORS.pink600}] hover:text-[${COLORS.pink500}] transition-colors`}
                          >
                            <Maximize2 className="h-4 w-4" />
                            Expand Preview
                          </button>
                        )}
                      </div>
                      <div
                        className={cn(
                          `rounded-md border border-dashed border-[${COLORS.line}] bg-[${COLORS.slate100}] overflow-hidden`,
                          (!previewUrl || fileType === "application/pdf")
                            ? "flex flex-col items-center justify-center"
                            : ""
                        )}
                        style={{
                          ...(imageAspectRatio && fileType !== "application/pdf"
                            ? { aspectRatio: String(imageAspectRatio) }
                            : { minHeight: "180px" }
                          ),
                          padding: fileType === "application/pdf" ? "0px" : undefined,
                        }}
                        onClick={handleDeselectField}
                      >
                        {!previewUrl && (
                          <p className={`text-[13px] italic text-[${COLORS.slate400}] text-center`}>
                            Upload a template to see a preview here
                          </p>
                        )}
                        {previewUrl && fileType === "application/pdf" && (
                          <iframe
                            src={previewUrl}
                            className="w-full h-full border-none rounded-md"
                            title="Document PDF Preview"
                            style={{ minHeight: "180px" }}
                          />
                        )}
                        {previewUrl && fileType !== "application/pdf" && (
                          <div
                            ref={containerRef}
                            className="relative w-full h-full"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="block w-full h-auto pointer-events-none"
                              draggable={false}
                              onLoad={(e) => {
                                const img = e.currentTarget;

                                setImageAspectRatio(img.naturalWidth / img.naturalHeight);
                              }}
                              onClick={handleDeselectField}
                            />
                            <GridOverlay visible={gridVisible} density={gridDensity} />
                            <DocPreviewFields
                              fieldPositions={fieldPositions}
                              onPositionChange={handlePositionChange}
                              containerRef={containerRef}
                              selectedField={selectedField}
                              onSelectField={(key) => { setSelectedField(key); }}
                              snapEnabled={snapEnabled}
                              gridDensity={gridDensity}
                              showSampleValues={showSampleValues}
                              containerWidth={containerWidth}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ───── Selected Field Properties Panel ───── */}
                    {selectedField && previewUrl && fileType !== "application/pdf" && (
                      <DocFieldPropertiesPanel
                        fieldKey={selectedField}
                        fieldState={fieldPositions[selectedField]}
                        onUpdate={handleFieldUpdate}
                      />
                    )}


                    {/* Field quick-select chips */}
                    {previewUrl && fileType !== "application/pdf" && (
                      <div className="space-y-2">
                        <span className={`text-xs font-medium text-[${COLORS.slate600}]`}>
                          Add or select fields:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {PREDEFINED_DOC_FIELDS.map((field) => {
                            const isActive = !!fieldPositions[field.key];
                            const isSelected = selectedField === field.key;

                            return (
                              <button
                                key={field.key}
                                type="button"
                                onClick={() => {
                                  if (isActive) {
                                    if (isSelected) {
                                      // If active and selected, just deselect
                                      setSelectedField(null);
                                    } else {
                                      // If active but NOT selected, select it
                                      setSelectedField(field.key);
                                    }
                                  } else {
                                    // If NOT active, turn it on and select it
                                    handleTogglePredefinedField(field.key);
                                  }
                                }}
                                className={cn(
                                  "px-2.5 py-1 rounded-full text-xs font-medium border transition-all flex items-center gap-1",
                                  isSelected
                                    ? `bg-[${COLORS.pink600}] text-white border-[${COLORS.pink600}] shadow-sm`
                                    : isActive
                                      ? "bg-[#FDF2F8] text-[#E60076] border-[#FBCFE8] hover:bg-[#FCE7F3]"
                                      : `bg-white text-[${COLORS.slate700}] border-[${COLORS.line}] hover:border-[${COLORS.slate400}] hover:bg-slate-50`
                                )}
                              >
                                {field.label}
                                {isActive && (
                                  <span
                                    title="Remove field"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleTogglePredefinedField(field.key);
                                    }}
                                    className={cn(
                                      "ml-1 p-0.5 rounded-full hover:bg-black/10 transition-colors",
                                      isSelected ? "text-white" : `text-[${COLORS.pink600}]`
                                    )}
                                  >
                                    <X className="h-3 w-3" />
                                  </span>
                                )}
                              </button>
                            );
                          })}
                          
                          {/* Active Custom Fields */}
                          {Object.entries(fieldPositions)
                            .filter(([, state]) => state.field_type === "CUSTOM")
                            .map(([key, state]) => {
                              const isSelected = selectedField === key;

                              return (
                                <button
                                  key={key}
                                  type="button"
                                  onClick={() => setSelectedField(isSelected ? null : key)}
                                  className={cn(
                                    "px-2.5 py-1 rounded-full text-xs font-medium border transition-all flex items-center gap-1",
                                    isSelected
                                      ? `bg-[${COLORS.pink600}] text-white border-[${COLORS.pink600}] shadow-sm`
                                      : `bg-[#F3F4F6] text-[#374151] border-[#D1D5DB] hover:bg-[#E5E7EB]`
                                  )}
                                >
                                  {state.label || "Custom"}
                                  <span
                                    title="Remove custom field"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveField(key);
                                    }}
                                    className={cn(
                                      "ml-1 p-0.5 rounded-full hover:bg-black/10 transition-colors",
                                      isSelected ? "text-white" : "text-[#4B5563]"
                                    )}
                                  >
                                    <X className="h-3 w-3" />
                                  </span>
                                </button>
                              );
                            })}

                          {/* Add Custom Field Button */}
                          <button
                            type="button"
                            onClick={handleAddCustomField}
                            className={`px-2.5 py-1 rounded-full text-xs font-medium border border-dashed border-[${COLORS.line}] bg-white text-[${COLORS.slate700}] hover:border-[${COLORS.slate400}] hover:bg-slate-50 transition-all flex items-center gap-1`}
                          >
                            <Plus className="h-3 w-3" /> Add Custom
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Footer */}
                <motion.div 
                  variants={itemVariants}
                  className={`flex items-center justify-end gap-3 border-t border-[${COLORS.line}] px-6 py-4 shrink-0`}
                >
                  <Button
                    onClick={handleCreate}
                    disabled={loadingStep !== "idle"}
                    className={cn(
                      BUTTON_STYLES.primary.full,
                      "w-auto px-[38.5px] text-sm font-semibold text-white"
                    )}
                  >
                    {loadingStep !== "idle" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {loadingStep === "template" && "Uploading Template..."}
                        {loadingStep === "creating" && "Creating..."}
                      </>
                    ) : (
                      "Create"
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </Portal>

      {/* Expanded Preview Modal */}
      {previewUrl && fileType !== "application/pdf" && (
        <DocExpandedPreviewModal
          open={isExpandedPreviewOpen}
          onOpenChange={setIsExpandedPreviewOpen}
          previewUrl={previewUrl}
          fieldPositions={fieldPositions}
          onPositionChange={handlePositionChange}
          onFieldUpdate={handleFieldUpdate}
          onResetPositions={handleResetPositions}
          selectedField={selectedField}
          onSelectField={setSelectedField}
          snapEnabled={snapEnabled}
          onSnapChange={setSnapEnabled}
          gridVisible={gridVisible}
          onGridVisibleChange={setGridVisible}
          gridDensity={gridDensity}
          onGridDensityChange={setGridDensity}
          showSampleValues={showSampleValues}
          onShowSampleValuesChange={setShowSampleValues}
          onTogglePredefinedField={handleTogglePredefinedField}
          onAddCustomField={handleAddCustomField}
          onRemoveField={handleRemoveField}
        />
      )}

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
