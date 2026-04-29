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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  AUTH_TYPOGRAPHY,
  AUTH_INPUT,
  BUTTON_STYLES,
} from "@/lib/constants/theme";
import ImageUpload from "@/components/common/ImageUpload";

interface AddBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddBannerModal({ isOpen, onClose }: AddBannerModalProps) {
  const [enableButtons, setEnableButtons] = useState(true);
  const [numberOfButtons, setNumberOfButtons] = useState<1 | 2>(2);
  const [desktopImageUrl, setDesktopImageUrl] = useState("");
  const [mobileImageUrl, setMobileImageUrl] = useState("");

  const handleClearAll = () => {
    setEnableButtons(true);
    setNumberOfButtons(2);
    setDesktopImageUrl("");
    setMobileImageUrl("");

    // Additional field resets would go here if using a form state
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        animateChildren={true}
        className="flex max-h-[90vh] w-[95%] max-w-[704px] flex-col gap-0 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-0 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] [&>button]:hidden"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between p-6 pb-4 shrink-0">
          <DialogTitle className="font-inter text-lg font-semibold leading-[30px] text-[#0F172B]">
            Add New Banner
          </DialogTitle>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-white transition-colors hover:bg-slate-50"
          >
            <X className="h-4 w-4 text-[#64748B]" />
          </button>
        </motion.div>

        <div className="h-[1px] bg-[#E2E8F0] mx-6" />

        {/* Body */}
        <motion.div
          variants={itemVariants}
          className="flex-1 overflow-y-auto p-6 pt-4 custom-scrollbar"
        >
          <div className="flex flex-col gap-4">
            {/* Title */}
            <div className="space-y-1.5">
              <Label className={AUTH_TYPOGRAPHY.label}>Title</Label>
              <Input
                placeholder="Enter title"
                className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
              />
            </div>

            {/* Sub Title */}
            <div className="space-y-1.5">
              <Label className={AUTH_TYPOGRAPHY.label}>Sub Title</Label>
              <Input
                placeholder="Enter sub title"
                className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
              />
            </div>

            {/* Paragraph */}
            <div className="space-y-1.5">
              <Label className={AUTH_TYPOGRAPHY.label}>Paragraph</Label>
              <Textarea
                placeholder="Enter paragraph text"
                rows={4}
                className={cn(
                  "resize-y rounded-md border border-gray-300 text-sm focus-visible:ring-[#E60076]",
                  AUTH_INPUT.placeholder
                )}
              />
            </div>

            {/* Desktop View & Mobile View */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label className={cn(AUTH_TYPOGRAPHY.label)}>
                  Desktop View <span className="text-red-500">*</span>
                </Label>
                <ImageUpload
                  imageUrl={desktopImageUrl}
                  setImage={(url) => setDesktopImageUrl(url)}
                  removeImage={() => setDesktopImageUrl("")}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className={cn(AUTH_TYPOGRAPHY.label)}>
                  Mobile View <span className="text-red-500">*</span>
                </Label>
                <ImageUpload
                  imageUrl={mobileImageUrl}
                  setImage={(url) => setMobileImageUrl(url)}
                  removeImage={() => setMobileImageUrl("")}
                />
              </div>
            </div>

            {/* Buttons Configuration */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label className={AUTH_TYPOGRAPHY.label}>Enable Buttons</Label>
                <div className="flex items-center gap-4">
                  {["Yes", "No"].map((opt) => (
                    <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="add-modal-enable-buttons"
                        checked={enableButtons === (opt === "Yes")}
                        onChange={() => setEnableButtons(opt === "Yes")}
                        className="h-4 w-4 cursor-pointer accent-[#0F172B]"
                      />
                      <span className="text-sm font-medium text-[#45556C]">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label className={AUTH_TYPOGRAPHY.label}>No. of Buttons</Label>
                <div className="flex items-center gap-4">
                  {([1, 2] as const).map((num) => (
                    <label key={num} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="add-modal-no-of-buttons"
                        checked={numberOfButtons === num}
                        onChange={() => setNumberOfButtons(num)}
                        className="h-4 w-4 cursor-pointer accent-[#0F172B]"
                      />
                      <span className="text-sm font-medium text-[#45556C]">{num}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Button Fields */}
            {enableButtons && (
              <div className="flex flex-col gap-4">
                {/* Button 1 */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className={AUTH_TYPOGRAPHY.label}>Button 1 Text</Label>
                    <Input
                      placeholder="Enter button text"
                      className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className={AUTH_TYPOGRAPHY.label}>Button 1 Link</Label>
                    <div className="flex h-10 items-center rounded-md border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-[#E60076] transition-all overflow-hidden">
                      <span className="border-r border-gray-300 px-3 text-sm font-medium text-[#64748B] h-full flex items-center bg-[#F8FAFC]">
                        https://
                      </span>
                      <input
                        placeholder="your-url.com/path"
                        className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-[#90A1B9] placeholder:italic w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Button 2 */}
                {numberOfButtons === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className={AUTH_TYPOGRAPHY.label}>Button 2 Text</Label>
                      <Input
                        placeholder="Enter button text"
                        className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className={AUTH_TYPOGRAPHY.label}>Button 2 Link</Label>
                      <div className="flex h-10 items-center rounded-md border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-[#E60076] transition-all overflow-hidden">
                        <span className="border-r border-gray-300 px-3 text-sm font-medium text-[#64748B] h-full flex items-center bg-[#F8FAFC]">
                          https://
                        </span>
                        <input
                          placeholder="your-url.com/path"
                          className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-[#90A1B9] placeholder:italic w-full"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-[#E2E8F0] shrink-0"
        >
          <Button
            type="button"
            variant="ghost"
            onClick={handleClearAll}
            className={cn(
              BUTTON_STYLES.secondary.md,
              "font-inter text-[14px] font-semibold text-[#0F172B] hover:bg-slate-100 bg-[#F1F5F9]"
            )}
          >
            Clear All
          </Button>
          <Button
            type="button"
            className={cn(
              BUTTON_STYLES.primary.md,
              "font-inter text-[14px] font-semibold text-white leading-5 px-6"
            )}
            onClick={onClose}
          >
            Create Banner
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
