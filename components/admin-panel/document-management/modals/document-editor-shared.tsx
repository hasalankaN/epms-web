"use client";

import React, { useRef, useCallback, useLayoutEffect } from "react";

import { motion, useMotionValue, type PanInfo } from "framer-motion";
import { Crosshair, Type, TextCursorInput, Minus, Plus } from "lucide-react";

import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import { COLORS, AUTH_INPUT } from "@/lib/constants/theme";
import type { DocumentFieldType } from "@/types/document";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DocFieldState {
  field_type: DocumentFieldType;
  label?: string;
  x: number;
  y: number;
  fontSize: number;
  sampleValue: string;
}

/** Map of active fields only — keys are unique field IDs */
export type DocFieldPositions = Record<string, DocFieldState>;

// ─── Constants ───────────────────────────────────────────────────────────────

/** Built-in (predefined) field types that can be toggled on/off */
export const PREDEFINED_DOC_FIELDS: { key: string; field_type: DocumentFieldType; label: string }[] = [
  { key: "studentName", field_type: "STUDENT_NAME", label: "Student Name" },
  { key: "courseName", field_type: "COURSE_NAME", label: "Course Name" },
  { key: "issueDate", field_type: "ISSUE_DATE", label: "Issue Date" },
  { key: "signature", field_type: "SIGNATURE", label: "Signature" },
  { key: "docId", field_type: "DOC_ID", label: "Document ID" },
];

export const DEFAULT_SAMPLE_VALUES: Record<string, string> = {
  studentName: "John Doe",
  courseName: "Advanced Web Development",
  issueDate: "2026-03-05",
  signature: "Director Signature",
  docId: "DOC-2026-001",
};

/** Default position/state for a newly-added field */
export function createDefaultFieldState(
  fieldType: DocumentFieldType,
  label?: string
): DocFieldState {
  return {
    field_type: fieldType,
    label,
    x: 50,
    y: 50,
    fontSize: 12,
    sampleValue: "",
  };
}

export const GRID_DENSITY_OPTIONS = [
  { value: 5, label: "Fine (5%)" },
  { value: 10, label: "Medium (10%)" },
  { value: 20, label: "Coarse (20%)" },
] as const;

/**
 * Reference container width in px. Font sizes are authored at this width;
 * in smaller containers they scale down proportionally.
 */
export const REFERENCE_CONTAINER_WIDTH = 800;

/** Step size for arrow-key nudging (%) */
const NUDGE_STEP = 0.5;
const NUDGE_STEP_SHIFT = 5;

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function snapToGrid(value: number, gridSize: number, enabled: boolean): number {
  if (!enabled) return value;

  return Math.round(value / gridSize) * gridSize;
}

/** Generate a unique key for a custom field */
let customCounter = 0;

export function generateCustomFieldKey(): string {
  customCounter += 1;

  return `custom_${Date.now()}_${customCounter}`;
}

// ─── Toggle Switch ─────────────────────────────────────────────────────────

export const ToggleSwitch = ({
  checked,
  onChange,
  label,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  id: string;
}) => (
  <label htmlFor={id} className="inline-flex items-center gap-2 cursor-pointer select-none">
    <div className="relative">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div
        className="h-5 w-9 rounded-full bg-gray-200 transition-colors"
        style={{
          backgroundColor: checked ? COLORS.pink600 : '#d1d5db',
        }}
      />
      <div
        className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform"
        style={{
          transform: checked ? 'translateX(1rem)' : 'translateX(0)',
        }}
      />
    </div>
    <span className={`text-xs font-medium text-[${COLORS.slate700}]`}>{label}</span>
  </label>
);

// ─── Grid Overlay ──────────────────────────────────────────────────────────

