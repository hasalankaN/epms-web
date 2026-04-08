import {
  type CourseGeneralDetailsValues,
  type CourseFeeDetailsValues,
  type CourseCommissionDetailsValues,
  type CourseFeeItem,
  type CourseInstallmentItem,
} from "@/schemas/course.schema";
import type { ApiCourseDetail } from "@/hooks/api/courses/useGetCourseById";
import type { UpdateCoursePayload } from "@/hooks/api/courses/useUpdateCourse";

const COURSE_TYPES = ["Workshop", "Certificate", "Diploma", "HND", "Degree", "School", "University", "Exam Prep"];
const LANGUAGES = ["Tamil", "Sinhala", "English"];
const LEVELS = ["Beginner", "Intermediate", "Advanced", "General"];

function mapOption(apiValue: string | null | undefined, options: string[]): string {
  if (!apiValue) return "";
  const normalized = apiValue.toLowerCase().replace(/_/g, " ");

  return options.find(o => o.toLowerCase() === normalized) || apiValue;
}

function calcTypeToFormType(apiType: string | null | undefined): string {
  if (!apiType) return "";
  if (apiType === "Percentage" || apiType === "PERCENTAGE") return "Percentage";
  if (apiType === "Fixed" || apiType === "FIXED") return "Fixed";

  return "";
}

/**
 * Transform the real API course detail response into the 3-step form data structure.
 */
export function transformApiCourseDetailToFormData(data: ApiCourseDetail): {
  generalDetails: Partial<CourseGeneralDetailsValues>;
  feeDetails: Partial<CourseFeeDetailsValues>;
  commissionDetails: Partial<CourseCommissionDetailsValues>;
} {
  // ── General Details ──────────────────────────────────────────────────────
  const generalDetails: Partial<CourseGeneralDetailsValues> = {
    courseName: data.general_details.name,
    staffMembers: (data.general_details.staff_members || []).map(m => m.id),
    assessment: data.general_details.has_assessment ? "Yes" : "No", // Frontend expects "Yes" or "No" often, check schema: actually optional string, but schema says it maps to strings. Schema does not have specific enum.
    courseType: mapOption(data.general_details.course_type, COURSE_TYPES),
    startDate: data.general_details.start_date ? new Date(data.general_details.start_date) : undefined,
    endDate: data.general_details.end_date ? new Date(data.general_details.end_date) : undefined,
    certificates: (data.general_details.certificates || []).map(c => c.id),
    courseCategory: data.general_details.category_id, // assuming it expects the ID
    lecturer: data.general_details.lecturer_id || "",
    courseLevel: mapOption(data.general_details.level, LEVELS),
    language: mapOption(data.general_details.language, LANGUAGES),
    lessonDuration: data.general_details.lesson_duration_hours ? String(data.general_details.lesson_duration_hours) : "",
    hierarchy: data.general_details.hierarchy_type || "3 Tiers",
    batchId: data.general_details.batch_id || "",
    shortDescription: data.general_details.short_description || "",
    longDescription: data.general_details.long_description || "",
    coverImage: data.general_details.cover_image_url || "",
    introductionVideo: data.general_details.intro_video_url || "",
  };

  // ── Fee Details ──────────────────────────────────────────────────────────
  const courseFeeItems: CourseFeeItem[] = (data.fee_details.fees || []).map((item, idx) => ({
    id: `fee-${idx}`,
    amount: String(item.amount),
    duration: String(item.duration_years),
  }));

  const enableInstallments = data.fee_details.installments_enabled ?? false;
  const numberOfInstallments = data.fee_details.number_of_installments ?? 0;

  const installmentItems: CourseInstallmentItem[] = (data.fee_details.installment_plans || []).map((item, idx) => ({
    id: `inst-${idx}`,
    description: item.description,
    amount: String(item.amount),
  }));

  const feeDetails: Partial<CourseFeeDetailsValues> = {
    pricingOption: data.fee_details.pricing_option || "Paid",
    courseFeeItems,
    enableInstallments,
    numberOfInstallments: enableInstallments && numberOfInstallments > 0 ? numberOfInstallments : undefined,
    installmentItems,
  };

  // ── Commission Details ────────────────────────────────────────────────────
  const comm = data.commission_details;

  const formatCommValue = (val: number | undefined | null) => {
    if (val === undefined || val === null || val === 0) return "";

    return String(val);
  };

  const commissionDetails: Partial<CourseCommissionDetailsValues> = {
    referralType: calcTypeToFormType(comm?.referral?.type),
    referralValue: formatCommValue(comm?.referral?.value),
    teamValue: formatCommValue(comm?.referral?.team_value),
    
    lecturerType: calcTypeToFormType(comm?.lecturer?.type),
    lecturerValue: formatCommValue(comm?.lecturer?.value),
    
    staffType: calcTypeToFormType(comm?.staff?.type),
    staffValue: formatCommValue(comm?.staff?.value),
    
    branchStaffType: calcTypeToFormType(comm?.branch_staff?.type),
    branchStaffValue: formatCommValue(comm?.branch_staff?.value),
  };

  return { generalDetails, feeDetails, commissionDetails };
}

