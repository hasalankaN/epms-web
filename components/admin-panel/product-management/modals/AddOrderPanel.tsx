"use client";

import React, { useState, useEffect, useMemo } from "react";

import { createPortal } from "react-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { DISTRICTS } from "@/lib/constants/districts";
import { useGetProducts } from "@/hooks/api/products/useGetProducts";
import { useGetStudents } from "@/hooks/api/user-management/useGetStudents";
import { useCreateOrder, type CreateOrderPayload } from "@/hooks/api/orders/useCreateOrder";

// ===== SCHEMA =====

const orderSchema = z.object({
  student_user_id: z.string().min(1, "Student is required."),
  product_id: z.string().min(1, "Product is required."),
  product_type: z.string().optional(),
  quantity: z.coerce.number().optional(),
  payment_method: z.enum(["BANK_TRANSFER", "CARD"]).default("BANK_TRANSFER"),
  mobileCountryCode: z.string().default("+94"),
  mobile_number: z.string().optional(),
  whatsappCountryCode: z.string().default("+94"),
  whatsapp_number: z.string().optional(),
  address_line_1: z.string().optional(),
  address_line_2: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),
}).superRefine((data, ctx) => {
  const isDelivery = data.product_type === "DELIVERY";

  if (isDelivery) {
    if (!data.quantity || data.quantity < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Quantity must be at least 1.",
        path: ["quantity"],
      });
    }
    
    if (!data.mobile_number) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mobile number is required.",
        path: ["mobile_number"],
      });
    } else if (!/^[0-9]{9}$/.test(data.mobile_number)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mobile must be exactly 9 digits.",
        path: ["mobile_number"],
      });
    }

    if (data.whatsapp_number && !/^[0-9]{9}$/.test(data.whatsapp_number)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "WhatsApp must be exactly 9 digits if provided.",
        path: ["whatsapp_number"],
      });
    }

    if (!data.address_line_1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Address Line 1 is required.",
        path: ["address_line_1"],
      });
    }

    if (!data.district) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "District is required.",
        path: ["district"],
      });
    }

    if (!data.city) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "City is required.",
        path: ["city"],
      });
    }

    if (!data.postal_code) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Postal Code is required.",
        path: ["postal_code"],
      });
    }
  }
});

type OrderFormValues = z.infer<typeof orderSchema>;

// ===== PROPS =====

interface AddOrderPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// ===== PORTAL =====

const Portal = ({ children }: { children: React.ReactNode }) => {
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
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) => (
  <Label className={cn(AUTH_TYPOGRAPHY.label, "mb-1.5 block text-[#1D293D]", className)}>
    {children}
    {required && <span className="ml-0.5 text-red-500">*</span>}
  </Label>
);

// ===== ANIMATION VARIANTS =====

const sidePanelVariants: Variants = {
  hidden: { x: "100%" },
  show: {
    x: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 200,
      staggerChildren: 0.08,
      delayChildren: 0.35,
    },
  },
  exit: { x: "100%" },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

// ===== MAIN COMPONENT =====

