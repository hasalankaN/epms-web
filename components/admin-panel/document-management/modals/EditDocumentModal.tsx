"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";

import { X, Maximize2, RotateCcw, Grid3X3, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  motion,
  itemVariants,
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
import { SearchableSelect } from "@/components/ui/searchable-select";

import { cn } from "@/lib/utils";
import { AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";
import { DOCUMENT_TYPE_LABELS, type ApiDocumentType, type TemplateAssignmentDto } from "@/types/document";

import { useGetDocumentTemplateById } from "@/hooks/api/documents/useGetDocumentTemplateById";
import { useUploadFile } from "@/hooks/api/files/useUploadFile";
import { useGetCourses } from "@/hooks/api/courses/useGetCourses";
import { useGetBatches } from "@/hooks/api/batches/useGetBatches";

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

// ── Types ─────────────────────────────────────────────────────────────────────

interface EditDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: string | null;
}

// ── FieldLabel helper ─────────────────────────────────────────────────────────

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

// ── Component ─────────────────────────────────────────────────────────────────

export function EditDocumentModal({ isOpen, onClose, templateId }: EditDocumentModalProps) {
  // ── Form & UI state ───────────────────────────────────────────────────────────
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState<ApiDocumentType | "">("");
  const [price, setPrice] = useState("");
  const [assignments, setAssignments] = useState<TemplateAssignmentDto[]>([]);
  const [interestSearch, setInterestSearch] = useState("");

  // ── Editor state ──────────────────────────────────────────────────────────────
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [rawTemplateFile, setRawTemplateFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [fieldPositions, setFieldPositions] = useState<DocFieldPositions>({});
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [snapEnabled, setSnapEnabled] = useState(false);
  const [gridVisible, setGridVisible] = useState(true);
  const [gridDensity, setGridDensity] = useState(10);
  const [showSampleValues, setShowSampleValues] = useState(true);
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isExpandedPreviewOpen, setIsExpandedPreviewOpen] = useState(false);

  // ── Loading / dirty state ────────────────────────────────────────────────────
  const [loadingStep, setLoadingStep] = useState<"idle" | "template" | "saving">("idle");
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── API ──────────────────────────────────────────────────────────────────────
  const { data: templateData, isLoading: isFetching } = useGetDocumentTemplateById(
    isOpen && templateId ? templateId : null
  );

  const { mutateAsync: uploadFile } = useUploadFile();

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

  // ── Container width tracking ─────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;

    if (!el) return;

    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });

    ro.observe(el);

    return () => ro.disconnect();
  }, [previewUrl, isOpen]);

  // ── Pre-fill when data arrives ───────────────────────────────────────────────
  useEffect(() => {
    if (isOpen && templateData) {
      setDocumentName(templateData.name ?? "");
      setDocumentType(templateData.document_type ?? "");
      setPrice(templateData.current_version?.price
        ? parseFloat(templateData.current_version.price).toString()
        : "");

      const imgUrl = templateData.current_version?.template_image_url ?? null;

      setPreviewUrl(imgUrl);
      setSelectedFileName(imgUrl ? `${templateData.name} Template` : "No file chosen");
      setRawTemplateFile(null);
      setIsExpandedPreviewOpen(false);
      setSelectedField(null);
      setSnapEnabled(false);
      setGridVisible(true);
      setGridDensity(10);
      setShowSampleValues(true);
      setImageAspectRatio(null);
      setIsDirty(false);
      setShowDiscardModal(false);
      setInterestSearch("");

      // ── Assignments ───────────────────────────────────────────────────────────
      setAssignments(templateData.assignments?.map(a => ({
        course_id: a.course_id || undefined,
        batch_id: a.batch_id || undefined
      })) || []);

      // ── Rebuild fieldPositions from API fields ────────────────────────────────
      const newPositions: DocFieldPositions = {};
      const fields = templateData.current_version?.fields ?? [];

      fields.forEach((f) => {
        const predefined = PREDEFINED_DOC_FIELDS.find((p) => p.field_type === f.field_type);
        const key = predefined ? predefined.key : `custom_${f.id}`;

        newPositions[key] = {
          field_type: f.field_type,
          label: f.label,
          x: parseFloat(f.x_position),
          y: parseFloat(f.y_position),
          fontSize: f.font_size,
          sampleValue: predefined ? (DEFAULT_SAMPLE_VALUES[predefined.key] ?? "") : f.label,
        };
      });

      setFieldPositions(newPositions);
    }
  }, [isOpen, templateData]);

  const markDirty = useCallback(() => {
    setIsDirty((prev) => (prev ? prev : true));
  }, []);

  // ── Close guard ───────────────────────────────────────────────────────────────
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

  // ── File change ───────────────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    setRawTemplateFile(file);
    setSelectedFileName(file.name);
    setImageAspectRatio(null);
    markDirty();
    setPreviewUrl(URL.createObjectURL(file));
  };

  // ── Field helpers (same pattern as AddDocumentPanel) ─────────────────────────
  const handlePositionChange = useCallback((key: string, x: number, y: number) => {
    setFieldPositions((prev) => ({ ...prev, [key]: { ...prev[key], x, y } }));
    markDirty();
  }, [markDirty]);

  const handleFieldUpdate = useCallback((key: string, updates: Partial<DocFieldState>) => {
    setFieldPositions((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...updates },
    }));
    markDirty();
  }, [markDirty]);

  const handleResetPositions = useCallback(() => {
    setFieldPositions({});
    setSelectedField(null);
    markDirty();
  }, [markDirty]);

  const handleDeselectField = useCallback(() => setSelectedField(null), []);

  const handleTogglePredefinedField = useCallback((fieldKey: string) => {
    setFieldPositions((prev) => {
      const next = { ...prev };

      if (next[fieldKey]) {
        delete next[fieldKey];
        if (selectedField === fieldKey) setSelectedField(null);
      } else {
        const predefined = PREDEFINED_DOC_FIELDS.find((f) => f.key === fieldKey);

        if (predefined) {
          next[fieldKey] = {
            ...createDefaultFieldState(predefined.field_type, predefined.label),
            sampleValue: DEFAULT_SAMPLE_VALUES[fieldKey] ?? "",
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

  // ── Save ──────────────────────────────────────────────────────────────────────
  const handleUpdate = async () => {
    if (!documentName.trim()) {
      toast.error("Please enter a document name");

      return;
    }

    if (!documentType) {
      toast.error("Please select a document type");

      return;
    }

    try {
      let finalTemplateUrl = previewUrl ?? "";

      if (rawTemplateFile) {
        setLoadingStep("template");
        const res = await uploadFile({ file: rawTemplateFile });

        finalTemplateUrl = res.data.url;
      }

      setLoadingStep("saving");

      const fields = Object.entries(fieldPositions).map(([, state]) => ({
        field_type: state.field_type,
        label: state.label,
        x_position: Math.round(state.x * 10) / 10,
        y_position: Math.round(state.y * 10) / 10,
        font_size: state.fontSize,
      }));

      // TODO: wire to actual update mutation when backend PATCH endpoint is confirmed
      console.log("Update payload:", {
        name: documentName.trim(),
        document_type: documentType,
        price: price ? parseFloat(price) : undefined,
        template_image_url: finalTemplateUrl,
        fields,
        assignments: assignments.length > 0 ? assignments : undefined,
      });

      toast.success("Document template updated successfully");
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingStep("idle");
    }
  };

  if (!isOpen || !templateId) return null;

  const isLoading = loadingStep !== "idle";

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseAttempt()}>
        <DialogContent
          isLoading={isFetching}
          animateChildren={true}
          className="flex max-h-[90vh] w-[95%] max-w-[900px] flex-col gap-4 overflow-hidden rounded-lg sm:rounded-xl border border-[#E2E8F0] bg-white p-4 sm:p-6 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] [&>button]:hidden"
        >
          {/* ── Header ── */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4 shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex-1 flex gap-3 items-center text-lg font-bold leading-[30px] text-[#0F172B]">
                Edit Document Template
                {isFetching && <Loader2 className="h-4 w-4 animate-spin text-[#90A1B9]" />}
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
          </motion.div>

          {/* ── Body (scrollable) ── */}
          <motion.div variants={itemVariants} className="flex-1 overflow-y-auto px-1 pt-4 pb-1 sm:px-2 sm:pt-4 sm:pb-2 scrollbar-hide">
            <div className="flex flex-col gap-6">

              {/* Row 1: Name + Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1">
                  <FieldLabel required>Document Name</FieldLabel>
                  <Input
                    value={documentName}
                    onChange={(e) => { setDocumentName(e.target.value); markDirty(); }}
                    className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                    placeholder="E.g. Student ID Card"
                  />
                </div>

                <div className="space-y-1">
                  <FieldLabel required>Document Type</FieldLabel>
                  <Select
                    value={documentType}
                    onValueChange={(v) => { setDocumentType(v as ApiDocumentType); markDirty(); }}
                  >
                    <SelectTrigger className={cn(AUTH_INPUT.base, "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic")}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="z-[99999]">
                      {(Object.entries(DOCUMENT_TYPE_LABELS) as [ApiDocumentType, string][]).map(([val, label]) => (
                        <SelectItem key={val} value={val}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* UPLOAD TEMPLATE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1">
                  <FieldLabel>Assign Price</FieldLabel>
                  <div className="relative">
                    <Input
                      value={price}
                      onChange={(e) => { setPrice(e.target.value); markDirty(); }}
                      className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "pr-12 text-[#0F172B] font-semibold")}
                      placeholder="XXXX"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-sm font-semibold text-[#0F172B]">LKR</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <FieldLabel required>Upload Template</FieldLabel>
                  <div className="relative flex items-center h-10 w-full rounded-md border border-[#E2E8F0] bg-white overflow-hidden shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] focus-within:ring-1 focus-within:ring-slate-950">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
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
                    accept="image/png,image/jpeg,image/webp,.pdf"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {/* Row 3: Assign Course/Batch */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <FieldLabel>Assign Course/Batch</FieldLabel>
                  <button
                    type="button"
                    onClick={handleAddAssignment}
                    className="flex items-center gap-1 text-sm font-semibold text-[#E60076] hover:text-[#F6339A] transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>

                {assignments.length === 0 && (
                  <p className="text-sm italic text-[#90A1B9]">
                    No assignments added yet. Click &quot;Add&quot; to link to courses or batches.
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {assignments.map((assignment, index) => {
                    const combinedValue = assignment.batch_id
                      ? `batch:${assignment.batch_id}`
                      : assignment.course_id
                        ? `course:${assignment.course_id}`
                        : "";

                    return (
                      <div key={index} className="flex items-center gap-2 group">
                        <div className="flex-1">
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
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#FBCFE8] bg-white text-[#E60076] hover:bg-[#FDF2F8] transition-colors shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* PREVIEW CONTAINER */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <FieldLabel>Preview</FieldLabel>
                  {previewUrl && (
                    <button
                      type="button"
                      onClick={() => setIsExpandedPreviewOpen(true)}
                      className="hidden sm:flex items-center gap-1.5 text-[13px] font-medium text-[#E60076] hover:text-[#BE006B] transition-colors"
                    >
                      <Maximize2 className="h-4 w-4" />
                      Expand Preview
                    </button>
                  )}
                </div>

                <div
                  className={cn(
                    "rounded-md border border-dashed border-[#E2E8F0] bg-[#F8FAFC] overflow-hidden",
                    !previewUrl ? "flex flex-col items-center justify-center min-h-[180px]" : ""
                  )}
                  style={{
                    ...(imageAspectRatio ? { aspectRatio: String(imageAspectRatio) } : { minHeight: "180px" })
                  }}
                  onClick={handleDeselectField}
                >
                  {!previewUrl && (
                    <div className="text-center text-[#64748B] flex flex-col items-center justify-center h-full gap-2 p-8">
                      <Grid3X3 className="h-8 w-8 text-[#CBD5E1]" />
                      <p className="text-sm">Upload a template to see a preview here</p>
                    </div>
                  )}
                  {previewUrl && (
                    <div
                      ref={containerRef}
                      className="relative w-full h-full flex items-center justify-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div 
                        className="absolute inset-0 cursor-default" 
                        onClick={handleDeselectField} 
                        aria-label="Deselect field"
                      />
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="block w-full h-auto pointer-events-none select-none"
                        draggable={false}
                        onLoad={(e) => {
                          const img = e.currentTarget;

                          setImageAspectRatio(img.naturalWidth / img.naturalHeight);
                        }}
                      />
                      <GridOverlay visible={gridVisible} density={gridDensity} />
                      <DocPreviewFields
                        fieldPositions={fieldPositions}
                        onPositionChange={handlePositionChange}
                        containerRef={containerRef}
                        selectedField={selectedField}
                        onSelectField={setSelectedField}
                        snapEnabled={snapEnabled}
                        gridDensity={gridDensity}
                        showSampleValues={showSampleValues}
                        containerWidth={containerWidth}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* TOOLS: Controls & Properties */}
              {previewUrl && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  
                  {/* LEFT TOOL COLUMN */}
                  <div className="flex flex-col gap-6">
                    {/* Editor Controls */}
                    <div className="w-full flex flex-col gap-4 border border-[#E2E8F0] rounded-xl p-4">
                      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                        <h4 className="text-sm font-semibold text-[#0F172B]">Editor Controls</h4>
                        <button
                          type="button"
                          onClick={handleResetPositions}
                          className="flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#E60076]"
                          title="Reset all fields"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          Reset
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4">
                        <ToggleSwitch
                          id="edit-doc-grid"
                          label="Grid"
                          checked={gridVisible}
                          onChange={setGridVisible}
                        />
                        <ToggleSwitch
                          id="edit-doc-snap"
                          label="Align"
                          checked={snapEnabled}
                          onChange={setSnapEnabled}
                        />
                        <ToggleSwitch
                          id="edit-doc-preview"
                          label="Values"
                          checked={showSampleValues}
                          onChange={setShowSampleValues}
                        />
                      </div>

                      {gridVisible && (
                        <div className="flex items-center gap-2 pt-2">
                          <span className="text-xs font-medium text-[#64748B]">Density:</span>
                          <div className="flex gap-1">
                            {GRID_DENSITY_OPTIONS.map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => setGridDensity(opt.value)}
                                className={cn(
                                  "px-2 py-0.5 rounded text-[10px] font-medium border transition-colors",
                                  gridDensity === opt.value
                                    ? "bg-[#0F172B] text-white border-[#0F172B]"
                                    : "bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50"
                                )}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Field Chips */}
                    <div className="flex flex-col gap-3">
                      <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">
                        Add or Select Fields
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
                                  setSelectedField(isSelected ? null : field.key);
                                } else {
                                  handleTogglePredefinedField(field.key);
                                }
                              }}
                              className={cn(
                                "px-2.5 py-1 rounded-full text-xs font-medium border transition-all flex items-center gap-1",
                                isSelected
                                  ? "bg-[#E60076] text-white border-[#E60076] shadow-sm"
                                  : isActive
                                    ? "bg-[#FDF2F8] text-[#E60076] border-[#FBCFE8] hover:bg-[#FCE7F3]"
                                    : "bg-white text-[#45556C] border-[#E2E8F0] hover:border-[#64748B] hover:bg-slate-50"
                              )}
                            >
                              {field.label}
                              {isActive && (
                                <span
                                  role="button"
                                  tabIndex={0}
                                  title="Remove field"
                                  onClick={(e) => { e.stopPropagation(); handleTogglePredefinedField(field.key); }}
                                  onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); handleTogglePredefinedField(field.key); } }}
                                  className={cn(
                                    "ml-1 p-0.5 rounded-full hover:bg-black/10 transition-colors",
                                    isSelected ? "text-white" : "text-[#E60076]"
                                  )}
                                >
                                  <X className="h-3 w-3" />
                                </span>
                              )}
                            </button>
                          );
                        })}

                        {/* Custom fields */}
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
                                    ? "bg-[#E60076] text-white border-[#E60076] shadow-sm"
                                    : "bg-[#F1F5F9] text-[#334155] border-[#E2E8F0] hover:bg-[#E2E8F0]"
                                )}
                              >
                                {state.label || "Custom"}
                                <span
                                  role="button"
                                  tabIndex={0}
                                  title="Remove"
                                  onClick={(e) => { e.stopPropagation(); handleRemoveField(key); }}
                                  onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); handleRemoveField(key); } }}
                                  className={cn(
                                    "ml-1 p-0.5 rounded-full hover:bg-black/10 transition-colors",
                                    isSelected ? "text-white" : "text-[#475569]"
                                  )}
                                >
                                  <X className="h-3 w-3" />
                                </span>
                              </button>
                            );
                          })}

                        <button
                          type="button"
                          onClick={handleAddCustomField}
                          className="px-2.5 py-1 rounded-full text-xs font-medium border border-dashed border-[#E2E8F0] bg-white text-[#45556C] hover:border-[#64748B] hover:bg-slate-50 transition-all flex items-center gap-1"
                        >
                          <Plus className="h-3 w-3" /> Add Custom
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT TOOL COLUMN (Properties) */}
                  <div className="flex flex-col border border-[#E2E8F0] rounded-xl p-4 bg-slate-50/50 min-h-[200px]">
                    {selectedField && fieldPositions[selectedField] ? (
                      <div className="w-full">
                        <DocFieldPropertiesPanel
                          fieldKey={selectedField}
                          fieldState={fieldPositions[selectedField]}
                          onUpdate={handleFieldUpdate}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full text-center text-sm italic text-[#64748B] flex items-center justify-center">
                        Click a field on the preview to edit its properties.
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </motion.div>

          {/* ── Footer ── */}
          <motion.div variants={itemVariants} className="flex items-center justify-end gap-3 border-t border-[#E2E8F0] pt-4 shrink-0 mt-auto">
            <Button
              onClick={handleUpdate}
              disabled={isLoading || isFetching || !isDirty}
              className={cn(BUTTON_STYLES.primary.full, "w-auto min-w-[120px] px-6 text-sm font-semibold text-white")}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {loadingStep === "template" && "Uploading..."}
                  {loadingStep === "saving" && "Saving..."}
                </>
              ) : (
                "Update"
              )}
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Expanded Preview Modal */}
      {previewUrl && isOpen && (
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

      {/* Discard confirmation */}
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
