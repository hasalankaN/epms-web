"use client";

import { useState } from "react";

import { X } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ScheduleClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; zoom_link: string; zoom_start_time: string; zoom_duration: number }) => void;
  isLoading?: boolean;
}

export function ScheduleClassModal({ isOpen, onClose, onSave, isLoading }: ScheduleClassModalProps) {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(1);

  const handleSave = () => {
    onSave({ 
      title, 
      zoom_link: link, 
      zoom_start_time: new Date(startTime).toISOString(), 
      zoom_duration: Number(duration) 
    });

    // Form reset logic can be added here or in parent
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[400px] p-6 rounded-[12px]">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4 mb-4">
          <DialogTitle className="text-lg font-bold">Schedule Online Class</DialogTitle>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Class Title *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Q&A Session" />
          </div>
          <div className="space-y-2">
            <Label>Zoom Link *</Label>
            <Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://zoom.us/j/..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Time *</Label>
              <Input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Duration (Hours) *</Label>
              <Input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} min={1} />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button 
            onClick={handleSave} 
            disabled={isLoading || !title || !link || !startTime}
            className="bg-[#E60076] hover:bg-[#C50065] text-white px-8"
          >
            {isLoading ? "Scheduling..." : "Schedule"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
