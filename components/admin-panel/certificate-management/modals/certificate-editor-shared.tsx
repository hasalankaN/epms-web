"use client";

import React, { useRef, useCallback, useLayoutEffect } from "react";

import { motion, useMotionValue, type PanInfo } from "framer-motion";
import { Crosshair, Type, Palette, Eye, TextCursorInput, CaseSensitive, Minus, Plus, Upload, Trash2, RotateCw, Maximize } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { COLORS, AUTH_INPUT } from "@/lib/constants/theme";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TagProperties {
  fontSize: number;
  fontColor: string;
  fontFamily: string;
  fontWeight: "normal" | "medium" | "semibold" | "bold";
  opacity: number;
}

export interface TagState {
  x: number;
  y: number;
  sampleValue: string;
  properties: TagProperties;
}

export type TagPositions = Record<string, TagState>;

export interface SignatureState {
  enabled: boolean;
  imageUrl: string | null;
  x: number;
  y: number;
  width: number;
  opacity: number;
  rotation: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const DRAGGABLE_TAGS = [
  { key: "certificateId", label: "Verification Number" },
  { key: "courseName", label: "Course Name" },
  { key: "studentName", label: "Student Name" },
  { key: "issuedDate", label: "Issued Date" },
] as const;

export const DEFAULT_TAG_PROPERTIES: TagProperties = {
  fontSize: 14,
  fontColor: "#000000",
  fontFamily: "Inter",
  fontWeight: "semibold",
  opacity: 100,
};

export const FONT_FAMILY_OPTIONS = [
  // Sans-serif
  { value: "Inter", label: "Inter", group: "Sans-serif" },
  { value: "Arial", label: "Arial", group: "Sans-serif" },
  { value: "Verdana", label: "Verdana", group: "Sans-serif" },
  { value: "Trebuchet MS", label: "Trebuchet MS", group: "Sans-serif" },
  { value: "Helvetica, Arial, sans-serif", label: "Helvetica", group: "Sans-serif" },

  // Serif
  { value: "Georgia", label: "Georgia", group: "Serif" },
  { value: "Times New Roman", label: "Times New Roman", group: "Serif" },
  { value: "Palatino Linotype", label: "Palatino", group: "Serif" },
  { value: "Garamond, serif", label: "Garamond", group: "Serif" },
  { value: "Book Antiqua, Palatino, serif", label: "Book Antiqua", group: "Serif" },

  // Cursive / Script (certificate-style)
  { value: "Brush Script MT, cursive", label: "Brush Script", group: "Cursive" },
  { value: "Lucida Handwriting, cursive", label: "Lucida Handwriting", group: "Cursive" },
  { value: "Segoe Script, cursive", label: "Segoe Script", group: "Cursive" },
  { value: "Palace Script MT, cursive", label: "Palace Script", group: "Cursive" },
  { value: "Script MT Bold, cursive", label: "Script MT Bold", group: "Cursive" },
  { value: "Edwardian Script ITC, cursive", label: "Edwardian Script", group: "Cursive" },
  { value: "cursive", label: "Cursive (System)", group: "Cursive" },

  // Display / Decorative
  { value: "Copperplate, Copperplate Gothic Light, fantasy", label: "Copperplate", group: "Display" },
  { value: "Papyrus, fantasy", label: "Papyrus", group: "Display" },
  { value: "Impact, sans-serif", label: "Impact", group: "Display" },

  // Monospace
  { value: "Courier New", label: "Courier New", group: "Monospace" },
  { value: "Consolas, monospace", label: "Consolas", group: "Monospace" },
] as const;

const FONT_FAMILY_GROUPS = ["Sans-serif", "Serif", "Cursive", "Display", "Monospace"] as const;

/** Step size for arrow-key / quantity-adjuster nudging (%) */
const NUDGE_STEP = 0.5;
const NUDGE_STEP_SHIFT = 5;

/**
 * Reference container width in px. Font sizes are authored at this width;
 * in smaller containers they scale down proportionally so the preview
 * matches the expanded editor.
 */
export const REFERENCE_CONTAINER_WIDTH = 800;

export const DEFAULT_SAMPLE_VALUES: Record<string, string> = {
  certificateId: "CERT-2026-001",
  courseName: "Advanced Web Development",
  studentName: "John Doe",
  issuedDate: "2026-03-05",
};

export const DEFAULT_SIGNATURE_STATE: SignatureState = {
  enabled: false,
  imageUrl: null,
  x: 70,
  y: 85,
  width: 15,
  opacity: 100,
  rotation: 0,
};

export const DEFAULT_TAG_POSITIONS: TagPositions = {
  certificateId: { x: 25, y: 15, sampleValue: DEFAULT_SAMPLE_VALUES.certificateId, properties: { ...DEFAULT_TAG_PROPERTIES } },
  courseName: { x: 50, y: 45, sampleValue: DEFAULT_SAMPLE_VALUES.courseName, properties: { ...DEFAULT_TAG_PROPERTIES } },
  studentName: { x: 50, y: 60, sampleValue: DEFAULT_SAMPLE_VALUES.studentName, properties: { ...DEFAULT_TAG_PROPERTIES } },
  issuedDate: { x: 30, y: 80, sampleValue: DEFAULT_SAMPLE_VALUES.issuedDate, properties: { ...DEFAULT_TAG_PROPERTIES } },
};

export const FONT_WEIGHT_OPTIONS: { value: TagProperties["fontWeight"]; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "medium", label: "Medium" },
  { value: "semibold", label: "Semibold" },
  { value: "bold", label: "Bold" },
];

