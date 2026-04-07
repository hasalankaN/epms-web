"use client";

import React, { useRef, useCallback, useState, useEffect } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { X, RotateCcw, Grid3X3, ChevronLeft, Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { COLORS } from "@/lib/constants/theme";

import {
  type DocFieldPositions,
  type DocFieldState,
  PREDEFINED_DOC_FIELDS,
  GRID_DENSITY_OPTIONS,
  ToggleSwitch,
  GridOverlay,
  DocPreviewFields,
  DocFieldPropertiesPanel,
} from "./document-editor-shared";

// ─── Types ───────────────────────────────────────────────────────────────────

interface DocExpandedPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  previewUrl: string;
  fieldPositions: DocFieldPositions;
  onPositionChange: (key: string, x: number, y: number) => void;
  onFieldUpdate: (key: string, updates: Partial<DocFieldState>) => void;
  onResetPositions: () => void;
  selectedField: string | null;
  onSelectField: (key: string | null) => void;
  snapEnabled: boolean;
  onSnapChange: (v: boolean) => void;
  gridVisible: boolean;
  onGridVisibleChange: (v: boolean) => void;
  gridDensity: number;
  onGridDensityChange: (v: number) => void;
  showSampleValues: boolean;
  onShowSampleValuesChange: (v: boolean) => void;
  onTogglePredefinedField: (key: string) => void;
  onAddCustomField: () => void;
  onRemoveField: (key: string) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function DocExpandedPreviewModal({
  open,
  onOpenChange,
  previewUrl,
  fieldPositions,
  onPositionChange,
  onFieldUpdate,
  onResetPositions,
  selectedField,
  onSelectField,
  snapEnabled,
  onSnapChange,
  gridVisible,
  onGridVisibleChange,
  gridDensity,
  onGridDensityChange,
  showSampleValues,
  onShowSampleValuesChange,
  onTogglePredefinedField,
  onAddCustomField,
  onRemoveField,
}: DocExpandedPreviewModalProps) {
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

  const handleSelectField = useCallback(
    (key: string) => {
      onSelectField(key);
    },
    [onSelectField]
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
              <ToggleSwitch id="doc-t-grid" checked={gridVisible} onChange={onGridVisibleChange} label="Grid" />
              <ToggleSwitch id="doc-t-snap" checked={snapEnabled} onChange={onSnapChange} label="Align" />
              <ToggleSwitch id="doc-t-preview" checked={showSampleValues} onChange={onShowSampleValuesChange} label="Preview" />
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
            onPointerDown={() => { onSelectField(null); }}
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
                alt="Document Preview"
                className={`block w-full h-auto shadow-sm border border-[${COLORS.line}] rounded-sm pointer-events-none select-none`}
                draggable={false}
                onLoad={(e) => {
                  const img = e.currentTarget;

                  setImageAspectRatio(img.naturalWidth / img.naturalHeight);
                }}
              />
              <GridOverlay visible={gridVisible} density={gridDensity} />
              <DocPreviewFields
                fieldPositions={fieldPositions}
                onPositionChange={onPositionChange}
                containerRef={expandedContainerRef}
                selectedField={selectedField}
                onSelectField={handleSelectField}
                snapEnabled={snapEnabled}
                gridDensity={gridDensity}
                showSampleValues={showSampleValues}
                containerWidth={expandedContainerWidth}
              />
            </div>
          </div>

          {/* Properties sidebar:
              - lg+   : static side panel (pushes image)
              - <lg   : absolute overlay from the right, so image is NOT pushed */}
          <AnimatePresence initial={false}>
            {selectedField && (
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
                    Field Properties
                  </span>
                  <button
                    type="button"
                    title="Close properties"
                    onClick={() => { onSelectField(null); }}
                    className={`flex h-6 w-6 items-center justify-center rounded text-[${COLORS.slate600}] hover:text-[${COLORS.slate900}] hover:bg-slate-100 transition-colors`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Field quick-select chips (Active only) */}
                <div className={`px-4 py-3 border-b border-[${COLORS.line}]`}>
                  <div className="flex flex-wrap gap-1.5">
                    {/* Active Predefined Fields */}
                    {PREDEFINED_DOC_FIELDS.filter((f) => !!fieldPositions[f.key]).map((field) => (
                      <button
                        key={field.key}
                        type="button"
                        onClick={() => handleSelectField(field.key)}
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-medium border transition-all flex items-center gap-1",
                          selectedField === field.key
                            ? `bg-[${COLORS.pink600}] text-white border-[${COLORS.pink600}] shadow-sm`
                            : `bg-white text-[${COLORS.slate700}] border-[${COLORS.line}] hover:border-[${COLORS.pink600}]/40`
                        )}
                      >
                        {field.label}
                      </button>
                    ))}

                    {/* Active Custom Fields */}
                    {Object.entries(fieldPositions)
                      .filter(([, state]) => state.field_type === "CUSTOM")
                      .map(([key, state]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleSelectField(key)}
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-medium border transition-all flex items-center gap-1",
                            selectedField === key
                              ? `bg-[${COLORS.pink600}] text-white border-[${COLORS.pink600}] shadow-sm`
                              : `bg-white text-[${COLORS.slate700}] border-[${COLORS.line}] hover:border-[${COLORS.pink600}]/40`
                          )}
                        >
                          {state.label || "Custom"}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Properties panel */}
                <div className="p-4">
                  <DocFieldPropertiesPanel
                    fieldKey={selectedField}
                    fieldState={fieldPositions[selectedField]}
                    onUpdate={onFieldUpdate}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─── Footer: hint when no field selected ─── */}
        <AnimatePresence initial={false}>
          {!selectedField && (
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
                  Select a field to edit:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {/* Provide toggle controls when no field is selected */}
                  {PREDEFINED_DOC_FIELDS.map((field) => {
                    const isActive = !!fieldPositions[field.key];

                    return (
                      <button
                        key={field.key}
                        type="button"
                        onClick={() => {
                          if (!isActive) onTogglePredefinedField(field.key);
                          else handleSelectField(field.key);
                        }}
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-medium border transition-all flex items-center gap-1",
                          isActive
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
                              onTogglePredefinedField(field.key);
                            }}
                            className={`ml-1 p-0.5 rounded-full hover:bg-black/10 transition-colors text-[${COLORS.pink600}]`}
                          >
                            <X className="h-3 w-3" />
                          </span>
                        )}
                      </button>
                    );
                  })}

                  {/* Active Custom Fields (in footer) */}
                  {Object.entries(fieldPositions)
                    .filter(([, state]) => state.field_type === "CUSTOM")
                    .map(([key, state]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleSelectField(key)}
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-medium border transition-all flex items-center gap-1",
                          "bg-[#FDF2F8] text-[#E60076] border-[#FBCFE8] hover:bg-[#FCE7F3]"
                        )}
                      >
                        {state.label || "Custom"}
                        <span
                          title="Remove custom field"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveField(key);
                          }}
                          className={`ml-1 p-0.5 rounded-full hover:bg-black/10 transition-colors text-[${COLORS.pink600}]`}
                        >
                          <X className="h-3 w-3" />
                        </span>
                      </button>
                    ))}

                  {/* Add Custom Field Button */}
                  <button
                    type="button"
                    onClick={onAddCustomField}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border border-dashed border-[${COLORS.line}] bg-white text-[${COLORS.slate700}] hover:border-[${COLORS.slate400}] hover:bg-slate-50 transition-all flex items-center gap-1`}
                  >
                    <Plus className="h-3 w-3" /> Add Custom
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
