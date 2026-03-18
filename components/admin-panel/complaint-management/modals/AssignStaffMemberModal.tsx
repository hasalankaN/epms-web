"use client";

import React, { useState, useEffect } from "react";

import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SearchableSelect, type SearchableSelectOption } from "@/components/ui/searchable-select";

import { cn } from "@/lib/utils";
import type { ComplaintDataType } from "@/types/complaint";
import { AUTH_TYPOGRAPHY, BUTTON_STYLES } from "@/lib/constants/theme";
import { useGetStaff } from "@/hooks/api/staff/useGetStaff";
import { useDebounce } from "@/hooks/useDebounce";
import { useAssignStaff } from "@/hooks/api/complaints/useAssignStaff";

interface AssignStaffMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: ComplaintDataType | null;
}

export function AssignStaffMemberModal({
  isOpen,
  onClose,
  complaint,
}: AssignStaffMemberModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState("");

  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data: staffData, isLoading: isStaffLoading } = useGetStaff({
    page: 1,
    size: 50,
    search: debouncedSearch || undefined,
  });

  const { mutateAsync: assignStaff, isPending } = useAssignStaff(complaint?.id || "");

  // Reset local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setSelectedStaffId("");
    }
  }, [isOpen]);

  if (!complaint) return null;

  const staffOptions: SearchableSelectOption[] = staffData?.results?.slice(0, 5).map(staff => ({
    value: staff.userId,
    label: `${staff.firstName} ${staff.lastName}`,
    subLabel: staff.email,
    avatarInitials: `${staff.firstName?.[0] || ""}${staff.lastName?.[0] || ""}`,
  })) || [];

  const handleSave = async () => {
    if (!selectedStaffId) return;

    try {
      await assignStaff({ assignee_user_id: selectedStaffId });
      onClose();
    } catch (error) {
      console.error(error);
    }
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
              Assign Staff Member
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
        <div className="flex flex-col gap-4">
          
          {/* Staff Member Field */}
          <div className="space-y-1">
            <FieldLabel required>Staff Member</FieldLabel>
            <SearchableSelect
              options={staffOptions}
              value={selectedStaffId}
              onChange={setSelectedStaffId}
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="Select a team member"
              searchPlaceholder="Search staff..."
              emptyMessage="No staff found."
              isLoading={isStaffLoading}
            />
          </div>

          {/* Spacer */}
          <div className="h-2"></div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSave}
              disabled={isPending || !selectedStaffId}
              className={cn(BUTTON_STYLES.primary.md, "w-auto px-10")}
            >
              {isPending ? "Assigning..." : "Save"}
            </Button>
          </div>

        </div>

      </DialogContent>
    </Dialog>
  );
}