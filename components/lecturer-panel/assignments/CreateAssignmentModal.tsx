"use client";

import { useState } from "react";

import { format } from "date-fns";
import { X, Calendar as CalendarIcon, FileUp } from "lucide-react";

import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectLabel, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { useGetLecturerDashboard } from "@/hooks/api/lecturers/useGetLecturerDashboard";
import { useGetCourseTiers } from "@/hooks/api/courses/useGetCourseTiers";
import type { TierNode } from "@/hooks/api/batches/useGetBatchTiers";
import { useGetBatchTiers } from "@/hooks/api/batches/useGetBatchTiers";
import { useCreateAssignment } from "@/hooks/api/assignments/useCreateAssignment";
import { useUploadFile } from "@/hooks/api/files/useUploadFile";

interface CreateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateAssignmentModal({ isOpen, onClose }: CreateAssignmentModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date>();
  const [selectedOwnerId, setSelectedOwnerId] = useState<string>("");
  const [selectedOwnerType, setSelectedOwnerType] = useState<"BATCH" | "COURSE" | "">("");
  const [selectedTierId, setSelectedTierId] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const { data: dashboardData } = useGetLecturerDashboard();
  const batches = dashboardData?.batches || [];
  const courses = dashboardData?.courses || [];

  const { data: batchTiers } = useGetBatchTiers(selectedOwnerType === "BATCH" ? selectedOwnerId : "");
  const { data: courseTiers } = useGetCourseTiers(selectedOwnerType === "COURSE" ? selectedOwnerId : "");
  
  const tiers = selectedOwnerType === "BATCH" ? batchTiers : courseTiers;

  // Flatten tiers to easily select lessons
  const flattenTiers = (nodes: TierNode[]): TierNode[] => {
    let result: TierNode[] = [];

    nodes?.forEach((node) => {
      result.push(node);

      if (node.children?.length > 0) {
        result = result.concat(flattenTiers(node.children));
      }
    });
    
return result;
  };

  const allTiers = flattenTiers(tiers || []);

  const createAssignmentMutation = useCreateAssignment();
  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile();

  const handleClear = () => {
    setTitle("");
    setDescription("");
    setDate(undefined);
    setSelectedOwnerId("");
    setSelectedOwnerType("");
    setSelectedTierId("");
    setFile(null);
  };

  const handleSave = async () => {
    if (!selectedTierId || !title || !description || !date) {
      toast.error("Please fill all required fields");
      
return;
    }

    try {
      const materials: any[] = [];

      if (file) {
        const uploadRes = await uploadFile({ file });

        if (uploadRes.status === "SUCCESS") {
          materials.push({
            file_url: uploadRes.data.url,
            file_name: uploadRes.data.fileName,
            file_type: uploadRes.data.mimetype.split('/').pop()?.toUpperCase() || "FILE"
          });
        }
      }

      await createAssignmentMutation.mutateAsync({
        tier_id: selectedTierId,
        title,
        description,
        due_date: format(date, "yyyy-MM-dd"),
        is_draft: false,
        materials
      });

      toast.success("Assignment created successfully");
      handleClear();
      onClose();
    } catch (e) {
      console.error("Failed to create assignment:", e);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent closeClass="hidden" className="sm:max-w-[450px] p-0 overflow-hidden bg-white rounded-[12px] gap-0">
        
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <DialogTitle className="text-[18px] font-semibold text-[#0F172B] leading-[30px] m-0">
            New Assignment
          </DialogTitle>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-[6px] border border-[#E2E8F0] shadow-sm hover:bg-slate-50 transition-colors"
          >
            <X className="w-5 h-5 text-[#0F172B]" />
          </button>
        </DialogHeader>

        {/* Body */}
        <div className="flex flex-col px-6 py-6 gap-6 max-h-[70vh] overflow-y-auto">
          
          {/* Select Batch/Course */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-[#1D293D] flex items-center gap-0.5">
              Select Batch/Course <span className="text-[#FB2C36]">*</span>
            </label>
            <Select 
              value={selectedOwnerId} 
              onValueChange={(val) => { 
                setSelectedOwnerId(val);
                if (batches.find(b => b.id === val)) setSelectedOwnerType("BATCH");
                 else if (courses.find(c => c.id === val)) setSelectedOwnerType("COURSE");
                setSelectedTierId(""); 
              }}
            >
              <SelectTrigger className="w-full h-9 rounded-[6px] border-[#E2E8F0] shadow-sm text-[#90A1B9] text-[14px] italic">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {batches.length > 0 && (
                  <SelectGroup>
                    <SelectLabel>Batches</SelectLabel>
                    {batches.map((batch) => (
                      <SelectItem key={`batch-${batch.id}`} value={batch.id}>{batch.name}</SelectItem>
                    ))}
                  </SelectGroup>
                )}
                {courses.length > 0 && (
                  <SelectGroup>
                    <SelectLabel>Courses</SelectLabel>
                    {courses.map((course) => (
                      <SelectItem key={`course-${course.id}`} value={course.id}>{course.name}</SelectItem>
                    ))}
                  </SelectGroup>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Select Lesson (Tier) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-[#1D293D] flex items-center gap-0.5">
              Select Lesson <span className="text-[#FB2C36]">*</span>
            </label>
            <Select value={selectedTierId} onValueChange={setSelectedTierId} disabled={!selectedOwnerId}>
              <SelectTrigger className="w-full h-9 rounded-[6px] border-[#E2E8F0] shadow-sm text-[#90A1B9] text-[14px] italic">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {allTiers.map((tier) => (
                  <SelectItem key={tier.id} value={tier.id}>{tier.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assignment Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-[#1D293D] flex items-center gap-0.5">
              Assignment Title <span className="text-[#FB2C36]">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="eg: Final Project"
              className="h-9 rounded-[6px] border-[#E2E8F0] shadow-sm text-[14px] italic placeholder:text-[#90A1B9]"
            />
          </div>

          {/* Due Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-[#1D293D] flex items-center gap-0.5">
              Due Date <span className="text-[#FB2C36]">*</span>
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex items-center border border-[#E2E8F0] rounded-[6px] shadow-sm h-9 overflow-hidden cursor-pointer focus-within:ring-1 focus-within:ring-[#1D293D]">
                  <div className="flex items-center justify-center w-10 h-full border-r border-[#E2E8F0] bg-white">
                    <CalendarIcon className="w-4 h-4 text-[#90A1B9]" />
                  </div>
                  <div className={cn("flex-1 h-full px-3 flex items-center text-[14px] italic", date ? "text-[#1D293D] not-italic font-normal" : "text-[#90A1B9]")}>
                    {date ? format(date, "PPP") : "Pick a date"}
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-[#E2E8F0] rounded-[12px]" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Assignment Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-[#1D293D] flex items-center gap-0.5">
              Assignment Description <span className="text-[#FB2C36]">*</span>
            </label>
            <Textarea
              placeholder="eg: Type your message here"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px] rounded-[6px] border-[#E2E8F0] shadow-sm resize-y italic placeholder:text-[#90A1B9] text-[14px]"
            />
          </div>

          {/* Upload File(s) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-[#1D293D] flex items-center gap-0.5">
              Upload File(s)
            </label>
            <div className="relative border border-dashed border-[#E2E8F0] rounded-[8px] h-[134px] flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer group">
              <input 
                type="file" 
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0]);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
              <div className="flex items-center justify-center w-8 h-8 rounded bg-[#F1F5F9] group-hover:bg-[#E2E8F0] transition-colors">
               <FileUp className="h-[22px] w-[22px] text-[#62748E]" />
              </div>
              <span className="text-[14px] text-[#62748E] font-medium">
                {file ? file.name : "Upload Here or drag and drop here"}
              </span>
              {!file && (
                <span className="text-[12px] text-[#90A1B9] text-center max-w-[240px]">
                  Supported File format: png, jpeg, WebP, PDF, PPTX, Doc (Max 10MB)
                </span>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 gap-3 bg-white border-t border-[#F1F5F9]">
          <Button
            variant="outline"
            onClick={() => { handleClear(); onClose(); }}
            className="w-[124px] h-10 border-0 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172B] font-semibold shadow-sm"
          >
            Clear All
          </Button>
          <Button
            onClick={handleSave}
            disabled={createAssignmentMutation.isPending || isUploading}
            className="w-[124px] h-10 bg-[#E60076] hover:bg-[#C50065] text-white font-semibold shadow-sm"
          >
            {createAssignmentMutation.isPending || isUploading ? "Saving..." : "Save"}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
