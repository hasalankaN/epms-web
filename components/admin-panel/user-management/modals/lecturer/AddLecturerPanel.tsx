"use client";

import React, { useState, useEffect } from "react";

import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import {
  AUTH_TYPOGRAPHY,
  AUTH_INPUT,
  BUTTON_STYLES,
} from "@/lib/constants/theme";

interface AddLecturerPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const Portal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(children, document.body);
};

export function AddLecturerPanel({ isOpen, onClose }: AddLecturerPanelProps) {
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [salaryType, setSalaryType] = useState("Monthly Salary");

  // Reset dirty state when panel opens
  useEffect(() => {
    if (isOpen) {
      setIsDirty(false);
      setShowDiscardModal(false);
      setSalaryType("Monthly Salary");
    }
  }, [isOpen]);

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

  const handleInputChange = () => {
    if (!isDirty) setIsDirty(true);
  };

  const handleSave = () => {
    toast.success("Lecturer added successfully");
    onClose();
  };

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
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </Label>
  );

  return (
    <>
      <Portal>
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseAttempt}
                className="fixed inset-0 z-[99999] bg-black/20 backdrop-blur-sm"
              />

              {/* Side Panel */}
              <motion.div
                key="panel"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 z-[99999] flex h-screen w-full max-w-[500px] flex-col bg-white shadow-2xl"
                style={{
                  borderLeft: "1px solid #E2E8F0",
                  borderRadius: "8px 0 0 8px",
                  boxShadow:
                    "0 4px 6px -4px rgba(16, 24, 40, 0.10), 0 10px 15px -3px rgba(0, 0, 0, 0.10)",
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4">
                  <h2 className="text-lg font-semibold leading-[30px] text-[#0F172B]">
                    Lecturer Registration Form
                  </h2>
                  <button
                    title="close"
                    onClick={handleCloseAttempt}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-transparent shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-slate-50"
                  >
                    <X className="h-4 w-4 text-[#64748B]" />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                  <div className="flex flex-col gap-6">
                    {/* Lecturer Name */}
                    <div className="space-y-1">
                      <FieldLabel required>Lecturer Name</FieldLabel>
                      <Input
                        className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                        placeholder="eg: perera"
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Gender */}
                    <div className="space-y-1">
                      <FieldLabel required>Gender</FieldLabel>
                      <Select onValueChange={handleInputChange}>
                        <SelectTrigger
                          className={cn(
                            AUTH_INPUT.base,
                            "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic"
                          )}
                        >
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
                        className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Mobile Number */}
                    <div className="flex flex-col">
                      <FieldLabel required className="mb-1">
                        Mobile Number
                      </FieldLabel>
                      <p className="mb-[6px] h-[20px] text-[12px] font-normal leading-[16px] text-[#90A1B9]">
                        Only use numbers; do not include any spaces.
                      </p>
                      <div
                        className={cn(
                          "flex h-10 w-full items-center rounded-md border border-gray-300 bg-white transition-all focus-within:ring-2 focus-within:ring-[#E60076]"
                        )}
                      >
                        <Select defaultValue="+94">
                          <SelectTrigger className="h-full w-[90px] rounded-l-md rounded-r-none border-0 border-r border-slate-200 bg-transparent px-2 ring-0 focus:ring-0 focus:ring-offset-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="z-[99999999]">
                            <SelectItem value="+94">🇱🇰 +94</SelectItem>
                            <SelectItem value="+1">🇺🇸 +1</SelectItem>
                            <SelectItem value="+44">🇬🇧 +44</SelectItem>
                          </SelectContent>
                        </Select>
                        <input
                          className={cn(
                            "flex-1 bg-transparent px-3 py-2 text-sm outline-none",
                            AUTH_INPUT.placeholder
                          )}
                          placeholder="eg: 77 234 5670"
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    {/* WhatsApp Number */}
                    <div className="flex flex-col">
                      <FieldLabel required className="mb-1">
                        WhatsApp Number
                      </FieldLabel>
                      <p className="mb-[6px] h-[20px] text-[12px] font-normal leading-[16px] text-[#90A1B9]">
                        Only use numbers; do not include any spaces.
                      </p>
                      <div
                        className={cn(
                          "flex h-10 w-full items-center rounded-md border border-gray-300 bg-white transition-all focus-within:ring-2 focus-within:ring-[#E60076]"
                        )}
                      >
                        <Select defaultValue="+94">
                          <SelectTrigger className="h-full w-[90px] rounded-l-md rounded-r-none border-0 border-r border-slate-200 bg-transparent px-2 ring-0 focus:ring-0 focus:ring-offset-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="z-[99999999]">
                            <SelectItem value="+94">🇱🇰 +94</SelectItem>
                            <SelectItem value="+1">🇺🇸 +1</SelectItem>
                            <SelectItem value="+44">🇬🇧 +44</SelectItem>
                          </SelectContent>
                        </Select>
                        <input
                          className={cn(
                            "flex-1 bg-transparent px-3 py-2 text-sm outline-none",
                            AUTH_INPUT.placeholder
                          )}
                          placeholder="eg: 77 234 5670"
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <FieldLabel required>Email</FieldLabel>
                      <Input
                        type="email"
                        className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                        placeholder="eg: user@gamil.com"
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* District */}
                    <div className="space-y-1">
                      <FieldLabel>District</FieldLabel>
                      <Select onValueChange={handleInputChange}>
                        <SelectTrigger
                          className={cn(
                            AUTH_INPUT.base,
                            "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic"
                          )}
                        >
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

                    {/* Salary Type (Radio Group) */}
                    <div className="space-y-3">
                      <FieldLabel>Salary Type</FieldLabel>
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="monthly-salary"
                            value="Monthly Salary"
                            name="salary-type"
                            checked={salaryType === "Monthly Salary"}
                            onChange={(e) => {
                              setSalaryType(e.target.value);
                              handleInputChange();
                            }}
                            className="accent-[#0F172B] w-4 h-4 cursor-pointer"
                          />
                          <label
                            htmlFor="monthly-salary"
                            className="text-sm font-medium text-[#45556C] cursor-pointer"
                          >
                            Monthly Salary
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="commission-enrollment"
                            value="Commission per enrollment"
                            name="salary-type"
                            checked={salaryType === "Commission per enrollment"}
                            onChange={(e) => {
                              setSalaryType(e.target.value);
                              handleInputChange();
                            }}
                            className="accent-[#0F172B] w-4 h-4 cursor-pointer"
                          />
                          <label
                            htmlFor="commission-enrollment"
                            className="text-sm font-medium text-[#45556C] cursor-pointer"
                          >
                            Commission per enrollment
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="commission-enrollment-month"
                            value="Commission per enrollment by month"
                            name="salary-type"
                            checked={
                              salaryType ===
                              "Commission per enrollment by month"
                            }
                            onChange={(e) => {
                              setSalaryType(e.target.value);
                              handleInputChange();
                            }}
                            className="accent-[#0F172B] w-4 h-4 cursor-pointer"
                          />
                          <label
                            htmlFor="commission-enrollment-month"
                            className="text-sm font-medium text-[#45556C] cursor-pointer"
                          >
                            Commission per enrollment by month
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-[#E2E8F0] px-6 py-4">
                  <Button
                    onClick={handleSave}
                    className={cn(
                      BUTTON_STYLES.primary.full,
                      "w-auto px-[38.5px] text-sm font-semibold text-white"
                    )}
                  >
                    Create
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </Portal>

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
