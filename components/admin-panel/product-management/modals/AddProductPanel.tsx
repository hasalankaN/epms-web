"use client";

import React, { useState, useEffect } from "react";

import { createPortal } from "react-dom";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import ImageUpload from "@/components/common/ImageUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";

interface AddProductPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// ===== Portal helper (same as AddInquiryPanel) =====
const Portal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(children, document.body);
};

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

export function AddProductPanel({ isOpen, onClose }: AddProductPanelProps) {
  // ===== Dirty-state guard =====
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  // ===== Image states (independent, concurrent) =====
  const [mainImage, setMainImage] = useState("");

  const [gallery, setGallery] = useState<[string, string, string, string]>([
    "",
    "",
    "",
    "",
  ]);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setIsDirty(false);
      setShowDiscardModal(false);
      setMainImage("");
      setGallery(["", "", "", ""]);
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

  const handleSaveAsDraft = () => {
    toast.success("Product saved as draft");
    onClose();
  };

  const handleAdd = () => {
    toast.success("Product added successfully");
    onClose();
  };

  const setGalleryImage = (index: number, url: string) => {
    setGallery((prev) => {
      const next = [...prev] as [string, string, string, string];

      next[index] = url;
      
      return next;
    });
  };

  const removeGalleryImage = (index: number) => {
    setGallery((prev) => {
      const next = [...prev] as [string, string, string, string];

      next[index] = "";
      
return next;
    });
  };

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
                    Add New Product
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

                    {/* Product Name */}
                    <div className="space-y-1">
                      <FieldLabel required>Product Name</FieldLabel>
                      <Input
                        className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                        placeholder="eg: T-shirt"
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Product Type */}
                    <div className="space-y-1">
                      <FieldLabel required>Product Type</FieldLabel>
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
                          <SelectItem value="digital">Digital</SelectItem>
                          <SelectItem value="delivery">Delivery</SelectItem>
                          <SelectItem value="physical">Physical</SelectItem>
                          <SelectItem value="service">Service</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Barcode / SKU */}
                    <div className="space-y-1">
                      <FieldLabel>Barcode / SKU</FieldLabel>
                      <Input
                        className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                        placeholder="eg: SKU-00123"
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Product Short Description */}
                    <div className="space-y-1">
                      <FieldLabel>Product Short Description</FieldLabel>
                      <Input
                        className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                        placeholder="eg: Type here"
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Product Long Description */}
                    <div className="space-y-1">
                      <FieldLabel>Product Long Description</FieldLabel>
                      <Textarea
                        className={cn(
                          "min-h-[100px] resize-none",
                          AUTH_INPUT.placeholder
                        )}
                        placeholder="eg: Type here"
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Product Price — FeeDetailsStep pattern */}
                    <div className="space-y-1">
                      <FieldLabel required>Product Price</FieldLabel>
                      <p className="mb-[6px] text-[12px] font-normal leading-[16px] text-[#90A1B9]">
                        Only numbers, periods, commas and spaces are accepted.
                      </p>
                      <div className="relative">
                        <Input
                          className={cn(
                            AUTH_INPUT.base,
                            AUTH_INPUT.placeholder,
                            "pr-14"
                          )}
                          placeholder="eg: 1,000.00"
                          onChange={handleInputChange}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <span className="text-sm font-semibold text-[#1D293D]">
                            LKR
                          </span>
                          <ChevronDown className="h-3 w-3 text-[#0F172B]" />
                        </div>
                      </div>
                    </div>

                    {/* Starting Stock Quantity */}
                    <div className="space-y-1">
                      <FieldLabel required>Starting Stock Quantity</FieldLabel>
                      <Input
                        type="number"
                        className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                        placeholder="eg: 100"
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Stock Threshold */}
                    <div className="space-y-1">
                      <FieldLabel>Stock Threshold</FieldLabel>
                      <Input
                        type="number"
                        className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                        placeholder="eg: 05"
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Image Upload — Product Image + Product Gallery */}
                    <div className="flex items-start gap-6">
                      {/* ── Product Image (1× 140×140) ── */}
                      <div className="flex flex-col gap-2">
                        <span className={cn(AUTH_TYPOGRAPHY.label)}>
                          Product Image
                        </span>
                        <div
                          className="shrink-0"
                          style={{
                            width: 180,
                            height: 180,
                            padding: 12,
                            borderRadius: "0.375rem",
                            border: "1px dashed #E2E8F0",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            aspectRatio: "1/1",
                            overflow: "hidden",
                          }}
                        >
                          <ImageUpload
                            imageUrl={mainImage}
                            setImage={(url) => {
                              setMainImage(url);
                              handleInputChange();
                            }}
                            removeImage={() => setMainImage("")}
                            showSupportedFormats={false}
                            className="h-full w-full"
                            dropzoneClassName="!h-full !border-none !rounded-none !bg-transparent !p-0"
                            iconClassName="w-6 h-6 mb-1"
                            placeholder={
                              <span className="text-[12px] leading-tight px-2 text-[#90A1B9]">
                                Upload Image Here or drag and drop here
                              </span>
                            }
                          />
                        </div>
                      </div>

                      {/* ── Product Gallery (4× 64×64 in 2×2 grid) ── */}
                      <div className="flex flex-col gap-2">
                        <span className={cn(AUTH_TYPOGRAPHY.label)}>
                          Product Gallery
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          {gallery.map((url, i) => (
                            <div
                              key={i}
                              style={{
                                width: 86,
                                height: 86,
                                padding: 12,
                                borderRadius: "7.6px",
                                border: "1px dashed #E2E8F0",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                aspectRatio: "1/1",
                                overflow: "hidden",
                              }}
                            >
                              <ImageUpload
                                imageUrl={url}
                                setImage={(imgUrl) => {
                                  setGalleryImage(i, imgUrl);
                                  handleInputChange();
                                }}
                                removeImage={() => removeGalleryImage(i)}
                                showSupportedFormats={false}
                                className="h-full w-full"
                                dropzoneClassName="!h-full !border-none !rounded-none !bg-transparent !p-0"
                                iconClassName="w-5 h-5 text-[#90A1B9]"
                                placeholder={null}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Select Commission Type */}
                    <div className="space-y-1">
                      <FieldLabel>Select Commission Type</FieldLabel>
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
                          <SelectItem value="fixed">Fixed</SelectItem>
                          <SelectItem value="percentage">Percentage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Commission Value */}
                    <div className="space-y-1">
                      <FieldLabel>Commission Value</FieldLabel>
                      <Input
                        type="number"
                        className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                        placeholder="eg: 05"
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Team Commission Value */}
                    <div className="space-y-1">
                      <FieldLabel>Team Commission Value</FieldLabel>
                      <Input
                        type="number"
                        className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                        placeholder="eg: 05"
                        onChange={handleInputChange}
                      />
                    </div>

                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-[#E2E8F0] px-6 py-4">
                  <Button
                    variant="ghost"
                    onClick={handleSaveAsDraft}
                    className={cn(
                      BUTTON_STYLES.secondary.md,
                      "text-sm font-semibold text-[#0F172B] hover:bg-slate-100"
                    )}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    onClick={handleAdd}
                    className={cn(
                      BUTTON_STYLES.primary.full,
                      "w-auto px-6 text-sm font-semibold text-white"
                    )}
                  >
                    Add
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
