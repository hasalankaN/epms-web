"use client";

import React, { useState, useEffect } from "react";

import { X, UserPlus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SearchableSelect, type SearchableSelectOption } from "@/components/ui/searchable-select";
import { cn } from "@/lib/utils";
import { AUTH_TYPOGRAPHY, BUTTON_STYLES } from "@/lib/constants/theme";

interface StartNewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChat: (role: string, personId: string) => void;
}

export function StartNewChatModal({
  isOpen,
  onClose,
  onStartChat,
}: StartNewChatModalProps) {
  const [role, setRole] = useState("student");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPersonId, setSelectedPersonId] = useState("");

  // Mock data for people based on role
  // In a real app, you'd fetch this from your hooks
  const mockOptions: Record<string, SearchableSelectOption[]> = {
    student: [
      { value: "s1", label: "Student Name", avatarInitials: "SN" },
      { value: "s2", label: "Student Name", avatarInitials: "SN" },
      { value: "s3", label: "Student Name", avatarInitials: "SN" },
      { value: "s4", label: "Student Name", avatarInitials: "SN" },
      { value: "s5", label: "Student Name", avatarInitials: "SN" },
    ],
    staff: [
      { value: "st1", label: "Staff Name", avatarInitials: "ST" },
    ],
    lecturer: [
      { value: "l1", label: "Lecturer Name", avatarInitials: "LN" },
    ],
  };

  const personOptions = mockOptions[role] || [];

  // Reset local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setSelectedPersonId("");
      setRole("student");
    }
  }, [isOpen]);

  const handleStartChat = () => {
    if (!selectedPersonId) return;
    onStartChat(role, selectedPersonId);
    onClose();
  };

  const FieldLabel = ({ children, required = false }: { children: React.ReactNode; required?: boolean }) => (
    <Label className={cn(AUTH_TYPOGRAPHY.label, "mb-1.5 block")}>
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </Label>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[90vh] w-[95%] max-w-[500px] flex-col gap-4 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] outline-none [&>button]:hidden">
        
        {/* ===== HEADER ===== */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex-1 text-lg font-semibold leading-[30px] text-[#0F172B]">
              Start New Chat
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

        {/* ===== FORM ===== */}
        <div className="flex flex-col gap-6">
          
          {/* Select Role */}
          <div className="space-y-3">
            <FieldLabel>Select Role</FieldLabel>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <input 
                  type="radio" 
                  id="role-student" 
                  name="chat-role"
                  value="student" 
                  checked={role === "student"}
                  onChange={(e) => setRole(e.target.value)}
                  className="accent-[#0F172B] w-4 h-4 cursor-pointer" 
                />
                <label htmlFor="role-student" className="text-sm font-medium text-[#45556C] cursor-pointer">To Student</label>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="radio" 
                  id="role-staff" 
                  name="chat-role"
                  value="staff" 
                  checked={role === "staff"}
                  onChange={(e) => setRole(e.target.value)}
                  className="accent-[#0F172B] w-4 h-4 cursor-pointer" 
                />
                <label htmlFor="role-staff" className="text-sm font-medium text-[#45556C] cursor-pointer">To Staff</label>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="radio" 
                  id="role-lecturer" 
                  name="chat-role"
                  value="lecturer" 
                  checked={role === "lecturer"}
                  onChange={(e) => setRole(e.target.value)}
                  className="accent-[#0F172B] w-4 h-4 cursor-pointer" 
                />
                <label htmlFor="role-lecturer" className="text-sm font-medium text-[#45556C] cursor-pointer">To Lecturer</label>
              </div>
            </div>
          </div>

          {/* Find Person Field */}
          <div className="space-y-1">
            <FieldLabel required>Find Person</FieldLabel>
            <SearchableSelect
              options={personOptions}
              value={selectedPersonId}
              onChange={setSelectedPersonId}
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="Select the person you want chat"
              searchPlaceholder="Search here by name.."
              icon={<UserPlus className="h-4 w-4 text-[#90A1B9]" />}
              className="h-[44px]"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <Button 
              onClick={handleStartChat}
              disabled={!selectedPersonId}
              className={cn(BUTTON_STYLES.primary.full, "w-auto min-w-[160px] bg-[#D90471] hover:bg-[#D90471]/90 rounded-[8px] h-[48px] text-[16px] font-semibold")}
            >
              Start New Chat
            </Button>
          </div>

        </div>

      </DialogContent>
    </Dialog>
  );
}