export const GRID_DENSITY_OPTIONS = [
  { value: 5, label: "Fine (5%)" },
  { value: 10, label: "Medium (10%)" },
  { value: 20, label: "Coarse (20%)" },
] as const;

export const FONT_WEIGHT_CLASS_MAP: Record<string, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function snapToGrid(value: number, gridSize: number, enabled: boolean): number {
  if (!enabled) return value;

  return Math.round(value / gridSize) * gridSize;
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
      {/* Dark stroke — visible on light backgrounds */}
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
      {/* Light stroke — visible on dark backgrounds */}
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

// ─── Draggable Tag ─────────────────────────────────────────────────────────

export const DraggableTag = ({
  tagKey,
  label,
  tagState,
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
  tagState: TagState;
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
  const { properties } = tagState;

  // Scale font size proportionally so small and large previews match
  const scale = containerWidth ? Math.min(1, containerWidth / REFERENCE_CONTAINER_WIDTH) : 1;
  const scaledFontSize = Math.max(6, properties.fontSize * scale);

  // Arrow-key movement handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

      if (!arrowKeys.includes(e.key)) return;
      e.preventDefault();
      e.stopPropagation();

      const step = e.shiftKey ? NUDGE_STEP_SHIFT : NUDGE_STEP;
      let newX = tagState.x;
      let newY = tagState.y;

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
    [tagState.x, tagState.y, snapEnabled, gridDensity, onPositionChange, tagKey]
  );

  // Reset drag offset synchronously AFTER React has committed new left/top
  // but BEFORE the browser paints — eliminates the 1-frame jump.
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

      // Use the pointer position directly — this is exactly where the cursor is,
      // unaffected by the -translate-x/y-1/2 CSS transform on the element.
      let xPct = Math.max(0, Math.min(100, ((info.point.x - rect.left) / rect.width) * 100));
      let yPct = Math.max(0, Math.min(100, ((info.point.y - rect.top) / rect.height) * 100));

      xPct = snapToGrid(xPct, gridDensity, snapEnabled);
      yPct = snapToGrid(yPct, gridDensity, snapEnabled);

      // Mark that we need to reset the drag offset after React commits the
      // new left/top values — useLayoutEffect above handles this.
      pendingResetRef.current = true;
      onPositionChange(tagKey, xPct, yPct);
    },
    [containerRef, dragX, dragY, gridDensity, onPositionChange, snapEnabled, tagKey]
  );

  return (
    <motion.div
      ref={tagRef}
      drag
      dragMomentum={false}
      dragConstraints={containerRef}
      dragElastic={0}
      tabIndex={0}
      role="button"
      aria-label={`${label} tag at ${tagState.x.toFixed(1)}% x ${tagState.y.toFixed(1)}%`}
      style={{
        position: "absolute",
        left: `${tagState.x}%`,
        top: `${tagState.y}%`,
        x: dragX,
        y: dragY,
        fontSize: `${scaledFontSize}px`,
        fontFamily: properties.fontFamily,
        color: properties.fontColor,
        opacity: properties.opacity / 100,
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
        "absolute -translate-x-1/2 -translate-y-1/2 px-2 py-1 border rounded whitespace-nowrap cursor-grab active:cursor-grabbing shadow-sm z-10 transition-shadow select-none",
        FONT_WEIGHT_CLASS_MAP[properties.fontWeight] ?? "font-semibold",
        showSampleValue && tagState.sampleValue
          ? "bg-transparent border-transparent shadow-none"
          : "bg-white/90",
        isSelected
          ? `border-[${COLORS.pink600}] border-2 shadow-md ring-2 ring-[${COLORS.pink600}]/20`
          : showSampleValue && tagState.sampleValue
            ? "border-transparent hover:border-dashed hover:border-gray-400 hover:shadow-md"
            : "border-dashed border-gray-400 hover:border-gray-600 hover:shadow-md"
      )}
    >
      {showSampleValue && tagState.sampleValue ? tagState.sampleValue : `{{${label}}}`}
    </motion.div>
  );
};

