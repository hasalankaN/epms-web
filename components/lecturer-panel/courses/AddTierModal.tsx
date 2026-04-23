"use client";

import { useState } from "react";

import { X } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AddTierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; description: string }) => void;
  isLoading?: boolean;
  parentTitle?: string | null;
}

export function AddTierModal({ isOpen, onClose, onSave, isLoading, parentTitle }: AddTierModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    if (!title) return;
    onSave({ title, description });
    setTitle("");
    setDescription("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent closeClass="hidden" className="max-w-[440px] p-6 gap-6 rounded-[12px] border-[#E2E8F0] shadow-lg">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-[#E2E8F0] pb-2">
          <div className="flex flex-col">
            <DialogTitle className="text-[18px] font-semibold text-[#0F172B]">
              Add New {parentTitle ? "Sub-item" : "Section"}
            </DialogTitle>
            {parentTitle && (
              <p className="text-[12px] text-[#64748B]">Adding to: <span className="font-medium">{parentTitle}</span></p>
            )}
          </div>
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
              Title <span className="text-[#FB2C36]">*</span>
            </Label>
            <Input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="eg: Week 01 / Lesson 01"
              className="h-9 rounded-[6px] border-[#E2E8F0] shadow-sm italic placeholder:text-[#90A1B9]" 
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[14px] font-medium text-[#1D293D]">
              Description
            </Label>
            <Textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this section/lesson"
              className="min-h-[100px] rounded-[6px] border-[#E2E8F0] shadow-sm italic placeholder:text-[#90A1B9]" 
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <Button 
            variant="outline"
            onClick={onClose}
            className="h-10 px-6 rounded-[6px] border-[#E2E8F0] text-[#0F172B]"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isLoading || !title}
            className="h-10 px-8 bg-[#E60076] hover:bg-[#C50065] text-white font-semibold rounded-[6px] shadow-sm"
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