export const GridOverlay = ({
  visible,
  density,
}: {
  visible: boolean;
  density: number;
}) => {
  if (!visible) return null;

  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.18) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.18) 1px, transparent 1px)
          `,
          backgroundSize: `${density}% ${density}%`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: `${density}% ${density}%`,
          backgroundPosition: "0.5px 0.5px",
        }}
      />
    </>
  );
};

// ─── Draggable Doc Field Tag ───────────────────────────────────────────────

export const DraggableDocField = ({
  tagKey,
  label,
  fieldState,
  containerRef,
  onPositionChange,
  isSelected,
  onSelect,
  snapEnabled,
  gridDensity,
  showSampleValue = false,
  containerWidth,
}: {
  tagKey: string;
  label: string;
  fieldState: DocFieldState;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onPositionChange: (key: string, x: number, y: number) => void;
  isSelected: boolean;
  onSelect: (key: string) => void;
  snapEnabled: boolean;
  gridDensity: number;
  showSampleValue?: boolean;
  containerWidth?: number;
}) => {
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const tagRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const pendingResetRef = useRef(false);

  const scale = containerWidth ? Math.min(1, containerWidth / REFERENCE_CONTAINER_WIDTH) : 1;
  const scaledFontSize = Math.max(6, fieldState.fontSize * scale);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

      if (!arrowKeys.includes(e.key)) return;
      e.preventDefault();
      e.stopPropagation();

      const step = e.shiftKey ? NUDGE_STEP_SHIFT : NUDGE_STEP;
      let newX = fieldState.x;
      let newY = fieldState.y;

      switch (e.key) {
        case "ArrowLeft":  newX = Math.max(0, newX - step); break;
        case "ArrowRight": newX = Math.min(100, newX + step); break;
        case "ArrowUp":    newY = Math.max(0, newY - step); break;
        case "ArrowDown":  newY = Math.min(100, newY + step); break;
      }

      if (snapEnabled) {
        newX = snapToGrid(newX, gridDensity, true);
        newY = snapToGrid(newY, gridDensity, true);
      }

      pendingResetRef.current = true;
      onPositionChange(tagKey, newX, newY);
    },
    [fieldState.x, fieldState.y, snapEnabled, gridDensity, onPositionChange, tagKey]
  );

  useLayoutEffect(() => {
    if (pendingResetRef.current) {
      dragX.jump(0);
      dragY.jump(0);
      pendingResetRef.current = false;
    }
  });

  const handleDragEnd = useCallback(
    (e: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
      e.stopPropagation();
      isDraggingRef.current = false;

      if (!containerRef.current) {
        dragX.jump(0);
        dragY.jump(0);

        return;
      }

      const rect = containerRef.current.getBoundingClientRect();

      let xPct = Math.max(0, Math.min(100, ((info.point.x - rect.left) / rect.width) * 100));
      let yPct = Math.max(0, Math.min(100, ((info.point.y - rect.top) / rect.height) * 100));

      xPct = snapToGrid(xPct, gridDensity, snapEnabled);
      yPct = snapToGrid(yPct, gridDensity, snapEnabled);

      pendingResetRef.current = true;
      onPositionChange(tagKey, xPct, yPct);
    },
    [containerRef, dragX, dragY, gridDensity, onPositionChange, snapEnabled, tagKey]
  );

  // Determine display text
  const displayLabel = fieldState.label || label;

  const displayText = showSampleValue && fieldState.sampleValue
    ? fieldState.sampleValue
    : `{{${displayLabel}}}`;

  return (
    <motion.div
      ref={tagRef}
      drag
      dragMomentum={false}
      dragConstraints={containerRef}
      dragElastic={0}
      tabIndex={0}
      role="button"
      aria-label={`${displayLabel} field at ${fieldState.x.toFixed(1)}% x ${fieldState.y.toFixed(1)}%`}
      style={{
        position: "absolute",
        left: `${fieldState.x}%`,
        top: `${fieldState.y}%`,
        x: dragX,
        y: dragY,
        fontSize: `${scaledFontSize}px`,
        fontFamily: "Inter",
        color: "#000000",
        touchAction: "none",
      }}
      onKeyDown={handleKeyDown}
      onPointerDown={(e) => {
        e.stopPropagation();
        isDraggingRef.current = false;
        onSelect(tagKey);
      }}
      onDragStart={() => {
        isDraggingRef.current = true;
      }}
      onDrag={(e) => {
        e.stopPropagation();
      }}
      onDragEnd={handleDragEnd}
      data-draggable-tag
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2 px-2 py-1 border rounded whitespace-nowrap cursor-grab active:cursor-grabbing shadow-sm z-10 transition-shadow select-none font-semibold",
        showSampleValue && fieldState.sampleValue
          ? "bg-transparent border-transparent shadow-none"
          : "bg-white/90",
        isSelected
          ? `border-[${COLORS.pink600}] border-2 shadow-md ring-2 ring-[${COLORS.pink600}]/20`
          : showSampleValue && fieldState.sampleValue
            ? "border-transparent hover:border-dashed hover:border-gray-400 hover:shadow-md"
            : "border-dashed border-gray-400 hover:border-gray-600 hover:shadow-md"
      )}
    >
      {displayText}
    </motion.div>
  );
};

// ─── Doc Preview Fields (renders only active/added fields) ─────────────────

export function DocPreviewFields({
  fieldPositions,
  onPositionChange,
  containerRef,
  selectedField,
  onSelectField,
  snapEnabled,
  gridDensity,
  showSampleValues = false,
  containerWidth,
}: {
  fieldPositions: DocFieldPositions;
  onPositionChange: (key: string, x: number, y: number) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  selectedField: string | null;
  onSelectField: (key: string) => void;
  snapEnabled: boolean;
  gridDensity: number;
  showSampleValues?: boolean;
  containerWidth?: number;
}) {
  return (
    <>
      {Object.entries(fieldPositions).map(([key, state]) => {
        // Resolve display label
        const predefined = PREDEFINED_DOC_FIELDS.find((f) => f.key === key);
        const label = predefined?.label || state.label || "Custom";

        return (
          <DraggableDocField
            key={key}
            tagKey={key}
            label={label}
            fieldState={state}
            containerRef={containerRef}
            onPositionChange={onPositionChange}
            isSelected={selectedField === key}
            onSelect={onSelectField}
            snapEnabled={snapEnabled}
            gridDensity={gridDensity}
            showSampleValue={showSampleValues}
            containerWidth={containerWidth}
          />
        );
      })}
    </>
  );
}

// ─── Field Properties Panel ─────────────────────────────────────────────────

export function DocFieldPropertiesPanel({
  fieldKey,
  fieldState,
  onUpdate,
}: {
  fieldKey: string;
  fieldState: DocFieldState;
  onUpdate: (key: string, updates: Partial<DocFieldState>) => void;
}) {
  // Resolve label
  const predefined = PREDEFINED_DOC_FIELDS.find((f) => f.key === fieldKey);
  const displayLabel = predefined?.label || fieldState.label || "Custom Field";

  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full bg-[${COLORS.pink600}]`} />
        <span className={`text-sm font-semibold text-[${COLORS.slate900}]`}>
          {displayLabel} Properties
        </span>
      </div>

      {/* Position X / Y with quantity adjusters */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className={`flex items-center gap-1 text-xs font-medium text-[${COLORS.slate600}]`}>
            <Crosshair className="h-3 w-3" /> X (%)
          </label>
          <div className="flex items-center gap-1">
            <button
              type="button"
              title="Decrease X"
              onClick={() => onUpdate(fieldKey, { x: Math.max(0, fieldState.x - NUDGE_STEP) })}
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-input",
                "bg-transparent text-sm transition-colors hover:bg-slate-100 active:bg-slate-200"
              )}
            >
              <Minus className="h-3 w-3" />
            </button>
            <Input
              type="number"
              min={0}
              max={100}
              step={0.5}
              value={fieldState.x.toFixed(1)}
              onChange={(e) => {
                const v = parseFloat(e.target.value);

                if (!isNaN(v)) onUpdate(fieldKey, { x: Math.max(0, Math.min(100, v)) });
              }}
              className={cn(AUTH_INPUT.base, "h-8 text-xs text-center [&::-webkit-inner-spin-button]:appearance-none")}
            />
            <button
              type="button"
              title="Increase X"
              onClick={() => onUpdate(fieldKey, { x: Math.min(100, fieldState.x + NUDGE_STEP) })}
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-input",
                "bg-transparent text-sm transition-colors hover:bg-slate-100 active:bg-slate-200"
              )}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
        <div className="space-y-1">
          <label className={`flex items-center gap-1 text-xs font-medium text-[${COLORS.slate600}]`}>
            <Crosshair className="h-3 w-3" /> Y (%)
          </label>
          <div className="flex items-center gap-1">
            <button
              type="button"
              title="Decrease Y"
              onClick={() => onUpdate(fieldKey, { y: Math.max(0, fieldState.y - NUDGE_STEP) })}
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-input",
                "bg-transparent text-sm transition-colors hover:bg-slate-100 active:bg-slate-200"
              )}
            >
              <Minus className="h-3 w-3" />
            </button>
            <Input
              type="number"
              min={0}
              max={100}
              step={0.5}
              value={fieldState.y.toFixed(1)}
              onChange={(e) => {
                const v = parseFloat(e.target.value);

                if (!isNaN(v)) onUpdate(fieldKey, { y: Math.max(0, Math.min(100, v)) });
              }}
              className={cn(AUTH_INPUT.base, "h-8 text-xs text-center [&::-webkit-inner-spin-button]:appearance-none")}
            />
            <button
              type="button"
              title="Increase Y"
              onClick={() => onUpdate(fieldKey, { y: Math.min(100, fieldState.y + NUDGE_STEP) })}
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-input",
                "bg-transparent text-sm transition-colors hover:bg-slate-100 active:bg-slate-200"
              )}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
      <p className={`text-[10px] text-[${COLORS.slate400}]`}>
        Tip: Select a field and use arrow keys to nudge (hold Shift for larger steps)
      </p>

      {/* Font Size */}
      <div className="space-y-1.5">
        <label className={`flex items-center gap-1 text-xs font-medium text-[${COLORS.slate600}]`}>
          <Type className="h-3 w-3" /> Font Size ({fieldState.fontSize}px)
        </label>
        <input
          type="range"
          min={6}
          max={72}
          step={1}
          value={fieldState.fontSize}
          onChange={(e) => onUpdate(fieldKey, { fontSize: Number(e.target.value) })}
          title="Font size"
          className={`w-full h-1.5 rounded-full appearance-none bg-gray-200 accent-[${COLORS.pink600}] cursor-pointer`}
        />
        <div className={`flex justify-between text-[10px] text-[${COLORS.slate400}]`}>
          <span>6px</span>
          <span>72px</span>
        </div>
      </div>

      {/* Custom Label (for CUSTOM field type) */}
      {fieldState.field_type === "CUSTOM" && (
        <div className="space-y-1.5">
          <label className={`flex items-center gap-1 text-xs font-medium text-[${COLORS.slate600}]`}>
            <TextCursorInput className="h-3 w-3" /> Custom Label
          </label>
          <Input
            type="text"
            value={fieldState.label || ""}
            onChange={(e) => onUpdate(fieldKey, { label: e.target.value })}
            className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "h-8 text-xs")}
            placeholder="Enter custom field label…"
          />
        </div>
      )}

      {/* Sample Value */}
      <div className="space-y-1.5">
        <label className={`flex items-center gap-1 text-xs font-medium text-[${COLORS.slate600}]`}>
          <TextCursorInput className="h-3 w-3" /> Sample Value
        </label>
        <Input
          type="text"
          value={fieldState.sampleValue}
          onChange={(e) => onUpdate(fieldKey, { sampleValue: e.target.value })}
          className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "h-8 text-xs")}
          placeholder={`Enter sample ${displayLabel.toLowerCase()}…`}
        />
        <p className={`text-[10px] text-[${COLORS.slate400}]`}>
          Enter a value to preview how it looks on the document
        </p>
      </div>
    </div>
  );
}