// ==================== Form → Update API Payload ====================

/**
 * Converts the 3-step form state held in Zustand into the exact shape
 * required by the PUT /api/v1/courses/{id} endpoint.
 */
export function buildUpdateCoursePayload(
  generalDetails: Partial<CourseGeneralDetailsValues>,
  feeDetails: Partial<CourseFeeDetailsValues>,
  commissionDetails: Partial<CourseCommissionDetailsValues>
): UpdateCoursePayload {
  // ── Helpers ──────────────────────────────────────────────────────
  const formatDate = (d: Date | string | undefined): string | undefined => {
    if (!d) return undefined;
    const date = d instanceof Date ? d : new Date(d);

    return date.toISOString().split("T")[0]; // "YYYY-MM-DD"
  };

  const toNum = (val?: string) => parseFloat(val?.replace(/,/g, "") || "0") || 0;

  const commissionEntry = (type?: string, value?: string, teamValue?: string) => ({
    type: (type || "Fixed") as "Percentage" | "Fixed",
    value: toNum(value),
    team_value: toNum(teamValue),
  });

  // ── Mapping ──────────────────────────────────────────────────────
  return {
    general_details: {
      name: generalDetails.courseName || "",
      staff_member_ids: generalDetails.staffMembers || [],
      has_assessment: generalDetails.assessment === "Yes" || generalDetails.assessment === "yes",
      course_type: generalDetails.courseType || undefined,
      start_date: formatDate(generalDetails.startDate),
      end_date: formatDate(generalDetails.endDate),
      certificate_ids: generalDetails.certificates || [],
      category_id: generalDetails.courseCategory || "",
      lecturer_id: generalDetails.lecturer || "",
      level: generalDetails.courseLevel || "",
      language: generalDetails.language || "",
      lesson_duration_hours: generalDetails.lessonDuration ? Number(generalDetails.lessonDuration) : undefined,

      // hierarchy_type: generalDetails.hierarchy || "3 Tiers",
      // batch_id: generalDetails.batchId || undefined,
      short_description: generalDetails.shortDescription || undefined,
      long_description: generalDetails.longDescription || "",
      cover_image_url: generalDetails.coverImage || undefined,
      intro_video_url: generalDetails.introductionVideo || undefined,
    },
    fee_details: {
      pricing_option: (feeDetails.pricingOption || "Paid") as "Paid" | "Free",
      fees: feeDetails.pricingOption === "Paid"
        ? (feeDetails.courseFeeItems || []).map((item) => ({
            amount: toNum(item.amount),
            duration_years: Number(item.duration) || 1,
          }))
        : undefined,
      installments_enabled: feeDetails.enableInstallments ?? false,
      number_of_installments: feeDetails.numberOfInstallments,
      installment_plans: (feeDetails.installmentItems || []).map((item) => ({
        description: item.description,
        amount: toNum(item.amount),
      })),
    },
    commission_details: {
      referral: commissionEntry(commissionDetails.referralType, commissionDetails.referralValue, commissionDetails.teamValue),
      lecturer: commissionEntry(commissionDetails.lecturerType, commissionDetails.lecturerValue, "0"),
      staff: commissionEntry(commissionDetails.staffType, commissionDetails.staffValue, "0"),
      branch_staff: commissionEntry(commissionDetails.branchStaffType, commissionDetails.branchStaffValue, "0"),
    },
  };
}