// ─── Draggable Signature ───────────────────────────────────────────────────

export const DraggableSignature = ({
  signatureState,
  containerRef,
  onPositionChange,
  isSelected,
  onSelect,

  // onDeselect — kept in interface for callers, not needed internally
  snapEnabled,
  gridDensity,
}: {
  signatureState: SignatureState;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onPositionChange: (x: number, y: number) => void;
  isSelected: boolean;
  onSelect: () => void;
  onDeselect: () => void;
  snapEnabled: boolean;
  gridDensity: number;
  containerWidth?: number;
}) => {
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const pendingResetRef = useRef(false);
  const isDraggingRef = useRef(false);

  // Width is already a percentage of the container — it scales naturally.
  // Only font sizes (in px) need the containerWidth-based scale factor.

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

      if (!arrowKeys.includes(e.key)) return;
      e.preventDefault();
      e.stopPropagation();

      const step = e.shiftKey ? NUDGE_STEP_SHIFT : NUDGE_STEP;
      let newX = signatureState.x;
      let newY = signatureState.y;

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
      onPositionChange(newX, newY);
    },
    [signatureState.x, signatureState.y, snapEnabled, gridDensity, onPositionChange]
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
      onPositionChange(xPct, yPct);
    },
    [containerRef, dragX, dragY, gridDensity, onPositionChange, snapEnabled]
  );

  if (!signatureState.enabled || !signatureState.imageUrl) return null;

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={containerRef}
      dragElastic={0}
      tabIndex={0}
      role="button"
      aria-label={`Signature at ${signatureState.x.toFixed(1)}% x ${signatureState.y.toFixed(1)}%`}
      style={{
        position: "absolute",
        left: `${signatureState.x}%`,
        top: `${signatureState.y}%`,
        width: `${signatureState.width}%`,
        x: dragX,
        y: dragY,
        opacity: signatureState.opacity / 100,
        rotate: signatureState.rotation,
        touchAction: "none",
      }}
      onKeyDown={handleKeyDown}
      onPointerDown={(e) => {
        e.stopPropagation();
        isDraggingRef.current = false;
        onSelect();
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
        "absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing z-10 transition-shadow select-none rounded",
        isSelected
          ? `border-2 border-[${COLORS.pink600}] shadow-md ring-2 ring-[${COLORS.pink600}]/20 p-0.5`
          : "border border-transparent hover:border-dashed hover:border-gray-400 hover:shadow-md p-0.5"
      )}
    >
      <img
        src={signatureState.imageUrl}
        alt="Digital Signature"
        className="w-full h-auto pointer-events-none select-none"
        draggable={false}
      />
    </motion.div>
  );
};

// ─── Certificate Preview Tags ──────────────────────────────────────────────

export function CertificatePreviewTags({
  tagPositions,
  onPositionChange,
  containerRef,
  selectedTag,
  onSelectTag,
  snapEnabled,
  gridDensity,
  showSampleValues = false,
  containerWidth,
}: {
  tagPositions: TagPositions;
  onPositionChange: (key: string, x: number, y: number) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  selectedTag: string | null;
  onSelectTag: (key: string) => void;
  snapEnabled: boolean;
  gridDensity: number;
  showSampleValues?: boolean;
  containerWidth?: number;
}) {
  return (
    <>
      {DRAGGABLE_TAGS.map((tag) => (
        <DraggableTag
          key={tag.key}
          tagKey={tag.key}
          label={tag.label}
          tagState={tagPositions[tag.key]}
          containerRef={containerRef}
          onPositionChange={onPositionChange}
          isSelected={selectedTag === tag.key}
          onSelect={onSelectTag}
          snapEnabled={snapEnabled}
          gridDensity={gridDensity}
          showSampleValue={showSampleValues}
          containerWidth={containerWidth}
        />
      ))}
    </>
  );
}

// ─── Tag Properties Panel ────────────────────────────────────────────────────

