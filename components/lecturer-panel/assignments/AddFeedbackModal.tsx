"use client";

import React, { useState } from "react";

import Image from "next/image";

import { X, FileUp } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AddFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentData?: {
    name: string;
    id: string;
    submittedDate: string;
    lessonTitle: string;
    courseBatchName: string;
    avatar?: string;
  };
}

export function AddFeedbackModal({
  isOpen,
  onClose,
  studentData,
}: AddFeedbackModalProps) {
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");

  const data = studentData || {
    name: "Student Name",
    id: "#Student Id",
    submittedDate: "2025.12.21",
    lessonTitle: "Lesson Title",
    courseBatchName: "Course/Batch Name",
    avatar: "https://i.pravatar.cc/150?u=student",
  };

  const handleClear = () => {
    setScore("");
    setFeedback("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        closeClass="hidden"
        className="sm:max-w-[450px] p-0 overflow-hidden bg-white rounded-[12px] gap-0 border border-[#E2E8F0] shadow-[0px_4px_6px_-4px_rgba(16,24,40,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)]"
      >
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <DialogTitle className="text-[18px] font-semibold text-[#0F172B] m-0">
            Add Feedback
          </DialogTitle>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-[6px] border border-[#E2E8F0] shadow-[0px_1px_2px_rgba(16,24,40,0.05)] hover:bg-slate-50 transition-colors"
          >
            <X className="w-5 h-5 text-[#0F172B]" />
          </button>
        </DialogHeader>

        {/* Body */}
        <div className="flex flex-col p-6 gap-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Student Info */}
          <div className="flex flex-col gap-4 border-b border-[#E2E8F0] pb-4">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-[#D9D9D9] shrink-0">
                <Image
                  src={data.avatar || "https://i.pravatar.cc/150?u=student"}
                  alt={data.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-[16px] font-semibold text-[#1D293D]">{data.name}</span>
                  <span className="text-[12px] text-[#90A1B9]">{data.id}</span>
                </div>
                <span className="text-[12px] text-[#45556C]">Submitted: {data.submittedDate}</span>
                <span className="text-[12px] text-[#45556C]">
                  {data.lessonTitle} _ {data.courseBatchName}
                </span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-6">
            {/* Score */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium text-[#1D293D]">Score</label>
              <input
                type="text"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="Lorem Ipsum"
                className="h-9 px-3 rounded-[6px] border border-[#E2E8F0] shadow-sm text-[14px] text-[#0F172B] placeholder:italic placeholder:text-[#90A1B9] focus:outline-none focus:ring-2 focus:ring-[#E60076]/20 focus:border-[#E60076]"
              />
            </div>

            {/* Feedback */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium text-[#1D293D]">
                Feedback <span className="text-[#FB2C36]">*</span>
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="eg: Type your message here"
                className="min-h-[106px] p-3 rounded-[6px] border border-[#E2E8F0] shadow-sm text-[14px] text-[#0F172B] placeholder:italic placeholder:text-[#90A1B9] focus:outline-none focus:ring-2 focus:ring-[#E60076]/20 focus:border-[#E60076] resize-none"
              />
            </div>

            {/* Upload File */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium text-[#1D293D]">
                Upload File <span className="text-[#FB2C36]">*</span>
              </label>
              <div className="flex flex-col items-center justify-center h-[134px] border border-dashed border-[#E2E8F0] rounded-[8px] bg-white cursor-pointer hover:bg-slate-50 transition-colors">
                <FileUp className="w-8 h-8 text-[#62748E] mb-2" />
                <span className="text-[14px] italic text-[#62748E] text-center px-6">
                  Upload Here or drag and drop here
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 gap-3 border-t border-transparent">
          <Button
            variant="ghost"
            onClick={handleClear}
            className="h-10 px-6 rounded-[6px] bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[14px] font-semibold text-[#0F172B]"
          >
            Clear All
          </Button>
          <Button
            onClick={() => {
              console.log("Saving feedback:", { score, feedback });
              onClose();
            }}
            className="h-10 px-6 rounded-[6px] bg-[#E60076] hover:bg-[#C50065] text-[14px] font-semibold text-white shadow-sm"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
