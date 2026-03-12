"use client";

import React, { useState, useEffect } from "react";

import { X, ChevronDown, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import type { ProductDataType } from "@/types/product";
import { useGetProductById } from "@/hooks/api/products/useGetProductById";
import { useUpdateProduct } from "@/hooks/api/products/useUpdateProduct";

// ===== SCHEMA =====

const editProductSchema = z
  .object({
    name: z.string().min(1, "Product name is required."),
    type: z.enum(["DIGITAL", "DELIVERY"], {
      required_error: "Product type is required.",
    }),
    sku: z.string().optional(),
    short_description: z.string().optional(),
    long_description: z.string().optional(),
    price: z.string().min(1, "Product price is required."),
    starting_stock: z.coerce.number().optional(),
    stock_threshold: z.coerce.number().optional(),
    commission_type: z.enum(["PERCENTAGE", "FIXED"]).optional(),
    commission_value: z.string().optional(),
    team_commission_value: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.type === "DELIVERY") {
        return data.starting_stock !== undefined && data.starting_stock !== null;
      }

      return true;
    },
    {
      message: "Starting stock is required for Delivery products.",
      path: ["starting_stock"],
    }
  );

type EditProductFormValues = z.infer<typeof editProductSchema>;

// ===== PROPS =====

interface EditProductPanelProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductDataType | null;
}

// ===== FIELD LABEL =====

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

// ===== MAIN COMPONENT =====

