"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";

import { useRouter, useSearchParams, usePathname, useParams } from "next/navigation";

import { ArrowRightCircle } from "lucide-react";

import { BackButton } from "@/components/common/BackButton";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BUTTON_STYLES } from "@/lib/constants/theme";
import { useBatchFormStore } from "@/store/batchFormStore";
import { transformApiBatchDetailToFormData, buildUpdateBatchPayload } from "@/transformers/batch.transformer";
import { useGetBatchById } from "@/hooks/api/batches/useGetBatchById";
import { useUpdateBatch } from "@/hooks/api/batches/useUpdateBatch";

import { BatchStepper } from "@/components/admin-panel/batch-management/add/BatchStepper";
import { GeneralDetailsStep } from "@/components/admin-panel/batch-management/add/steps/GeneralDetailsStep";
import { FeeDetailsStep } from "@/components/admin-panel/batch-management/add/steps/FeeDetailsStep";
import { CommissionDetailsStep } from "@/components/admin-panel/batch-management/add/steps/CommissionDetailsStep";

// Helper to serialize data consistently for comparison
const serializeForComparison = (data: unknown): string => {
  return JSON.stringify(data, (key, value) => {
    if (value instanceof Date) {
      return value.toISOString();
    }

    return value;
  });
};

export default function EditBatchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = useParams();
  const batchId = params.id as string;

  const {
    generalDetails,
    feeDetails,
    commissionDetails,
    resetForm,
    setMode,
    loadFormData,
  } = useBatchFormStore();

  const { mutateAsync: updateBatch, isPending: isUpdating } = useUpdateBatch(batchId);

  const currentStep = Number(searchParams.get("step")) || 1;

  // Fetch batch details from real API
  const { data: batchDetail, isLoading, isError } = useGetBatchById(batchId);

  // Store original data as serialized strings for comparison (for dirty check)
  const originalDataRef = useRef<{
    generalDetails: string;
    feeDetails: string;
    commissionDetails: string;
  } | null>(null);

  // Track if original data has been loaded from API
  const [hasLoadedOriginal, setHasLoadedOriginal] = useState(false);

  // Track if user has unsaved changes
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  // Load batch data into store when API data arrives
  useEffect(() => {
    if (!batchDetail) return;

    console.log("EditBatchPage: batchDetail arrived", batchDetail);

    setMode("edit", batchId);

    const formData = transformApiBatchDetailToFormData(batchDetail);

    console.log("EditBatchPage: Transformed formData", formData);

    loadFormData(formData);

    // Store serialized original data for dirty-check comparison
    originalDataRef.current = {
      generalDetails: serializeForComparison(formData.generalDetails),
      feeDetails: serializeForComparison(formData.feeDetails),
      commissionDetails: serializeForComparison(formData.commissionDetails),
    };

    setHasLoadedOriginal(false); // will validate in the next effect
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchDetail]);

  // Set hasLoadedOriginal after store has synced with loaded data
  useEffect(() => {
    if (!batchDetail || !originalDataRef.current || hasLoadedOriginal) return;

    const currentGeneral = serializeForComparison(generalDetails);
    const currentFee = serializeForComparison(feeDetails);
    const currentCommission = serializeForComparison(commissionDetails);

    if (
      currentGeneral === originalDataRef.current.generalDetails &&
      currentFee === originalDataRef.current.feeDetails &&
      currentCommission === originalDataRef.current.commissionDetails
    ) {
      setHasLoadedOriginal(true);
    }
  }, [batchDetail, hasLoadedOriginal, generalDetails, feeDetails, commissionDetails]);

  // Check if form has been modified from original data
  const isFormDirty = useMemo(() => {
    if (!hasLoadedOriginal || !originalDataRef.current) return false;

    const currentGeneral = serializeForComparison(generalDetails);
    const currentFee = serializeForComparison(feeDetails);
    const currentCommission = serializeForComparison(commissionDetails);

    return (
      currentGeneral !== originalDataRef.current.generalDetails ||
      currentFee !== originalDataRef.current.feeDetails ||
      currentCommission !== originalDataRef.current.commissionDetails
    );
  }, [hasLoadedOriginal, generalDetails, feeDetails, commissionDetails]);

  const handleNext = async () => {
    if (currentStep < 3) {
      const urlParams = new URLSearchParams(searchParams.toString());

      urlParams.set("step", (currentStep + 1).toString());
      router.push(`${pathname}?${urlParams.toString()}`);
    } else {
      // Build & submit the update payload
      try {
        const payload = buildUpdateBatchPayload(generalDetails, feeDetails, commissionDetails);

        await updateBatch(payload);
        resetForm();
        router.push("/admin-panel/batch-management");
      } catch {
        // Error is already shown via toast inside the hook
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
    if (isLoading || (batchDetail && !hasLoadedOriginal)) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E60076]" />
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex items-center justify-center py-20 text-red-500">
          Failed to load batch details. Please try again.
        </div>
      );
    }

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
    <div className="flex flex-col h-full overflow-auto" id="batch-edit-form-container">
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

        <button
          type="submit"
          form="active-step-form"
          disabled={isLoading || isUpdating || (currentStep === 3 && !isFormDirty)}
          className={cn(
            currentStep === 3 ? cn(BUTTON_STYLES.primary.md, "text-white") : cn(BUTTON_STYLES.outline.md, "text-[#0F172B]"),
            "font-semibold text-sm leading-5",
            (currentStep === 3 && !isFormDirty) && "opacity-50 cursor-not-allowed"
          )}
        >
          {currentStep === 3 ? "Update Batch" : "Go to Next Step"}
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
