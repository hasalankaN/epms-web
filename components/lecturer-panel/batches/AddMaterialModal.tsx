"use client";

import { useState } from "react";

import { X, FileUp } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useUploadFile } from "@/hooks/api/files/useUploadFile";

interface AddMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; url: string; fileName: string; format: string }) => void;
  isLoading?: boolean;
}

export function AddMaterialModal({ isOpen, onClose, onSave, isLoading: isSaving }: AddMaterialModalProps) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile();

  const handleSave = async () => {
    if (!title || !file) return;

    try {
      const uploadResponse = await uploadFile({ file });

      if (uploadResponse.status === "SUCCESS") {
        onSave({ 
          title, 
          url: uploadResponse.data.url,
          fileName: uploadResponse.data.fileName,
          format: uploadResponse.data.mimetype.split('/').pop()?.toUpperCase() || "FILE"
        });
        setTitle("");
        setFile(null);
      }
    } catch {
      // Error handled by hook
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent closeClass="hidden" className="max-w-[368px] p-6 gap-4 rounded-[12px] border-[#E2E8F0] shadow-lg">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-[#E2E8F0] pb-2 mb-2">
          <DialogTitle className="text-[18px] font-semibold text-[#0F172B]">Add New Materials</DialogTitle>
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
              placeholder="eg: lorem ipsum"
              className="h-9 rounded-[6px] border-[#E2E8F0] shadow-sm italic placeholder:text-[#90A1B9]" 
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[14px] font-medium text-[#1D293D]">Upload Material</Label>
            <div className="relative group">
              <input 
                type="file" 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              />
              <div className="flex flex-col items-center justify-center gap-2 h-[171px] border border-dashed border-[#E2E8F0] rounded-[8px] bg-[#F1F5F9]/50 group-hover:bg-[#F1F5F9] transition-colors">
                <FileUp className="w-8 h-8 text-[#62748E]" />
                <div className="flex flex-col items-center gap-1 px-4 text-center">
                  <span className="text-[14px] font-normal leading-[20px] text-[#62748E] italic">
                    {file ? file.name : "Click Here to upload or drag and drop here"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-2">
          <Button 
            onClick={handleSave}
            disabled={isUploading || isSaving || !title || !file}
            className="h-10 w-[120px] bg-[#E60076] hover:bg-[#C50065] text-white font-semibold rounded-[6px] shadow-sm"
          >
            {isUploading ? "Uploading..." : isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
