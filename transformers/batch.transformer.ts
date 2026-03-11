import {
  type GeneralDetailsValues,
  type FeeDetailsValues,
  type CommissionDetailsValues,
  type FeeItem,
  type AdditionalFeeItem,
} from "@/schemas/batch.schema";

// ==================== API Response Types (what comes from backend) ====================
export interface ApiBatchResponse {
  id: string;
  batchName: string;
  branch: string;
  language: string;
  batchType: string;
  staffMembers: string[];
  assignment?: string;
  batchCategory: string;
  startDate: string; // ISO date string from API
  endDate: string; // ISO date string from API
  certificates: string[];
  batchStatus?: string;
  lecturer: string;
  batchLevel?: string;
  hierarchy?: string;
  lessonDuration?: string;
  description?: string;
  coverImage?: string;

  // Fee Details
  pricingOption: "Paid" | "Free";
  baseFeeItems: Array<{
    id: string;
    amount: string;
    description: string;
  }>;
  enableInstallments: boolean;
  numberOfInstallments?: number;
  additionalFeeItems: Array<{
    id: string;
    amount: string;
    duration: string;
  }>;

  // Commission Details
  referralType?: string;
  referralValue?: string;
  teamValue?: string;
  lecturerType?: string;
  lecturerValue?: string;
}

// ==================== Dummy Data for Testing ====================
export const dummyBatchData: ApiBatchResponse = {
  id: "batch-001",
  batchName: "Digital Marketing Batch 2026",
  branch: "Main",
  language: "English",
  batchType: "Diploma",
  staffMembers: ["kalpa", "saduni"],
  assignment: "Exam",
  batchCategory: "Online",
  startDate: "2026-02-01T00:00:00.000Z",
  endDate: "2026-06-30T00:00:00.000Z",
  certificates: ["UK", "Free"],
  batchStatus: "Ongoing",
  lecturer: "Ruwan Perera",
  batchLevel: "Beginner",
  hierarchy: "4 Tiers",
  lessonDuration: "2 Hours",
  description: "This is a comprehensive digital marketing course covering SEO, SEM, and social media marketing.",
  coverImage: "",

  // Fee Details
  pricingOption: "Paid",
  baseFeeItems: [
    { id: "fee-1", amount: "25000.00", description: "Course Fee" },
    { id: "fee-2", amount: "5000.00", description: "Registration Fee" },
  ],
  enableInstallments: true,
  numberOfInstallments: 3,
  additionalFeeItems: [
    { id: "add-1", amount: "2500.00", duration: "Per Month" },
  ],

  // Commission Details
  referralType: "Percentage",
  referralValue: "10",
  teamValue: "5",
  lecturerType: "Fixed",
  lecturerValue: "15000",
};

// ==================== Transform Functions ====================

/**
 * Transform API batch response to General Details form values
 */
export function transformToGeneralDetails(data: ApiBatchResponse): GeneralDetailsValues {
  return {
    batchName: data.batchName,
    branch: data.branch,
    language: data.language,
    batchType: data.batchType,
    staffMembers: data.staffMembers,
    assignment: data.assignment || "",
    batchCategory: data.batchCategory,
    startDate: new Date(data.startDate),
    endDate: new Date(data.endDate),
    certificates: data.certificates,
    batchStatus: data.batchStatus || "",
    lecturer: data.lecturer,
    batchLevel: data.batchLevel || "",
    hierarchy: data.hierarchy || "3 Tiers",
    lessonDuration: data.lessonDuration || "",
    description: data.description || "",
    coverImage: data.coverImage || "",
  };
}

/**
 * Transform API batch response to Fee Details form values
 */
export function transformToFeeDetails(data: ApiBatchResponse): FeeDetailsValues {
  const baseFeeItems: FeeItem[] = data.baseFeeItems.map((item) => ({
    id: item.id,
    amount: item.amount,
    description: item.description,
  }));

  const additionalFeeItems: AdditionalFeeItem[] = data.additionalFeeItems.map((item) => ({
    id: item.id,
    amount: item.amount,
    duration: item.duration,
  }));

  const calculateInstallments = () => {
    if (!data.enableInstallments || !data.numberOfInstallments || data.numberOfInstallments < 2) {
      return [];
    }

    const baseTotal = baseFeeItems.reduce((sum, item) => sum + parseFloat(item.amount), 0);

    if (baseTotal === 0) return [];

    const count = data.numberOfInstallments;
    const perInstallment = (baseTotal / count).toFixed(2);
    const ORDINALS = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth"];

    return Array.from({ length: count }).map((_, idx) => {
      const isLast = idx === count - 1;
      let amount = perInstallment;

      if (isLast) {
        const currentSum = parseFloat(perInstallment) * (count - 1);
        const remainder = baseTotal - currentSum;
        
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
    baseFeeItems,
    enableInstallments: data.enableInstallments,
    numberOfInstallments: data.numberOfInstallments,
    installmentItems: calculateInstallments(),
    additionalFeeItems,
  };
}

/**
 * Transform API batch response to Commission Details form values
 */
export function transformToCommissionDetails(data: ApiBatchResponse): CommissionDetailsValues {
  return {
    referralType: data.referralType || "",
    referralValue: data.referralValue || "",
    teamValue: data.teamValue || "",
    lecturerType: data.lecturerType || "",
    lecturerValue: data.lecturerValue || "",
  };
}

/**
 * Transform full API batch response to all form sections
 */
export function transformBatchToFormData(data: ApiBatchResponse) {
  return {
    generalDetails: transformToGeneralDetails(data),
    feeDetails: transformToFeeDetails(data),
    commissionDetails: transformToCommissionDetails(data),
  };
}

// ==================== Reverse Transform (Form to API) ====================

/**
 * Transform form values back to API format for submission
 */
export function transformFormToApiPayload(
  generalDetails: GeneralDetailsValues,
  feeDetails: FeeDetailsValues,
  commissionDetails: CommissionDetailsValues
): Omit<ApiBatchResponse, "id"> {
  return {
    // General Details
    batchName: generalDetails.batchName,
    branch: generalDetails.branch,
    language: generalDetails.language,
    batchType: generalDetails.batchType,
    staffMembers: generalDetails.staffMembers,
    assignment: generalDetails.assignment,
    batchCategory: generalDetails.batchCategory,
    startDate: generalDetails.startDate.toISOString(),
    endDate: generalDetails.endDate.toISOString(),
    certificates: generalDetails.certificates,
    batchStatus: generalDetails.batchStatus,
    lecturer: generalDetails.lecturer,
    batchLevel: generalDetails.batchLevel,
    hierarchy: generalDetails.hierarchy,
    lessonDuration: generalDetails.lessonDuration,
    description: generalDetails.description,
    coverImage: generalDetails.coverImage,

    // Fee Details
    pricingOption: feeDetails.pricingOption,
    baseFeeItems: feeDetails.baseFeeItems,
    enableInstallments: feeDetails.enableInstallments,
    numberOfInstallments: feeDetails.numberOfInstallments,
    additionalFeeItems: feeDetails.additionalFeeItems,

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
 * Mock function to fetch batch by ID (simulates API call)
 * Replace with actual API call when endpoints are ready
 */
export async function fetchBatchById(batchId: string): Promise<ApiBatchResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Return dummy data (in real implementation, fetch from API)
  return {
    ...dummyBatchData,
    id: batchId,
  };
}

/**
 * Get batch data for edit form
 */
export async function getBatchForEdit(batchId: string) {
  const apiData = await fetchBatchById(batchId);
  
  return transformBatchToFormData(apiData);
}
