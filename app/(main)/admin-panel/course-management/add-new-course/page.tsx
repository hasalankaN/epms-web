"use client";

import React, { useState, useMemo, useEffect } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { ArrowRightCircle } from "lucide-react";

import { BackButton } from "@/components/common/BackButton";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import { FormStepper } from "@/components/common/FormStepper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BUTTON_STYLES } from "@/lib/constants/theme";
import { useCourseFormStore } from "@/store/courseFormStore";
import { defaultCourseGeneralDetailsValues, defaultCourseCommissionDetailsValues } from "@/schemas/course.schema";

import { CourseGeneralDetailsStep } from "@/components/admin-panel/course-management/add/steps/CourseGeneralDetailsStep";
import { CourseFeeDetailsStep } from "@/components/admin-panel/course-management/add/steps/CourseFeeDetailsStep";
import { CourseCommissionDetailsStep } from "@/components/admin-panel/course-management/add/steps/CourseCommissionDetailsStep";
import { useCreateCourse, type CreateCoursePayload } from "@/hooks/api/courses/useCreateCourse";

const COURSE_STEPS = [
  { id: 1, label: "General Details" },
  { id: 2, label: "Fee Details" },
  { id: 3, label: "Commission Details" },
];

export default function AddCoursePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { mode, generalDetails, feeDetails, commissionDetails, resetForm } = useCourseFormStore();
  const { mutateAsync: createCourse, isPending: isCreating } = useCreateCourse();

  const currentStep = Number(searchParams.get("step")) || 1;

  // Track if user has unsaved changes
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  // If we came directly from the "Edit" page via SPA routing, the in-memory store
  // still holds the edit data. We need to completely wipe it and restore the "add"
  // draft (if any) from localStorage directly, ignoring the current memory state.
  useEffect(() => {
    if (mode === "edit") {
      useCourseFormStore.getState().clearEditAndRestoreAdd();
    }
  }, [mode]);

  // Check if form has any data filled
  const isFormDirty = useMemo(() => {
    const hasGeneralChanges =
      generalDetails.courseName !== defaultCourseGeneralDetailsValues.courseName ||
      (generalDetails.staffMembers && generalDetails.staffMembers.length > 0) ||
      generalDetails.assessment !== defaultCourseGeneralDetailsValues.assessment ||
      generalDetails.courseType !== defaultCourseGeneralDetailsValues.courseType ||
      generalDetails.startDate !== undefined ||
      generalDetails.endDate !== undefined ||
      (generalDetails.certificates && generalDetails.certificates.length > 0) ||
      generalDetails.courseCategory !== defaultCourseGeneralDetailsValues.courseCategory ||
      generalDetails.lecturer !== defaultCourseGeneralDetailsValues.lecturer ||
      generalDetails.courseLevel !== defaultCourseGeneralDetailsValues.courseLevel ||
      generalDetails.language !== defaultCourseGeneralDetailsValues.language ||
      generalDetails.lessonDuration !== defaultCourseGeneralDetailsValues.lessonDuration ||
      generalDetails.hierarchy !== defaultCourseGeneralDetailsValues.hierarchy ||
      generalDetails.shortDescription !== defaultCourseGeneralDetailsValues.shortDescription ||
      generalDetails.longDescription !== defaultCourseGeneralDetailsValues.longDescription ||
      generalDetails.coverImage !== defaultCourseGeneralDetailsValues.coverImage ||
      generalDetails.introductionVideo !== defaultCourseGeneralDetailsValues.introductionVideo;

    const hasFeeChanges =
      (feeDetails.courseFeeItems && feeDetails.courseFeeItems.length > 0) ||
      feeDetails.enableInstallments === true;

    const hasCommissionChanges =
      commissionDetails.referralType !== defaultCourseCommissionDetailsValues.referralType ||
      commissionDetails.referralValue !== defaultCourseCommissionDetailsValues.referralValue ||
      commissionDetails.lecturerType !== defaultCourseCommissionDetailsValues.lecturerType ||
      commissionDetails.lecturerValue !== defaultCourseCommissionDetailsValues.lecturerValue;

    return hasGeneralChanges || hasFeeChanges || hasCommissionChanges;
  }, [generalDetails, feeDetails, commissionDetails]);

  // Build the API payload from the Zustand store
  const buildPayload = (): CreateCoursePayload => {
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
        name: g.courseName || "",
        staff_members: g.staffMembers || [],
        has_assessment: g.assessment === "Yes",
        course_type: g.courseType || undefined,
        start_date: g.startDate ? new Date(g.startDate).toISOString().split("T")[0] : undefined,
        end_date: g.endDate ? new Date(g.endDate).toISOString().split("T")[0] : undefined,
        certificates: g.certificates || [],
        category_id: g.courseCategory || "",
        lecturer_id: g.lecturer || "",
        level: g.courseLevel || "",
        language: g.language || "",
        lesson_duration_hours: g.lessonDuration ? Number(g.lessonDuration) : undefined,
        hierarchy_type: g.hierarchy || "3 Tiers",
        batch_id: g.batchId || undefined,
        short_description: g.shortDescription || undefined,
        long_description: g.longDescription || "",
        cover_image_url: g.coverImage || undefined,
        intro_video_url: g.introductionVideo || undefined,
      },
      fee_details: {
        pricing_option: (f.pricingOption || "Paid") as "Paid" | "Free",
        fees: f.pricingOption === "Paid"
          ? f.courseFeeItems?.map((item) => ({
              amount: toNum(item.amount),
              duration_years: Number(item.duration) || 1,
            }))
          : undefined,
        installments_enabled: f.enableInstallments,
        number_of_installments: f.numberOfInstallments,
        installment_plans: f.installmentItems?.map((item) => ({
          description: item.description,
          amount: toNum(item.amount),
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

        await createCourse(payload);
        resetForm();
        router.push("/admin-panel/course-management");
      } catch {
        // Error already handled by the hook's onError toast
      }
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
    if (mode === "edit") {
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
          disabled={isCreating}
          className={cn(
            currentStep === 3 ? cn(BUTTON_STYLES.primary.md, "text-white") : cn(BUTTON_STYLES.outline.md, "text-[#0F172B]"),
            "font-semibold text-sm leading-5",
            isCreating && "opacity-70 cursor-not-allowed"
          )}
        >
          {currentStep === 3 ? (isCreating ? "Creating Course..." : "Create Course") : "Go to Next Step"}
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
