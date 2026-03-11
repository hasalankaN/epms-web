"use client";

import React, { useState } from "react";

import { X, ZoomIn, ZoomOut, Download } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES } from "@/lib/constants/theme";

interface ViewSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string;
}

export function ViewSlipModal({
  isOpen,
  onClose,
  imageUrl = "https://placehold.co/600x800/e2e8f0/94a3b8?text=ATM+TRANSACTION+SLIP",
}: ViewSlipModalProps) {
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.5, 0.5));

  const handleDownload = () => {
    toast.success("Downloading slip...");

    // Mock download logic
    const link = document.createElement("a");

    link.href = imageUrl;
    link.download = "bank-slip.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[90vh] w-[95%] max-w-[500px] flex-col gap-4 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] outline-none [&>button]:hidden">
        
        {/* ===== HEADER ===== */}
        <div className="flex flex-col gap-4 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="flex-1 text-lg font-semibold leading-[30px] text-[#0F172B]">
              View Slip
            </DialogTitle>
            <button
              title="Close"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-transparent shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-slate-50"
            >
              <X className="h-4 w-4 text-[#64748B]" />
            </button>
          </div>
          <div className="border-b border-[#E2E8F0]" />
        </div>

        {/* ===== IMAGE VIEWER ===== */}
        <div className="flex-1 overflow-hidden rounded-md border border-[#E2E8F0] bg-slate-50 flex items-center justify-center relative min-h-[400px]">
           <div 
             className="w-full h-full overflow-auto flex items-center justify-center"
           >
             <img 
               src={imageUrl} 
               alt="Bank Transfer Slip"
               className="transition-transform duration-200 ease-in-out object-contain"
               style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center center" }}
             />
           </div>
        </div>

        {/* ===== TOOLBAR ===== */}
        <div className="flex items-center justify-between mt-2">
           <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleZoomIn}
                className="h-10 w-10 border-[#E2E8F0] bg-slate-50 hover:bg-slate-100 disabled:opacity-50 text-[#1D293D]"
                disabled={zoomLevel >= 3}
              >
                 <ZoomIn className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleZoomOut}
                className="h-10 w-10 border-[#E2E8F0] bg-slate-50 hover:bg-slate-100 disabled:opacity-50 text-[#1D293D]"
                disabled={zoomLevel <= 0.5}
              >
                 <ZoomOut className="h-4 w-4" />
              </Button>
           </div>

           <Button
             variant="ghost"
             onClick={handleDownload}
             className={cn(BUTTON_STYLES.ghost.sm, "h-10 px-4 gap-2 text-[#0F172B] hover:text-[#0F172B] hover:bg-slate-100")}
           >
              <Download className="h-4 w-4" />
              <span className="text-sm font-semibold leading-5 text-[#0F172B]">Download</span>
           </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
