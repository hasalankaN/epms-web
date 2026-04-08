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
import type { CertificateTemplateItem } from "@/types/certificate";

const SAMPLE_VALUES: Record<string, string> = {
  certificateId: "CERT-2026-001",
  courseName: "Advanced Web Development",
  studentName: "John Doe",
  issuedDate: "2026-03-13",
  course_name: "Advanced Web Development",
  student_name: "John Doe",
  date_issued: "2026-03-13",
};

// ─── Tag entry from API ───────────────────────────────────────────────────────

interface ApiTagEntry {
  x: number;
  y: number;
  fontSize?: number;
  fontColor?: string;
  fontFamily?: string;
  fontWeight?: string;
  opacity?: number;
}

// ─── Helper: Get a display label from a tag key ───────────────────────────────

function getLabelFromKey(key: string): string {
  const map: Record<string, string> = {
    certificateId: "Certificate ID",
    courseName: "Course Name",
    studentName: "Student Name",
    issuedDate: "Issued Date",
    course_name: "Course Name",
    student_name: "Student Name",
    date_issued: "Issued Date",
  };

  return map[key] ?? key;
}

// ─── Helper: font-weight string to CSS numeric ────────────────────────────────

function fontWeightToNum(fw?: string): number {
  const map: Record<string, number> = { normal: 400, medium: 500, semibold: 600, bold: 700 };

  return map[fw ?? "normal"] ?? 400;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ViewCertificateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: CertificateTemplateItem | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ViewCertificateTemplateModal({
  isOpen,
  onClose,
  certificate,
}: ViewCertificateTemplateModalProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);

  // Reset state on open / certificate change
  useEffect(() => {
    if (!isOpen) return;
    setImgLoaded(false);
    setImgError(false);
    setImageAspectRatio(null);
  }, [isOpen, certificate]);

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

  if (!certificate) return null;

  const tagLayout = certificate.tag_layout as Record<string, ApiTagEntry> | null;

  const signatureLayout = certificate.signature_layout as Record<string, {
    x: number; y: number; width: number; opacity?: number; rotation?: number;
  }> | null;

  const hasTags = tagLayout && Object.keys(tagLayout).length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        animateChildren={true}
        isLoading={!imgLoaded}
        className={cn(
          "flex w-[95vw] max-w-[95vw] sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[900px]",
          "h-[92vh] max-h-[92vh] flex-col gap-0",
          "rounded-xl border border-[#E2E8F0] bg-white p-0 shadow-[0_8px_30px_rgba(0,0,0,0.12)]",
          "overflow-hidden [&>button]:hidden",
        )}
      >

        {/* ===== HEADER ===== */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4 p-4 sm:p-6 pb-0 shrink-0 bg-white">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex-1 font-inter text-lg font-semibold leading-[30px] text-[#0F172B]">
              Certificate Preview
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

        {/* ===== BODY (Certificate Preview) ===== */}
        <motion.div variants={itemVariants} className="flex-1 overflow-auto bg-[#F8FAFC] custom-scrollbar">
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
              {!imgError ? (
                <img
                  ref={imgRef}
                  src={certificate.template_file_url}
                  alt={`${certificate.name} template`}
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
                    <p className="text-sm text-slate-500">Template image unavailable</p>
                  </div>
                </div>
              )}

              {/* Tag overlays — rendered only after image loads */}
              <AnimatePresence>
                {imgLoaded && hasTags && Object.entries(tagLayout!).map(([key, tag]) => {
                  const sampleVal = SAMPLE_VALUES[key] ?? getLabelFromKey(key);

                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 }}
                      className="absolute whitespace-nowrap pointer-events-none px-2 py-1"
                      style={{
                        left: `${tag.x}%`,
                        top: `${tag.y}%`,
                        fontSize: tag.fontSize && containerWidth
                          ? `${Math.max(6, tag.fontSize * Math.min(1, containerWidth / 800))}px`
                          : "12px",
                        color: tag.fontColor ?? "#000000",
                        fontFamily: tag.fontFamily ?? "Inter, sans-serif",
                        fontWeight: fontWeightToNum(tag.fontWeight),
                        opacity: (tag.opacity ?? 100) / 100,
                      }}
                    >
                      {sampleVal}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Signature overlay */}
              <AnimatePresence>
                {imgLoaded && signatureLayout && certificate.signature_image_url && (
                  Object.entries(signatureLayout).map(([key, sig]) => {
                    return (
                      <motion.img
                        key={key}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: sig.opacity ? sig.opacity / 100 : 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        src={certificate.signature_image_url!}
                        alt="Signature"
                        className="absolute pointer-events-none rounded p-0.5"
                        style={{
                          left: `${sig.x}%`,
                          top: `${sig.y}%`,
                          width: `${sig.width}%`,
                          rotate: sig.rotation ?? 0,
                        }}
                        draggable={false}
                      />
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* ===== FOOTER ===== */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-start gap-3 p-4 sm:p-6 pt-4 border-t border-[#E2E8F0] shrink-0 mt-auto bg-white"
        >
          {hasTags ? (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className={`text-[10px] font-semibold uppercase tracking-wider text-[${COLORS.slate400}]`}>
                Sample data shown:
              </span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(tagLayout!).map(([key]) => (
                  <span
                    key={key}
                    className={`text-xs font-medium text-[${COLORS.slate600}]`}
                  >
                    <span className={`text-[${COLORS.pink600}]`}>{getLabelFromKey(key)}</span>
                    {" = "}
                    {SAMPLE_VALUES[key] ?? "..."}
                  </span>
                ))}
              </div>
            </div>
          ) : (
             <span className={`text-xs font-medium text-[${COLORS.slate400}]`}>
               No dynamic tags present in this template.
             </span>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
