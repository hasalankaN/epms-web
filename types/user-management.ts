/**
 * Student status options
 */
export type StudentStatus = "ACTIVE" | "INACTIVE" | "DROPPED" | "COMPLETED" | "PENDING_VERIFICATION";

/**
 * Payment status options
 */
export type PaymentStatus = "Pending" | "Completed";

/**
 * Certificate status options
 */
export type CertificateStatus = "Pending" | "Completed";

/**
 * Salary status options (shared by Lecturer + Staff)
 */
export type SalaryStatus = "OVER_DUE" | "PENDING" | "PAID" | "NO_RECORD";

/**
 * Member status options (shared by Lecturer + Staff)
 */
export type MemberStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

/**
 * Student data structure for the table
 */
export interface StudentDataType {
  id: string;
  date: string;
  idNo: string;
  name: string;
  district: string;
  phone: string;
  whatsApp: string;
  paymentStatus: PaymentStatus;
  paymentPendingAmount: string;
  certificateStatus: CertificateStatus;
  pendingCertificates: number;
  commissions: string;
  studentStatus: StudentStatus;
}

/**
 * Lecturer data structure for the table
 */
export interface LecturerDataType {
  id: string;
  regDate: string;
  idNo: string;
  name: string;
  phone: string;
  whatsApp: string;
  email: string;
  salaryType: string;
  salaryStatus: SalaryStatus | string;
  status: MemberStatus;
}

/**
 * API Response structure for a Lecturer
 */
export interface ApiLecturerRow {
  user_id: string;
  public_id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  salary_type: string;
  status: MemberStatus;
  branch_id: string | null;
  branch_name: string | null;
  created_at: string;
  assigned_courses: number;
  assigned_batches: number;
  whatsapp_number?: string | null;
  salary_payment_status?: string | null;
}

/**
 * API Response structure for a Student Summary list
 */
/**
 * API Response structure for a Student row (nested student/user objects)
 */
export interface ApiStudentRow {
  user_id: string;
  public_id: string;
  full_name: string;
  mobile_number: string;
  whatsapp_number: string | null;
  district: string | null;
  referral_code: string;
  email: string;
  status: StudentStatus | string;
  created_at: string;
  enrollment_count: number;
  payment_status?: {
    status: string;
    pending_count: number;
    paid_count: number;
    partially_paid_count: number;
    total_pending_amount: string;
  };
  certificate_status?: {
    status: string;
    total_issued: number;
    has_certificate: boolean;
    certificate_types: string[];
  };
  commissions?: {
    total_earned: string;
    approved_pending: string;
    paid: string;
    transaction_count: number;
  };
}

/**
 * API Response structure for a Staff Member
 */
export interface ApiStaffRow {
  userId: string;
  customId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  whatsapp: string;
  salaryType: string;
  isBranchManager: boolean;
  status: MemberStatus;
  branchId: string | null;
  branchName: string | null;
  privileges: string[];
  salaryStatus: SalaryStatus | string;
  createdAt: string;
  commissionEarned: string;
}

/**
 * Staff data structure for the table
 */
export interface StaffDataType {
  id: string;
  regDate: string;
  idNo: string;
  name: string;
  district: string;
  phone: string;
  whatsApp: string;
  email: string;
  privileges: string;
  rawPrivileges: string[];
  commissions: string;
  branch: string;
  salaryStatus: SalaryStatus | string;
  status: MemberStatus;
  role: string;
  isBranchManager: boolean;
}

/**
 * Status badge configurations
 */
export const STUDENT_STATUS_CONFIG: Record<StudentStatus, { bg: string; text: string }> = {
  "ACTIVE": { bg: "#D9E9FF", text: "#2563EB" },
  "INACTIVE": { bg: "#F1F5F9", text: "#000000" },
  "DROPPED": { bg: "#FEE2E2", text: "#EF4444" },
  "COMPLETED": { bg: "#DCFCE7", text: "#16A34A" },
  "PENDING_VERIFICATION": { bg: "#FFF7D7", text: "#F59E0B" },
};

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { bg: string; text: string }> = {
  "Pending": { bg: "#FFF7D7", text: "#F59E0B" },
  "Completed": { bg: "#DFFFF0", text: "#16A34A" },
};

export const CERTIFICATE_STATUS_CONFIG: Record<CertificateStatus, { bg: string; text: string }> = {
  "Pending": { bg: "#FFF7D7", text: "#F59E0B" },
  "Completed": { bg: "#DFFFF0", text: "#16A34A" },
};

export const SALARY_STATUS_CONFIG: Record<SalaryStatus, { bg: string; text: string }> = {
  "OVER_DUE": { bg: "#FFDEDE", text: "#FB2C36" },
  "PENDING": { bg: "#FFF7D7", text: "#F59E0B" },
  "PAID": { bg: "#DFFFF0", text: "#16A34A" },
  "NO_RECORD": { bg: "#F1F5F9", text: "#64748B" },
};

