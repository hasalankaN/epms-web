"use client";

import React from "react";

import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface ViewAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ViewAssessmentModal({
  isOpen,
  onClose,
}: ViewAssessmentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        closeClass="hidden"
        className="sm:max-w-[650px] p-0 overflow-hidden bg-white rounded-[12px] gap-0 border border-[#E2E8F0]"
      >
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between px-6 py-[18px] border-b border-[#E2E8F0]">
          <DialogTitle className="text-[18px] font-semibold text-[#0F172B] m-0">
            View Assessment
          </DialogTitle>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-[6px] border border-[#E2E8F0] shadow-sm hover:bg-slate-50 transition-colors"
          >
            <X className="w-5 h-5 text-[#0F172B]" />
          </button>
        </DialogHeader>

        {/* Body */}
        <div className="flex flex-col px-6 py-6 gap-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Assignment Info */}
          <div className="flex flex-col w-full">
            <h3 className="text-[18px] font-semibold text-[#1D293D] m-0 mb-1">
              Assignment Name
            </h3>
            <p className="text-[15px] text-[#475569] m-0 mb-3">Lesson Name</p>

            <div className="flex items-center mb-5">
              <Badge className="bg-[#E0E7FF] text-[#4F46E5] hover:bg-[#E0E7FF]/80 rounded-full font-medium shadow-none px-3 border-0 h-6">
                Category
              </Badge>
            </div>

            <p className="text-[15px] leading-[24px] text-[#475569] mb-4">
              <span className="text-[#1D293D] font-semibold">
                Assignment Description:
              </span>{" "}
              Lorem ipsum dolor sit amet consectetur. Elementum montes laoreet
              aliquam nibh adipiscing. Nec consequat venenatis nulla cras proin
              orci.
            </p>

            <div className="flex items-center gap-2 mb-2">
              <i className="file-pdf h-5 w-5 text-[#E60076]" />
              <a
                href="#"
                className="text-[#E60076] hover:underline text-[14px] font-semibold"
              >
                Assignment Guideline
              </a>
            </div>
          </div>

          <div className="h-[1px] w-full bg-[#E2E8F0]" />

          {/* Submission Status */}
          <div className="flex flex-col w-full px-1">
            <h3 className="text-[16px] font-semibold text-[#1D293D] mb-2">
              Submission Status
            </h3>

            <div className="flex flex-col w-full mt-2">
              <div className="flex items-center py-[22px] border-b border-[#E2E8F0]">
                <div className="flex-1 text-[14px] text-[#475569]">
                  Pending Submission
                </div>
                <div className="flex-1 text-[14px] text-[#475569] text-center">
                  Number
                </div>
                <div className="flex-1 text-[14px] font-semibold text-[#E60076] hover:underline cursor-pointer text-right">
                  View
                </div>
              </div>

              <div className="flex items-center py-[22px] border-b border-[#E2E8F0]">
                <div className="flex-1 text-[14px] text-[#475569]">
                  Pending Submission
                </div>
                <div className="flex-1 text-[14px] text-[#475569] text-center">
                  Number
                </div>
                <div className="flex-1 text-[14px] font-semibold text-[#E60076] hover:underline cursor-pointer text-right">
                  View
                </div>
              </div>

              <div className="flex items-center justify-between py-[22px] border-b border-[#E2E8F0]">
                <div className="text-[14px] text-[#475569]">Due Date</div>
                <div className="text-[14px] text-[#475569] text-right">
                  Sunday, 30th November, 11:59 PM
                </div>
              </div>

              <div className="flex items-center justify-between py-[22px] border-b border-[#E2E8F0]">
                <div className="text-[14px] text-[#475569]">Time remaining</div>
                <div className="text-[14px] text-[#475569] text-right">
                  3 Days , 1 hr , 40 minutes
                </div>
              </div>

              <div className="flex items-center justify-between py-[22px] border-b border-[#E2E8F0]">
                <div className="text-[14px] text-[#475569]">Last Modified</div>
                <div className="text-[14px] text-[#475569] text-right">
                  2026/01/21
                </div>
              </div>

              <div className="flex items-center py-[22px] border-b border-[#E2E8F0] last:border-0 pb-2">
                <div className="flex-1 text-[14px] text-[#475569]">
                  Not Submitted
                </div>
                <div className="flex-1 text-[14px] text-[#475569] text-center">
                  Number
                </div>
                <div className="flex-1 text-[14px] font-semibold text-[#E60076] hover:underline cursor-pointer text-right">
                  View
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
