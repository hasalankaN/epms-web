"use client";

import React, { useState } from "react";

import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  motion,
  itemVariants,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";

interface RequestAmountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RequestAmountModal({ isOpen, onClose }: RequestAmountModalProps) {
  const [amount, setAmount] = useState("");

  const handleSubmit = () => {
    // Handle submission logic here
    console.log("Request amount:", amount);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[90vh] w-[95%] max-w-[370px] flex-col gap-4 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] outline-none [&>button]:hidden">
        
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            show: {
              transition: {
                staggerChildren: 0.08,
              }
            }
          }}
          className="flex flex-col gap-4"
        >
          {/* ===== HEADER ===== */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex-1 text-lg font-semibold leading-[30px] text-[#0F172B]">
                Request Form
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
          </motion.div>
          
          {/* ===== FORM ===== */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            
            {/* Amount Field */}
            <div className="space-y-1">
              <Label className={cn(AUTH_TYPOGRAPHY.label, "mb-1.5 block")}>
                Enter Amount
              </Label>
              <div className="relative flex items-center">
                <Input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="XXXX.00"
                  className={cn(
                    AUTH_INPUT.base,
                    AUTH_INPUT.placeholder,
                    "pr-12 text-[#1D293D]"
                  )}
                />
                <span className="absolute right-3 text-[14px] font-semibold text-[#0F172B]">
                  LKR
                </span>
              </div>
            </div>

            {/* Spacer */}
            <div className="h-2"></div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmit}
                disabled={!amount.trim()}
                className={cn(
                  BUTTON_STYLES.primary.full, 
                  "w-auto px-6 font-inter text-[14px] font-semibold leading-[20px]"
                )}
              >
                Send Request
              </Button>
            </div>
          </motion.div>
        </motion.div>

      </DialogContent>
    </Dialog>
  );
}
