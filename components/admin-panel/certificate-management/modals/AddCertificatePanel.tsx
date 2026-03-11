"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Maximize2, RotateCcw, Grid3X3, PenTool } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";

import { cn } from "@/lib/utils";
import { COLORS, AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";

import {
  type TagPositions,
  type TagState,
  type SignatureState,
  DEFAULT_TAG_POSITIONS,
  DEFAULT_SIGNATURE_STATE,
  DRAGGABLE_TAGS,
  GRID_DENSITY_OPTIONS,
  ToggleSwitch,
  GridOverlay,
  CertificatePreviewTags,
  TagPropertiesPanel,
  DraggableSignature,
  SignaturePropertiesPanel,
} from "./certificate-editor-shared";
import { ExpandedPreviewModal } from "./ExpandedPreviewModal";

// ─── Sub-components ──────────────────────────────────────────────────────────

interface AddCertificatePanelProps {
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

export function AddCertificatePanel({ isOpen, onClose }: AddCertificatePanelProps) {
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [tagPositions, setTagPositions] = useState<TagPositions>(DEFAULT_TAG_POSITIONS);
  const [isExpandedPreviewOpen, setIsExpandedPreviewOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [snapEnabled, setSnapEnabled] = useState(false);
  const [gridVisible, setGridVisible] = useState(true);
  const [gridDensity, setGridDensity] = useState(10);
  const [showSampleValues, setShowSampleValues] = useState(false);
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [signatureState, setSignatureState] = useState<SignatureState>({ ...DEFAULT_SIGNATURE_STATE });
  const [isSignatureSelected, setIsSignatureSelected] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

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
      setIsDirty(false);
      setShowDiscardModal(false);
      setPreviewUrl(null);
      setFileType(null);
      setSelectedFileName("");
      setIsExpandedPreviewOpen(false);
      setSelectedTag(null);
      setSnapEnabled(false);
      setGridVisible(true);
      setGridDensity(10);
      setShowSampleValues(false);
      setImageAspectRatio(null);
      setTagPositions(
        JSON.parse(JSON.stringify(DEFAULT_TAG_POSITIONS)) as TagPositions
      );
      setSignatureState({ ...DEFAULT_SIGNATURE_STATE });
      setIsSignatureSelected(false);
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
    markDirty();
    setImageAspectRatio(null);
    const objectUrl = URL.createObjectURL(file);

    setPreviewUrl(objectUrl);
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleCreate = () => {
    toast.success("Certificate template created successfully");
    onClose();
  };

  const handlePositionChange = useCallback(
    (key: string, x: number, y: number) => {
      setTagPositions((prev) => ({
        ...prev,
        [key]: { ...prev[key], x, y },
      }));
      markDirty();
    },
    [markDirty]
  );

  const handleTagUpdate = useCallback(
    (key: string, updates: Partial<TagState>) => {
      setTagPositions((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          ...updates,
          properties: {
            ...prev[key].properties,
            ...(updates.properties ?? {}),
          },
          sampleValue: updates.sampleValue ?? prev[key].sampleValue,
        },
      }));
      markDirty();
    },
    [markDirty]
  );

  const handleResetPositions = () => {
    setTagPositions(JSON.parse(JSON.stringify(DEFAULT_TAG_POSITIONS)) as TagPositions);
    setSelectedTag(null);
    setSignatureState((prev) => ({ ...prev, x: DEFAULT_SIGNATURE_STATE.x, y: DEFAULT_SIGNATURE_STATE.y, width: DEFAULT_SIGNATURE_STATE.width, opacity: DEFAULT_SIGNATURE_STATE.opacity, rotation: DEFAULT_SIGNATURE_STATE.rotation }));
    setIsSignatureSelected(false);
    markDirty();
    toast.info("Tag positions reset to defaults");
  };

  const handleDeselectTag = () => {
    setSelectedTag(null);
    setIsSignatureSelected(false);
  };

  const handleSignatureFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG recommended)");

      return;
    }

    const objectUrl = URL.createObjectURL(file);

    setSignatureState((prev) => ({ ...prev, imageUrl: objectUrl, enabled: true }));
    markDirty();

    // Reset file input so re-uploading the same file still triggers onChange
    e.target.value = "";
  };

  const handleSignatureUploadClick = () => {
    signatureInputRef.current?.click();
  };

  const handleRemoveSignatureImage = () => {
    setSignatureState((prev) => ({ ...prev, imageUrl: null }));
    setIsSignatureSelected(false);
    markDirty();
  };

  const handleSignaturePositionChange = useCallback(
    (x: number, y: number) => {
      setSignatureState((prev) => ({ ...prev, x, y }));
      markDirty();
    },
    [markDirty]
  );

  const handleSignatureUpdate = useCallback(
    (updates: Partial<SignatureState>) => {
      setSignatureState((prev) => ({ ...prev, ...updates }));
      markDirty();
    },
    [markDirty]
  );

  const handleSelectSignature = useCallback(() => {
    setSelectedTag(null);
    setIsSignatureSelected(true);
  }, []);

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
                className="fixed right-0 top-0 z-[99999] flex h-screen w-full max-w-[540px] flex-col bg-white shadow-2xl"
                style={{
                  borderLeft: "1px solid #E2E8F0",
                  borderRadius: "8px 0 0 8px",
                  boxShadow:
                    "0 4px 6px -4px rgba(16, 24, 40, 0.10), 0 10px 15px -3px rgba(0, 0, 0, 0.10)",
                }}
              >
                {/* Header */}
                <div className={`flex items-center justify-between border-b border-[${COLORS.line}] px-6 py-4`}>
                  <h2 className={`text-lg font-semibold leading-[30px] text-[${COLORS.slate900}]`}>
                    New Certificate
                  </h2>
                  <button
                    title="close"
                    onClick={handleCloseAttempt}
                    className={`flex h-8 w-8 items-center justify-center rounded-md border border-[${COLORS.line}] bg-transparent shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-slate-50`}
                  >
                    <X className={`h-4 w-4 text-[${COLORS.slate600}]`} />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
                  <div className="flex flex-col gap-6">
                    {/* Certificate Name */}
                    <div className="space-y-1">
                      <FieldLabel required>Certificate Name</FieldLabel>
                      <Input
                        className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                        placeholder="lorem ipsum"
                        onChange={markDirty}
                      />
                    </div>

                    {/* Assign Price */}
                    <div className="space-y-1">
                      <FieldLabel required>Assign Price</FieldLabel>
                      <div className="relative">
                        <Input
                          className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "pr-16")}
                          placeholder="XXXX"
                          onChange={markDirty}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <span className={`text-sm font-semibold text-[${COLORS.slate800}]`}>LKR</span>
                          <ChevronDown className={`h-3 w-3 text-[${COLORS.slate900}]`} />
                        </div>
                      </div>
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
                        aria-label="Upload certificate template"
                        title="Upload certificate template"
                      />
                    </div>

                    {/* ───── Digital Signature (Optional) ───── */}
                    <div className={`rounded-lg border border-[${COLORS.line}] bg-white p-3 space-y-3`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <PenTool className={`h-3.5 w-3.5 text-[${COLORS.slate700}]`} />
                          <span className={`text-xs font-semibold text-[${COLORS.slate900}] uppercase tracking-wide`}>
                            Digital Signature
                          </span>
                          <span className={`text-[10px] font-medium text-[${COLORS.slate400}] italic`}>Optional</span>
                        </div>
                        <ToggleSwitch
                          id="signature-toggle"
                          checked={signatureState.enabled}
                          onChange={(v) => {
                            setSignatureState((prev) => ({ ...prev, enabled: v }));
                            if (!v) setIsSignatureSelected(false);
                            markDirty();
                          }}
                          label=""
                        />
                      </div>

                      {signatureState.enabled && (
                        <div className="space-y-2">
                          {signatureState.imageUrl ? (
                            <div className={`relative rounded-md border border-[${COLORS.line}] bg-[${COLORS.slate100}] p-3 flex items-center justify-center`}>
                              <img
                                src={signatureState.imageUrl}
                                alt="Signature preview"
                                className="max-h-14 max-w-full object-contain"
                              />
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSignatureUploadClick}
                              className={`w-full flex items-center justify-center gap-2 h-10 rounded-md border border-dashed border-[${COLORS.line}] bg-[${COLORS.slate100}] text-xs font-medium text-[${COLORS.slate600}] hover:bg-slate-50 hover:border-[${COLORS.pink600}]/40 transition-colors`}
                            >
                              <PenTool className="h-3.5 w-3.5" /> Upload Signature Image
                            </button>
                          )}
                          <p className={`text-[10px] text-[${COLORS.slate400}]`}>
                            PNG with transparent background recommended. Drag to position on preview.
                          </p>
                        </div>
                      )}
                      <input
                        ref={signatureInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={handleSignatureFileChange}
                        aria-label="Upload signature image"
                        title="Upload signature image"
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
                            id="grid-toggle"
                            checked={gridVisible}
                            onChange={setGridVisible}
                            label="Show Grid"
                          />
                          <ToggleSwitch
                            id="snap-toggle"
                            checked={snapEnabled}
                            onChange={setSnapEnabled}
                            label="Align to Grid"
                          />
                          <ToggleSwitch
                            id="preview-values-toggle"
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
                          // Use natural image aspect ratio when loaded; else a default placeholder height
                          ...(imageAspectRatio && fileType !== "application/pdf"
                            ? { aspectRatio: String(imageAspectRatio) }
                            : { minHeight: "180px" }
                          ),
                          padding: fileType === "application/pdf" ? "0px" : undefined,
                        }}
                        onClick={handleDeselectTag}
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
                            title="Certificate PDF Preview"
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
                              onClick={handleDeselectTag}
                            />
                            <GridOverlay visible={gridVisible} density={gridDensity} />
                            <CertificatePreviewTags
                              tagPositions={tagPositions}
                              onPositionChange={handlePositionChange}
                              containerRef={containerRef}
                              selectedTag={selectedTag}
                              onSelectTag={(key) => { setSelectedTag(key); setIsSignatureSelected(false); }}
                              snapEnabled={snapEnabled}
                              gridDensity={gridDensity}
                              showSampleValues={showSampleValues}
                              containerWidth={containerWidth}
                            />
                            <DraggableSignature
                              signatureState={signatureState}
                              containerRef={containerRef}
                              onPositionChange={handleSignaturePositionChange}
                              isSelected={isSignatureSelected}
                              onSelect={handleSelectSignature}
                              onDeselect={() => setIsSignatureSelected(false)}
                              snapEnabled={snapEnabled}
                              gridDensity={gridDensity}
                              containerWidth={containerWidth}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ───── Selected Tag Properties Panel ───── */}
                    {selectedTag && previewUrl && fileType !== "application/pdf" && (
                      <TagPropertiesPanel
                        tagKey={selectedTag}
                        tagState={tagPositions[selectedTag]}
                        onUpdate={handleTagUpdate}
                      />
                    )}

                    {/* ───── Signature Properties Panel ───── */}
                    {isSignatureSelected && signatureState.enabled && previewUrl && fileType !== "application/pdf" && (
                      <SignaturePropertiesPanel
                        signatureState={signatureState}
                        onUpdate={handleSignatureUpdate}
                        onRemoveImage={handleRemoveSignatureImage}
                        onUploadClick={handleSignatureUploadClick}
                      />
                    )}

                    {/* Tag quick-select chips */}
                    {previewUrl && fileType !== "application/pdf" && (
                      <div className="space-y-2">
                        <span className={`text-xs font-medium text-[${COLORS.slate600}]`}>
                          Click a tag on the preview or pick one below:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {DRAGGABLE_TAGS.map((tag) => (
                            <button
                              key={tag.key}
                              type="button"
                              onClick={() =>
                                setSelectedTag((prev) => {
                                  setIsSignatureSelected(false);

                                  return prev === tag.key ? null : tag.key;
                                })
                              }
                              className={cn(
                                "px-2.5 py-1 rounded-full text-xs font-medium border transition-all",
                                selectedTag === tag.key
                                  ? `bg-[${COLORS.pink600}] text-white border-[${COLORS.pink600}] shadow-sm`
                                  : `bg-white text-[${COLORS.slate700}] border-[${COLORS.line}] hover:border-[${COLORS.pink600}]/40`
                              )}
                            >
                              {tag.label}
                            </button>
                          ))}
                          {signatureState.enabled && signatureState.imageUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedTag(null);
                                setIsSignatureSelected((prev) => !prev);
                              }}
                              className={cn(
                                "px-2.5 py-1 rounded-full text-xs font-medium border transition-all flex items-center gap-1",
                                isSignatureSelected
                                  ? `bg-[${COLORS.pink600}] text-white border-[${COLORS.pink600}] shadow-sm`
                                  : `bg-white text-[${COLORS.slate700}] border-[${COLORS.line}] hover:border-[${COLORS.pink600}]/40`
                              )}
                            >
                              <PenTool className="h-3 w-3" /> Signature
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className={`flex items-center justify-end gap-3 border-t border-[${COLORS.line}] px-6 py-4`}>
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

      {/* Expanded Preview Modal */}
      {previewUrl && fileType !== "application/pdf" && (
        <ExpandedPreviewModal
          open={isExpandedPreviewOpen}
          onOpenChange={setIsExpandedPreviewOpen}
          previewUrl={previewUrl}
          tagPositions={tagPositions}
          onPositionChange={handlePositionChange}
          onTagUpdate={handleTagUpdate}
          onResetPositions={handleResetPositions}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
          snapEnabled={snapEnabled}
          onSnapChange={setSnapEnabled}
          gridVisible={gridVisible}
          onGridVisibleChange={setGridVisible}
          gridDensity={gridDensity}
          onGridDensityChange={setGridDensity}
          showSampleValues={showSampleValues}
          onShowSampleValuesChange={setShowSampleValues}
          signatureState={signatureState}
          onSignaturePositionChange={handleSignaturePositionChange}
          onSignatureUpdate={handleSignatureUpdate}
          onRemoveSignatureImage={handleRemoveSignatureImage}
          onSignatureUploadClick={handleSignatureUploadClick}
          isSignatureSelected={isSignatureSelected}
          onSelectSignature={handleSelectSignature}
          onDeselectSignature={() => setIsSignatureSelected(false)}
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
