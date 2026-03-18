"use client";

import React, { useRef, useCallback, useState, useEffect } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { X, RotateCcw, Grid3X3, ChevronLeft, PenTool } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { COLORS } from "@/lib/constants/theme";

import {
  type TagPositions,
  type TagState,
  type SignatureState,
  DRAGGABLE_TAGS,
  GRID_DENSITY_OPTIONS,
  ToggleSwitch,
  GridOverlay,
  CertificatePreviewTags,
  TagPropertiesPanel,
  DraggableSignature,
  SignaturePropertiesPanel,
} from "./certificate-editor-shared";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ExpandedPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  previewUrl: string;
  tagPositions: TagPositions;
  onPositionChange: (key: string, x: number, y: number) => void;
  onTagUpdate: (key: string, updates: Partial<TagState>) => void;
  onResetPositions: () => void;
  selectedTag: string | null;
  onSelectTag: (key: string | null) => void;
  snapEnabled: boolean;
  onSnapChange: (v: boolean) => void;
  gridVisible: boolean;
  onGridVisibleChange: (v: boolean) => void;
  gridDensity: number;
  onGridDensityChange: (v: number) => void;
  showSampleValues: boolean;
  onShowSampleValuesChange: (v: boolean) => void;  // Signature
  signatureState: SignatureState;
  onSignaturePositionChange: (x: number, y: number) => void;
  onSignatureUpdate: (updates: Partial<SignatureState>) => void;
  onRemoveSignatureImage: () => void;
  onSignatureUploadClick: () => void;
  isSignatureSelected: boolean;
  onSelectSignature: () => void;
  onDeselectSignature: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ExpandedPreviewModal({
  open,
  onOpenChange,
  previewUrl,
  tagPositions,
  onPositionChange,
  onTagUpdate,
  onResetPositions,
  selectedTag,
  onSelectTag,
  snapEnabled,
  onSnapChange,
  gridVisible,
  onGridVisibleChange,
  gridDensity,
  onGridDensityChange,
  showSampleValues,
  onShowSampleValuesChange,
  signatureState,
  onSignaturePositionChange,
  onSignatureUpdate,
  onRemoveSignatureImage,
  onSignatureUploadClick,
  isSignatureSelected,
  onSelectSignature,
  onDeselectSignature,
}: ExpandedPreviewModalProps) {
  const expandedContainerRef = useRef<HTMLDivElement>(null);
  const [expandedContainerWidth, setExpandedContainerWidth] = useState(0);
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);

  // Track container width for proportional font scaling
  useEffect(() => {
    const el = expandedContainerRef.current;

    if (!el) return;

    const ro = new ResizeObserver(([entry]) => {
      setExpandedContainerWidth(entry.contentRect.width);
    });

    ro.observe(el);

    return () => ro.disconnect();
  }, [open]);

  // Reset aspect ratio when modal reopens
  useEffect(() => {
    if (open) setImageAspectRatio(null);
  }, [open]);

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleSelectTag = useCallback(
    (key: string) => {
      onSelectTag(key);
      onDeselectSignature();
    },
    [onSelectTag, onDeselectSignature]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`flex w-[95vw] max-w-[95vw] sm:max-w-[90vw] lg:max-w-[85vw] h-[90vh] max-h-[90vh] flex-col rounded-xl border border-[${COLORS.line}] bg-white p-0 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] overflow-hidden [&>button]:hidden`}
        onPointerDownOutside={(e) => {
          // Prevent closing when interacting with draggable tags
          const target = e.target as HTMLElement;

          if (target.closest("[data-draggable-tag]")) {
            e.preventDefault();
          }
        }}
        onInteractOutside={(e) => {
          const target = e.target as HTMLElement;

          if (target.closest("[data-draggable-tag]")) {
            e.preventDefault();
          }
        }}
      >
        {/* ─── Header ─── */}
        <div className={`flex items-center justify-between border-b border-[${COLORS.line}] px-4 sm:px-6 py-3 bg-white shrink-0`}>
          <div className="flex items-center gap-2">
            <button
              type="button"
              title="Back to panel"
              onClick={handleClose}
              className={`flex h-8 w-8 items-center justify-center rounded-md border border-[${COLORS.line}] bg-transparent transition-colors hover:bg-slate-50 lg:hidden`}
            >
              <ChevronLeft className={`h-4 w-4 text-[${COLORS.slate600}]`} />
            </button>
            <DialogTitle className={`text-sm sm:text-base font-semibold text-[${COLORS.slate900}]`}>
              Template Editor
            </DialogTitle>
          </div>
          <button
            type="button"
            title="Close"
            onClick={handleClose}
            className={`flex h-8 w-8 items-center justify-center rounded-md border border-[${COLORS.line}] bg-transparent transition-colors hover:bg-slate-50`}
          >
            <X className={`h-4 w-4 text-[${COLORS.slate600}]`} />
          </button>
        </div>

        {/* ─── Toolbar (all sizes) ─── */}
        <div className={`shrink-0 border-b border-[${COLORS.line}] px-3 sm:px-4 py-2`}>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {/* Toggles */}
            <div className="flex items-center gap-3 flex-wrap">
              <ToggleSwitch id="t-grid" checked={gridVisible} onChange={onGridVisibleChange} label="Grid" />
              <ToggleSwitch id="t-snap" checked={snapEnabled} onChange={onSnapChange} label="Align" />
              <ToggleSwitch id="t-preview" checked={showSampleValues} onChange={onShowSampleValuesChange} label="Preview" />
            </div>

            {/* Density — only when grid is on */}
            {gridVisible && (
              <div className="flex items-center gap-1.5">
                <Grid3X3 className={`h-3.5 w-3.5 shrink-0 text-[${COLORS.slate600}]`} />
                {GRID_DENSITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onGridDensityChange(opt.value)}
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-medium border transition-colors whitespace-nowrap",
                      gridDensity === opt.value
                        ? `bg-[${COLORS.slate900}] text-white border-[${COLORS.slate900}]`
                        : `bg-white text-[${COLORS.slate600}] border-[${COLORS.line}] hover:bg-slate-50`
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {/* Spacer + Reset */}
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                title="Reset all positions"
                onClick={onResetPositions}
                className={`flex items-center gap-1 text-xs font-medium text-[${COLORS.slate600}] hover:text-[${COLORS.pink600}] transition-colors`}
              >
                <RotateCcw className="h-3 w-3" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* ─── Body ─── */}
        <div className="flex-1 relative flex flex-row overflow-hidden min-h-0">
          {/* Preview area always takes full space */}
          <div
            className={`flex-1 overflow-auto bg-[${COLORS.slate100}] p-3 sm:p-4 lg:p-6 min-h-0`}
            onPointerDown={() => { onSelectTag(null); onDeselectSignature(); }}
          >
            <div
              ref={expandedContainerRef}
              className="relative w-full mx-auto"
              style={{
                maxWidth: "900px",
                ...(imageAspectRatio ? { aspectRatio: String(imageAspectRatio) } : {}),
              }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <img
                src={previewUrl}
                alt="Certificate Preview"
                className={`block w-full h-auto shadow-sm border border-[${COLORS.line}] rounded-sm pointer-events-none select-none`}
                draggable={false}
                onLoad={(e) => {
                  const img = e.currentTarget;

                  setImageAspectRatio(img.naturalWidth / img.naturalHeight);
                }}
              />
              <GridOverlay visible={gridVisible} density={gridDensity} />
              <CertificatePreviewTags
                tagPositions={tagPositions}
                onPositionChange={onPositionChange}
                containerRef={expandedContainerRef}
                selectedTag={selectedTag}
                onSelectTag={handleSelectTag}
                snapEnabled={snapEnabled}
                gridDensity={gridDensity}
                showSampleValues={showSampleValues}
                containerWidth={expandedContainerWidth}
              />
              <DraggableSignature
                signatureState={signatureState}
                containerRef={expandedContainerRef}
                onPositionChange={onSignaturePositionChange}
                isSelected={isSignatureSelected}
                onSelect={() => { onSelectTag(null); onSelectSignature(); }}
                onDeselect={onDeselectSignature}
                snapEnabled={snapEnabled}
                gridDensity={gridDensity}
                containerWidth={expandedContainerWidth}
              />
            </div>
          </div>

          {/* Properties sidebar:
              - lg+   : static side panel (pushes image)
              - <lg   : absolute overlay from the right, so image is NOT pushed */}
          <AnimatePresence initial={false}>
            {(selectedTag || isSignatureSelected) && (
              <motion.div
                key="props-panel"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 60 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={cn(
                  "shrink-0 w-[320px] sm:w-[300px] xl:w-[400px]",
                  `bg-white border-l border-[${COLORS.line}] overflow-y-auto`
                )}
              >
                {/* Sidebar header */}
                <div className={`flex items-center justify-between px-4 py-3 border-b border-[${COLORS.line}] bg-white sticky top-0 z-10`}>
                  <span className={`text-sm font-semibold text-[${COLORS.slate900}]`}>
                    {isSignatureSelected ? "Signature Properties" : "Tag Properties"}
                  </span>
                  <button
                    type="button"
                    title="Close properties"
                    onClick={() => { onSelectTag(null); onDeselectSignature(); }}
                    className={`flex h-6 w-6 items-center justify-center rounded text-[${COLORS.slate600}] hover:text-[${COLORS.slate900}] hover:bg-slate-100 transition-colors`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Tag quick-select chips */}
                <div className={`px-4 py-3 border-b border-[${COLORS.line}]`}>
                  <div className="flex flex-wrap gap-1.5">
                    {DRAGGABLE_TAGS.map((tag) => (
                      <button
                        key={tag.key}
                        type="button"
                        onClick={() => handleSelectTag(tag.key)}
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-medium border transition-all",
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
                        onClick={() => { onSelectTag(null); onSelectSignature(); }}
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-medium border transition-all flex items-center gap-1",
                          isSignatureSelected
                            ? `bg-[${COLORS.pink600}] text-white border-[${COLORS.pink600}] shadow-sm`
                            : `bg-white text-[${COLORS.slate700}] border-[${COLORS.line}] hover:border-[${COLORS.pink600}]/40`
                        )}
                      >
                        <PenTool className="h-2.5 w-2.5" /> Signature
                      </button>
                    )}
                  </div>
                </div>

                {/* Properties panel */}
                <div className="p-4">
                  {selectedTag && (
                    <TagPropertiesPanel
                      tagKey={selectedTag}
                      tagState={tagPositions[selectedTag]}
                      onUpdate={onTagUpdate}
                      compact
                    />
                  )}
                  {isSignatureSelected && (
                    <SignaturePropertiesPanel
                      signatureState={signatureState}
                      onUpdate={onSignatureUpdate}
                      onRemoveImage={onRemoveSignatureImage}
                      onUploadClick={onSignatureUploadClick}
                      compact
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─── Footer: hint when no tag selected ─── */}
        <AnimatePresence initial={false}>
          {!selectedTag && !isSignatureSelected && (
            <motion.div
              key="footer-tags"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`shrink-0 border-t border-[${COLORS.line}] bg-white px-4 sm:px-6 py-3`}
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className={`text-xs font-medium text-[${COLORS.slate600}] shrink-0`}>
                  Select a tag to edit:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {DRAGGABLE_TAGS.map((tag) => (
                    <button
                      key={tag.key}
                      type="button"
                      onClick={() => handleSelectTag(tag.key)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border border-[${COLORS.line}] bg-white text-[${COLORS.slate700}] hover:border-[${COLORS.pink600}]/40 hover:bg-slate-50 transition-all`}
                    >
                      {tag.label}
                    </button>
                  ))}
                  {signatureState.enabled && signatureState.imageUrl && (
                    <button
                      type="button"
                      onClick={() => { onSelectTag(null); onSelectSignature(); }}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border border-[${COLORS.line}] bg-white text-[${COLORS.slate700}] hover:border-[${COLORS.pink600}]/40 hover:bg-slate-50 transition-all flex items-center gap-1`}
                    >
                      <PenTool className="h-3 w-3" /> Signature
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
