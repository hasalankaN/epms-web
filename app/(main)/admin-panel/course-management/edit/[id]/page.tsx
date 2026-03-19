"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";

import { useRouter, useSearchParams, usePathname, useParams } from "next/navigation";

import { ArrowRightCircle } from "lucide-react";

import { BackButton } from "@/components/common/BackButton";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import { FormStepper } from "@/components/common/FormStepper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BUTTON_STYLES } from "@/lib/constants/theme";
import { useCourseFormStore } from "@/store/courseFormStore";
import { getCourseForEdit } from "@/transformers/course.transformer";

import { CourseGeneralDetailsStep } from "@/components/admin-panel/course-management/add/steps/CourseGeneralDetailsStep";
import { CourseFeeDetailsStep } from "@/components/admin-panel/course-management/add/steps/CourseFeeDetailsStep";
import { CourseCommissionDetailsStep } from "@/components/admin-panel/course-management/add/steps/CourseCommissionDetailsStep";

const COURSE_STEPS = [
  { id: 1, label: "General Details" },
  { id: 2, label: "Fee Details" },
  { id: 3, label: "Commission Details" },
];

// Helper to serialize data consistently for comparison
const serializeForComparison = (data: unknown): string => {
  return JSON.stringify(data, (key, value) => {
    // Convert Date objects to ISO strings for consistent comparison
    if (value instanceof Date) {
      return value.toISOString();
    }

    return value;
  });
};

export default function EditCoursePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = useParams();
  const courseId = params.id as string;

  const { 
    generalDetails, 
    feeDetails, 
    commissionDetails, 
    resetForm,
    setMode,
    loadFormData,
  } = useCourseFormStore();

  const currentStep = Number(searchParams.get("step")) || 1;
  const [isLoading, setIsLoading] = useState(true);

  // Store original data as serialized strings for comparison
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

  // Load course data on mount - always fetch fresh from API
  useEffect(() => {
    const loadCourseData = async () => {
      setIsLoading(true);
      setHasLoadedOriginal(false);
      originalDataRef.current = null;

      try {
        const formData = await getCourseForEdit(courseId);

        setMode("edit", courseId);
        loadFormData(formData);

        // Store serialized original data for comparison
        originalDataRef.current = {
          generalDetails: serializeForComparison(formData.generalDetails),
          feeDetails: serializeForComparison(formData.feeDetails),
          commissionDetails: serializeForComparison(formData.commissionDetails),
        };
      } catch (error) {
        console.error("Failed to load course data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourseData();
  }, [courseId, setMode, loadFormData]);

  // Set hasLoadedOriginal after store has synced with loaded data
  useEffect(() => {
    if (!isLoading && originalDataRef.current && !hasLoadedOriginal) {
      // Verify the store data matches what we loaded before enabling dirty check
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
    }
  }, [isLoading, hasLoadedOriginal, generalDetails, feeDetails, commissionDetails]);

  // Check if form has been modified from original data
  const isFormDirty = useMemo(() => {
    if (!hasLoadedOriginal || !originalDataRef.current) return false;

    // Serialize current data for comparison (handles Date objects consistently)
    const currentGeneral = serializeForComparison(generalDetails);
    const currentFee = serializeForComparison(feeDetails);
    const currentCommission = serializeForComparison(commissionDetails);

    return (
      currentGeneral !== originalDataRef.current.generalDetails ||
      currentFee !== originalDataRef.current.feeDetails ||
      currentCommission !== originalDataRef.current.commissionDetails
    );
  }, [hasLoadedOriginal, generalDetails, feeDetails, commissionDetails]);

  const handleNext = () => {
    if (currentStep < 3) {
      const params = new URLSearchParams(searchParams.toString());

      params.set("step", (currentStep + 1).toString());
      router.push(`${pathname}?${params.toString()}`);
    } else {
      // Final step submission - reset form and redirect
      // TODO: Call update API here
      console.log("Updating course:", courseId);
      resetForm();
      router.push("/admin-panel/course-management");
    }
  };

  const handleDiscard = () => {
    if (isFormDirty) {
      setPendingNavigation("/admin-panel/course-management");
      setShowDiscardModal(true);
    } else {
      resetForm();
      router.push("/admin-panel/course-management");
    }
  };

  const handleBackClick = (href: string) => {
    // Only show warning when going back to course management (leaving the form entirely)
    if (href === "/admin-panel/course-management" && isFormDirty) {
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
    if (isLoading || !hasLoadedOriginal) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E60076]" />
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return <CourseGeneralDetailsStep onNext={handleNext} />;
      case 2:
        return <CourseFeeDetailsStep onNext={handleNext} />;
      case 3:
        return <CourseCommissionDetailsStep onNext={handleNext} />;
      default:
        return null;
    }
  };

  const isFirstStep = currentStep === 1;
  const backHref = isFirstStep ? "/admin-panel/course-management" : `${pathname}?step=${currentStep - 1}`;
  const backLabel = isFirstStep ? "Go to Course Management" : "Back";

  return (
    <div className="flex flex-col h-full overflow-auto" id="course-form-container">
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
        <FormStepper 
          currentStep={currentStep} 
          steps={COURSE_STEPS}
          scrollContainerId="course-form-container"
        />
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
            className={cn(
                currentStep === 3 ? cn(BUTTON_STYLES.primary.md, "text-white") : cn(BUTTON_STYLES.outline.md, "text-[#0F172B]"),
                "font-semibold text-sm leading-5",
                currentStep === 3 && !isFormDirty && "opacity-50 cursor-not-allowed"
            )}
            disabled={isLoading || (currentStep === 3 && !isFormDirty)}
         >
           {currentStep === 3 ? "Update Course" : "Go to Next Step"}
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
