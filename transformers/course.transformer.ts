import {
  type CourseGeneralDetailsValues,
  type CourseFeeDetailsValues,
  type CourseCommissionDetailsValues,
  type CourseFeeItem,
} from "@/schemas/course.schema";

// ==================== API Response Types (what comes from backend) ====================
export interface ApiCourseResponse {
  id: string;
  courseName: string;
  staffMembers: string[];
  assessment?: string;
  courseType?: string;
  startDate?: string; // ISO date string from API
  endDate?: string; // ISO date string from API
  certificates: string[];
  courseCategory: string;
  lecturer: string;
  courseLevel: string;
  language: string;
  lessonDuration?: string;
  hierarchy: string;
  shortDescription?: string;
  longDescription: string;
  coverImage: string;
  introductionVideo: string;

  // Fee Details
  pricingOption: "Paid" | "Free";
  courseFeeItems: Array<{
    id: string;
    amount: string;
    duration: string;
  }>;
  enableInstallments: boolean;
  numberOfInstallments?: number;

  // Commission Details
  referralType?: string;
  referralValue?: string;
  teamValue?: string;
  lecturerType?: string;
  lecturerValue?: string;
}

// ==================== Dummy Data for Testing ====================
export const dummyCourseData: ApiCourseResponse = {
  id: "course-001",
  courseName: "Digital Marketing Masterclass",
  staffMembers: ["kalpa", "saduni"],
  assessment: "Exam",
  courseType: "Diploma",
  startDate: "2026-02-01T00:00:00.000Z",
  endDate: "2026-06-30T00:00:00.000Z",
  certificates: ["UK", "Free"],
  courseCategory: "Online",
  lecturer: "Ruwan Perera",
  courseLevel: "Beginner",
  language: "English",
  lessonDuration: "2 Hours",
  hierarchy: "3 Tiers",
  shortDescription: "Learn digital marketing from scratch",
  longDescription: "This is a comprehensive digital marketing course covering SEO, SEM, and social media marketing.",
  coverImage: "",
  introductionVideo: "",

  // Fee Details
  pricingOption: "Paid",
  courseFeeItems: [
    { id: "fee-1", amount: "25000.00", duration: "1 Year" },
    { id: "fee-2", amount: "45000.00", duration: "2 Years" },
  ],
  enableInstallments: true,
  numberOfInstallments: 3,

  // Commission Details
  referralType: "Percentage",
  referralValue: "10",
  teamValue: "5",
  lecturerType: "Fixed",
  lecturerValue: "15000",
};

// ==================== Transform Functions ====================

/**
 * Transform API course response to General Details form values
 */
export function transformToCourseGeneralDetails(data: ApiCourseResponse): CourseGeneralDetailsValues {
  return {
    courseName: data.courseName,
    staffMembers: data.staffMembers,
    assessment: data.assessment || "",
    courseType: data.courseType || "",
    startDate: data.startDate ? new Date(data.startDate) : undefined,
    endDate: data.endDate ? new Date(data.endDate) : undefined,
    certificates: data.certificates,
    courseCategory: data.courseCategory,
    lecturer: data.lecturer,
    courseLevel: data.courseLevel,
    language: data.language,
    lessonDuration: data.lessonDuration || "",
    hierarchy: data.hierarchy,
    shortDescription: data.shortDescription || "",
    longDescription: data.longDescription,
    coverImage: data.coverImage,
    introductionVideo: data.introductionVideo,
  };
}

/**
 * Transform API course response to Fee Details form values
 */