export function EditProductPanel({ isOpen, onClose, product: listProduct }: EditProductPanelProps) {
  // Fetch full product details from API
  const { data: product, isLoading: isLoadingProduct } = useGetProductById(
    isOpen ? listProduct?.id ?? null : null
  );

  const { mutateAsync: updateProduct, isPending: isUpdating } = useUpdateProduct(
    listProduct?.id ?? ""
  );

  // Image URL states (not in form, handled separately via ImageUpload)
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [galleryUrls, setGalleryUrls] = useState<string[]>(["", "", "", ""]);

  // Dirty guard
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<EditProductFormValues>({
    resolver: zodResolver(editProductSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      type: undefined,
      sku: "",
      short_description: "",
      long_description: "",
      price: "",
      starting_stock: undefined,
      stock_threshold: undefined,
      commission_type: undefined,
      commission_value: "",
      team_commission_value: "",
    },
  });

  const watchedType = watch("type");
  const watchedCommissionType = watch("commission_type");

  // Prefill form when API data is loaded
  useEffect(() => {
    if (isOpen && product) {
      reset({
        name: product.name ?? "",
        type: product.type as "DIGITAL" | "DELIVERY",
        sku: product.sku ?? "",
        short_description: product.short_description ?? "",
        long_description: product.long_description ?? "",
        price: product.price ?? "",
        starting_stock: product.starting_stock ?? undefined,
        stock_threshold: product.stock_threshold ?? undefined,
        commission_type: product.commission_type as "PERCENTAGE" | "FIXED",
        commission_value: product.commission_value ?? "",
        team_commission_value: product.team_commission_value ?? "",
      });

      // Prefill images from product
      const sortedImages = [...(product.images ?? [])].sort(
        (a, b) => a.display_order - b.display_order
      );

      const primaryImage = sortedImages.find((img) => img.is_primary);
      const galleryImages = sortedImages.filter((img) => !img.is_primary);

      setMainImageUrl(primaryImage?.url ?? "");
      setGalleryUrls([
        galleryImages[0]?.url ?? "",
        galleryImages[1]?.url ?? "",
        galleryImages[2]?.url ?? "",
        galleryImages[3]?.url ?? "",
      ]);

      setIsDirty(false);
      setShowDiscardModal(false);
    }
  }, [isOpen, product, reset]);

  // Reset dirty when closed
  useEffect(() => {
    if (!isOpen) {
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

  const onSubmit = async (values: EditProductFormValues) => {
    // Build image payload
    const images = [];

    if (mainImageUrl) {
      images.push({ url: mainImageUrl, is_primary: true, display_order: 0 });
    }

    galleryUrls.forEach((url, i) => {
      if (url) {
        images.push({ url, is_primary: false, display_order: i + 1 });
      }
    });

    try {
      await updateProduct({
        name: values.name,
        type: values.type,
        sku: values.sku || undefined,
        short_description: values.short_description || undefined,
        long_description: values.long_description || undefined,
        price: values.price,
        ...(values.type === "DELIVERY"
          ? {
              starting_stock: values.starting_stock,
              stock_threshold: values.stock_threshold,
            }
          : {}),
        commission_type: values.commission_type,
        commission_value: values.commission_value || undefined,
        team_commission_value: values.team_commission_value || undefined,
        images: images,
      });

      setIsDirty(false);
      onClose();
    } catch {
      // errors handled by hook's onError
    }
  };

  if (!listProduct) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseAttempt()}>
        <DialogContent
          isLoading={isLoadingProduct}
          animateChildren={true}
          className="flex max-h-[90vh] w-[95%] max-w-[720px] flex-col gap-0 overflow-hidden rounded-lg sm:rounded-xl border border-[#E2E8F0] bg-white p-0 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] [&>button]:hidden"
        >
          {/* ===== HEADER ===== */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4 p-4 sm:p-6 pb-0 shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex-1 font-inter text-lg font-semibold leading-[30px] text-[#0F172B]">
                Edit Product Details
              </DialogTitle>
              <button
                onClick={handleCloseAttempt}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-white transition-colors hover:bg-slate-50"
              >
                <X className="h-4 w-4 text-[#64748B]" />
              </button>
            </div>
            <div className="border-b border-[#E2E8F0]" />
          </motion.div>

          {/* ===== BODY (Scrollable) ===== */}
          <motion.form
            key={listProduct.id}
            variants={itemVariants}
            id="edit-product-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto p-4 sm:p-6 sm:pt-4 pt-4 custom-scrollbar"
            onChange={() => setIsDirty(true)}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">

              {/* Product Name */}
              <div className="space-y-1">
                <FieldLabel required>Product Name</FieldLabel>
                <Input
                  {...register("name")}
                  className={cn(
                    AUTH_INPUT.base,
                    AUTH_INPUT.placeholder,
                    errors.name && "border-red-500 focus-visible:ring-red-500"
                  )}
                  placeholder="eg: T-shirt"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Product Type */}
              <div className="space-y-1">
                <FieldLabel required>Product Type</FieldLabel>
                <Select
                  value={watchedType}
                  onValueChange={(val) => {
                    setValue("type", val as "DIGITAL" | "DELIVERY", { shouldDirty: true });
                    trigger("type");
                    setIsDirty(true);
                  }}
                >
                  <SelectTrigger
                    className={cn(
                      AUTH_INPUT.base,
                      "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic",
                      errors.type && "border-red-500 focus-visible:ring-red-500"
                    )}
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="z-[99999999]">
                    <SelectItem value="DIGITAL">Digital</SelectItem>
                    <SelectItem value="DELIVERY">Delivery</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="mt-1 text-xs text-red-500">{errors.type.message}</p>
                )}
              </div>

              {/* Barcode / SKU */}
              <div className="space-y-1">
                <FieldLabel>Barcode / SKU</FieldLabel>
                <Input
                  {...register("sku")}
                  className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                  placeholder="eg: SKU-00123"
                />
              </div>

              {/* Short Description */}
              <div className="space-y-1">
                <FieldLabel>Short Description</FieldLabel>
                <Input
                  {...register("short_description")}
                  className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                  placeholder="eg: Type here"
                />
              </div>

              {/* Starting Stock — DELIVERY only */}
              {watchedType === "DELIVERY" && (
                <div className="space-y-1">
                  <FieldLabel required>Starting Stock Quantity</FieldLabel>
                  <Input
                    type="number"
                    {...register("starting_stock")}
                    className={cn(
                      AUTH_INPUT.base,
                      AUTH_INPUT.placeholder,
                      errors.starting_stock && "border-red-500 focus-visible:ring-red-500"
                    )}
                    placeholder="eg: 100"
                  />
                  {errors.starting_stock && (
                    <p className="mt-1 text-xs text-red-500">{errors.starting_stock.message}</p>
                  )}
                </div>
              )}

              {/* Stock Threshold — DELIVERY only */}
              {watchedType === "DELIVERY" && (
                <div className="space-y-1">
                  <FieldLabel>Stock Threshold</FieldLabel>
                  <Input
                    type="number"
                    {...register("stock_threshold")}
                    className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                    placeholder="eg: 05"
                  />
                </div>
              )}

              {/* Image Section — spans left column on desktop */}
              <div className="col-span-1 space-y-2">
                <div className="flex items-start gap-5">
                  {/* Product Image (1× 120×120) */}
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
                        imageUrl={mainImageUrl}
                        setImage={(url) => { setMainImageUrl(url); setIsDirty(true); }}
                        removeImage={() => { setMainImageUrl(""); setIsDirty(true); }}
                        showSupportedFormats={false}
                        className="h-full w-full"
                        dropzoneClassName="!h-full !border-none !rounded-none !bg-transparent !p-0"
                        iconClassName="w-5 h-5 mb-0.5"
                      />
                    </div>
                  </div>

                  {/* Product Gallery (4× 2×2 grid) */}
                  <div className="flex flex-col gap-1.5">
                    <span className={cn(AUTH_TYPOGRAPHY.label)}>Product Gallery</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {galleryUrls.map((url, i) => (
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
                            setImage={(imgUrl) => {
                              setGalleryUrls((prev) => {
                                const next = [...prev];

                                next[i] = imgUrl;

                                return next;
                              });
                              setIsDirty(true);
                            }}
                            removeImage={() => {
                              setGalleryUrls((prev) => {
                                const next = [...prev];

                                next[i] = "";

                                return next;
                              });
                            }}
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

              {/* Product Price */}
              <div className="col-span-1 space-y-1">
                <FieldLabel required>Product Price</FieldLabel>
                <p className={cn(AUTH_TYPOGRAPHY.description, "mb-1")}>
                  Only numbers, periods, commas and spaces are acceptable.
                </p>
                <div className="relative">
                  <Input
                    {...register("price")}
                    className={cn(
                      AUTH_INPUT.base,
                      AUTH_INPUT.placeholder,
                      "pr-14",
                      errors.price && "border-red-500 focus-visible:ring-red-500"
                    )}
                    placeholder="eg: 1,000.00"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <span className="text-sm font-semibold text-[#1D293D]">LKR</span>
                    <ChevronDown className="h-3 w-3 text-[#0F172B]" />
                  </div>
                </div>
                {errors.price && (
                  <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>
                )}
              </div>

              {/* Long Description — full width */}
              <div className="col-span-1 sm:col-span-2 space-y-1">
                <FieldLabel>Product Long Description</FieldLabel>
                <Textarea
                  {...register("long_description")}
                  className={cn("min-h-[90px] resize-none", AUTH_INPUT.placeholder)}
                  placeholder="eg: Type here"
                />
              </div>

              {/* Commission Type */}
              <div className="space-y-1">
                <FieldLabel>Commission Type</FieldLabel>
                <Select
                  value={watchedCommissionType}
                  onValueChange={(val) => {
                    setValue("commission_type", val as "PERCENTAGE" | "FIXED", { shouldDirty: true });
                    setIsDirty(true);
                  }}
                >
                  <SelectTrigger
                    className={cn(
                      AUTH_INPUT.base,
                      "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic"
                    )}
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="z-[99999999]">
                    <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                    <SelectItem value="FIXED">Fixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Commission Value */}
              <div className="space-y-1">
                <FieldLabel>Commission Value</FieldLabel>
                <Input
                  type="number"
                  {...register("commission_value")}
                  className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                  placeholder="eg: 05"
                />
              </div>

              {/* Team Commission Value — full width */}
              <div className="col-span-1 sm:col-span-2 space-y-1">
                <FieldLabel>Team Commission Value</FieldLabel>
                <Input
                  type="number"
                  {...register("team_commission_value")}
                  className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                  placeholder="eg: 05"
                />
              </div>

            </div>
          </motion.form>

          {/* ===== FOOTER ===== */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-end gap-3 p-4 sm:p-6 pt-4 border-t border-[#E2E8F0] shrink-0 mt-auto"
          >
            <Button
              type="button"
              variant="ghost"
              onClick={handleCloseAttempt}
              disabled={isUpdating}
              className={cn(BUTTON_STYLES.secondary.md, "text-sm font-semibold text-[#0F172B] hover:bg-slate-100")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="edit-product-form"
              disabled={isUpdating}
              className={cn(BUTTON_STYLES.primary.md, "text-sm font-semibold text-white")}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Update Details"
              )}
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Discard Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onConfirm={() => {
          setShowDiscardModal(false);
          onClose();
        }}
        title="Save Your Edits First"
        description="Unsaved changes detected, remember to save your edits before you close!"
        confirmText="Proceed Without Saving"
        cancelText="Go Back and Save"
      />
    </>
  );
}