export const MEMBER_STATUS_CONFIG: Record<MemberStatus, { bg: string; text: string }> = {
  "ACTIVE": { bg: "#D9E9FF", text: "#2563EB" },
  "INACTIVE": { bg: "#F1F5F9", text: "#000000" },
  "SUSPENDED": { bg: "#F1F5F9", text: "#64748B" },
};

export const SALARY_TYPE_CONFIG: Record<string, { label: string }> = {
  MONTHLY: { label: "Monthly Salary" },
  PERCENTAGE_FROM_BATCH_DEPOSITS: { label: "Percentage from Batch Deposits" },
  COURSE_WISE_PAYMENTS: { label: "Course-wise Payments" },
  BATCH_WISE_PAYMENTS: { label: "Batch-wise Payments" },
};

/**
 * Detailed Student Profile for the View Student page
 */
export interface StudentDetailProfile {
  user_id: string;
  public_id: string;
  title: string | null;
  full_name: string;
  gender: string | null;
  date_of_birth: string | null;
  nic: string | null;
  language: string | null;
  mobile_number: string;
  secondary_phone_number: string | null;
  whatsapp_number: string | null;
  email: string;
  address: string | null;
  district: string | null;
  guardian_name: string | null;
  guardian_phone: string | null;
  nic_photo_url: string | null;
  passport_photo_url: string | null;
  ol_results_url: string | null;
  al_results_url: string | null;
  profile_image_url: string | null;
  referral_code: string;
  referred_by_user_id: string | null;
  is_email_verified: boolean;
  is_profile_complete: boolean;
  status: string;
  created_at: string;
  referral_count: number;
  total_commissions_earned: string;
  commission_count: number;
  overall_progress_percentage: number;
  total_paid_amount: string;
  total_pending_amount: string;
  total_discount_amount: string;
}

export interface EnrolledCourseItem {
  enrollment_id: string;
  course_id: string;
  course_name: string;
  course_category: string | null;
  total_amount: string;
  payment_type: "FULL" | "INSTALLMENT";
  financial_status: string;
  lifecycle_status: string;
  access_status: string;
  progress_percentage: number;
  enrolled_at: string;
  certificate_status: string;
}

export interface EnrolledBatchItem {
  enrollment_id: string;
  batch_id: string;
  batch_name: string;
  total_amount: string;
  payment_type: "FULL" | "INSTALLMENT";
  financial_status: string;
  lifecycle_status: string;
  access_status: string;
  progress_percentage: number;
  enrolled_at: string;
  certificate_status: string;
}

export interface ProductPurchaseItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: string;
  total_amount: string;
  financial_status: string;
  fulfillment_status: string;
  currency: string;
  purchased_at: string;
}

export interface ReferralCommissionItem {
  id: string;
  source_type: "COURSE" | "BATCH" | "PRODUCT";
  source_id: string;
  source_name: string | null;
  triggered_by_student_name: string | null;
  payment_amount: string | null;
  amount_snapshot: string;
  status: string;
  commission_type: string;
  percentage_snapshot: string | null;
  created_at: string;
}

export interface PaymentHistoryItem {
  id: string;
  enrollment_id: string;
  schedule_id: string | null;
  course_id: string | null;
  course_name: string | null;
  batch_id: string | null;
  batch_name: string | null;
  method: string;
  amount: string;
  reference_number: string | null;
  receipt_url: string | null;
  status: string;
  payment_type: string;
  bank_name: string | null;
  account_info: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface WalletInfo {
  id: string;
  user_id: string;
  balance: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface InstallmentItem {
  id: string;
  enrollment_id: string;
  installment_number: number;
  title: string | null;
  due_amount: string;
  paid_amount: string;
  status: string;
  due_date: string | null;
  paid_at: string | null;
  total_discounts: string;
  course_id: string | null;
  course_name: string | null;
  batch_id: string | null;
  batch_name: string | null;
  discount_offered_by: string | null;
  invoice_url: string | null;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

/**
 * Response for the dedicated enrollment payment details API
 */
export interface EnrollmentPaymentDetailsResponse {
  enrollment: EnrolledCourseItem | EnrolledBatchItem;
  payments: PaymentHistoryItem[];
  installments: InstallmentItem[];
}

/**
 * Root response for Admin Student Detail API
 */
export interface AdminStudentDetailResponse {
  profile: StudentDetailProfile;
  enrolledCourses: PaginatedResult<EnrolledCourseItem>;
  enrolledBatches: PaginatedResult<EnrolledBatchItem>;
  productPurchases: PaginatedResult<ProductPurchaseItem>;
  referralCommissions: PaginatedResult<ReferralCommissionItem>;
  paymentHistory: PaginatedResult<PaymentHistoryItem>;
  wallet: WalletInfo | null;
  installments: PaginatedResult<InstallmentItem>;
}

