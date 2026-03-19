"use client";

import React, { useState, useMemo } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { ArrowRightCircle } from "lucide-react";

import { BackButton } from "@/components/common/BackButton";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BUTTON_STYLES } from "@/lib/constants/theme";
import { useBatchFormStore } from "@/store/batchFormStore";
import { defaultGeneralDetailsValues, defaultCommissionDetailsValues } from "@/schemas/batch.schema";

import { BatchStepper } from "@/components/admin-panel/batch-management/add/BatchStepper";
import { GeneralDetailsStep } from "@/components/admin-panel/batch-management/add/steps/GeneralDetailsStep";
import { FeeDetailsStep } from "@/components/admin-panel/batch-management/add/steps/FeeDetailsStep";
import { CommissionDetailsStep } from "@/components/admin-panel/batch-management/add/steps/CommissionDetailsStep";
import { useCreateBatch, type CreateBatchPayload } from "@/hooks/api/batches/useCreateBatch";

export default function AddBatchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { generalDetails, feeDetails, commissionDetails, resetForm } = useBatchFormStore();
  const { mutateAsync: createBatch, isPending: isCreating } = useCreateBatch();

  const currentStep = Number(searchParams.get("step")) || 1;

  // Track if user has unsaved changes
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  // Check if form has any data filled
  const isFormDirty = useMemo(() => {
    // Check general details
    const hasGeneralChanges = 
      generalDetails.batchName !== defaultGeneralDetailsValues.batchName ||
      generalDetails.branch !== defaultGeneralDetailsValues.branch ||
      generalDetails.language !== defaultGeneralDetailsValues.language ||
      generalDetails.batchType !== defaultGeneralDetailsValues.batchType ||
      (generalDetails.staffMembers && generalDetails.staffMembers.length > 0) ||
      generalDetails.batchCategory !== defaultGeneralDetailsValues.batchCategory ||
      generalDetails.startDate !== undefined ||
      generalDetails.endDate !== undefined ||
      generalDetails.lecturer !== defaultGeneralDetailsValues.lecturer ||
      (generalDetails.certificates && generalDetails.certificates.length > 0) ||
      generalDetails.description !== defaultGeneralDetailsValues.description ||
      generalDetails.coverImage !== defaultGeneralDetailsValues.coverImage;

    // Check fee details
    const hasFeeChanges = 
      (feeDetails.baseFeeItems && feeDetails.baseFeeItems.length > 0) ||
      (feeDetails.additionalFeeItems && feeDetails.additionalFeeItems.length > 0) ||
      feeDetails.enableInstallments === true;

    // Check commission details
    const hasCommissionChanges =
      commissionDetails.referralType !== defaultCommissionDetailsValues.referralType ||
      commissionDetails.referralValue !== defaultCommissionDetailsValues.referralValue ||
      commissionDetails.lecturerType !== defaultCommissionDetailsValues.lecturerType ||
      commissionDetails.lecturerValue !== defaultCommissionDetailsValues.lecturerValue;

    return hasGeneralChanges || hasFeeChanges || hasCommissionChanges;
  }, [generalDetails, feeDetails, commissionDetails]);

  // Build the API payload from the Zustand store
  const buildPayload = (): CreateBatchPayload => {
    const g = generalDetails;
    const f = feeDetails;
    const c = commissionDetails;

    const toNum = (val?: string) => parseFloat(val?.replace(/,/g, "") || "0") || 0;

    const commissionEntry = (type?: string, value?: string, teamValue?: string) => ({
      type: (type || "Fixed") as "Percentage" | "Fixed",
      value: toNum(value),
      team_value: toNum(teamValue),
    });

    return {
      general_details: {
        name: g.batchName || "",
        branch_id: g.branch || "",
        language: g.language || "",
        batch_type: g.batchType || "",
        staff_member_ids: g.staffMembers || [],
        has_assignment: g.assignment === "yes",
        category: g.batchCategory || "",
        start_date: g.startDate ? new Date(g.startDate).toISOString() : "",
        end_date: g.endDate ? new Date(g.endDate).toISOString() : "",
        certificate_ids: g.certificates || [],
        status: g.batchStatus || "",
        lecturer_id: g.lecturer || "",
        level: g.batchLevel || "",
        hierarchy_type: g.hierarchy || "3 Tiers",
        lesson_duration_hours: g.lessonDuration ? Number(g.lessonDuration) : undefined,
        description: g.description || undefined,
        cover_image_url: g.coverImage || undefined,
      },
      fee_details: {
        pricing_option: f.pricingOption || "Paid",
        base_fees: f.baseFeeItems?.map((item) => ({
          amount: toNum(item.amount),
          description: item.description,
        })),
        installments_enabled: f.enableInstallments,
        number_of_installments: f.numberOfInstallments,
        installment_plans: f.installmentItems?.map((item) => ({
          description: item.description,
          amount: toNum(item.amount),
        })),
        additional_fees: f.additionalFeeItems?.map((item) => ({
          amount: toNum(item.amount),
          duration_years: Number(item.duration) || 1,
          description: item.description,
        })),
      },
      commission_details: {
        referral: commissionEntry(c.referralType, c.referralValue, c.teamValue),
        lecturer: commissionEntry(c.lecturerType, c.lecturerValue, "0"),
        staff: commissionEntry(c.staffType, c.staffValue, "0"),
        branch_staff: commissionEntry(c.branchStaffType, c.branchStaffValue, "0"),
      },
    };
  };

  const handleNext = async () => {
    if (currentStep < 3) {
      const params = new URLSearchParams(searchParams.toString());

      params.set("step", (currentStep + 1).toString());
      router.push(`${pathname}?${params.toString()}`);
    } else {
      // Final step - build payload and submit
      try {
        const payload = buildPayload();

        await createBatch(payload);
        resetForm();
        router.push("/admin-panel/batch-management");
      } catch {
        // Error already handled by the hook's onError toast
      }
    }
  };

  const handleDiscard = () => {
    if (isFormDirty) {
      setPendingNavigation("/admin-panel/batch-management");
      setShowDiscardModal(true);
    } else {
      resetForm();
      router.push("/admin-panel/batch-management");
    }
  };

  const handleBackClick = (href: string) => {
    // Only show warning when going back to batch management (leaving the form entirely)
    if (href === "/admin-panel/batch-management" && isFormDirty) {
      setPendingNavigation(href);
      setShowDiscardModal(true);
    } else {
      router.push(href);
    }
  };

  const handleConfirmDiscard = () => {
    setShowDiscardModal(false);
    resetForm();

    if (pendingNavigation) {
      router.push(pendingNavigation);
    }
  };

  const handleCancelDiscard = () => {
    setShowDiscardModal(false);
    setPendingNavigation(null);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <GeneralDetailsStep onNext={handleNext} />;
      case 2:
        return <FeeDetailsStep onNext={handleNext} />;
      case 3:
        return <CommissionDetailsStep onNext={handleNext} />;
      default:
        return null;
    }
  };

  const isFirstStep = currentStep === 1;
  const backHref = isFirstStep ? "/admin-panel/batch-management" : `${pathname}?step=${currentStep - 1}`;
  const backLabel = isFirstStep ? "Go to Batch Management" : "Back";

  return (
    <div className="flex flex-col h-full overflow-auto" id="batch-form-container">
      {/* Sticky Header Section */}
      <div className="sticky top-0 z-40 bg-white shadow-sm">
        {/* Header */}
        <div className="px-4 pt-6 pb-4 md:px-6">
          <BackButton 
            href={backHref} 
            label={backLabel} 
            onClick={() => handleBackClick(backHref)}
          />
        </div>

        {/* Stepper */}
        <BatchStepper currentStep={currentStep} />
      </div>

      <div className="flex-1 px-4 pb-20 pt-8 md:px-6">
        {renderStepContent()}
      </div>

      <div className="sticky bottom-0 z-50 flex items-center justify-end gap-x-4 bg-white px-4 py-4 border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.025)] md:px-6">
         <Button type="button" variant="ghost" size="md" className="text-[#0F172B] font-semibold" onClick={handleDiscard}>
           Discard
         </Button>

         {currentStep === 3 && (
            <button 
              type="button" 
              className={cn(BUTTON_STYLES.secondary.md, "text-sm font-semibold")}
            >
                Save as Draft
            </button>
         )}

         <button 
            type="submit"
            form="active-step-form"
            disabled={isCreating}
            className={cn(
                currentStep === 3 ? cn(BUTTON_STYLES.primary.md, "text-white") : cn(BUTTON_STYLES.outline.md, "text-[#0F172B]"),
                "font-semibold text-sm leading-5",
                isCreating && "opacity-70 cursor-not-allowed"
            )}
         >
           {currentStep === 3 ? (isCreating ? "Creating Batch..." : "Create Batch") : "Go to Next Step"}
           {currentStep !== 3 && <ArrowRightCircle className="h-5 w-5" />}
         </button>
      </div>

      {/* Discard Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDiscardModal}
        onClose={handleCancelDiscard}
        onConfirm={handleConfirmDiscard}
        title="Save Your Edits First"
        description="Unsaved changes detected, remember to save your edits before you close!"
        confirmText="Proceed Without Saving"
        cancelText="Save Details"
        cancelAsPrimary
      />
    </div>
  );
}
