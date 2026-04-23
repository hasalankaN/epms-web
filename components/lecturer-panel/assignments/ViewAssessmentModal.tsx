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
  assessmentData?: {
    name: string;
    lesson: string;
    category: string;
    description: string;
    dueDate: string;
    timeRemaining: string;
    lastModified: string;
  };
}

export function ViewAssessmentModal({
  isOpen,
  onClose,
  assessmentData,
}: ViewAssessmentModalProps) {
  const data = assessmentData || {
    name: "Assignment Name",
    lesson: "Lesson Name",
    category: "Category",
    description: "Lorem ipsum dolor sit amet consectetur. Elementum montes laoreet aliquam nibh adipiscing. Nec consequat venenatis nulla cras proin orci.",
    dueDate: "Sunday, 30th November, 11:59 PM",
    timeRemaining: "3 Days , 1 hr , 40 minutes",
    lastModified: "2026/01/21",
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        closeClass="hidden"
        className="sm:max-w-[704px] h-[704px] p-0 overflow-hidden bg-white rounded-[12px] gap-0 border border-[#E2E8F0] shadow-[0px_4px_6px_-4px_rgba(16,24,40,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)] flex flex-col"
      >
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-[#E2E8F0] h-[64px] shrink-0">
          <DialogTitle className="text-[18px] font-semibold text-[#0F172B] m-0">
            View Assessment
          </DialogTitle>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-[6px] border border-[#E2E8F0] shadow-[0px_1px_2px_rgba(16,24,40,0.05)] hover:bg-slate-50 transition-colors"
          >
            <X className="w-5 h-5 text-[#0F172B]" />
          </button>
        </DialogHeader>

        {/* Body */}
        <div className="flex flex-col p-6 gap-8 overflow-y-auto custom-scrollbar flex-grow">
          {/* Top Section: Assignment Details */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-[16px] font-semibold text-[#1D293D] m-0 uppercase letter-spacing-[0.02em]">
                {data.name}
              </h1>
              <p className="text-[14px] text-[#45556C] m-0">{data.lesson}</p>
            </div>
            
            <div className="flex">
              <Badge className="bg-[#D9E9FF] text-[#2563EB] hover:bg-[#D9E9FF]/80 rounded-full font-medium shadow-[0px_1px_2px_rgba(16,24,40,0.05)] px-3 border-0 h-5 text-[12px]">
                {data.category}
              </Badge>
            </div>

            <p className="text-[14px] leading-[20px] text-[#666666]">
              <span className="font-bold text-[#666666]">Assignment Description:</span> {data.description}
            </p>

            <button className="flex items-center gap-2 text-[#F6339A] hover:opacity-80 transition-opacity w-fit mt-1">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C5.47 2 4.96 2.21 4.59 2.59C4.21 2.96 4 3.47 4 4V20C4 20.53 4.21 21.04 4.59 21.41C4.96 21.79 5.47 22 6 22H18C18.53 22 19.04 21.79 19.41 21.41C19.79 21.04 20 20.53 20 20V8L14 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 15H9.01M9 18H15M9 12H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[12px] font-medium">Assignment Guideline</span>
            </button>
          </div>

          <div className="h-[1px] w-full bg-[#E2E8F0]" />

          {/* Bottom Section: Submission Status */}
          <div className="flex flex-col gap-4">
            <h2 className="text-[14px] font-medium text-[#1D293D] m-0">Submission Status</h2>
            
            <div className="flex flex-col divide-y divide-[#E7E5E4]">
              {[
                { label: "Pending Submission", value: "Number", action: "View" },
                { label: "Pending Submission", value: "Number", action: "View" },
                { label: "Due Date", value: data.dueDate },
                { label: "Time remaining", value: data.timeRemaining },
                { label: "Last Modified", value: data.lastModified },
              ].map((row, idx) => {
                const isStatusRow = !row.action;

                
return (
                  <div key={idx} className="flex items-center h-[56px] px-6">
                    <span className="text-[12px] text-[#45556C] w-[200px] shrink-0">
                      {row.label}
                    </span>
                    
                    {isStatusRow ? (
                      <span className="text-[12px] text-[#45556C] flex-1 text-right">
                        {row.value}
                      </span>
                    ) : (
                      <>
                        <span className="text-[12px] text-[#45556C] flex-1 text-center">
                          {row.value}
                        </span>
                        <button className="text-[12px] font-medium text-[#F6339A] hover:underline w-[100px] text-right">
                          {row.action}
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
