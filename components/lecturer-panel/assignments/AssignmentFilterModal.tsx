"use client";

import React, { useState } from "react";

import { X, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AssignmentFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

export function AssignmentFilterModal({
  isOpen,
  onClose,
  onApply,
}: AssignmentFilterModalProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  
  // This is a simplified calendar for the UI demonstration
  // In a real app, you'd use a range picker or two linked calendars
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date(2026, 0, 23));
  const [toDate, setToDate] = useState<Date | undefined>(new Date(2026, 1, 4));

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleClearAll = () => {
    setSelectedTypes([]);
    setFromDate(undefined);
    setToDate(undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        closeClass="hidden"
        className="sm:max-w-[704px] p-0 overflow-hidden bg-white rounded-[12px] gap-0 border border-[#E2E8F0] shadow-[0px_4px_6px_-4px_rgba(16,24,40,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)]"
      >
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <DialogTitle className="text-[18px] font-semibold text-[#0F172B] m-0">
            Filter Options
          </DialogTitle>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-[6px] border border-[#E2E8F0] shadow-[0px_1px_2px_rgba(16,24,40,0.05)] hover:bg-slate-50 transition-colors"
          >
            <X className="w-5 h-5 text-[#0F172B]" />
          </button>
        </DialogHeader>

        {/* Body */}
        <div className="flex flex-col p-6 gap-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
          {/* Selected Info */}
          <div className="flex flex-col border-b border-[#E2E8F0] pb-2">
             <span className="text-[12px] text-[#90A1B9]">Selected 0/8</span>
          </div>

          {/* Date Selection Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-semibold text-[#0F172B]">By Date</span>
              <span className="text-[14px] italic text-[#90A1B9]">Today date: 09/02/2026</span>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              {/* January Calendar */}
              <div className="flex-1 p-3 bg-white border border-[#E4E4E7] rounded-[6px] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_rgba(16,24,40,0.1)]">
                <div className="flex items-center justify-between mb-4 px-1">
                  <button className="p-1 border border-[#E2E8F0] rounded-[6px] shadow-sm hover:bg-slate-50">
                    <ChevronLeft className="w-4 h-4 text-[#0F172B]" />
                  </button>
                  <span className="text-[14px] font-medium text-[#1D293D]">January</span>
                  <button className="p-1 border border-[#E2E8F0] rounded-[6px] shadow-sm hover:bg-slate-50">
                    <ChevronRight className="w-4 h-4 text-[#0F172B]" />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-y-1 text-center">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <span key={day} className="text-[14px] text-[#71717A] py-1">{day}</span>
                  ))}
                  {/* Mock Days for January */}
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(d => {
                    const isSelected = d === 23;
                    const isRange = d > 23;

                    
return (
                      <div 
                        key={`jan-${d}`} 
                        className={cn(
                          "w-8 h-8 flex items-center justify-center rounded-[6px] text-[14px] mx-auto cursor-pointer transition-colors",
                          isSelected ? "bg-[#0F172B] text-white" : "",
                          isRange ? "bg-[#F1F5F9] text-[#1D293D]" : "",
                          !isSelected && !isRange ? "text-[#1D293D] hover:bg-slate-100" : "",
                          d < 23 && d > 20 ? "text-[#CAD5E2]" : "" // Disabled look
                        )}
                      >
                        {d}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* February Calendar */}
              <div className="flex-1 p-3 bg-white border border-[#E4E4E7] rounded-[6px] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_rgba(16,24,40,0.1)]">
                <div className="flex items-center justify-between mb-4 px-1">
                  <button className="p-1 border border-[#E2E8F0] rounded-[6px] shadow-sm hover:bg-slate-50">
                    <ChevronLeft className="w-4 h-4 text-[#0F172B]" />
                  </button>
                  <span className="text-[14px] font-medium text-[#1D293D]">February</span>
                  <button className="p-1 border border-[#E2E8F0] rounded-[6px] shadow-sm hover:bg-slate-50">
                    <ChevronRight className="w-4 h-4 text-[#0F172B]" />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-y-1 text-center">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <span key={day} className="text-[14px] text-[#71717A] py-1">{day}</span>
                  ))}
                  {/* Mock Days for February */}
                  {Array.from({ length: 28 }, (_, i) => i + 1).map(d => {
                    const isRange = d < 4;
                    const isSelected = d === 4 || d === 9;
                    const isSelectionEnd = d === 4;
                    const isMarked = d === 9; // Second mark in the image

                    
return (
                      <div 
                        key={`feb-${d}`} 
                        className={cn(
                          "w-8 h-8 flex items-center justify-center rounded-[6px] text-[14px] mx-auto cursor-pointer transition-colors",
                          isSelectionEnd ? "bg-[#0F172B] text-white" : "",
                          isMarked ? "bg-[#E2E8F0] text-[#1D293D]" : "",
                          isRange && !isSelectionEnd ? "bg-[#F1F5F9] text-[#1D293D]" : "",
                          !isSelected && !isRange ? "text-[#1D293D] hover:bg-slate-100" : ""
                        )}
                      >
                        {d}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Type Selection Section */}
          <div className="flex flex-col gap-4">
            <span className="text-[14px] font-bold text-[#0F172B]">Type</span>
            <div className="flex items-center gap-2">
               <button 
                onClick={() => toggleType('Course')}
                className={cn(
                  "flex items-center gap-2 px-2 py-1 border rounded-[6px] transition-all",
                  selectedTypes.includes('Course') ? "border-[#E60076] bg-[#FFF1F8]" : "border-[#E2E8F0] bg-white"
                )}
               >
                 <CheckCircle2 className={cn("w-4 h-4", selectedTypes.includes('Course') ? "text-[#E60076]" : "text-[#90A1B9]")} />
                 <span className="text-[14px] font-medium text-[#314158]">Course</span>
               </button>

               <button 
                onClick={() => toggleType('Batch')}
                className={cn(
                  "flex items-center gap-2 px-2 py-1 border rounded-[6px] transition-all",
                  selectedTypes.includes('Batch') ? "border-[#E60076] bg-[#FFF1F8]" : "border-[#E2E8F0] bg-white"
                )}
               >
                 <CheckCircle2 className={cn("w-4 h-4", selectedTypes.includes('Batch') ? "text-[#E60076]" : "text-[#90A1B9]")} />
                 <span className="text-[14px] font-medium text-[#314158]">Batch</span>
               </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 gap-3 pt-4">
          <Button
            variant="ghost"
            onClick={handleClearAll}
            className="h-10 px-4 rounded-[6px] bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[14px] font-semibold text-[#0F172B]"
          >
            Clear All
          </Button>
          <Button
            onClick={() => {
              onApply({ types: selectedTypes, fromDate, toDate });
              onClose();
            }}
            className="h-10 px-4 rounded-[6px] bg-[#E60076] hover:bg-[#C50065] text-[14px] font-semibold text-white shadow-sm"
          >
            Show Results
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
