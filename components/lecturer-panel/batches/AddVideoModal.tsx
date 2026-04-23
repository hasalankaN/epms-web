"use client";

import { useState } from "react";

import { X } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; url: string }) => void;
  isLoading?: boolean;
}

export function AddVideoModal({ isOpen, onClose, onSave, isLoading }: AddVideoModalProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const handleSave = () => {
    onSave({ title, url });
    setTitle("");
    setUrl("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent closeClass="hidden" className="max-w-[368px] p-6 gap-4 rounded-[12px] border-[#E2E8F0] shadow-lg">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-[#E2E8F0] pb-2 mb-2">
          <DialogTitle className="text-[18px] font-semibold text-[#0F172B]">Add New Video</DialogTitle>
          <button 
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-[6px] border border-[#E2E8F0] shadow-sm hover:bg-slate-50 transition-colors"
          >
            <X className="w-5 h-5 text-[#0F172B]" />
          </button>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <Label className="text-[14px] font-medium text-[#1D293D]">
              YouTube Link <span className="text-[#FB2C36]">*</span>
            </Label>
            <Input 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="eg: https://youtube.com"
              className="h-9 rounded-[6px] border-[#E2E8F0] shadow-sm italic placeholder:text-[#90A1B9]" 
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[14px] font-medium text-[#1D293D]">
              Title <span className="text-[#FB2C36]">*</span>
            </Label>
            <Input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="eg: lorem ipsum"
              className="h-9 rounded-[6px] border-[#E2E8F0] shadow-sm italic placeholder:text-[#90A1B9]" 
            />
          </div>
        </div>

        <div className="flex justify-end mt-2">
          <Button 
            onClick={handleSave}
            disabled={isLoading || !title || !url}
            className="h-10 w-[80px] bg-[#E60076] hover:bg-[#C50065] text-white font-semibold rounded-[6px] shadow-sm"
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
