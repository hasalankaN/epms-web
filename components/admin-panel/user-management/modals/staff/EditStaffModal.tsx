"use client";

import React, { useState, useEffect } from "react";

import { X } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";

import { cn } from "@/lib/utils";
import {
  AUTH_TYPOGRAPHY,
  AUTH_INPUT,
  BUTTON_STYLES,
} from "@/lib/constants/theme";
import type { StaffDataType } from "@/types/user-management";

interface EditStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffDataType | null;
}

// ===== Reusable FieldLabel helper =====
const FieldLabel = ({
  children,
  required = false,
  className,
}: {
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) => (
  <Label className={cn(AUTH_TYPOGRAPHY.label, "mb-1.5 block", className)}>
    {children}
    {required && <span className="ml-0.5 text-red-500">*</span>}
  </Label>
);

export function EditStaffModal({ isOpen, onClose, staff }: EditStaffModalProps) {
  // ===== Form state (pre-filled from staff data) =====
  const [memberName, setMemberName] = useState("");
  const [gender, setGender] = useState("");
  const [nic, setNic] = useState("");
  const [email, setEmail] = useState("");
  
  const [mobileCountryCode, setMobileCountryCode] = useState("+94");
  const [mobileNumber, setMobileNumber] = useState("");
  
  const [whatsappCountryCode, setWhatsappCountryCode] = useState("+94");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  
  const [district, setDistrict] = useState("");
  const [branch, setBranch] = useState("");
  const [isBranchManager, setIsBranchManager] = useState(false);
  
  const [salaryType, setSalaryType] = useState("Monthly Salary");
  
  const [privileges, setPrivileges] = useState<{ [key: string]: boolean }>({
    "1": true,
    "2": false,
    "3": true,
    "4": false,
  });

  // ===== Dirty-state guard =====
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  // Pre-fill form when staff changes or modal opens
  useEffect(() => {
    if (isOpen && staff) {
      setMemberName(staff.name || "");

      // Defaulting to "Male" as placeholder for gender if not available in StaffDataType
      setGender("Male");
      setNic("123456789V"); // Placeholder as nic is not in StaffDataType
      setEmail("user@gmail.com"); // Placeholder as email is not in StaffDataType

      // Parse phone into country code and number

      const phoneStr = staff.phone || "";

      if (phoneStr.startsWith("+")) {
        const match = ["+94", "+1", "+44"].find(code => phoneStr.startsWith(code));

        if (match) {
          setMobileCountryCode(match);
          setMobileNumber(phoneStr.substring(match.length).trim());
        } else {
          setMobileCountryCode("+94");
          setMobileNumber(phoneStr);
        }
      } else {
        setMobileCountryCode("+94");
        setMobileNumber(phoneStr);
      }


      // Parse WhatsApp into country code and number

      const whatsappStr = staff.whatsApp || "";

      if (whatsappStr.startsWith("+")) {
        const match = ["+94", "+1", "+44"].find(code => whatsappStr.startsWith(code));

        if (match) {
          setWhatsappCountryCode(match);
          setWhatsappNumber(whatsappStr.substring(match.length).trim());
        } else {
          setWhatsappCountryCode("+94");
          setWhatsappNumber(whatsappStr);
        }
      } else {
        setWhatsappCountryCode("+94");
        setWhatsappNumber(whatsappStr);
      }


      setDistrict(staff.district || "");
      setBranch(staff.branch || "");
      setIsBranchManager(false); // Placeholder
      
      setSalaryType("Monthly Salary"); // Default or derived from staff data

      setIsDirty(false);
      setShowDiscardModal(false);
    }
  }, [isOpen, staff]);

  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
  };

  const handleCloseAttempt = () => {
    if (isDirty) {
      setShowDiscardModal(true);
    } else {
      onClose();
    }
  };

  const handleConfirmDiscard = () => {
    setShowDiscardModal(false);
    onClose();
  };

  const handleUpdate = () => {
    toast.success("Staff details updated successfully");
    onClose();
  };

  const togglePrivilege = (num: string) => {
    setPrivileges((prev) => ({
      ...prev,
      [num]: !prev[num],
    }));
    markDirty();
  };

  if (!staff) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseAttempt()}>
        <DialogContent className="flex max-h-[90vh] w-[95%] max-w-[720px] flex-col gap-4 overflow-hidden rounded-lg sm:rounded-xl border border-[#E2E8F0] bg-white p-4 sm:p-6 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] [&>button]:hidden">
          
          {/* ===== HEADER ===== */}
          <div className="flex flex-col gap-4 shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex-1 text-lg font-semibold leading-[30px] text-[#0F172B]">
                Edit Details
              </DialogTitle>
              <button
                title="close modal"
                onClick={handleCloseAttempt}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-transparent shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-slate-50"
              >
                <X className="h-4 w-4 text-[#64748B]" />
              </button>
            </div>
            <div className="border-b border-[#E2E8F0]" />
          </div>

          {/* ===== BODY (scrollable) ===== */}
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 sm:gap-y-5">
              
              {/* Member Name */}
              <div className="space-y-1">
                <FieldLabel required>Member Name</FieldLabel>
                <Input
                  value={memberName}
                  onChange={(e) => { setMemberName(e.target.value); markDirty(); }}
                  className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                  placeholder="eg: perera"
                />
              </div>

              {/* Gender */}
              <div className="space-y-1">
                <FieldLabel required>Gender</FieldLabel>
                <Select value={gender} onValueChange={(v) => { setGender(v); markDirty(); }}>
                  <SelectTrigger className={cn(AUTH_INPUT.base, "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic")}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="z-[99999999]">
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* NIC */}
              <div className="space-y-1">
                <FieldLabel>NIC</FieldLabel>
                <Input
                  value={nic}
                  onChange={(e) => { setNic(e.target.value); markDirty(); }}
                  className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                  placeholder="XXXXXXXXX V"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <FieldLabel required>Email</FieldLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); markDirty(); }}
                  className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                  placeholder="user@gmail.com"
                />
              </div>

              {/* Mobile Number */}
              <div className="flex flex-col">
                <FieldLabel required className="mb-1">Mobile Number</FieldLabel>
                <p className="mb-[6px] h-[20px] text-[12px] font-normal leading-[16px] text-[#90A1B9]">
                  Only use numbers; do not include any spaces.
                </p>
                <div className={cn("flex h-10 w-full items-center rounded-md border border-gray-300 bg-white transition-all focus-within:ring-2 focus-within:ring-[#E60076]")}>
                  <Select value={mobileCountryCode} onValueChange={(v) => { setMobileCountryCode(v); markDirty(); }}>
                    <SelectTrigger className="h-full w-[100px] rounded-l-md rounded-r-none border-0 border-r border-slate-200 bg-transparent px-2 ring-0 focus:ring-0 focus:ring-offset-0 whitespace-nowrap overflow-hidden">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[99999999]">
                      <SelectItem value="+94">🇱🇰 +94</SelectItem>
                      <SelectItem value="+1">🇺🇸 +1</SelectItem>
                      <SelectItem value="+44">🇬🇧 +44</SelectItem>
                    </SelectContent>
                  </Select>
                  <input
                    value={mobileNumber}
                    onChange={(e) => { setMobileNumber(e.target.value); markDirty(); }}
                    className={cn("flex-1 bg-transparent px-3 py-2 text-sm outline-none", AUTH_INPUT.placeholder)}
                    placeholder="77 234 5670"
                  />
                </div>
              </div>

              {/* WhatsApp Number */}
              <div className="flex flex-col">
                <FieldLabel required className="mb-1">WhatsApp Number</FieldLabel>
                <p className="mb-[6px] h-[20px] text-[12px] font-normal leading-[16px] text-[#90A1B9]">
                  Only use numbers; do not include any spaces.
                </p>
                <div className={cn("flex h-10 w-full items-center rounded-md border border-gray-300 bg-white transition-all focus-within:ring-2 focus-within:ring-[#E60076]")}>
                  <Select value={whatsappCountryCode} onValueChange={(v) => { setWhatsappCountryCode(v); markDirty(); }}>
                    <SelectTrigger className="h-full w-[100px] rounded-l-md rounded-r-none border-0 border-r border-slate-200 bg-transparent px-2 ring-0 focus:ring-0 focus:ring-offset-0 whitespace-nowrap overflow-hidden">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[99999999]">
                      <SelectItem value="+94">🇱🇰 +94</SelectItem>
                      <SelectItem value="+1">🇺🇸 +1</SelectItem>
                      <SelectItem value="+44">🇬🇧 +44</SelectItem>
                    </SelectContent>
                  </Select>
                  <input
                    value={whatsappNumber}
                    onChange={(e) => { setWhatsappNumber(e.target.value); markDirty(); }}
                    className={cn("flex-1 bg-transparent px-3 py-2 text-sm outline-none", AUTH_INPUT.placeholder)}
                    placeholder="77 234 5670"
                  />
                </div>
              </div>

              {/* District */}
              <div className="space-y-1">
                <FieldLabel>District</FieldLabel>
                <Select value={district} onValueChange={(v) => { setDistrict(v); markDirty(); }}>
                  <SelectTrigger className={cn(AUTH_INPUT.base, "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic")}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="z-[99999999]">
                    <SelectItem value="Colombo">Colombo</SelectItem>
                    <SelectItem value="Kandy">Kandy</SelectItem>
                    <SelectItem value="Galle">Galle</SelectItem>
                    <SelectItem value="Matara">Matara</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Branch */}
              <div className="space-y-1">
                <FieldLabel>Branch</FieldLabel>
                <Select value={branch} onValueChange={(v) => { setBranch(v); markDirty(); }}>
                  <SelectTrigger className={cn(AUTH_INPUT.base, "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic")}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="z-[99999999]">
                    <SelectItem value="Main">Main Branch</SelectItem>
                    <SelectItem value="Kandy">Kandy Branch</SelectItem>
                    <SelectItem value="Galle">Galle Branch</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="branch-manager-edit"
                    checked={isBranchManager}
                    onChange={(e) => { setIsBranchManager(e.target.checked); markDirty(); }}
                    className="accent-[#0F172B] w-4 h-4 cursor-pointer rounded-sm"
                  />
                  <label htmlFor="branch-manager-edit" className="text-[13px] font-medium text-[#45556C] cursor-pointer">
                    Make this user a Branch Manager
                  </label>
                </div>
              </div>

              {/* Privileges */}
              <div className="space-y-3 mt-1">
                <FieldLabel>Privileges</FieldLabel>
                <div className="flex flex-col gap-3">
                  {["1", "2", "3", "4"].map((num) => (
                    <div key={`privilege-${num}`} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`edit-privilege-${num}`}
                        checked={privileges[num]}
                        onChange={() => togglePrivilege(num)}
                        className="accent-[#0F172B] w-4 h-4 cursor-pointer rounded-sm"
                      />
                      <label htmlFor={`edit-privilege-${num}`} className="text-sm font-medium text-[#45556C] cursor-pointer">
                        Privilege {num}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Salary Type */}
              <div className="space-y-3 mt-1">
                <FieldLabel>Salary Type</FieldLabel>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="edit-monthly-salary"
                      value="Monthly Salary"
                      name="edit-salary-type"
                      checked={salaryType === "Monthly Salary"}
                      onChange={(e) => { setSalaryType(e.target.value); markDirty(); }}
                      className="accent-[#0F172B] w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="edit-monthly-salary" className="text-sm font-medium text-[#45556C] cursor-pointer">
                      Monthly Salary
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="edit-commission-enrollments"
                      value="Commission per enrollments"
                      name="edit-salary-type"
                      checked={salaryType === "Commission per enrollments"}
                      onChange={(e) => { setSalaryType(e.target.value); markDirty(); }}
                      className="accent-[#0F172B] w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="edit-commission-enrollments" className="text-sm font-medium text-[#45556C] cursor-pointer">
                      Commission per enrollments
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="edit-commission-branch-enrollments"
                      value="Commission per enrollments by branch"
                      name="edit-salary-type"
                      checked={salaryType === "Commission per enrollments by branch"}
                      onChange={(e) => { setSalaryType(e.target.value); markDirty(); }}
                      className="accent-[#0F172B] w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="edit-commission-branch-enrollments" className="text-sm font-medium text-[#45556C] cursor-pointer">
                      Commission per enrollments by branch
                    </label>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ===== FOOTER (static) ===== */}
          <div className="flex items-center justify-end gap-3 border-t border-[#E2E8F0] pt-4 shrink-0">
            <Button
              onClick={handleUpdate}
              className={cn(BUTTON_STYLES.primary.full, "w-auto px-[38.5px] text-sm font-semibold text-white")}
            >
              Update
            </Button>
          </div>

        </DialogContent>
      </Dialog>

      {/* Discard Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onConfirm={handleConfirmDiscard}
        title="Save Your Edits First"
        description="Unsaved changes detected, remember to save your edits before you close!"
        confirmText="Proceed Without Saving"
        cancelText="Go Back and Save"
      />
    </>
  );
}
