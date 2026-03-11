"use client";

import React, { useState, useEffect } from "react";

import { X, ChevronDown } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
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
import type { ProductDataType } from "@/types/product";
import { AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";

interface EditProductPanelProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductDataType | null;
}

// ===== Reusable FieldLabel helper =====
const FieldLabel = ({
  children,
  required = false,
}: {
  children: React.ReactNode;
  required?: boolean;
}) => (
  <Label className={cn(AUTH_TYPOGRAPHY.label, "mb-1.5 block")}>
    {children}
    {required && <span className="ml-0.5 text-red-500">*</span>}
  </Label>
);

export function EditProductPanel({ isOpen, onClose, product }: EditProductPanelProps) {
  // ===== Form state (pre-filled from product) =====
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("");
  const [barcodeSku, setBarcodeSku] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [stockThreshold, setStockThreshold] = useState("");
  const [commissionType, setCommissionType] = useState("");
  const [commissionValue, setCommissionValue] = useState("");
  const [teamCommissionValue, setTeamCommissionValue] = useState("");

  // ===== Image states =====
  const [mainImage, setMainImage] = useState("");
  const [gallery, setGallery] = useState<[string, string, string, string]>(["", "", "", ""]);

  // ===== Dirty-state guard =====
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  // Pre-fill form when product changes or modal opens
  useEffect(() => {
    if (isOpen && product) {
      setProductName(product.productName ?? "");
      setProductType(product.productType ?? "");
      setBarcodeSku(product.barcodeSku ?? "");
      setShortDescription(product.shortDescription ?? "");
      setLongDescription(product.longDescription ?? "");
      setPrice(product.price?.toString() ?? "");
      setStockQuantity(product.quantity?.toString() ?? "");
      setStockThreshold(product.stockThreshold?.toString() ?? "");
      setCommissionType(product.commissionType ?? "");
      setCommissionValue(product.commissionValue?.toString() ?? "");
      setTeamCommissionValue(product.teamCommissionValue?.toString() ?? "");
      setMainImage(product.thumbnail ?? "");
      setGallery(product.gallery ?? ["", "", "", ""]);
      setIsDirty(false);
      setShowDiscardModal(false);
    }
  }, [isOpen, product]);

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
    toast.success("Product updated successfully");
    onClose();
  };

  const setGalleryImage = (index: number, url: string) => {
    setGallery((prev) => {
      const next = [...prev] as [string, string, string, string];

      next[index] = url;

      return next;
    });
    markDirty();
  };

  const removeGalleryImage = (index: number) => {
    setGallery((prev) => {
      const next = [...prev] as [string, string, string, string];
      
      next[index] = "";

      return next;
    });
  };

  if (!product) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseAttempt()}>
        <DialogContent className="flex max-h-[90vh] w-[95%] max-w-[720px] flex-col gap-4 overflow-hidden rounded-lg sm:rounded-xl border border-[#E2E8F0] bg-white p-4 sm:p-6 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] [&>button]:hidden">

          {/* ===== HEADER ===== */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex-1 text-lg font-semibold leading-[30px] text-[#0F172B]">
                Edit Product Details
              </DialogTitle>
              <button
                title="close"
                onClick={handleCloseAttempt}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-transparent shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-slate-50"
              >
                <X className="h-4 w-4 text-[#64748B]" />
              </button>
            </div>
            <div className="border-b border-[#E2E8F0]" />
          </div>

          {/* ===== BODY ===== */}
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 sm:gap-y-5">

              {/* Product Name */}
              <div className="space-y-1">
                <FieldLabel required>Product Name</FieldLabel>
                <Input
                  value={productName}
                  onChange={(e) => { setProductName(e.target.value); markDirty(); }}
                  className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                  placeholder="eg: T-shirt"
                />
              </div>

              {/* Product Type */}
              <div className="space-y-1">
                <FieldLabel required>Product Type</FieldLabel>
                <Select
                  value={productType}
                  onValueChange={(v) => { setProductType(v); markDirty(); }}
                >
                  <SelectTrigger className={cn(AUTH_INPUT.base, "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic")}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="z-[99999999]">
                    <SelectItem value="Digital">Digital</SelectItem>
                    <SelectItem value="Delivery">Delivery</SelectItem>
                    <SelectItem value="Physical">Physical</SelectItem>
                    <SelectItem value="Service">Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Barcode / SKU */}
              <div className="space-y-1">
                <FieldLabel>Barcode / SKU</FieldLabel>
                <Input
                  value={barcodeSku}
                  onChange={(e) => { setBarcodeSku(e.target.value); markDirty(); }}
                  className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                  placeholder="eg: SKU-00123"
                />
              </div>

              {/* Product Short Description */}
              <div className="space-y-1">
                <FieldLabel>Product Short Description</FieldLabel>
                <Input
                  value={shortDescription}
                  onChange={(e) => { setShortDescription(e.target.value); markDirty(); }}
                  className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                  placeholder="eg: Type here"
                />
              </div>

              {/* Stock Threshold */}
              <div className="space-y-1">
                <FieldLabel required>Stock Threshold</FieldLabel>
                <Input
                  type="number"
                  value={stockThreshold}
                  onChange={(e) => { setStockThreshold(e.target.value); markDirty(); }}
                  className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                  placeholder="eg: 05"
                />
              </div>

              {/* Starting Stock Quantity */}
              <div className="space-y-1">
                <FieldLabel required>Starting Stock Quantity</FieldLabel>
                <Input
                  type="number"
                  value={stockQuantity}
                  onChange={(e) => { setStockQuantity(e.target.value); markDirty(); }}
                  className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                  placeholder="eg: 100"
                />
              </div>

              {/* Image Section — spans left column on desktop, full on mobile */}
              <div className="col-span-1 space-y-2">
                <div className="flex items-start gap-5">
                  {/* Product Image (1× 180×180) */}
                  <div className="flex flex-col gap-1.5">
                    <span className={cn(AUTH_TYPOGRAPHY.label)}>Product Image</span>
                    <div
                      style={{
                        width: 120,
                        height: 120,
                        padding: 8,
                        borderRadius: "0.375rem",
                        border: "1px dashed #E2E8F0",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        overflow: "hidden",
                      }}
                    >
                      <ImageUpload
                        imageUrl={mainImage}
                        setImage={(url) => { setMainImage(url); markDirty(); }}
                        removeImage={() => { setMainImage(""); markDirty(); }}
                        showSupportedFormats={true}
                        className="h-full w-full"
                        dropzoneClassName="!h-full !border-none !rounded-none !bg-transparent !p-0"
                        iconClassName="w-5 h-5 mb-0.5"
                      />
                    </div>
                  </div>

                  {/* Product Gallery (4× 2×2) */}
                  <div className="flex flex-col gap-1.5">
                    <span className={cn(AUTH_TYPOGRAPHY.label)}>Product Gallery</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {gallery.map((url, i) => (
                        <div
                          key={i}
                          style={{
                            width: 54,
                            height: 54,
                            borderRadius: "7.6px",
                            border: "1px dashed #E2E8F0",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: "hidden",
                          }}
                        >
                          <ImageUpload
                            imageUrl={url}
                            setImage={(imgUrl) => setGalleryImage(i, imgUrl)}
                            removeImage={() => removeGalleryImage(i)}
                            showSupportedFormats={false}
                            className="h-full w-full"
                            dropzoneClassName="!h-full !border-none !rounded-none !bg-transparent !p-0"
                            iconClassName="w-4 h-4 text-[#90A1B9]"
                            placeholder={null}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Price — right column on desktop */}
              <div className="col-span-1 space-y-1">
                <FieldLabel required>Product Price</FieldLabel>
                <p className={cn(AUTH_TYPOGRAPHY.description, "mb-1")}>
                  Only numbers, periods, commas and spaces are acceptable.
                </p>
                <div className="relative">
                  <Input
                    value={price}
                    onChange={(e) => { setPrice(e.target.value); markDirty(); }}
                    className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "pr-14")}
                    placeholder="eg: 1,000.00"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <span className="text-sm font-semibold text-[#1D293D]">LKR</span>
                    <ChevronDown className="h-3 w-3 text-[#0F172B]" />
                  </div>
                </div>
              </div>

              {/* Product Long Description — full width */}
              <div className="col-span-1 sm:col-span-2 space-y-1">
                <FieldLabel>Product Long Description</FieldLabel>
                <Textarea
                  value={longDescription}
                  onChange={(e) => { setLongDescription(e.target.value); markDirty(); }}
                  className={cn("min-h-[90px] resize-none", AUTH_INPUT.placeholder)}
                  placeholder="eg: Type here"
                />
              </div>

              {/* Select Commission Type */}
              <div className="space-y-1">
                <FieldLabel>Select Commission Type</FieldLabel>
                <Select
                  value={commissionType}
                  onValueChange={(v) => { setCommissionType(v); markDirty(); }}
                >
                  <SelectTrigger className={cn(AUTH_INPUT.base, "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic")}>
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
                  value={commissionValue}
                  onChange={(e) => { setCommissionValue(e.target.value); markDirty(); }}
                  className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                  placeholder="eg: 05"
                />
              </div>

              {/* Team Commission Value — full width */}
              <div className="col-span-1 sm:col-span-2 space-y-1">
                <FieldLabel>Team Commission Value</FieldLabel>
                <Input
                  type="number"
                  value={teamCommissionValue}
                  onChange={(e) => { setTeamCommissionValue(e.target.value); markDirty(); }}
                  className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                  placeholder="eg: 05"
                />
              </div>

            </div>
          </div>

          {/* ===== FOOTER ===== */}
          <div className="flex items-center justify-end gap-3 border-t border-[#E2E8F0] pt-4">
            <Button
              variant="ghost"
              onClick={handleCloseAttempt}
              className={cn(BUTTON_STYLES.secondary.md, "text-sm font-semibold text-[#0F172B] hover:bg-slate-100")}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              className={cn(BUTTON_STYLES.primary.md, "text-sm font-semibold text-white")}
            >
              Update Details
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
