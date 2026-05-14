"use client";

import type { ReactNode } from "react";
import React, { useState, useEffect, useMemo } from "react";

import { createPortal } from "react-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { X, ChevronDown, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import { SearchableSelect } from "@/components/ui/searchable-select";

import { cn } from "@/lib/utils";
import { AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";
import { useCreateProduct } from "@/hooks/api/products/useCreateProduct";
import { useGetProductCategories } from "@/hooks/api/product-categories/useGetProductCategories";

// ===== SCHEMA =====

const productSchema = z
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
    category_id: z.string().min(1, "Product category is required."),
  })
  .refine(
    (data) => {
      // DELIVERY products must have starting_stock
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

type ProductFormValues = z.infer<typeof productSchema>;

// ===== PROPS =====

interface AddProductPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// ===== PORTAL =====

const Portal = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(children, document.body);
};

// ===== FIELD LABEL =====

const FieldLabel = ({
  children,
  required = false,
  className,
}: {
  children: ReactNode;
  required?: boolean;
  className?: string;
}) => (
  <Label className={cn(AUTH_TYPOGRAPHY.label, "mb-1.5 block", className)}>
    {children}
    {required && <span className="ml-0.5 text-red-500">*</span>}
  </Label>
);

// ===== ANIMATION VARIANTS (from AddLecturerPanel) =====

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

// ===== MAIN COMPONENT =====

export function AddProductPanel({ isOpen, onClose }: AddProductPanelProps) {
  const { mutateAsync: createProduct, isPending } = useCreateProduct();

  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  // Image state
  const [mainImageUrl, setMainImageUrl] = useState<string>("");
  const [galleryUrls, setGalleryUrls] = useState<string[]>(["", "", "", ""]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
    trigger,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      type: undefined,
      sku: "",
      short_description: "",
      long_description: "",
      price: "",
      commission_value: "",
      team_commission_value: "",
      category_id: "",
      starting_stock: undefined,
      stock_threshold: undefined,
    },
  });

  // Category Search State
  const [categorySearch, setCategorySearch] = useState("");

  const { data: categoriesData, isLoading: isLoadingCategories } = useGetProductCategories({
    page: 1,
    size: 100, // Fetch more for search
    search: categorySearch || undefined,
  });

  const categoryOptions = useMemo(() => {
    if (!categoriesData?.results) return [];

    return categoriesData.results
      .filter(c => c.is_active)
      .map((c) => ({
        value: c.id,
        label: c.name,
      }));
  }, [categoriesData]);

  // Reset on close to avoid Radix UI Select stale state on reopen
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        reset();
        setIsDirty(false);
        setShowDiscardModal(false);
        setMainImageUrl("");
        setGalleryUrls(["", "", "", ""]);
      }, 300); // Wait for exit animation
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, reset]);

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

  // ── Image helpers ──

  const handleMainImageSelect = (url: string) => {
    setMainImageUrl(url);
    markDirty();
  };

  const handleGalleryImageSelect = (index: number, url: string) => {
    setGalleryUrls((prev) => {
      const next = [...prev];
      
      next[index] = url;
      
      return next;
    });
    markDirty();
  };

  // ── Submit ──

  const onSubmit = async (values: ProductFormValues) => {
    const images: { url: string; is_primary: boolean; display_order: number }[] = [];

    if (mainImageUrl) {
      images.push({ url: mainImageUrl, is_primary: true, display_order: 1 });
    }

    for (let i = 0; i < galleryUrls.length; i++) {
      const url = galleryUrls[i];
      
      if (url) {
        images.push({ url, is_primary: false, display_order: i + 2 });
      }
    }

    // 3. Build payload (strip stock fields for DIGITAL)
    const payload: any = {
      name: values.name,
      type: values.type,
      price: values.price,
      status: "ACTIVE",
      ...(values.sku && { sku: values.sku }),
      ...(values.short_description && { short_description: values.short_description }),
      ...(values.long_description && { long_description: values.long_description }),
      ...(values.commission_type && { commission_type: values.commission_type }),
      ...(values.commission_value && { commission_value: values.commission_value }),
      ...(values.team_commission_value && { team_commission_value: values.team_commission_value }),
      ...(images.length > 0 && { images }),
    };

    if (values.type === "DELIVERY") {
      payload.starting_stock = values.starting_stock;
      payload.stock_threshold = values.stock_threshold;
    }

    payload.category_id = values.category_id;

    await createProduct(payload);
    onClose();
  };

  const handleSaveAsDraft = async () => {
    const values = watch();
    const images: { url: string; is_primary: boolean; display_order: number }[] = [];

    if (mainImageUrl) {
      images.push({ url: mainImageUrl, is_primary: true, display_order: 1 });
    }

    for (let i = 0; i < galleryUrls.length; i++) {
      const url = galleryUrls[i];
      
      if (url) {
        images.push({ url, is_primary: false, display_order: i + 2 });
      }
    }

    // Build payload with minimum requirements for draft
    const payload: any = {
      name: values.name || "Untitled Product",
      type: values.type || "DIGITAL",
      price: values.price || "0",
      status: "DRAFT",
      ...(values.sku && { sku: values.sku }),
      ...(values.short_description && { short_description: values.short_description }),
      ...(values.long_description && { long_description: values.long_description }),
      ...(values.commission_type && { commission_type: values.commission_type }),
      ...(values.commission_value && { commission_value: values.commission_value }),
      ...(values.team_commission_value && { team_commission_value: values.team_commission_value }),
      ...(images.length > 0 && { images }),
    };

    if (values.type === "DELIVERY") {
      payload.starting_stock = values.starting_stock;
      payload.stock_threshold = values.stock_threshold;
    }

    if (values.category_id) {
      payload.category_id = values.category_id;
    }

    await createProduct(payload);
    onClose();
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

              {/* Panel */}
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

                {/* Scrollable content */}
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-1 flex-col overflow-hidden"
                >
                  <div className="flex-1 overflow-y-auto px-6 py-6">
                    <motion.div
                      className="flex flex-col gap-5"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {/* Product Name */}
                      <motion.div variants={itemVariants} className="space-y-1">
                        <FieldLabel required>Product Name</FieldLabel>
                        <Input
                          {...register("name", { onChange: markDirty })}
                          className={cn(
                            AUTH_INPUT.base,
                            AUTH_INPUT.placeholder,
                            errors.name && "border-red-500 focus-visible:ring-red-500"
                          )}
                          placeholder="eg: Advanced Math Course"
                        />
                        {errors.name && (
                          <p className="text-xs text-red-500">{errors.name.message}</p>
                        )}
                      </motion.div>

                      {/* Product Type */}
                      <motion.div variants={itemVariants} className="space-y-1">
                        <FieldLabel required>Product Type</FieldLabel>
                        <Controller
                          control={control}
                          name="type"
                          render={({ field }) => (
                            <Select
                              onValueChange={(val) => {
                                field.onChange(val);
                                trigger("type");
                                markDirty();
                              }}
                              value={field.value}
                            >
                              <SelectTrigger
                                className={cn(
                                  AUTH_INPUT.base,
                                  "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic",
                                  errors.type && "border-red-500 focus:ring-red-500"
                                )}
                              >
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent className="z-[99999999]">
                                <SelectItem value="DIGITAL">Digital</SelectItem>
                                <SelectItem value="DELIVERY">Delivery</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.type && (
                          <p className="text-xs text-red-500">{errors.type.message}</p>
                        )}
                      </motion.div>

                      {/* Product Category */}
                      <motion.div variants={itemVariants} className="space-y-1">
                        <FieldLabel required>Product Category</FieldLabel>
                        <Controller
                          control={control}
                          name="category_id"
                          render={({ field }) => (
                            <SearchableSelect
                              options={categoryOptions}
                              value={field.value}
                              onChange={(val) => {
                                field.onChange(val);
                                trigger("category_id");
                                markDirty();
                              }}
                              onSearchChange={setCategorySearch}
                              searchValue={categorySearch}
                              placeholder="Select category"
                              searchPlaceholder="Search categories..."
                              isLoading={isLoadingCategories}
                              error={!!errors.category_id}
                            />
                          )}
                        />
                        {errors.category_id && (
                          <p className="text-xs text-red-500">{errors.category_id.message}</p>
                        )}
                      </motion.div>

                      {/* SKU */}
                      <motion.div variants={itemVariants} className="space-y-1">
                        <FieldLabel>Barcode / SKU</FieldLabel>
                        <Input
                          {...register("sku", { onChange: markDirty })}
                          className={cn(
                            AUTH_INPUT.base, 
                            AUTH_INPUT.placeholder,
                            errors.sku && "border-red-500 focus-visible:ring-red-500"
                          )}
                          placeholder="eg: DIGI-MATH-001"
                        />
                      </motion.div>

                      {/* Short Description */}
                      <motion.div variants={itemVariants} className="space-y-1">
                        <FieldLabel>Short Description</FieldLabel>
                        <Input
                          {...register("short_description", { onChange: markDirty })}
                          className={cn(
                            AUTH_INPUT.base, 
                            AUTH_INPUT.placeholder,
                            errors.short_description && "border-red-500 focus-visible:ring-red-500"
                          )}
                          placeholder="eg: Learn advanced calculus."
                        />
                      </motion.div>

                      {/* Long Description */}
                      <motion.div variants={itemVariants} className="space-y-1">
                        <FieldLabel>Long Description</FieldLabel>
                        <Textarea
                          {...register("long_description", { onChange: markDirty })}
                          className={cn(
                            "min-h-[100px] resize-none",
                            AUTH_INPUT.placeholder,
                            errors.long_description && "border-red-500 focus-visible:ring-red-500"
                          )}
                          placeholder="eg: Full access to our video library..."
                        />
                      </motion.div>

                      {/* Price */}
                      <motion.div variants={itemVariants} className="space-y-1">
                        <FieldLabel required>Product Price</FieldLabel>
                        <p className="mb-[6px] text-[12px] font-normal leading-[16px] text-[#90A1B9]">
                          Only numbers, periods, commas and spaces are accepted.
                        </p>
                        <div className="relative">
                          <Input
                            {...register("price", { onChange: markDirty })}
                            className={cn(
                              AUTH_INPUT.base, 
                              AUTH_INPUT.placeholder, 
                              "pr-14",
                              errors.price && "border-red-500 focus-visible:ring-red-500"
                            )}
                            placeholder="eg: 15,000.00"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <span className="text-sm font-semibold text-[#1D293D]">LKR</span>
                            <ChevronDown className="h-3 w-3 text-[#0F172B]" />
                          </div>
                        </div>
                        {errors.price && (
                          <p className="text-xs text-red-500">{errors.price.message}</p>
                        )}
                      </motion.div>

                      {/* Stock fields — only for DELIVERY */}
                      {watch("type") === "DELIVERY" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col gap-5 overflow-hidden"
                        >
                          <motion.div
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-1"
                          >
                            <FieldLabel required>Starting Stock Quantity</FieldLabel>
                            <Input
                              type="number"
                              {...register("starting_stock", { onChange: markDirty })}
                              className={cn(
                                AUTH_INPUT.base, 
                                AUTH_INPUT.placeholder,
                                errors.starting_stock && "border-red-500 focus-visible:ring-red-500"
                              )}
                              placeholder="eg: 50"
                            />
                            {errors.starting_stock && (
                              <p className="text-xs text-red-500">
                                {errors.starting_stock.message}
                              </p>
                            )}
                          </motion.div>

                          <motion.div
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-1"
                          >
                            <FieldLabel>Stock Threshold</FieldLabel>
                            <Input
                              type="number"
                              {...register("stock_threshold", { onChange: markDirty })}
                              className={cn(
                                AUTH_INPUT.base, 
                                AUTH_INPUT.placeholder,
                                errors.stock_threshold && "border-red-500 focus-visible:ring-red-500"
                              )}
                              placeholder="eg: 5"
                            />
                            {errors.stock_threshold && (
                              <p className="text-xs text-red-500">
                                {errors.stock_threshold.message}
                              </p>
                            )}
                          </motion.div>
                        </motion.div>
                      )}

                      {/* Image Upload */}
                      <motion.div variants={itemVariants} className="flex items-start gap-6">
                        {/* Main Image */}
                        <div className="flex flex-col gap-2">
                          <span className={cn(AUTH_TYPOGRAPHY.label)}>Product Image</span>
                          <div
                            className="shrink-0"
                            style={{
                              width: 180,
                              height: 180,
                              padding: 12,
                              borderRadius: "0.375rem",
                              border: "1px dashed #E2E8F0",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              overflow: "hidden",
                            }}
                          >
                            <ImageUpload
                              imageUrl={mainImageUrl}
                              setImage={(url) => handleMainImageSelect(url)}
                              removeImage={() => setMainImageUrl("")}
                              showSupportedFormats={false}
                              className="h-full w-full"
                              dropzoneClassName="!h-full !border-none !rounded-none !bg-transparent !p-0"
                              iconClassName="w-6 h-6 mb-1"
                              placeholder={
                                <span className="text-[12px] leading-tight px-2 text-[#90A1B9]">
                                  Upload Image Here or drag and drop
                                </span>
                              }
                            />
                          </div>
                        </div>

                        {/* Gallery */}
                        <div className="flex flex-col gap-2">
                          <span className={cn(AUTH_TYPOGRAPHY.label)}>Product Gallery</span>
                          <div className="grid grid-cols-2 gap-2">
                            {galleryUrls.map((url, i) => (
                              <div
                                key={i}
                                style={{
                                  width: 86,
                                  height: 86,
                                  padding: 12,
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
                                  setImage={(imgUrl) => handleGalleryImageSelect(i, imgUrl)}
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
                                  iconClassName="w-5 h-5 text-[#90A1B9]"
                                  placeholder={null}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>

                      {/* Commission Type */}
                      <motion.div variants={itemVariants} className="space-y-1">
                        <FieldLabel>Commission Type</FieldLabel>
                        <Controller
                          control={control}
                          name="commission_type"
                          render={({ field }) => (
                            <Select
                                onValueChange={(val) => {
                                  field.onChange(val);
                                  trigger("commission_type");
                                  markDirty();
                                }}
                              value={field.value}
                            >
                              <SelectTrigger
                                className={cn(
                                  AUTH_INPUT.base,
                                  "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic",
                                  errors.commission_type && "border-red-500 focus:ring-red-500"
                                )}
                              >
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent className="z-[99999999]">
                                <SelectItem value="FIXED">Fixed</SelectItem>
                                <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </motion.div>

                      {/* Commission Value */}
                      <motion.div variants={itemVariants} className="space-y-1">
                        <FieldLabel>Commission Value</FieldLabel>
                        <Input
                          {...register("commission_value", { onChange: markDirty })}
                          type="number"
                          className={cn(
                            AUTH_INPUT.base, 
                            AUTH_INPUT.placeholder,
                            errors.commission_value && "border-red-500 focus-visible:ring-red-500"
                          )}
                          placeholder="eg: 20"
                        />
                      </motion.div>

                      {/* Team Commission Value */}
                      <motion.div variants={itemVariants} className="space-y-1">
                        <FieldLabel>Team Commission Value</FieldLabel>
                        <Input
                          {...register("team_commission_value", { onChange: markDirty })}
                          type="number"
                          className={cn(
                            AUTH_INPUT.base, 
                            AUTH_INPUT.placeholder,
                            errors.team_commission_value && "border-red-500 focus-visible:ring-red-500"
                          )}
                          placeholder="eg: 5"
                        />
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-end gap-3 border-t border-[#E2E8F0] px-6 py-4">
                    <Button
                      type="button"
                      disabled={isPending}
                      onClick={handleSaveAsDraft}
                      className={cn(
                        BUTTON_STYLES.secondary.md,
                        "text-sm font-semibold"
                      )}
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save as Draft"
                      )}
                    </Button>
                    <Button
                      type="submit"
                      disabled={isPending}
                      className={cn(
                        BUTTON_STYLES.primary.full,
                        "w-auto min-w-[100px] px-6 text-sm font-semibold text-white"
                      )}
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        "Add"
                      )}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </Portal>

      {/* Discard Confirmation */}
      <DeleteConfirmationModal
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onConfirm={handleConfirmDiscard}
        title="Save Your Edits First"
        description="Unsaved changes detected, remember to save before closing!"
        confirmText="Proceed Without Saving"
        cancelText="Go Back and Save"
      />
    </>
  );
}