export function transformToCourseFeeDetails(data: ApiCourseResponse): CourseFeeDetailsValues {
  const courseFeeItems: CourseFeeItem[] = data.courseFeeItems.map((item) => ({
    id: item.id,
    amount: item.amount,
    duration: item.duration,
  }));

  const calculateInstallments = () => {
    if (!data.enableInstallments || !data.numberOfInstallments || data.numberOfInstallments < 2) {
      return [];
    }

    const feeTotal = courseFeeItems.reduce((sum, item) => sum + parseFloat(item.amount), 0);

    if (feeTotal === 0) return [];

    const count = data.numberOfInstallments;
    const perInstallment = (feeTotal / count).toFixed(2);
    const ORDINALS = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth"];

    return Array.from({ length: count }).map((_, idx) => {
      const isLast = idx === count - 1;
      let amount = perInstallment;

      if (isLast) {
        const currentSum = parseFloat(perInstallment) * (count - 1);
        const remainder = feeTotal - currentSum;
        
        amount = remainder.toFixed(2);
      }

      const ordinal = ORDINALS[idx] || `${idx + 1}th`;

      return {
        id: `inst-${idx + 1}`, // Deterministic ID for transformer
        description: `${ordinal} Installment`,
        amount: amount,
      };
    });
  };

  return {
    pricingOption: data.pricingOption,
    courseFeeItems,
    enableInstallments: data.enableInstallments,
    numberOfInstallments: data.numberOfInstallments,
    installmentItems: calculateInstallments(),
  };
}

/**
 * Transform API course response to Commission Details form values
 */
export function transformToCourseCommissionDetails(data: ApiCourseResponse): CourseCommissionDetailsValues {
  return {
    referralType: data.referralType || "",
    referralValue: data.referralValue || "",
    teamValue: data.teamValue || "",
    lecturerType: data.lecturerType || "",
    lecturerValue: data.lecturerValue || "",
  };
}

/**
 * Transform full API course response to all form sections
 */
export function transformCourseToFormData(data: ApiCourseResponse) {
  return {
    generalDetails: transformToCourseGeneralDetails(data),
    feeDetails: transformToCourseFeeDetails(data),
    commissionDetails: transformToCourseCommissionDetails(data),
  };
}

// ==================== Reverse Transform (Form to API) ====================

/**
 * Transform form values back to API format for submission
 */
export function transformCourseFormToApiPayload(
  generalDetails: CourseGeneralDetailsValues,
  feeDetails: CourseFeeDetailsValues,
  commissionDetails: CourseCommissionDetailsValues
): Omit<ApiCourseResponse, "id"> {
  return {
    // General Details
    courseName: generalDetails.courseName,
    staffMembers: generalDetails.staffMembers,
    assessment: generalDetails.assessment,
    courseType: generalDetails.courseType,
    startDate: generalDetails.startDate?.toISOString(),
    endDate: generalDetails.endDate?.toISOString(),
    certificates: generalDetails.certificates,
    courseCategory: generalDetails.courseCategory,
    lecturer: generalDetails.lecturer,
    courseLevel: generalDetails.courseLevel,
    language: generalDetails.language,
    lessonDuration: generalDetails.lessonDuration,
    hierarchy: generalDetails.hierarchy,
    shortDescription: generalDetails.shortDescription,
    longDescription: generalDetails.longDescription,
    coverImage: generalDetails.coverImage || "",
    introductionVideo: generalDetails.introductionVideo || "",

    // Fee Details
    pricingOption: feeDetails.pricingOption,
    courseFeeItems: feeDetails.courseFeeItems,
    enableInstallments: feeDetails.enableInstallments,
    numberOfInstallments: feeDetails.numberOfInstallments,

    // Commission Details
    referralType: commissionDetails.referralType,
    referralValue: commissionDetails.referralValue,
    teamValue: commissionDetails.teamValue,
    lecturerType: commissionDetails.lecturerType,
    lecturerValue: commissionDetails.lecturerValue,
  };
}

// ==================== Mock API Functions ====================

/**
 * Mock function to fetch course by ID (simulates API call)
 * Replace with actual API call when endpoints are ready
 */
export async function fetchCourseById(courseId: string): Promise<ApiCourseResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Return dummy data (in real implementation, fetch from API)
  return {
    ...dummyCourseData,
    id: courseId,
  };
}

/**
 * Get course data for edit form
 */
export async function getCourseForEdit(courseId: string) {
  const apiData = await fetchCourseById(courseId);
  
  return transformCourseToFormData(apiData);
}