export function TagPropertiesPanel({
  tagKey,
  tagState,
  onUpdate,
  compact = false,
}: {
  tagKey: string;
  tagState: TagState;
  onUpdate: (key: string, updates: Partial<TagState>) => void;
  compact?: boolean;
}) {
  const tag = DRAGGABLE_TAGS.find((t) => t.key === tagKey);

  if (!tag) return null;

  const { properties } = tagState;

  const updateProp = (propUpdates: Partial<TagProperties>) => {
    onUpdate(tagKey, {
      properties: { ...properties, ...propUpdates },
    });
  };

  return (
    <div className={cn(
      "rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] space-y-4",
      compact ? "p-3" : "p-4"
    )}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full bg-[${COLORS.pink600}]`} />
        <span className={cn(
          `font-semibold text-[${COLORS.slate900}]`,
          compact ? "text-xs" : "text-sm"
        )}>
          {tag.label} Properties
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
              onClick={() => onUpdate(tagKey, { x: Math.max(0, tagState.x - NUDGE_STEP) })}
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
              value={tagState.x.toFixed(1)}
              onChange={(e) => {
                const v = parseFloat(e.target.value);

                if (!isNaN(v)) onUpdate(tagKey, { x: Math.max(0, Math.min(100, v)) });
              }}
              className={cn(AUTH_INPUT.base, "h-8 text-xs text-center [&::-webkit-inner-spin-button]:appearance-none")}
            />
            <button
              type="button"
              title="Increase X"
              onClick={() => onUpdate(tagKey, { x: Math.min(100, tagState.x + NUDGE_STEP) })}
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
              onClick={() => onUpdate(tagKey, { y: Math.max(0, tagState.y - NUDGE_STEP) })}
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
              value={tagState.y.toFixed(1)}
              onChange={(e) => {
                const v = parseFloat(e.target.value);

                if (!isNaN(v)) onUpdate(tagKey, { y: Math.max(0, Math.min(100, v)) });
              }}
              className={cn(AUTH_INPUT.base, "h-8 text-xs text-center [&::-webkit-inner-spin-button]:appearance-none")}
            />
            <button
              type="button"
              title="Increase Y"
              onClick={() => onUpdate(tagKey, { y: Math.min(100, tagState.y + NUDGE_STEP) })}
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
        Tip: Select a tag and use arrow keys to nudge (hold Shift for larger steps)
      </p>

      {/* Font Family */}
      <div className="space-y-1.5">
        <label className={`flex items-center gap-1 text-xs font-medium text-[${COLORS.slate600}]`}>
          <CaseSensitive className="h-3 w-3" /> Font Family
        </label>
        <Select
          value={properties.fontFamily}
          onValueChange={(v) => updateProp({ fontFamily: v })}
        >
          <SelectTrigger
            className={cn(
              AUTH_INPUT.base,
              "h-8 text-xs",
              AUTH_INPUT.placeholder
            )}
          >
            <SelectValue placeholder="Select font…" />
          </SelectTrigger>
          <SelectContent className="max-h-60" style={{ zIndex: 99999999 }}>
            {FONT_FAMILY_GROUPS.map((group) => {
              const fonts = FONT_FAMILY_OPTIONS.filter((f) => f.group === group);

              return (
                <React.Fragment key={group}>
                  <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {group}
                  </div>
                  {fonts.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-xs"
                    >
                      <span style={{ fontFamily: opt.value }}>{opt.label}</span>
                    </SelectItem>
                  ))}
                </React.Fragment>
              );
            })}
          </SelectContent>
        </Select>
        <div
          className="rounded-md border border-input bg-transparent px-3 py-2 text-sm text-muted-foreground"
          style={{ fontFamily: properties.fontFamily }}
        >
          The quick brown fox jumps over the lazy dog
        </div>
      </div>

      {/* Font Size */}
      <div className="space-y-1.5">
        <label className={`flex items-center gap-1 text-xs font-medium text-[${COLORS.slate600}]`}>
          <Type className="h-3 w-3" /> Font Size ({properties.fontSize}px)
        </label>
        <input
          type="range"
          min={8}
          max={48}
          step={1}
          value={properties.fontSize}
          onChange={(e) => updateProp({ fontSize: Number(e.target.value) })}
          title="Font size"
          className={`w-full h-1.5 rounded-full appearance-none bg-gray-200 accent-[${COLORS.pink600}] cursor-pointer`}
        />
        <div className={`flex justify-between text-[10px] text-[${COLORS.slate400}]`}>
          <span>8px</span>
          <span>48px</span>
        </div>
      </div>

      {/* Font Color */}
      <div className="space-y-1.5">
        <label className={`flex items-center gap-1 text-xs font-medium text-[${COLORS.slate600}]`}>
          <Palette className="h-3 w-3" /> Font Color
        </label>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="color"
              value={properties.fontColor}
              onChange={(e) => updateProp({ fontColor: e.target.value })}
              className="h-8 w-8 cursor-pointer rounded-md border border-input p-0.5"
              title="Pick font color"
            />
          </div>
          <Input
            type="text"
            value={properties.fontColor}
            onChange={(e) => {
              const v = e.target.value;

              if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) updateProp({ fontColor: v });
            }}
            className={cn(AUTH_INPUT.base, "h-8 text-xs font-mono flex-1")}
            placeholder="#000000"
          />
        </div>
      </div>

      {/* Font Weight */}
      <div className="space-y-1.5">
        <label className={`flex items-center gap-1 text-xs font-medium text-[${COLORS.slate600}]`}>
          <Type className="h-3 w-3 stroke-[3]" /> Font Weight
        </label>
        <div className={cn(
          "grid gap-1",
          compact ? "grid-cols-2" : "grid-cols-4"
        )}>
          {FONT_WEIGHT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateProp({ fontWeight: opt.value })}
              className={cn(
                "h-7 rounded text-[10px] font-medium border transition-colors",
                properties.fontWeight === opt.value
                  ? `bg-[${COLORS.pink600}] text-white border-[${COLORS.pink600}]`
                  : `bg-white text-[${COLORS.slate700}] border-[#E2E8F0] hover:bg-slate-50`
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sample Value */}
      <div className="space-y-1.5">
        <label className={`flex items-center gap-1 text-xs font-medium text-[${COLORS.slate600}]`}>
          <TextCursorInput className="h-3 w-3" /> Sample Value
        </label>
        <Input
          type="text"
          value={tagState.sampleValue}
          onChange={(e) => onUpdate(tagKey, { sampleValue: e.target.value })}
          className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "h-8 text-xs")}
          placeholder={`Enter sample ${tag.label.toLowerCase()}…`}
        />
        <p className={`text-[10px] text-[${COLORS.slate400}]`}>
          Enter a value to preview how it looks on the certificate
        </p>
      </div>

      {/* Opacity */}
      <div className="space-y-1.5">
        <label className={`flex items-center gap-1 text-xs font-medium text-[${COLORS.slate600}]`}>
          <Eye className="h-3 w-3" /> Opacity ({properties.opacity}%)
        </label>
        <input
          type="range"
          min={10}
          max={100}
          step={5}
          value={properties.opacity}
          onChange={(e) => updateProp({ opacity: Number(e.target.value) })}
          title="Opacity"
          className={`w-full h-1.5 rounded-full appearance-none bg-gray-200 accent-[${COLORS.pink600}] cursor-pointer`}
        />
        <div className={`flex justify-between text-[10px] text-[${COLORS.slate400}]`}>
          <span>10%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}

