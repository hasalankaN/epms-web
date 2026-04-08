"use client";

import React, { useMemo } from "react";

import { X, Info } from "lucide-react";
import { motion } from "framer-motion";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  itemVariants,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useGetDocumentTemplateById } from "@/hooks/api/documents/useGetDocumentTemplateById";
import { useGetCourses } from "@/hooks/api/courses/useGetCourses";
import { useGetBatches } from "@/hooks/api/batches/useGetBatches";
import { cn } from "@/lib/utils";
import { BUTTON_STYLES } from "@/lib/constants/theme";

interface ViewAssignmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: string | null;
  templateName?: string;
}

export function ViewAssignmentsModal({
  isOpen,
  onClose,
  templateId,
}: ViewAssignmentsModalProps) {
  const { data: templateData, isLoading: templateLoading } = useGetDocumentTemplateById(
    isOpen && templateId ? templateId : null
  );

  // We fetch courses and batches to resolve names if the API only gives IDs
  const { data: coursesData, isLoading: coursesLoading } = useGetCourses({ size: 100 });
  const { data: batchesData, isLoading: batchesLoading } = useGetBatches({ size: 100 });

  const isLoading = templateLoading || coursesLoading || batchesLoading;

  const resolvedAssignments = useMemo(() => {
    if (!templateData?.assignments) {
      return [];
    }

    return templateData.assignments.map((a) => {
      if (a.course_id) {
        const course = coursesData?.results?.find((c) => c.id === a.course_id);

        return {
          id: a.id,
          type: "Course" as const,
          name: course?.name || `Course (ID: ${a.course_id.substring(0, 8)}...)`,
          idValue: a.course_id,
        };
      }

      if (a.batch_id) {
        const batch = batchesData?.results?.find((b) => b.id === a.batch_id);

        return {
          id: a.id,
          type: "Batch" as const,
          name: batch?.name || `Batch (ID: ${a.batch_id.substring(0, 8)}...)`,
          idValue: a.batch_id,
        };
      }

      return null;
    }).filter(Boolean);
  }, [templateData, coursesData, batchesData]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        animateChildren={true}
        isLoading={isLoading}
        className="flex max-h-[90vh] w-[95%] max-w-[500px] flex-col gap-0 overflow-hidden rounded-lg sm:rounded-xl border border-[#E2E8F0] bg-white p-0 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] [&>button]:hidden"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4 p-4 sm:p-6 pb-0 shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex-1 font-inter text-lg font-semibold leading-[30px] text-[#0F172B]">
              Assigned Courses & Batches
            </DialogTitle>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-white transition-colors hover:bg-slate-50"
            >
              <X className="h-4 w-4 text-[#64748B]" />
            </button>
          </div>
          <div className="border-b border-[#E2E8F0]" />
        </motion.div>

        {/* Body */}
        <motion.div variants={itemVariants} className="flex-1 overflow-y-auto p-4 sm:p-6 sm:pt-2 custom-scrollbar">
          {resolvedAssignments.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {resolvedAssignments.map((assignment) => (
                <div
                  key={assignment!.id}
                  className="flex items-center space-x-3 rounded-lg border border-[#E2E8F0] p-3 transition-colors hover:bg-slate-50"
                >
                  <label className="text-sm font-medium leading-none text-[#45556C] truncate">
                    {assignment!.name}
                  </label>
                </div>
              ))}
            </div>
          ) : !isLoading && (
            <div className="flex h-44 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#E2E8F0] bg-slate-50/50">
              <div className="p-3 rounded-full bg-slate-100">
                <Info className="h-6 w-6 text-[#94A3B8]" />
              </div>
              <p className="text-sm italic text-[#94A3B8]">No assignments found for this template.</p>
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div variants={itemVariants} className="flex items-center justify-end gap-3 p-4 sm:p-6 border-t border-[#E2E8F0] mt-auto">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className={cn(
              BUTTON_STYLES.secondary.md,
              "font-inter text-[14px] font-semibold text-[#0F172B] hover:bg-slate-100 bg-[#F1F5F9]"
            )}
          >
            Close
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
