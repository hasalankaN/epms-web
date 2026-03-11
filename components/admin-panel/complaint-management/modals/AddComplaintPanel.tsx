"use client";

import React, { useState, useEffect } from "react";

import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";

interface AddComplaintPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const Portal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(children, document.body);
};

export function AddComplaintPanel({ isOpen, onClose }: AddComplaintPanelProps) {
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsDirty(false);
      setShowDiscardModal(false);
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

  const handleSubmit = () => {
    toast.success("Complain added successfully");
    onClose();
  };

  const FieldLabel = ({ children, required = false, className }: { children: React.ReactNode; required?: boolean; className?: string }) => (
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
                  boxShadow: "0 4px 6px -4px rgba(16, 24, 40, 0.10), 0 10px 15px -3px rgba(0, 0, 0, 0.10)"
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4">
                  <h2 className="text-lg font-semibold leading-[30px] text-[#0F172B]">Add a Complain</h2>
                  <button
                    title="close"
                    onClick={handleCloseAttempt}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-transparent shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-slate-50"
                  >
                    <X className="h-4 w-4 text-[#64748B]" />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
                  <div className="flex flex-col gap-6">
                    
                    {/* Complain Holder */}
                    <div className="space-y-1">
                      <FieldLabel required>Complain Holder</FieldLabel>
                      <Input
                        className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                        placeholder="eg: perera"
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Mobile Number */}
                    <div className="flex flex-col">
                      <FieldLabel required className="mb-1">Mobile Number</FieldLabel>
                      <p className="mb-[6px] h-[20px] text-[12px] font-normal leading-[16px] text-[#90A1B9]">Only use numbers; do not include any spaces.</p>
                      <div className={cn(
                          "flex h-10 w-full items-center rounded-md border border-gray-300 bg-white transition-all focus-within:ring-2 focus-within:ring-[#E60076]"
                      )}>
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

                    {/* Assignee */}
                    <div className="space-y-1">
                      <FieldLabel required>Assignee</FieldLabel>
                      <Select onValueChange={handleInputChange}>
                        <SelectTrigger className={cn(AUTH_INPUT.base, "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic")}>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="z-[99999999]">
                          <SelectItem value="John Doe">John Doe</SelectItem>
                          <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Complain Type */}
                    <div className="space-y-1">
                      <FieldLabel required>Complain Type</FieldLabel>
                      <Select onValueChange={handleInputChange}>
                        <SelectTrigger className={cn(AUTH_INPUT.base, "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic")}>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="z-[99999999]">
                          <SelectItem value="System Error">System Error</SelectItem>
                          <SelectItem value="Billing Issue">Billing Issue</SelectItem>
                          <SelectItem value="User Feedback">User Feedback</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Enter Complain */}
                    <div className="space-y-1">
                      <FieldLabel required>Enter Complain</FieldLabel>
                      <Textarea
                        className={cn("min-h-[100px] resize-none", AUTH_INPUT.placeholder)}
                        placeholder="eg: Type your message here"
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Additional Notes */}
                    <div className="space-y-1">
                      <FieldLabel>Additional Notes</FieldLabel>
                      <Textarea
                        className={cn("min-h-[100px] resize-none", AUTH_INPUT.placeholder)}
                        placeholder="eg: Type your message here"
                        onChange={handleInputChange}
                      />
                    </div>

                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-[#E2E8F0] px-6 py-4">
                  <Button 
                    onClick={handleSubmit}
                    className={cn(BUTTON_STYLES.primary.full, "w-auto px-[38.5px] text-sm font-semibold text-white")}
                  >
                    Submit
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
