import {
  type GeneralDetailsValues,
  type FeeDetailsValues,
  type CommissionDetailsValues,
  type FeeItem,
  type AdditionalFeeItem,
} from "@/schemas/batch.schema";
import type { ApiBatchDetail, ApiBatchCommissionRule } from "@/hooks/api/batches/useGetBatchById";

// ==================== Legacy API Response Types (kept for backwards compat) ====================

export interface ApiBatchResponse {
  id: string;
  batchName: string;
  branch: string;
  language: string;
  batchType: string;
  staffMembers: string[];
  assignment?: string;
  batchCategory: string;
  startDate: string;
  endDate: string;
  certificates: string[];
  batchStatus?: string;
  lecturer: string;
  batchLevel?: string;
  hierarchy?: string;
  lessonDuration?: string;
  description?: string;
  coverImage?: string;

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
    description?: string;
  }>;

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
  pricingOption: "Paid",
  baseFeeItems: [
    { id: "fee-1", amount: "25000.00", description: "Course Fee" },
    { id: "fee-2", amount: "5000.00", description: "Registration Fee" },
  ],
  enableInstallments: true,
  numberOfInstallments: 3,
  additionalFeeItems: [
    { id: "add-1", amount: "2500.00", duration: "Per Month", description: "" },
  ],
  referralType: "Percentage",
  referralValue: "10",
  teamValue: "5",
  lecturerType: "Fixed",
  lecturerValue: "15000",
};

// ==================== Legacy Transform Functions ====================

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
    description: item.description || "",
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
        id: `inst-${idx + 1}`,
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

export function transformToCommissionDetails(data: ApiBatchResponse): CommissionDetailsValues {
  return {
    referralType: data.referralType || "",
    referralValue: data.referralValue || "",
    teamValue: data.teamValue || "",
    lecturerType: data.lecturerType || "",
    lecturerValue: data.lecturerValue || "",
    staffType: "",
    staffValue: "",
    branchStaffType: "",
    branchStaffValue: "",
  };
}

export function transformBatchToFormData(data: ApiBatchResponse) {
  return {
    generalDetails: transformToGeneralDetails(data),
    feeDetails: transformToFeeDetails(data),
    commissionDetails: transformToCommissionDetails(data),
  };
}

// ==================== Real API Transformer (ApiBatchDetail → Form) ====================

const BATCH_TYPES = ["Workshop", "Certificate", "Diploma", "HND", "Degree", "School", "University", "Exam Prep"];
const LANGUAGES = ["Tamil", "Sinhala", "English"];
const CATEGORIES = ["Online", "Offline", "Hybrid"];
const STATUSES = ["Active", "Upcoming", "Completed", "Inactive"];

function mapOption(apiValue: string | null | undefined, options: string[]): string {
  if (!apiValue) return "";
  const normalized = apiValue.toLowerCase().replace(/_/g, " ");
  
  return options.find(o => o.toLowerCase() === normalized) || apiValue;
}

function findRule(
  rules: ApiBatchCommissionRule[],
  target: string,
  scope: string
): ApiBatchCommissionRule | undefined {
  return rules.find((r) => r.commission_target === target && r.commission_scope === scope);
}

function calcTypeToFormType(calculationType: string): string {
  return calculationType === "PERCENTAGE" ? "Percentage" : "Fixed";
}

/**
 * Transform the real API batch detail response into the 3-step form data structure.
 */
