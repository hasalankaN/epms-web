"use client";

import type { ReactNode } from "react";
import React, { useEffect, useState, useMemo } from "react";

import { X, Loader2 } from "lucide-react";
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
import { SearchableSelect } from "@/components/ui/searchable-select";

import { cn } from "@/lib/utils";
import { AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";
import type { ProductDataType } from "@/types/product";
import { useGetProductById } from "@/hooks/api/products/useGetProductById";
import { useUpdateProduct } from "@/hooks/api/products/useUpdateProduct";
import { useGetProductCategories } from "@/hooks/api/product-categories/useGetProductCategories";

// ===== SCHEMA =====

const editProductSchema = z
  .object({
    name: z.string().min(1, "Product name is required."),
    type: z.preprocess((val) => (val === "" || val === null ? undefined : val), z.enum(["DIGITAL", "DELIVERY"]).optional()),
    sku: z.string().optional(),
    short_description: z.string().optional(),
    long_description: z.string().optional(),
    price: z.string().optional(),
    starting_stock: z.preprocess((val) => (val === "" || val === null ? undefined : val), z.coerce.number().optional()),
    stock_threshold: z.preprocess((val) => (val === "" || val === null ? undefined : val), z.coerce.number().optional()),
    commission_type: z.preprocess((val) => (val === "" || val === null ? undefined : val), z.enum(["PERCENTAGE", "FIXED"]).optional()),
    commission_value: z.string().optional(),
    team_commission_value: z.string().optional(),
    category_id: z.string().optional(),
    status: z.enum(["ACTIVE", "DRAFT"]),
  })
  .superRefine((data, ctx) => {
    if (data.status === "ACTIVE") {
      if (!data.type) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Product type is required.",
          path: ["type"],
        });
      }

      if (!data.price || data.price.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Product price is required.",
          path: ["price"],
        });
      }

      if (!data.category_id || data.category_id.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Product category is required.",
          path: ["category_id"],
        });
      }

      if (data.type === "DELIVERY") {
        if (data.starting_stock === undefined || data.starting_stock === null) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Starting stock quantity is required.",
            path: ["starting_stock"],
          });
        }

        if (data.stock_threshold === undefined || data.stock_threshold === null) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Stock threshold is required.",
            path: ["stock_threshold"],
          });
        }
      }
    }
  });

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
  children: ReactNode;
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
  const [imagesDirty, setImagesDirty] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    trigger,
    formState: { errors, isDirty: formIsDirty },
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
      status: "ACTIVE",
      category_id: "",
    },
  });

  const [categorySearch, setCategorySearch] = useState("");

  const { data: categoriesData, isLoading: isLoadingCategories } = useGetProductCategories({
    page: 1,
    size: 100,
    search: categorySearch || undefined,
  });

  const categoryOptions = useMemo(() => {
    const options = (categoriesData?.results ?? [])
      .filter((c) => c.is_active || c.id === product?.category_id)
      .map((c) => ({
        value: c.id,
        label: c.name,
      }));

    // Ensure the current product category is always in the options list for pre-filling
    if (product?.category_id && !options.find((opt) => opt.value === product.category_id)) {
      options.unshift({
        value: product.category_id,
        label: product.category_name || "Selected Category",
      });
    }

    return options;
  }, [categoriesData, product]);

  const watchedCommissionType = watch("commission_type");
  const watchedType = watch("type");
  const watchedStatus = watch("status");

  const isDirty = formIsDirty || imagesDirty;

  // Prefill form when API data is loaded
  useEffect(() => {
    if (isOpen && product) {
      reset({
        name: product.name ?? "",
        type: (product.type as "DIGITAL" | "DELIVERY") || undefined,
        sku: product.sku ?? "",
        short_description: product.short_description ?? "",
        long_description: product.long_description ?? "",
        price: product.price ?? "",
        starting_stock: product.starting_stock ?? undefined,
        stock_threshold: product.stock_threshold ?? undefined,
        commission_type: (product.commission_type as "PERCENTAGE" | "FIXED") || undefined,
        commission_value: product.commission_value ?? "",
        team_commission_value: product.team_commission_value ?? "",
        category_id: product.category_id ?? "",
        status: (product.status as "ACTIVE" | "DRAFT") || "DRAFT",
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

      setImagesDirty(false);
      setShowDiscardModal(false);
    }
  }, [isOpen, product, reset]);

  // Reset dirty when closed
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setImagesDirty(false);
        setShowDiscardModal(false);
        reset();
      }, 300); // Match exit animation duration
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, reset]);

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
        type: values.type || undefined,
        sku: values.sku || undefined,
        short_description: values.short_description || undefined,
        long_description: values.long_description || undefined,
        price: values.price || undefined,
        ...(values.type === "DELIVERY"
          ? {
              starting_stock: values.starting_stock,
              stock_threshold: values.stock_threshold,
            }
          : {}),
        commission_type: values.commission_type,
        commission_value: values.commission_value || undefined,
        team_commission_value: values.team_commission_value || undefined,
        category_id: values.category_id || undefined,
        status: values.status,
        images: images,
      });

      setImagesDirty(false);
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
            className="flex-1 overflow-y-auto p-4 sm:p-6 sm:pt-0 pt-0 custom-scrollbar"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
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
                  placeholder="e.g. T-shirt"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Product Type */}
              <div className="space-y-1">
                <FieldLabel required={watchedStatus !== "DRAFT"}>Product Type</FieldLabel>
                <Select
                  value={watchedType}
                  onValueChange={(val) => {
                    setValue("type", val as "DIGITAL" | "DELIVERY", { shouldDirty: true });
                    trigger("type");
                  }}
                >
                  <SelectTrigger
                    className={cn(
                      AUTH_INPUT.base,
                      "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic",
                      errors.type && "border-red-500 focus-visible:ring-red-500"
                    )}
                  >
                    <SelectValue placeholder="Select" />
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
                <FieldLabel>Product Short Description</FieldLabel>
                <Input
                  {...register("short_description")}
                  className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                  placeholder="eg: Type here"
                />
              </div>

              {/* Stock fields — only for DELIVERY */}
              {watch("type") === "DELIVERY" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.2 }}
                  className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-5 overflow-hidden"
                >
                  <div className="space-y-1">
                    <FieldLabel required={watchedStatus !== "DRAFT"}>Stock Threshold <span className="text-[#E60076]"></span></FieldLabel>
                    <Input
                      type="number"
                      {...register("stock_threshold")}
                      className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                      placeholder="eg: 05"
                    />
                    {errors.stock_threshold && (
                      <p className="mt-1 text-xs text-red-500 text-left w-full block">
                        {errors.stock_threshold.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <FieldLabel required={watchedStatus !== "DRAFT"}>Starting Stock Quantity</FieldLabel>
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
                      <p className="mt-1 text-xs text-red-500 text-left w-full block">
                        {errors.starting_stock.message}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Image & Price Row */}
              <div className="flex flex-col sm:flex-row items-start gap-4 col-span-1">
                {/* Product Image */}
                <div className="flex flex-col gap-1.5 align-top">
                  <span className={cn(AUTH_TYPOGRAPHY.label)}>Product Image</span>
                  <div
                    style={{
                      width: 150,
                      height: 150,
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
                      setImage={(url: string) => {
                        setMainImageUrl(url);
                        setImagesDirty(true);
                      }}
                      removeImage={() => {
                        setMainImageUrl("");
                        setImagesDirty(true);
                      }}
                      showSupportedFormats={false}
                      className="h-full w-full"
                      dropzoneClassName="!h-full !border-none !rounded-none !bg-transparent !p-0"
                      iconClassName="w-5 h-5 mb-0.5"
                    />
                  </div>
                </div>

                {/* Product Gallery */}
                <div className="flex flex-col gap-1.5">
                  <span className={cn(AUTH_TYPOGRAPHY.label)}>Product Gallery</span>
                  <div className="grid grid-cols-2 gap-1.5 object-cover">
                    {galleryUrls.map((url, i) => (
                      <div
                        key={i}
                        style={{
                          width: 72,
                          height: 72,
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
                          setImage={(imgUrl: string) => {
                            setGalleryUrls((prev) => {
                              const next = [...prev];

                              next[i] = imgUrl;
                              
                              return next;
                            });
                            setImagesDirty(true);
                          }}
                          removeImage={() => {
                            setGalleryUrls((prev) => {
                              const next = [...prev];
                              
                              next[i] = "";
                              
                              return next;
                            });
                            setImagesDirty(true);
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

              {/* Product Price */}
              <div className="space-y-1 col-span-1">
                <FieldLabel required={watchedStatus !== "DRAFT"}>Product Price</FieldLabel>
                <p className={cn(AUTH_TYPOGRAPHY.description, "mb-1 text-xs text-[#90A1B9]")}>
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
                  </div>
                </div>
                {errors.price && (
                  <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>
                )}
              </div>

              {/* Long Description */}
              <div className="col-span-1 md:col-span-2 space-y-1">
                <FieldLabel>Product Long Description</FieldLabel>
                <Textarea
                  {...register("long_description")}
                  className={cn("min-h-[90px] resize-none", AUTH_INPUT.placeholder)}
                  placeholder="eg: Type here"
                />
              </div>

              {/* Commission Type */}
              <div className="space-y-1">
                <FieldLabel>Select Commission Type</FieldLabel>
                <Select
                  value={watchedCommissionType}
                  onValueChange={(val) => {
                    setValue("commission_type", val as "PERCENTAGE" | "FIXED", { shouldDirty: true });
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

              {/* Team Commission Value */}
              <div className="space-y-1">
                <FieldLabel>Team Commission Value</FieldLabel>
                <Input
                  type="number"
                  {...register("team_commission_value")}
                  className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                  placeholder="eg: 05"
                />
              </div>
              
              {/* Product Category (Moved here since it wasn't in the provided snapshot but required in DTO) */}
              <div className="space-y-1">
                <FieldLabel required={watchedStatus !== "DRAFT"}>Product Category</FieldLabel>
                <SearchableSelect
                  options={categoryOptions}
                  value={watch("category_id") || ""}
                  onChange={(val) => {
                    setValue("category_id", val, { shouldDirty: true });
                    trigger("category_id");
                  }}
                  onSearchChange={setCategorySearch}
                  searchValue={categorySearch}
                  placeholder="Select category"
                  searchPlaceholder="Search categories..."
                  isLoading={isLoadingCategories}
                  error={!!errors.category_id}
                />
                {errors.category_id && (
                  <p className="mt-1 text-xs text-red-500">{errors.category_id.message}</p>
                )}
              </div>

              {/* Product Status */}
              <div className="space-y-1">
                <FieldLabel required>Product Status</FieldLabel>
                <Select
                  value={watchedStatus}
                  onValueChange={(val) => {
                    setValue("status", val as "ACTIVE" | "DRAFT", { shouldDirty: true });
                  }}
                >
                  <SelectTrigger
                    className={cn(
                      AUTH_INPUT.base,
                      "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic"
                    )}
                  >
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="z-[99999999]">
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                  </SelectContent>
                </Select>
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
              disabled={isUpdating || !isDirty}
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