// ─── Signature Properties Panel ──────────────────────────────────────────────

export function SignaturePropertiesPanel({
  signatureState,
  onUpdate,
  onRemoveImage,
  onUploadClick,
  compact = false,
}: {
  signatureState: SignatureState;
  onUpdate: (updates: Partial<SignatureState>) => void;
  onRemoveImage: () => void;
  onUploadClick: () => void;
  compact?: boolean;
}) {
  return (
    <div className={cn(
      "rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] space-y-4",
      compact ? "p-3" : "p-4"
    )}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full bg-[${COLORS.pink600}]`} />
        <span className={cn(
          `font-semibold text-[${COLORS.slate900}]`,
          compact ? "text-xs" : "text-sm"
        )}>
          Signature Properties
        </span>
      </div>

      {/* Signature image preview / upload */}
      {signatureState.imageUrl ? (
        <div className="space-y-2">
          <div className={`relative rounded-md border border-[${COLORS.line}] bg-white p-2 flex items-center justify-center`}>
            <img
              src={signatureState.imageUrl}
              alt="Signature"
              className="max-h-16 max-w-full object-contain"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onUploadClick}
              className={`flex-1 flex items-center justify-center gap-1.5 h-7 rounded text-[10px] font-medium border border-[${COLORS.line}] bg-white text-[${COLORS.slate700}] hover:bg-slate-50 transition-colors`}
            >
              <Upload className="h-3 w-3" /> Replace
            </button>
            <button
              type="button"
              onClick={onRemoveImage}
              className="flex-1 flex items-center justify-center gap-1.5 h-7 rounded text-[10px] font-medium border border-red-200 bg-white text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-3 w-3" /> Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={onUploadClick}
          className={`w-full flex items-center justify-center gap-2 h-10 rounded-md border border-dashed border-[${COLORS.line}] bg-white text-xs font-medium text-[${COLORS.slate600}] hover:bg-slate-50 hover:border-[${COLORS.pink600}]/40 transition-colors`}
        >
          <Upload className="h-3.5 w-3.5" /> Upload Signature Image
        </button>
      )}

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
              onClick={() => onUpdate({ x: Math.max(0, signatureState.x - NUDGE_STEP) })}
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
              value={signatureState.x.toFixed(1)}
              onChange={(e) => {
                const v = parseFloat(e.target.value);

                if (!isNaN(v)) onUpdate({ x: Math.max(0, Math.min(100, v)) });
              }}
              className={cn(AUTH_INPUT.base, "h-8 text-xs text-center [&::-webkit-inner-spin-button]:appearance-none")}
            />
            <button
              type="button"
              title="Increase X"
              onClick={() => onUpdate({ x: Math.min(100, signatureState.x + NUDGE_STEP) })}
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
              onClick={() => onUpdate({ y: Math.max(0, signatureState.y - NUDGE_STEP) })}
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
              value={signatureState.y.toFixed(1)}
              onChange={(e) => {
                const v = parseFloat(e.target.value);

                if (!isNaN(v)) onUpdate({ y: Math.max(0, Math.min(100, v)) });
              }}
              className={cn(AUTH_INPUT.base, "h-8 text-xs text-center [&::-webkit-inner-spin-button]:appearance-none")}
            />
            <button
              type="button"
              title="Increase Y"
              onClick={() => onUpdate({ y: Math.min(100, signatureState.y + NUDGE_STEP) })}
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

      {/* Width */}
      <div className="space-y-1.5">
        <label className={`flex items-center gap-1 text-xs font-medium text-[${COLORS.slate600}]`}>
          <Maximize className="h-3 w-3" /> Width ({signatureState.width}%)
        </label>
        <input
          type="range"
          min={5}
          max={50}
          step={1}
          value={signatureState.width}
          onChange={(e) => onUpdate({ width: Number(e.target.value) })}
          title="Signature width"
          className={`w-full h-1.5 rounded-full appearance-none bg-gray-200 accent-[${COLORS.pink600}] cursor-pointer`}
        />
        <div className={`flex justify-between text-[10px] text-[${COLORS.slate400}]`}>
          <span>5%</span>
          <span>50%</span>
        </div>
      </div>

      {/* Rotation */}
      <div className="space-y-1.5">
        <label className={`flex items-center gap-1 text-xs font-medium text-[${COLORS.slate600}]`}>
          <RotateCw className="h-3 w-3" /> Rotation ({signatureState.rotation}°)
        </label>
        <input
          type="range"
          min={-180}
          max={180}
          step={1}
          value={signatureState.rotation}
          onChange={(e) => onUpdate({ rotation: Number(e.target.value) })}
          title="Rotation"
          className={`w-full h-1.5 rounded-full appearance-none bg-gray-200 accent-[${COLORS.pink600}] cursor-pointer`}
        />
        <div className={`flex justify-between text-[10px] text-[${COLORS.slate400}]`}>
          <span>-180°</span>
          <span>0°</span>
          <span>180°</span>
        </div>
      </div>

      {/* Opacity */}
      <div className="space-y-1.5">
        <label className={`flex items-center gap-1 text-xs font-medium text-[${COLORS.slate600}]`}>
          <Eye className="h-3 w-3" /> Opacity ({signatureState.opacity}%)
        </label>
        <input
          type="range"
          min={10}
          max={100}
          step={5}
          value={signatureState.opacity}
          onChange={(e) => onUpdate({ opacity: Number(e.target.value) })}
          title="Opacity"
          className={`w-full h-1.5 rounded-full appearance-none bg-gray-200 accent-[${COLORS.pink600}] cursor-pointer`}
        />
        <div className={`flex justify-between text-[10px] text-[${COLORS.slate400}]`}>
          <span>10%</span>
          <span>100%</span>
        </div>
      </div>

      <p className={`text-[10px] text-[${COLORS.slate400}]`}>
        Tip: Use a PNG image with a transparent background for the best result
      </p>
    </div>
  );
}
