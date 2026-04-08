"use client";

import React, { useRef, useState, useEffect } from "react";

import { X, ImageOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  itemVariants,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { COLORS } from "@/lib/constants/theme";
import { useGetDocumentTemplateById } from "@/hooks/api/documents/useGetDocumentTemplateById";
import { PREDEFINED_DOC_FIELDS, DEFAULT_SAMPLE_VALUES as FIELD_SAMPLE_VALUES } from "./document-editor-shared";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Get the display label for a field. Predefined fields use their label mapping; custom fields use the stored label. */
function getFieldLabel(fieldType: string, label?: string): string {
  const predefined = PREDEFINED_DOC_FIELDS.find((f) => f.field_type === fieldType);

  return predefined?.label ?? label ?? fieldType;
}

/** Get sample value for preview display */
function getFieldSampleValue(fieldKey: string, fieldType: string, label?: string): string {
  // Try the predefined key first
  if (FIELD_SAMPLE_VALUES[fieldKey]) return FIELD_SAMPLE_VALUES[fieldKey];

  // Fallback for custom fields
  return label ?? getFieldLabel(fieldType, label);
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ViewDocumentTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: string | null;
  templateName?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ViewDocumentTemplateModal({
  isOpen,
  onClose,
  templateId,
}: ViewDocumentTemplateModalProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);

  const { data: templateData, isLoading } = useGetDocumentTemplateById(
    isOpen && templateId ? templateId : null
  );

  // Reset state on open / template change
  useEffect(() => {
    if (!isOpen) return;
    setImgLoaded(false);
    setImgError(false);
    setImageAspectRatio(null);
  }, [isOpen, templateId]);

  // Track container width for proportional font scaling
  useEffect(() => {
    if (!imgLoaded || !containerRef.current) return;

    const container = containerRef.current;

    const ro = new ResizeObserver(() => {
      setContainerWidth(container.clientWidth);
    });

    ro.observe(container);
    setContainerWidth(container.clientWidth);

    return () => ro.disconnect();
  }, [imgLoaded]);

  const imageUrl = templateData?.current_version?.template_image_url ?? null;
  const fields = templateData?.current_version?.fields ?? [];
  const hasFields = fields.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        animateChildren={true}
        isLoading={isLoading}
        className={cn(
          "flex w-[95vw] max-w-[95vw] sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[900px]",
          "h-[92vh] max-h-[92vh] flex-col gap-0",
          "rounded-xl border border-[#E2E8F0] bg-white p-0 shadow-[0_8px_30px_rgba(0,0,0,0.12)]",
          "overflow-hidden [&>button]:hidden"
        )}
      >
        {/* ── Header ── */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-4 p-4 sm:p-6 pb-0 shrink-0 bg-white"
        >
          <div className="flex items-center justify-between">
            <DialogTitle className="flex-1 font-inter text-lg font-semibold leading-[30px] text-[#0F172B]">
              Document Preview
            </DialogTitle>
            <button
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-white transition-colors hover:bg-slate-50"
            >
              <X className="h-4 w-4 text-[#64748B]" />
            </button>
          </div>
          <div className="border-b border-[#E2E8F0]" />
        </motion.div>
 
        {/* ── Body: Template Image Preview ── */}
        <motion.div
           variants={itemVariants}
           className="flex-1 overflow-auto bg-[#F8FAFC] custom-scrollbar"
        >
          <div className="p-4 sm:p-6">
            <div
              ref={containerRef}
              className="relative mx-auto shadow-xl rounded-sm overflow-hidden select-none"
              style={{
                width: "100%",
                maxWidth: "900px",
                ...(imageAspectRatio ? { aspectRatio: String(imageAspectRatio) } : {}),
              }}
            >
              {/* Template image */}
              {imageUrl && !imgError ? (
                <img
                  ref={imgRef}
                  src={imageUrl}
                  alt={`${templateData?.name ?? "Document"} template`}
                  className="block w-full h-auto pointer-events-none"
                  draggable={false}
                  onLoad={(e) => {
                    const img = e.currentTarget;

                    setImageAspectRatio(img.naturalWidth / img.naturalHeight);

                    if (containerRef.current) {
                      setContainerWidth(containerRef.current.clientWidth);
                    }

                    setImgLoaded(true);
                  }}
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="flex flex-1 min-h-[40vh] items-center justify-center gap-3 bg-slate-100 rounded">
                  <div className="flex flex-col items-center">
                    <ImageOff className="h-10 w-10 text-slate-400 mb-2" />
                    <p className="text-sm text-slate-500">
                      {imgError ? "Template image unavailable" : "No template image uploaded"}
                    </p>
                  </div>
                </div>
              )}

              {/* Field overlays — shown after image loads */}
              <AnimatePresence>
                {imgLoaded && hasFields && fields.map((field) => {
                  const predefined = PREDEFINED_DOC_FIELDS.find(
                    (p) => p.field_type === field.field_type
                  );

                  const displayValue = getFieldSampleValue(
                    predefined?.key ?? field.id,
                    field.field_type,
                    field.label
                  );

                  return (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 }}
                      className="absolute whitespace-nowrap pointer-events-none"
                      style={{
                        left: `${field.x_position}%`,
                        top: `${field.y_position}%`,
                        fontSize: field.font_size && containerWidth
                          ? `${Math.max(6, field.font_size * Math.min(1, containerWidth / 800))}px`
                          : "12px",
                        color: "#0F172B",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 500,
                      }}
                    >
                      {displayValue}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* ── Footer ── */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-start gap-3 p-4 sm:p-6 pt-4 border-t border-[#E2E8F0] shrink-0 mt-auto bg-white"
        >
          {hasFields ? (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className={`text-[10px] font-semibold uppercase tracking-wider text-[${COLORS.slate400}]`}>
                Sample data shown:
              </span>
              <div className="flex flex-wrap gap-2">
                {fields.map((field) => {
                  const predefined = PREDEFINED_DOC_FIELDS.find(
                    (p) => p.field_type === field.field_type
                  );

                  const displayValue = getFieldSampleValue(
                    predefined?.key ?? field.id,
                    field.field_type,
                    field.label
                  );

                  return (
                    <span key={field.id} className={`text-xs font-medium text-[${COLORS.slate600}]`}>
                      <span className={`text-[${COLORS.pink600}]`}>
                        {getFieldLabel(field.field_type, field.label)}
                      </span>
                      {" = "}
                      {displayValue}
                    </span>
                  );
                })}
              </div>
            </div>
          ) : (
            !isLoading && (
              <span className={`text-xs font-medium text-[${COLORS.slate400}]`}>
                No dynamic fields present in this template.
              </span>
            )
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