export function transformApiBatchDetailToFormData(data: ApiBatchDetail): {
  generalDetails: Partial<GeneralDetailsValues>;
  feeDetails: Partial<FeeDetailsValues>;
  commissionDetails: Partial<CommissionDetailsValues>;
} {
  // ── General Details ──────────────────────────────────────────────────────
  const tierCount = data.hierarchy?.tier_count ?? data.tier_count ?? 3;

  const generalDetails: Partial<GeneralDetailsValues> = {
    batchName: data.name,
    branch: data.branch_id,
    language: mapOption(data.language, LANGUAGES),
    batchType: mapOption(data.type, BATCH_TYPES),
    staffMembers: [],
    assignment: "yes",
    batchCategory: mapOption(data.category, CATEGORIES),
    startDate: new Date(data.start_date),
    endDate: new Date(data.end_date),
    certificates: [],
    batchStatus: mapOption(data.status, STATUSES),
    lecturer: data.lecturer_id || "",
    batchLevel: "", // Backend does not return level currently
    hierarchy: `${tierCount} Tiers`,
    lessonDuration: data.lesson_duration,
    description: data.description || "",
    coverImage: data.cover_image_url || "",
  };

  // ── Fee Details ──────────────────────────────────────────────────────────
  const baseFeeItems: FeeItem[] = (data.feeItems || []).map((item) => ({
    id: item.id,
    amount: item.amount,
    description: item.label,
  }));

  const installmentCount = data.installment?.installment_count ?? 0;
  const enableInstallments = installmentCount >= 2;

  const calculateInstallments = (): Array<{ id: string; description: string; amount: string }> => {
    if (!enableInstallments || installmentCount < 2) return [];

    const baseTotal = baseFeeItems.reduce((sum, item) => sum + parseFloat(item.amount), 0);

    if (baseTotal === 0) return [];

    const per = (baseTotal / installmentCount).toFixed(2);
    const ORDINALS = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth"];

    return Array.from({ length: installmentCount }).map((_, idx) => {
      const isLast = idx === installmentCount - 1;
      let amount = per;

      if (isLast) {
        const remainder = baseTotal - parseFloat(per) * (installmentCount - 1);

        amount = remainder.toFixed(2);
      }

      return {
        id: `inst-${idx + 1}`,
        description: `${ORDINALS[idx] ?? `${idx + 1}th`} Installment`,
        amount,
      };
    });
  };

  const additionalFeeItems: AdditionalFeeItem[] = (data.extendedAccessOptions || []).map((opt) => ({
    id: opt.id,
    amount: opt.price,
    duration: String(opt.years),
    description: `${opt.years}-year extended access`,
  }));

  const feeDetails: Partial<FeeDetailsValues> = {
    pricingOption: "Paid",
    baseFeeItems,
    enableInstallments,
    numberOfInstallments: enableInstallments ? installmentCount : undefined,
    installmentItems: calculateInstallments(),
    additionalFeeItems,
  };

  // ── Commission Details ────────────────────────────────────────────────────
  const rules = data.commission?.rules ?? [];

  const referralDirect = findRule(rules, "REFERRAL", "DIRECT");
  const referralTeam = findRule(rules, "REFERRAL", "TEAM");
  const lecturerRule = findRule(rules, "LECTURER", "PER_ENROLLMENT");
  const staffRule = findRule(rules, "STAFF", "PER_ENROLLMENT");
  const branchStaffRule = findRule(rules, "STAFF", "PER_BRANCH");

  const commissionDetails: Partial<CommissionDetailsValues> = {
    referralType: referralDirect ? calcTypeToFormType(referralDirect.calculation_type) : "",
    referralValue: referralDirect?.value ?? "",
    teamValue: referralTeam?.value ?? "",
    lecturerType: lecturerRule ? calcTypeToFormType(lecturerRule.calculation_type) : "",
    lecturerValue: lecturerRule?.value ?? "",
    staffType: staffRule ? calcTypeToFormType(staffRule.calculation_type) : "",
    staffValue: staffRule?.value ?? "",
    branchStaffType: branchStaffRule ? calcTypeToFormType(branchStaffRule.calculation_type) : "",
    branchStaffValue: branchStaffRule?.value ?? "",
  };

  return { generalDetails, feeDetails, commissionDetails };
}

// ==================== Reverse Transform (Form to API) ====================

export function transformFormToApiPayload(
  generalDetails: GeneralDetailsValues,
  feeDetails: FeeDetailsValues,
  commissionDetails: CommissionDetailsValues
): Omit<ApiBatchResponse, "id"> {
  return {
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
    pricingOption: feeDetails.pricingOption,
    baseFeeItems: feeDetails.baseFeeItems,
    enableInstallments: feeDetails.enableInstallments,
    numberOfInstallments: feeDetails.numberOfInstallments,
    additionalFeeItems: feeDetails.additionalFeeItems,
    referralType: commissionDetails.referralType,
    referralValue: commissionDetails.referralValue,
    teamValue: commissionDetails.teamValue,
    lecturerType: commissionDetails.lecturerType,
    lecturerValue: commissionDetails.lecturerValue,
  };
}

// ==================== Mock API Functions ====================

export async function fetchBatchById(batchId: string): Promise<ApiBatchResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return { ...dummyBatchData, id: batchId };
}

export async function getBatchForEdit(batchId: string) {
  const apiData = await fetchBatchById(batchId);

  return transformBatchToFormData(apiData);
}
