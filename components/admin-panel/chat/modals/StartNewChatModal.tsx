"use client";

import React, { useState, useEffect, useMemo } from "react";

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
import { useGetStudents } from "@/hooks/api/user-management/useGetStudents";
import { useGetStaff } from "@/hooks/api/staff/useGetStaff";
import { useGetLecturers } from "@/hooks/api/lecturers/useGetLecturers";
import { useDebounce } from "@/hooks/useDebounce";

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

  const debouncedSearch = useDebounce(searchTerm, 400);

  const studentsQuery = useGetStudents({
    page: 1,
    size: 100,
    search: role === "student" && debouncedSearch ? debouncedSearch : undefined,
    student_status: "ACTIVE",
  });

  const staffQuery = useGetStaff({
    page: 1,
    size: 100,
    search: role === "staff" && debouncedSearch ? debouncedSearch : undefined,
    status: "ACTIVE",
  });

  const lecturersQuery = useGetLecturers({
    page: 1,
    size: 100,
    search: role === "lecturer" && debouncedSearch ? debouncedSearch : undefined,
    status: "ACTIVE",
  });

  const personOptions: SearchableSelectOption[] = useMemo(() => {
    if (role === "student") {
      return (
        studentsQuery.data?.results.map((s) => ({
          value: s.user_id,
          label: s.full_name || s.email,
          subLabel: s.email || s.mobile_number,
          avatarInitials: s.full_name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "ST",
        })) ?? []
      );
    }

    if (role === "staff") {
      return (
        staffQuery.data?.results.map((s) => ({
          value: s.userId,
          label: `${s.firstName} ${s.lastName}`.trim() || s.email,
          subLabel: s.email || s.mobile,
          avatarInitials: `${s.firstName?.[0] ?? ""}${s.lastName?.[0] ?? ""}`.toUpperCase() || "ST",
        })) ?? []
      );
    }

    if (role === "lecturer") {
      return (
        lecturersQuery.data?.results.map((l) => ({
          value: l.user_id,
          label: `${l.first_name} ${l.last_name}`.trim() || l.email,
          subLabel: l.email || l.mobile_number,
          avatarInitials: `${l.first_name?.[0] ?? ""}${l.last_name?.[0] ?? ""}`.toUpperCase() || "LE",
        })) ?? []
      );
    }

    return [];
  }, [role, studentsQuery.data, staffQuery.data, lecturersQuery.data]);

  const isLoading =
    (role === "student" && studentsQuery.isLoading) ||
    (role === "staff" && staffQuery.isLoading) ||
    (role === "lecturer" && lecturersQuery.isLoading);

  // Reset local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setSelectedPersonId("");
      setRole("student");
    }
  }, [isOpen]);

  // Reset selected person when role changes
  useEffect(() => {
    setSelectedPersonId("");
    setSearchTerm("");
  }, [role]);

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
              isLoading={isLoading}
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