export function AddOrderPanel({ isOpen, onClose }: AddOrderPanelProps) {
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [evidenceUrl, setEvidenceUrl] = useState<string>("");

  // Product Search
  const [productSearch, setProductSearch] = useState("");

  const { data: productsData, isLoading: isLoadingProducts } = useGetProducts({
    page: 1,
    size: 20,
    search: productSearch || undefined,
  });

  // Student Search
  const [studentSearch, setStudentSearch] = useState("");

  const { data: studentsData, isLoading: isLoadingStudents } = useGetStudents({
    page: 1,
    size: 20,
    search: studentSearch || undefined,
  });

  const { mutate: createOrder, isPending: isSubmitting } = useCreateOrder();

  const productOptions = useMemo(() => {
    return productsData?.results?.map((p) => ({
      value: p.id,
      label: p.name,
    })) || [];
  }, [productsData]);

  const studentOptions = useMemo(() => {
    return studentsData?.results?.map((s) => ({
      value: s.user_id,
      label: s.full_name,
    })) || [];
  }, [studentsData]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      student_user_id: "",
      product_id: "",
      product_type: "",
      quantity: undefined as unknown as number,
      payment_method: "BANK_TRANSFER",
      mobileCountryCode: "+94",
      mobile_number: "",
      whatsappCountryCode: "+94",
      whatsapp_number: "",
      address_line_1: "",
      address_line_2: "",
      district: "",
      city: "",
      postal_code: "",
    },
  });

  const mobileCountryCode = watch("mobileCountryCode");
  const whatsappCountryCode = watch("whatsappCountryCode");
  const paymentMethod = watch("payment_method");
  const selectedProductId = watch("product_id");

  const selectedProduct = useMemo(() => {
    return productsData?.results?.find((p) => p.id === selectedProductId);
  }, [productsData, selectedProductId]);

  const isDeliveryProduct = selectedProduct?.type === "DELIVERY";

  useEffect(() => {
    setValue("product_type", selectedProduct?.type || "", { shouldValidate: true });
  }, [selectedProduct?.type, setValue]);

  useEffect(() => {
    if (isOpen) {
      reset();
      setEvidenceUrl("");
      setShowDiscardModal(false);
    }
  }, [isOpen, reset]);

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

  const onSubmit = async (values: OrderFormValues) => {
    const payload: CreateOrderPayload = {
      student_user_id: values.student_user_id,
      product_id: values.product_id,
      quantity: isDeliveryProduct ? (values.quantity || 1) : 1,
      payment_method: values.payment_method,
      evidence_url: evidenceUrl || undefined,
    };

    if (isDeliveryProduct) {
      payload.delivery_details = {
        mobile_number: values.mobile_number || "",
        whatsapp_number: values.whatsapp_number || "",
        address_line_1: values.address_line_1 || "",
        address_line_2: values.address_line_2 || "",
        district: values.district || "",
        city: values.city || "",
        postal_code: values.postal_code || "",
      };
    }

    createOrder(payload, {
      onSuccess: () => {
        onClose();
        reset();
      },
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

              {/* Panel */}
              <motion.div
                key="panel"
                variants={sidePanelVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="fixed right-0 top-0 z-[99999] flex h-screen w-full max-w-[500px] flex-col bg-white shadow-2xl"
                style={{
                  borderLeft: "1px solid #E2E8F0",
                  borderRadius: "8px 0 0 8px",
                  boxShadow: "0 4px 6px -4px rgba(16, 24, 40, 0.10), 0 10px 15px -3px rgba(0, 0, 0, 0.10)",
                }}
              >
                {/* Header */}
                <motion.div variants={itemVariants} className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4 shrink-0">
                  <h2 className="text-lg font-semibold leading-[30px] text-[#0F172B]">Add Order</h2>
                  <button
                    title="close"
                    onClick={handleCloseAttempt}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-transparent shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-slate-50"
                  >
                    <X className="h-4 w-4 text-[#64748B]" />
                  </button>
                </motion.div>

                {/* Content */}
                <motion.div variants={itemVariants} className="flex-1 overflow-y-auto">
                  <form id="add-order-form" onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 space-y-5">
                    {/* Student Name */}
                    <div className="space-y-1">
                      <FieldLabel required>Student Name</FieldLabel>
                      <Controller
                        control={control}
                        name="student_user_id"
                        render={({ field }) => (
                          <SearchableSelect
                            options={studentOptions}
                            value={field.value}
                            onChange={field.onChange}
                            onSearchChange={setStudentSearch}
                            searchValue={studentSearch}
                            placeholder="type here to find it"
                            searchPlaceholder="Search students..."
                            isLoading={isLoadingStudents}
                            error={!!errors.student_user_id}
                          />
                        )}
                      />
                      {errors.student_user_id && <p className="text-xs text-red-500">{errors.student_user_id.message}</p>}
                    </div>

                    {/* Product Name */}
                    <div className="space-y-1">
                      <FieldLabel required>Product Name</FieldLabel>
                      <Controller
                        control={control}
                        name="product_id"
                        render={({ field }) => (
                          <SearchableSelect
                            options={productOptions}
                            value={field.value}
                            onChange={field.onChange}
                            onSearchChange={setProductSearch}
                            searchValue={productSearch}
                            placeholder="type here to find it"
                            searchPlaceholder="Search products..."
                            isLoading={isLoadingProducts}
                            error={!!errors.product_id}
                          />
                        )}
                      />
                      {errors.product_id && <p className="text-xs text-red-500">{errors.product_id.message}</p>}
                    </div>

                    {/* QTY */}
                    {isDeliveryProduct && (
                      <div className="space-y-1">
                        <FieldLabel required>QTY</FieldLabel>
                        <Input
                          type="number"
                          {...register("quantity")}
                          className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, errors.quantity && "border-red-500 focus-visible:ring-red-500")}
                          placeholder="Enter quantity"
                        />
                        {errors.quantity && <p className="text-xs text-red-500">{errors.quantity.message}</p>}
                      </div>
                    )}

                    {/* Conditional Delivery Details */}
                    {isDeliveryProduct && (
                      <div className="space-y-5 pt-2">
                        <div className="border-t border-[#E2E8F0] pt-4">
                          <h3 className="text-sm font-semibold text-[#0F172B] mb-4">Delivery Details</h3>
                        </div>

                        {/* Mobile Number */}
                        <div className="flex flex-col">
                          <FieldLabel className="mb-1" required>Mobile Number</FieldLabel>
                          <p className="mb-[6px] h-[20px] text-[12px] font-normal leading-[16px] text-[#90A1B9]">
                            Only use numbers; do not include any spaces.
                          </p>
                          <div className={cn(
                            "flex h-10 w-full items-center rounded-md border bg-white transition-all focus-within:ring-2 focus-within:ring-[#E60076]",
                            errors.mobile_number ? "border-red-500 focus-within:ring-red-500" : "border-gray-300"
                          )}>
                            <Select value={mobileCountryCode} onValueChange={(val) => setValue("mobileCountryCode", val)} disabled>
                              <SelectTrigger className="h-full w-[90px] rounded-l-md rounded-r-none border-0 border-r border-slate-200 bg-transparent px-2 ring-0 focus:ring-0 focus:ring-offset-0">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="z-[99999999]">
                                <SelectItem value="+94">🇱🇰 +94</SelectItem>
                              </SelectContent>
                            </Select>
                            <input
                              {...register("mobile_number")}
                              className={cn("flex-1 bg-transparent px-3 py-2 text-sm outline-none", AUTH_INPUT.placeholder)}
                              placeholder="eg: 711234567"
                            />
                          </div>
                          {errors.mobile_number && <p className="text-xs text-red-500 mt-1">{errors.mobile_number.message}</p>}
                        </div>

                        {/* Whatsapp Number */}
                        <div className="flex flex-col">
                          <FieldLabel className="mb-1">Whatsapp Number</FieldLabel>
                          <p className="mb-[6px] h-[20px] text-[12px] font-normal leading-[16px] text-[#90A1B9]">
                            Only use numbers; do not include any spaces.
                          </p>
                          <div className={cn(
                            "flex h-10 w-full items-center rounded-md border bg-white transition-all focus-within:ring-2 focus-within:ring-[#E60076]",
                            errors.whatsapp_number ? "border-red-500 focus-within:ring-red-500" : "border-gray-300"
                          )}>
                            <Select value={whatsappCountryCode} onValueChange={(val) => setValue("whatsappCountryCode", val)} disabled>
                              <SelectTrigger className="h-full w-[90px] rounded-l-md rounded-r-none border-0 border-r border-slate-200 bg-transparent px-2 ring-0 focus:ring-0 focus:ring-offset-0">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="z-[99999999]">
                                <SelectItem value="+94">🇱🇰 +94</SelectItem>
                              </SelectContent>
                            </Select>
                            <input
                              {...register("whatsapp_number")}
                              className={cn("flex-1 bg-transparent px-3 py-2 text-sm outline-none", AUTH_INPUT.placeholder)}
                              placeholder="eg: 771234567"
                            />
                          </div>
                          {errors.whatsapp_number && <p className="text-xs text-red-500 mt-1">{errors.whatsapp_number.message}</p>}
                        </div>

                        {/* Address Lines */}
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <FieldLabel required>Address Line 1</FieldLabel>
                            <Input
                              {...register("address_line_1")}
                              className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, errors.address_line_1 && "border-red-500 focus-visible:ring-red-500")}
                              placeholder="House No / Street"
                            />
                            {errors.address_line_1 && <p className="text-xs text-red-500">{errors.address_line_1.message}</p>}
                          </div>
                          <div className="space-y-1">
                            <FieldLabel>Address Line 2</FieldLabel>
                            <Input
                              {...register("address_line_2")}
                              className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, errors.address_line_2 && "border-red-500 focus-visible:ring-red-500")}
                              placeholder="Area / Landmarked"
                            />
                            {errors.address_line_2 && <p className="text-xs text-red-500">{errors.address_line_2.message}</p>}
                          </div>
                        </div>

                        {/* City / District */}
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <FieldLabel required>City</FieldLabel>
                            <Input
                              {...register("city")}
                              className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, errors.city && "border-red-500 focus-visible:ring-red-500")}
                              placeholder="eg: Nugegoda"
                            />
                            {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
                          </div>
                          <div className="space-y-1">
                            <FieldLabel required>District</FieldLabel>
                            <Controller
                              name="district"
                              control={control}
                              render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <SelectTrigger className={cn(AUTH_INPUT.base, errors.district && "border-red-500")}>
                                    <SelectValue placeholder="Select District" />
                                  </SelectTrigger>
                                  <SelectContent className="z-[99999999]">
                                    {DISTRICTS.map((district) => (
                                      <SelectItem key={district} value={district}>
                                        {district}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            {errors.district && <p className="text-xs text-red-500">{errors.district.message}</p>}
                          </div>
                        </div>

                        {/* Postal Code */}
                        <div className="space-y-1">
                          <FieldLabel required>Postal Code</FieldLabel>
                          <Input
                            {...register("postal_code")}
                            className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, errors.postal_code && "border-red-500 focus-visible:ring-red-500")}
                            placeholder="eg: 10250"
                          />
                          {errors.postal_code && <p className="text-xs text-red-500">{errors.postal_code.message}</p>}
                        </div>
                      </div>
                    )}

                    {/* Payment Method */}
                    <div className="space-y-3">
                      <FieldLabel>Payment Method</FieldLabel>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="payment-bank"
                            value="BANK_TRANSFER"
                            checked={paymentMethod === "BANK_TRANSFER"}
                            onChange={() => setValue("payment_method", "BANK_TRANSFER", { shouldDirty: true })}
                            className="h-4 w-4 accent-[#0F172B]"
                          />
                          <label htmlFor="payment-bank" className="text-sm font-medium text-[#45556C]">Bank Transfer</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="payment-card"
                            value="CARD"
                            checked={paymentMethod === "CARD"}
                            onChange={() => setValue("payment_method", "CARD", { shouldDirty: true })}
                            className="h-4 w-4 accent-[#0F172B]"
                          />
                          <label htmlFor="payment-card" className="text-sm font-medium text-[#45556C]">Card Payment</label>
                        </div>
                      </div>
                    </div>

                    {/* Evidence of Payment */}
                    <div className="space-y-2">
                      <FieldLabel>Evidence of Payment</FieldLabel>
                      <div className="h-[140px] w-full rounded-md border border-dashed border-[#E2E8F0] p-1 overflow-hidden">
                        <ImageUpload
                          imageUrl={evidenceUrl}
                          setImage={setEvidenceUrl}
                          removeImage={() => setEvidenceUrl("")}
                          showSupportedFormats={false}
                          className="h-full w-full"
                          dropzoneClassName="!h-full !border-none !bg-transparent"
                          placeholder={
                            <div className="flex flex-col items-center gap-1 text-[#64748B]">
                              <span className="text-[12px] text-center px-4 leading-tight">Click Here to upload or drag and drop here</span>
                            </div>
                          }
                        />
                      </div>
                    </div>
                  </form>
                </motion.div>

                {/* Footer */}
                <motion.div variants={itemVariants} className="flex items-center justify-end gap-3 border-t border-[#E2E8F0] px-6 py-4 shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => reset()}
                    className={cn(BUTTON_STYLES.secondary.md, "font-inter text-[14px] font-semibold text-[#0F172B]")}
                  >
                    Clear All
                  </Button>
                  <Button
                    type="submit"
                    form="add-order-form"
                    disabled={isSubmitting}
                    className={cn(BUTTON_STYLES.primary.full, "w-auto px-10 text-sm font-semibold text-white")}
                  >
                    {isSubmitting ? "Adding..." : "Add"}
                  </Button>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </Portal>

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
