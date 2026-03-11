"use client";

import React, { useState, useMemo, useEffect } from "react";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { 
  courseFeeDetailsSchema, 
  type CourseFeeDetailsValues,
} from "@/schemas/course.schema";
import { useCourseFormStore } from "@/store/courseFormStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CourseFeeDetailsStepProps {
  onNext?: () => void;
}

const ORDINALS = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth"];

// Reusable FeeTable Component
interface FeeTableProps {
  items: { id: string; label: string; amount: string | number }[];
  totalLabel: string;
  totalAmount: number;
  emptyMessage?: string;
  onRemove?: (index: number) => void;
  labelHeader?: string;
}

function FeeTable({ items, totalLabel, totalAmount, emptyMessage = "No fee items added yet.", onRemove, labelHeader = "Duration in Years" }: FeeTableProps) {
  // Helper formats
  const formatCurrency = (val: number) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="border border-[#E4E4E7] rounded-lg bg-white shadow-sm overflow-hidden flex flex-col w-full">
      <Table className="min-w-[500px]">
        <TableHeader className="bg-pink-50">
          <TableRow className="border-none hover:bg-pink-50">
            <TableHead className="text-sm font-semibold text-[#1D293D] font-inter pl-6 py-2 h-auto w-auto">{labelHeader}</TableHead>
            <TableHead className="w-[152px] text-sm font-semibold text-[#1D293D] font-inter text-right pr-6 py-2 h-auto shrink-0">Amount</TableHead>
            {onRemove && <TableHead className="w-[50px] text-sm font-semibold text-[#1D293D] font-inter text-center py-2 h-auto shrink-0"></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
             <TableRow className="hover:bg-transparent">
                <TableCell colSpan={onRemove ? 3 : 2} className="h-16 text-center text-xs text-[#90A1B9] border-t border-transparent">
                  {emptyMessage}
                </TableCell>
             </TableRow>
          ) : (
            items.map((item, index) => (
              <TableRow key={item.id} className="border-b border-[#F1F5F9] last:border-none hover:bg-transparent">
                <TableCell className="text-[#45556C] text-sm font-normal font-inter leading-5 break-all px-6 py-2">
                  {item.label}
                </TableCell>
                <TableCell className="w-[152px] shrink-0 text-[#45556C] text-sm font-normal font-inter leading-5 text-right px-6 py-2 align-middle">
                   {typeof item.amount === 'string' ? `${item.amount}` : `${parseFloat(item.amount.toString()).toLocaleString('en-US', { minimumFractionDigits: 2 })} LKR`}
                </TableCell>
                {onRemove && (
                    <TableCell className="w-[50px] shrink-0 text-center py-2 align-middle">
                        <button
                            type="button"
                            onClick={() => onRemove(index)}
                            className="text-[#94A3B8] hover:text-[#EF4444] transition-colors inline-flex items-center justify-center"
                            aria-label={`Remove ${item.label}`}
                            title={`Remove ${item.label}`}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
        {items.length > 0 && (
          <TableFooter className="border-t-[2px] border-t-[#62748E] bg-[#F8FAFC]">
            <TableRow className="hover:bg-[#F8FAFC] border-none">
              <TableCell className="text-[#0F172B] text-sm font-semibold font-inter leading-6 px-6 py-3">
                {totalLabel}
              </TableCell>
              <TableCell className="w-[152px] shrink-0 text-[#0F172B] text-sm font-semibold font-inter leading-6 text-right px-6 py-3">
                {formatCurrency(totalAmount)}
              </TableCell>
              {onRemove && <TableCell className="w-[50px] shrink-0 px-6 py-3"></TableCell>}
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  );
}

// Reusable error message component
const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;

  return (
    <p className="text-xs text-red-500 mt-1">{message}</p>
  );
};

export function CourseFeeDetailsStep({ onNext }: CourseFeeDetailsStepProps) {
  // Get stored values and actions from Zustand store
  const { feeDetails, setFeeDetails } = useCourseFormStore();

  // Temporary input states for adding items
  const [feeAmount, setFeeAmount] = useState("");
  const [feeDuration, setFeeDuration] = useState("");

  const form = useForm<CourseFeeDetailsValues>({
    resolver: zodResolver(courseFeeDetailsSchema),
    defaultValues: feeDetails as CourseFeeDetailsValues,
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = form;

  // Watch all form values and save to store on change
  useEffect(() => {
    const subscription = watch((data) => {
      setFeeDetails(data as Partial<CourseFeeDetailsValues>);
    });
    
    return () => subscription.unsubscribe();
  }, [watch, setFeeDetails]);

  const { fields: feeFields, append: appendFee, remove: removeFee } = useFieldArray({
    control,
    name: "courseFeeItems",
  });

  const { fields: installmentFields, replace: replaceInstallments } = useFieldArray({
    control,
    name: "installmentItems",
  });

  const pricingOption = watch("pricingOption");
  const enableInstallments = watch("enableInstallments");

  // Watch specifically for changes in number of installments key press
  const numberOfInstallments = watch("numberOfInstallments");

  // Reset fee-related fields when switching to "Free"
  useEffect(() => {
    if (pricingOption === "Free") {
      // Clear course fee items and installment settings when Free is selected
      setValue("courseFeeItems", []);
      setValue("enableInstallments", false);
      setValue("numberOfInstallments", undefined);
      setValue("installmentItems", []);
    }
  }, [pricingOption, setValue]);

  // Helper to calculate total
  const calculateTotal = (items: { amount: string }[]) => {
    return items.reduce((sum, item) => {
      const val = parseFloat(item.amount.replace(/,/g, ""));

      return sum + (isNaN(val) ? 0 : val);
    }, 0);
  };

  const feeTotal = useMemo(() => calculateTotal(feeFields), [feeFields]);
  const installmentTotal = useMemo(() => calculateTotal(installmentFields as any), [installmentFields]);

  // Effect to auto-calculate installments when number changes
  useEffect(() => {
    if (!enableInstallments || !numberOfInstallments || numberOfInstallments < 2) {
       if (installmentFields.length > 0) {
          replaceInstallments([]);
       }
       
       return;
    }

    if (feeTotal === 0) return;

    const count = numberOfInstallments;

    // Simple even split logic
    const perInstallment = (feeTotal / count).toFixed(2);
    
    // Adjust last installment to handle rounding errors if any
    // Adjust last installment to handle rounding errors if any
    const newItems = Array.from({ length: count }).map((_, idx) => {
        const isLast = idx === count - 1;
        let amount = perInstallment;
        
        if (isLast) {
             const currentSum = parseFloat(perInstallment) * (count - 1);
             const remainder = feeTotal - currentSum;

             amount = remainder.toFixed(2);
        }

        const ordinal = ORDINALS[idx] || `${idx + 1}th`;

        // Try to reuse ID from existing field to prevent unnecessary dirty state
        return {
            description: `${ordinal} Installment`,
            amount: amount
        };
    });

    // Check if distinct change occurred
    const isChange = 
        installmentFields.length !== newItems.length ||
        newItems.some((newItem, idx) => {
            const current = installmentFields[idx];

            return current.amount !== newItem.amount || current.description !== newItem.description;
        });

    if (isChange) {
         const itemsWithIds = newItems.map((item, idx) => ({
             ...item,

             // Reuse existing ID if available at index, else new
             id: installmentFields[idx]?.id || crypto.randomUUID()
         }));
         
         replaceInstallments(itemsWithIds);
    }

  }, [numberOfInstallments, feeTotal, enableInstallments, replaceInstallments, installmentFields]);


  const onSubmit = (data: CourseFeeDetailsValues) => {
    console.log("Course Fee Details Submitted:", data);
    setFeeDetails(data);
    onNext?.();
  };

  const handleAddCourseFee = () => {
    if (!feeAmount || !feeDuration) return;
    appendFee({
      id: crypto.randomUUID(),
      amount: feeAmount,
      duration: feeDuration,
    });
    setFeeAmount("");
    setFeeDuration("");
  };

  return (
    <form id="active-step-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      
      {/* Pricing Option */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-[#0F172B] leading-6 font-inter">Pricing Option</h3>
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="Paid"
              {...register("pricingOption")}
              className="w-4 h-4 accent-[#0F172B] cursor-pointer"
            />
            <span className="text-sm font-normal text-[#314158] leading-5 font-inter">Paid</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="Free"
              {...register("pricingOption")}
              className="w-4 h-4 accent-[#0F172B] cursor-pointer"
            />
            <span className="text-sm font-normal text-[#314158] leading-5 font-inter">Free</span>
          </label>
        </div>
      </div>

      {/* Course Fee Card */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB]">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-[#0F172B] leading-5 font-inter">
                Course Fee{pricingOption === "Paid" && <span className="text-red-500 ml-0.5">*</span>}
              </h3>
              <p className={AUTH_TYPOGRAPHY.description}>
                This is the standard fee for the course before installments or add-on charges.
              </p>
            </div>
        </div>

        {pricingOption === "Free" ? (
          <div className="p-4 text-center text-sm text-[#90A1B9]">
            No Course fee for this course.
          </div>
        ) : (
        <div className="p-4 flex flex-col justify-center items-start gap-6">
              <div className="space-y-6 w-full">
                {/* Input Row */}
                <div className="flex flex-col md:flex-row items-end gap-3 w-full">
                  <div className="w-full md:flex-1 space-y-1.5">
                      <Label className={AUTH_TYPOGRAPHY.label}>Enter Amount</Label>
                      <div className="relative">
                        <Input 
                            value={feeAmount}
                            onChange={(e) => setFeeAmount(e.target.value)}
                            placeholder="eg: 1,000.00"
                            className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "pr-16")}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <span className="text-sm font-semibold text-[#1D293D] font-inter">LKR</span>
                            <ChevronDown className="h-3 w-3 text-[#0F172B]" />
                        </div>
                      </div>
                  </div>
                  <div className="w-full md:flex-1 space-y-1.5">
                      <Label className={AUTH_TYPOGRAPHY.label}>Duration for the Course Price (Years)</Label>
                      <Input 
                          value={feeDuration}
                          onChange={(e) => setFeeDuration(e.target.value)}
                          placeholder="eg: 1"
                          className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                      />
                  </div>
                  <Button 
                    type="button" 
                    onClick={handleAddCourseFee} 
                    variant="ghost" 
                    className={cn(BUTTON_STYLES.outline.md, "w-full md:w-auto text-sm font-semibold text-[#0F172B]")}
                  >
                    Add Option
                  </Button>
                </div>

                {/* Fee Overview Section */}
                <div className="space-y-2 w-full">
                    <h4 className="text-sm font-medium text-[#1D293D] font-inter">Fee Overview</h4>
                    <FeeTable 
                      items={feeFields.map(f => ({ id: f.id, label: f.duration, amount: f.amount }))}
                      totalLabel="Total Course Fee"
                      totalAmount={feeTotal}
                      onRemove={(index) => removeFee(index)}
                      labelHeader="Duration in Years"
                    />
                    <FieldError message={errors.courseFeeItems?.message} />
                    <p className={AUTH_TYPOGRAPHY.description}>
                        This is the total base amount before installments or additional payments.
                    </p>
                </div>

                <div className="h-[1px] bg-[#E2E8F0] w-full" />

                {/* Installment Checkbox */}
                <div className="space-y-3 w-full">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <Checkbox 
                                id="course-installments" 
                                checked={enableInstallments}
                                onCheckedChange={(checked) => setValue("enableInstallments", !!checked)}
                                className="border-[#94A3B8] data-[state=checked]:bg-[#0F172B] data-[state=checked]:border-[#0F172B]"
                            />
                            <label htmlFor="course-installments" className="text-sm font-medium text-[#1D293D] font-inter cursor-pointer select-none">
                                Enable Installment Payments
                            </label>
                        </div>
                        <p className={cn(AUTH_TYPOGRAPHY.description, "pl-6")}>
                            Allow students to pay the course fee in multiple parts instead of a single payment.
                        </p>
                    </div>

                    {enableInstallments && (
                         <div className="pl-0 space-y-3 pt-3">
                             {/* Number of installments input */}
                             <div className="space-y-1">
                               <div className="flex items-center gap-3">
                                  <Label className="text-sm font-medium text-[#1D293D] font-inter whitespace-nowrap">
                                      Number of Installments
                                  </Label>
                                  <Input 
                                      type="number"
                                      min={2}
                                      max={5}
                                      {...register("numberOfInstallments")}
                                      placeholder="eg: 2 or 3"
                                      className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "w-[150px]", errors.numberOfInstallments && "border-red-500")}
                                  />
                               </div>
                               <FieldError message={errors.numberOfInstallments?.message} />
                             </div>

                             {/* Installment Table - Only show if items exist */}
                             {installmentFields.length > 0 && (
                                <FeeTable 
                                  items={installmentFields.map(f => ({ id: f.id, label: f.description, amount: f.amount }))}
                                  totalLabel="Total Course Fee"
                                  totalAmount={installmentTotal}
                                  labelHeader="Description"
                                />
                             )}
                         </div>
                    )}
                </div>
              </div>
        </div>
        )}
      </div>

    </form>
  );
}
