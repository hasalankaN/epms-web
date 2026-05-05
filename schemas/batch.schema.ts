import * as z from "zod";

// ==================== Step 1: General Details Schema ====================
export const scheduleItemSchema = z.object({
  day: z.string().min(1, "Day is required"),
  time: z.string().min(1, "Time is required"),
});

export const generalDetailsSchema = z.object({
  batchName: z.string().min(1, "Batch name is required"),
  branch: z.string().min(1, "Branch is required"),
  language: z.string().min(1, "Language is required"),
  batchType: z.string().min(1, "Batch type is required"),
  staffMembers: z.array(z.string()).min(1, "At least one staff member is required"),
  assignment: z.string().optional(),
  batchCategory: z.string().min(1, "Batch category is required"),
  startDate: z.date({ required_error: "Start date is required" }),
  certificates: z.array(z.string()).min(1, "Certificate is required"),
  batchStatus: z.string().min(1, "Batch status is required"),
  endDate: z.date({ required_error: "End date is required" }),
  lecturer: z.string().min(1, "Lecturer is required"),
  batchLevel: z.string().min(1, "Batch level is required"),
  hierarchy: z.string().min(1, "Hierarchy is required"),
  lessonDuration: z.string().optional(),
  description: z.string().optional(),
  coverImage: z.string().min(1, "Cover image is required"),
  schedules: z.array(scheduleItemSchema).min(1, "At least one schedule is required"),
});

export type GeneralDetailsValues = z.infer<typeof generalDetailsSchema>;

// ... (fee items stay same)
export const feeItemSchema = z.object({
  id: z.string(),
  amount: z.string().min(1, "Amount is required"),
  description: z.string().min(1, "Description is required"),
});

export const additionalFeeItemSchema = z.object({
  id: z.string(),
  amount: z.string().min(1, "Amount is required"),
  duration: z.string().min(1, "Duration is required"),
  description: z.string().min(1, "Description is required"),
});

export const installmentItemSchema = z.object({
  id: z.string(),
  description: z.string(),
  amount: z.string(),
});

export const feeDetailsSchema = z.object({
  pricingOption: z.enum(["Paid", "Free"]),
  baseFeeItems: z.array(feeItemSchema),
  enableInstallments: z.boolean(),
  numberOfInstallments: z.coerce.number().optional(),
  installmentItems: z.array(installmentItemSchema).optional(),
  additionalFeeItems: z.array(additionalFeeItemSchema),
}).refine(
  (data) => {
    // If pricingOption is "Paid", baseFeeItems must have at least one item
    if (data.pricingOption === "Paid") {
      return data.baseFeeItems.length > 0;
    }

    return true;
  },
  {
    message: "At least one base course fee is required for paid batches",
    path: ["baseFeeItems"],
  }
).refine(
  (data) => {
    // If installments are enabled, numberOfInstallments is required
    if (data.enableInstallments) {
      return data.numberOfInstallments !== undefined && data.numberOfInstallments !== null;
    }
    
    return true;
  },
  {
    message: "Number of installments is required when installment payment is enabled",
    path: ["numberOfInstallments"],
  }
).refine(
  (data) => {
    // If installments are enabled, numberOfInstallments must be between 2 and 5
    if (data.enableInstallments && data.numberOfInstallments !== undefined) {
      return data.numberOfInstallments >= 2 && data.numberOfInstallments <= 5;
    }
    
    return true;
  },
  {
    message: "Number of installments must be between 2 and 5",
    path: ["numberOfInstallments"],
  }
);

export type FeeDetailsValues = z.infer<typeof feeDetailsSchema>;
export type FeeItem = z.infer<typeof feeItemSchema>;
export type AdditionalFeeItem = z.infer<typeof additionalFeeItemSchema>;
export type InstallmentItem = z.infer<typeof installmentItemSchema>;

// ==================== Step 3: Commission Details Schema ====================
const validatePercentage = (type: unknown, value: unknown, ctx: z.RefinementCtx, path: string[]) => {
  if (type === "Percentage" && typeof value === "string") {
    const num = Number(value.replace(/,/g, ""));

    if (!isNaN(num) && num > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Percentage cannot exceed 100",
        path,
      });
    }
  }
};

export const commissionDetailsSchema = z.object({
  referralType: z.string().optional(),
  referralValue: z.string().optional(),
  teamValue: z.string().optional(),
  lecturerType: z.string().optional(),
  lecturerValue: z.string().optional(),
  staffType: z.string().optional(),
  staffValue: z.string().optional(),
  branchStaffType: z.string().optional(),
  branchStaffValue: z.string().optional(),
}).superRefine((data, ctx) => {
  validatePercentage(data.referralType, data.referralValue, ctx, ["referralValue"]);
  validatePercentage(data.referralType, data.teamValue, ctx, ["teamValue"]);
  validatePercentage(data.lecturerType, data.lecturerValue, ctx, ["lecturerValue"]);
  validatePercentage(data.staffType, data.staffValue, ctx, ["staffValue"]);
  validatePercentage(data.branchStaffType, data.branchStaffValue, ctx, ["branchStaffValue"]);
});

export type CommissionDetailsValues = z.infer<typeof commissionDetailsSchema>;

// ==================== Combined Batch Schema ====================
export const batchSchema = z.object({
  generalDetails: generalDetailsSchema,
  feeDetails: feeDetailsSchema,
  commissionDetails: commissionDetailsSchema,
});

export type BatchFormValues = z.infer<typeof batchSchema>;

// ==================== Default Values ====================
export const defaultGeneralDetailsValues: Partial<GeneralDetailsValues> = {
  batchName: "",
  branch: "",
  language: "",
  batchType: "",
  staffMembers: [],
  assignment: "yes",
  batchCategory: "",
  batchStatus: "",
  lecturer: "",
  batchLevel: "",
  hierarchy: "3 Tiers",
  lessonDuration: "",
  description: "",
  coverImage: "",
  certificates: [],
  schedules: [{ day: "", time: "" }],
};

export const defaultFeeDetailsValues: Partial<FeeDetailsValues> = {
  pricingOption: "Paid",
  baseFeeItems: [],
  enableInstallments: false,
  numberOfInstallments: undefined,
  installmentItems: [],
  additionalFeeItems: [],
};

export const defaultCommissionDetailsValues: Partial<CommissionDetailsValues> = {
  referralType: "",
  referralValue: "",
  teamValue: "",
  lecturerType: "",
  lecturerValue: "",
  staffType: "",
  staffValue: "",
  branchStaffType: "",
  branchStaffValue: "",
};
