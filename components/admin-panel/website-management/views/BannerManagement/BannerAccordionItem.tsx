"use client";

import React, { useState } from "react";

import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AUTH_INPUT, AUTH_TYPOGRAPHY, BUTTON_STYLES } from "@/lib/constants/theme";
import ImageUpload from "@/components/common/ImageUpload";
import type { BannerItem } from "@/types/website-management";
import { motion, itemVariants } from "@/components/ui/dialog";

interface BannerAccordionItemProps {
  banner: BannerItem;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

export function BannerAccordionItem({
  banner,
  index,
  isExpanded,
  onToggle,
  onDelete,
}: BannerAccordionItemProps) {
  const [enableButtons, setEnableButtons] = useState(banner.enableButtons);
  const [numberOfButtons, setNumberOfButtons] = useState<1 | 2>(banner.numberOfButtons);
  const [desktopImageUrl, setDesktopImageUrl] = useState<string>("");
  const [mobileImageUrl, setMobileImageUrl] = useState<string>("");

  return (
    <motion.div variants={itemVariants} className="flex flex-col w-full">
      {/* Header Card */}
      <div
        className={cn(
          "flex px-2 py-[20px] items-center justify-between gap-[12px] self-stretch rounded-lg border border-[#E2E8F0] transition-all cursor-pointer",
          isExpanded ? "bg-[#F8FAFC] shadow-none" : "bg-white shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]"
        )}
        onClick={onToggle}
      >
        {/* Label */}
        <span className="font-inter text-[14px] font-medium leading-[20px] text-[#0F172B]">
          Banner {index + 1}
        </span>

        {/* Actions */}
        <div className="flex items-center gap-[8px]">
          {/* Delete */}
          <button
            title="Delete Banner"
            className="flex h-[28px] w-[28px] shrink-0 items-center justify-center text-[#FB2C36] hover:bg-[#FB2C36]/10 rounded-full transition-all"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-[14px] w-[14px]" />
          </button>

          {/* Chevron */}
          <button
            title={isExpanded ? "Collapse" : "Expand"}
            className="flex h-[18px] w-[18px] shrink-0 items-center justify-center text-[#64748B] hover:opacity-80 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            {isExpanded ? (
              <ChevronUp className="h-[16px] w-[16px]" />
            ) : (
              <ChevronDown className="h-[16px] w-[16px]" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex pt-[32px] pb-[16px] w-full">
              {/* Vertical Line */}
              <div className="w-[1px] bg-[#E2E8F0] shrink-0 ml-[24px] mr-[24px]" />

              {/* Form Content */}
              <div className="flex-1 flex flex-col pr-[8px]">
                {/* Top section with 32px gaps */}
                <div className="flex flex-col gap-[32px]">
                  {/* Title & Sub Title */}
                  <div className="grid grid-cols-1 gap-[32px] md:gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className={AUTH_TYPOGRAPHY.label}>Title</Label>
                      <Input
                        defaultValue={banner.title}
                        placeholder="Enter title"
                        className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className={AUTH_TYPOGRAPHY.label}>Sub Title</Label>
                      <Input
                        defaultValue={banner.subTitle}
                        placeholder="Enter sub title"
                        className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                      />
                    </div>
                  </div>

                  {/* Paragraph */}
                  <div className="space-y-1.5">
                    <Label className={AUTH_TYPOGRAPHY.label}>Paragraph</Label>
                    <Textarea
                      defaultValue={banner.paragraph}
                      placeholder="Enter paragraph text"
                      rows={4}
                      className={cn(
                        "resize-y rounded-md border border-gray-300 text-sm focus-visible:ring-[#E60076]",
                        AUTH_INPUT.placeholder
                      )}
                    />
                  </div>

                  {/* Desktop View & Mobile View */}
                  <div className="grid grid-cols-1 gap-[32px] md:gap-4 md:grid-cols-2">
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
                </div>

                {/* Separator with 16px vertical gaps */}
                <div className="h-[1px] bg-[#E2E8F0] w-full my-[16px]" />

                {/* Bottom section with 32px gaps */}
                <div className="flex flex-col gap-[32px]">
                  {/* Enable Buttons */}
                  <div className="grid grid-cols-1 gap-[32px] md:gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label className={AUTH_TYPOGRAPHY.label}>Enable Buttons</Label>
                      <div className="flex items-center gap-4">
                        {["Yes", "No"].map((opt) => (
                          <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name={`enable-buttons-${banner.id}`}
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
                              name={`no-of-buttons-${banner.id}`}
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
                    <div className="flex flex-col gap-[32px]">
                      {/* Button 1 */}
                      <div className="grid grid-cols-1 gap-[32px] md:gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label className={AUTH_TYPOGRAPHY.label}>Button 1 Text</Label>
                          <Input
                            defaultValue={banner.button1Text}
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
                              defaultValue={banner.button1Link}
                              placeholder="your-url.com/path"
                              className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-[#90A1B9] placeholder:italic w-full"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Button 2 (conditional) */}
                      {numberOfButtons === 2 && (
                        <div className="grid grid-cols-1 gap-[32px] md:gap-4 md:grid-cols-2">
                          <div className="space-y-1.5">
                            <Label className={AUTH_TYPOGRAPHY.label}>Button 2 Text</Label>
                            <Input
                              defaultValue={banner.button2Text}
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
                                defaultValue={banner.button2Link}
                                placeholder="your-url.com/path"
                                className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-[#90A1B9] placeholder:italic w-full"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Update Button */}
                  <div className="flex justify-end">
                    <Button
                      className={cn(
                        BUTTON_STYLES.secondary.md,
                        "font-inter text-[14px] font-semibold text-[#0F172B]"
                      )}
                    >
                      Update Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
