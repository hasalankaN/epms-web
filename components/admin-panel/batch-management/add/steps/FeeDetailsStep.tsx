"use client";

import React, { useState, useMemo, useEffect } from "react";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { 
  feeDetailsSchema, 
  type FeeDetailsValues,
} from "@/schemas/batch.schema";
import { useBatchFormStore } from "@/store/batchFormStore";
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

interface FeeDetailsStepProps {
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
}

function FeeTable({ items, totalLabel, totalAmount, emptyMessage = "No fee items added yet.", onRemove }: FeeTableProps) {
  // Helper formats
  const formatCurrency = (val: number) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="border border-[#E4E4E7] rounded-lg bg-white shadow-sm overflow-hidden flex flex-col w-full">
      <Table className="min-w-[500px]">
        <TableHeader className="bg-pink-50">
          <TableRow className="border-none hover:bg-pink-50">
            <TableHead className="text-sm font-semibold text-[#1D293D] font-inter pl-6 py-2 h-auto w-auto">Description</TableHead>
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

export function FeeDetailsStep({ onNext }: FeeDetailsStepProps) {
  // Get stored values and actions from Zustand store
  const { feeDetails, setFeeDetails } = useBatchFormStore();

  // Temporary input states for adding items
  const [baseAmount, setBaseAmount] = useState("");
  const [baseDescription, setBaseDescription] = useState("");
  const [addAmount, setAddAmount] = useState("");
  const [addDuration, setAddDuration] = useState("");

  const form = useForm<FeeDetailsValues>({
    resolver: zodResolver(feeDetailsSchema),
    defaultValues: feeDetails as FeeDetailsValues,
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
      setFeeDetails(data as Partial<FeeDetailsValues>);
    });
    
    return () => subscription.unsubscribe();
  }, [watch, setFeeDetails]);

  const { fields: baseFields, append: appendBase, remove: removeBase } = useFieldArray({
    control,
    name: "baseFeeItems",
  });

  const { fields: additionalFields, append: appendAdditional, remove: removeAdditional } = useFieldArray({
    control,
    name: "additionalFeeItems",
  });

  const { fields: installmentFields, replace: replaceInstallments } = useFieldArray({
    control,
    name: "installmentItems",
  });

  const pricingOption = watch("pricingOption");
  const enableInstallments = watch("enableInstallments");

  // Watch specifically for changes in number of installments key press
  const numberOfInstallments = watch("numberOfInstallments");

  // Helper to calculate total
  const calculateTotal = (items: { amount: string }[]) => {
    return items.reduce((sum, item) => {
      const val = parseFloat(item.amount.replace(/,/g, ""));

      return sum + (isNaN(val) ? 0 : val);
    }, 0);
  };

  const baseTotal = useMemo(() => calculateTotal(baseFields), [baseFields]);
  const additionalTotal = useMemo(() => calculateTotal(additionalFields), [additionalFields]);
  const installmentTotal = useMemo(() => calculateTotal(installmentFields as any), [installmentFields]);

  // Effect to auto-calculate installments when number changes
  useEffect(() => {
    if (!enableInstallments || !numberOfInstallments || numberOfInstallments < 2) {
       if (installmentFields.length > 0) {
          replaceInstallments([]);
       }
       
       return;
    }

    if (baseTotal === 0) return;

    const count = numberOfInstallments;

    // Simple even split logic
    const perInstallment = (baseTotal / count).toFixed(2);
    
    // Adjust last installment to handle rounding errors if any
    // e.g. 100 / 3 = 33.33, 33.33, 33.34
    
    const newItems = Array.from({ length: count }).map((_, idx) => {
        const isLast = idx === count - 1;
        let amount = perInstallment;
        
        if (isLast) {
             const currentSum = parseFloat(perInstallment) * (count - 1);
             const remainder = baseTotal - currentSum;

             amount = remainder.toFixed(2);
        }

        const ordinal = ORDINALS[idx] || `${idx + 1}th`;
        
        // Try to reuse ID from existing field to prevent unnecessary dirty state
        // We can't access installmentFields directly in map cleanly without dependency
        // But we can check inside the effect
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

  }, [numberOfInstallments, baseTotal, enableInstallments, replaceInstallments, installmentFields]);


  const onSubmit = (data: FeeDetailsValues) => {
    console.log("Fee Details Submitted:", data);
    setFeeDetails(data);
    onNext?.();
  };

  const handleAddBaseFee = () => {
    if (!baseAmount || !baseDescription) return;
    appendBase({
      id: crypto.randomUUID(),
      amount: baseAmount,
      description: baseDescription,
    });
    setBaseAmount("");
    setBaseDescription("");
  };

  const handleAddAdditionalFee = () => {
    if (!addAmount || !addDuration) return;
    appendAdditional({
      id: crypto.randomUUID(),
      amount: addAmount,
      duration: addDuration,
    });
    setAddAmount("");
    setAddDuration("");
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

      {/* Base Course Fee Card */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB]">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-[#0F172B] leading-5 font-inter">Course Fee</h3>
              <p className={AUTH_TYPOGRAPHY.description}>
                This is the standard fee for the course before installments or add-on charges.
              </p>
            </div>
        </div>

        {pricingOption === "Free" ? (
          <div className="p-4 text-center text-sm text-[#90A1B9]">
            No Course fee for this batch.
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
                            value={baseAmount}
                            onChange={(e) => setBaseAmount(e.target.value)}
                            placeholder="eg: 1,000.00"
                            className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "pr-12")}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <span className="text-sm font-semibold text-[#1D293D] font-inter">LKR</span>
                            <ChevronDown className="h-3 w-3 text-[#0F172B]" />
                        </div>
                      </div>
                  </div>
                  <div className="w-full md:flex-[2] space-y-1.5">
                      <Label className={AUTH_TYPOGRAPHY.label}>Fee Description</Label>
                      <Input 
                          value={baseDescription}
                          onChange={(e) => setBaseDescription(e.target.value)}
                          placeholder="eg: Registration Fee, Course Fee"
                          className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                      />
                  </div>
                  <Button 
                    type="button" 
                    onClick={handleAddBaseFee} 
                    variant="ghost" 
                    className={cn(BUTTON_STYLES.outline.md, "w-full md:w-auto text-sm font-semibold text-[#0F172B]")}
                  >
                    Add
                  </Button>
                </div>

                {/* Fee Overview Section (Grouped for 8px gaps) */}
                <div className="space-y-2 w-full">
                    <h4 className="text-sm font-medium text-[#1D293D] font-inter">Fee Overview</h4>
                    <FeeTable 
                      items={baseFields.map(f => ({ id: f.id, label: f.description, amount: f.amount }))}
                      totalLabel="Total Course Fee"
                      totalAmount={baseTotal}
                      onRemove={(index) => removeBase(index)}
                    />
                    <FieldError message={errors.baseFeeItems?.message} />
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
                                id="installments" 
                                checked={enableInstallments}
                                onCheckedChange={(checked) => setValue("enableInstallments", !!checked)}
                                className="border-[#94A3B8] data-[state=checked]:bg-[#0F172B] data-[state=checked]:border-[#0F172B]"
                            />
                            <label htmlFor="installments" className="text-sm font-medium text-[#1D293D] font-inter cursor-pointer select-none">
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
                                />
                             )}
                         </div>
                    )}
                </div>
              </div>
        </div>
        )}
      </div>

      {/* Additional Payments Card */}
      {pricingOption === "Paid" && (
      <div className="rounded-xl border border-[#E2E8F0] bg-white">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB]">
             <div className="space-y-1">
              <h3 className="text-sm font-semibold text-[#0F172B] leading-5 font-inter">Additional Payments</h3>
              <p className={AUTH_TYPOGRAPHY.description}>
                Optional charges for extended access or additional services.
              </p>
            </div>
        </div>

        <div className="p-4 flex flex-col justify-center items-start gap-6">
            {/* Input Row */}
            <div className="flex flex-col md:flex-row items-end gap-3 w-full">
               <div className="w-full md:flex-1 space-y-1.5">
                  <Label className={AUTH_TYPOGRAPHY.label}>Enter Amount</Label>
                  <div className="relative">
                    <Input 
                        value={addAmount}
                        onChange={(e) => setAddAmount(e.target.value)}
                        placeholder="eg: 1,000.00"
                        className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "pr-12")}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <span className="text-sm font-semibold text-[#1D293D] font-inter">LKR</span>
                        <ChevronDown className="h-3 w-3 text-[#0F172B]" />
                    </div>
                  </div>
               </div>
               <div className="w-full md:flex-[2] space-y-1.5">
                  <Label className={AUTH_TYPOGRAPHY.label}>Duration in Years</Label>
                  <Input 
                      value={addDuration}
                      onChange={(e) => setAddDuration(e.target.value)}
                      placeholder="eg: Extra 1 year course access"
                      className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                  />
               </div>
               <Button 
                type="button" 
                onClick={handleAddAdditionalFee} 
                variant="ghost" 
                className={cn(BUTTON_STYLES.outline.md, "w-full md:w-auto text-sm font-semibold text-[#0F172B]")}
               >
                 Add
               </Button>
            </div>

            {/* Fee Overview Section (Grouped for 8px gaps) */}
            <div className="space-y-2 w-full">
                <h4 className="text-sm font-medium text-[#1D293D] font-inter">Fee Overview</h4>
                <FeeTable 
                  items={additionalFields.map(f => ({ id: f.id, label: f.duration, amount: f.amount }))}
                  totalLabel="Total Additional Fee"
                  totalAmount={additionalTotal}
                  onRemove={(index) => removeAdditional(index)}
                />
            </div>
        </div>
      </div>
      )}

    </form>
  );
}
