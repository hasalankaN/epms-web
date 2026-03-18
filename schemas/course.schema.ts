import * as z from "zod";

// ==================== Step 1: General Details Schema ====================
export const courseGeneralDetailsSchema = z.object({
  courseName: z.string().min(1, "Course name is required"),
  staffMembers: z.array(z.string()).min(1, "At least one staff member is required"),
  assessment: z.string().optional(),
  courseType: z.string().optional(),
  startDate: z.date().optional(),
  certificates: z.array(z.string()).min(1, "Certificate is required"),
  courseCategory: z.string().min(1, "Course category is required"),
  endDate: z.date().optional(),
  lecturer: z.string().min(1, "Lecturer is required"),
  courseLevel: z.string().min(1, "Course level is required"),
  language: z.string().min(1, "Language is required"),
  lessonDuration: z.string().optional(),
  hierarchy: z.string().min(1, "Hierarchy is required"),
  subject: z.string().optional(),
  shortDescription: z.string().optional(),
  longDescription: z.string().min(1, "Course long description is required"),
  coverImage: z.string().optional(), // TODO: Make required after upload API integration
  introductionVideo: z.string().optional(), // TODO: Make required after upload API integration
});

export type CourseGeneralDetailsValues = z.infer<typeof courseGeneralDetailsSchema>;

// ==================== Step 2: Fee Details Schema ====================
export const courseFeeItemSchema = z.object({
  id: z.string(),
  amount: z.string().min(1, "Amount is required"),
  duration: z.string().min(1, "Duration is required"),
});

export const courseInstallmentItemSchema = z.object({
  id: z.string(),
  description: z.string(),
  amount: z.string(),
});

export const courseFeeDetailsSchema = z.object({
  pricingOption: z.enum(["Paid", "Free"]),
  courseFeeItems: z.array(courseFeeItemSchema),
  enableInstallments: z.boolean(),
  numberOfInstallments: z.coerce.number().optional(),
  installmentItems: z.array(courseInstallmentItemSchema).optional(),
}).refine(
  (data) => {
    // If pricingOption is "Paid", courseFeeItems must have at least one item
    if (data.pricingOption === "Paid") {
      return data.courseFeeItems.length > 0;
    }

    return true;
  },
  {
    message: "At least one course fee is required for paid courses",
    path: ["courseFeeItems"],
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

export type CourseFeeDetailsValues = z.infer<typeof courseFeeDetailsSchema>;
export type CourseFeeItem = z.infer<typeof courseFeeItemSchema>;
export type CourseInstallmentItem = z.infer<typeof courseInstallmentItemSchema>;

// ==================== Step 3: Commission Details Schema ====================
export const courseCommissionDetailsSchema = z.object({
  referralType: z.string().optional(),
  referralValue: z.string().optional(),
  teamValue: z.string().optional(),
  lecturerType: z.string().optional(),
  lecturerValue: z.string().optional(),
  staffType: z.string().optional(),
  staffValue: z.string().optional(),
  branchStaffType: z.string().optional(),
  branchStaffValue: z.string().optional(),
});

export type CourseCommissionDetailsValues = z.infer<typeof courseCommissionDetailsSchema>;

// ==================== Combined Course Schema ====================
export const courseSchema = z.object({
  generalDetails: courseGeneralDetailsSchema,
  feeDetails: courseFeeDetailsSchema,
  commissionDetails: courseCommissionDetailsSchema,
});

export type CourseFormValues = z.infer<typeof courseSchema>;

// ==================== Default Values ====================
export const defaultCourseGeneralDetailsValues: Partial<CourseGeneralDetailsValues> = {
  courseName: "",
  staffMembers: [],
  assessment: "",
  courseType: "",
  certificates: [],
  courseCategory: "",
  lecturer: "",
  courseLevel: "",
  language: "",
  lessonDuration: "",
  hierarchy: "3 Tiers",
  subject: "",
  shortDescription: "",
  longDescription: "",
  coverImage: "",
  introductionVideo: "",
};

export const defaultCourseFeeDetailsValues: Partial<CourseFeeDetailsValues> = {
  pricingOption: "Paid",
  courseFeeItems: [],
  enableInstallments: false,
  numberOfInstallments: undefined,
  installmentItems: [],
};

export const defaultCourseCommissionDetailsValues: Partial<CourseCommissionDetailsValues> = {
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
