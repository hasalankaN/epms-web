export type EnrollType =
  | "Direct Enroll"
  | "Student Referral-Student Name"
  | "Agent Referral-Agent Name";

export type RejectedType = "Products" | "Batch" | "Course";

export type ApprovalSource = "BATCH" | "COURSE" | "PRODUCT";

// ==========================================
// API RESPONSE SHAPES (from backend)
// ==========================================

export interface ApprovalsApiBankTransferItem {
  payment_id: string;
  source: ApprovalSource;
  transaction_date: string;
  amount: number;
  reference_number: string | null;
  receipt_url: string | null;
  student_full_name: string;
  student_whatsapp: string | null;
  target_name: string | null;
  referral_agent_name: string | null;
  display_label: string;
}

export interface ApprovalsApiRejectedItem {
  payment_id: string;
  source: string; // ENROLLMENT (BATCH/COURSE) | PRODUCT
  target_type: string; // BATCH | COURSE | PRODUCT
  transaction_date: string;
  amount: number;
  reference_number: string | null;
  receipt_url: string | null;
  student_full_name: string;
  student_whatsapp: string | null;
  target_name: string | null;
  referral_agent_name: string | null;
  display_label: string;
}

export interface ApprovalsApiMeta {
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

export interface ApprovalsApiResponse<T> {
  data: T[];
  meta: ApprovalsApiMeta;
}

// ==========================================
// BANK TRANSFERS (UI row types)
// ==========================================

export interface BankTransferBatchRow {
  id: string; // payment_id
  source: ApprovalSource;
  transactionDate: string;
  batchName: string;
  studentName: string;
  enrolledBy: string;
  whatsApp: string;
  amount: string;
  refNo: string;
  receiptUrl: string | null;
}

export interface BankTransferCourseRow {
  id: string;
  source: ApprovalSource;
  transactionDate: string;
  courseName: string;
  studentName: string;
  enrolledBy: string;
  whatsApp: string;
  amount: string;
  refNo: string;
  receiptUrl: string | null;
}

export interface BankTransferProductRow {
  id: string;
  source: ApprovalSource;
  transactionDate: string;
  productName: string;
  studentName: string;
  enrolledBy: string;
  whatsApp: string;
  amount: string;
  refNo: string;
  receiptUrl: string | null;
}

export interface BankTransferRejectedRow {
  id: string;
  source: string;
  date: string;
  transactionFor: string;
  type: string;
  studentName: string;
  enrolledBy: string;
  whatsApp: string;
  amount: string;
  refNo: string;
  rejectedReason?: string;
  receiptUrl: string | null;
}

// ==========================================
// REFERRAL COMMISSIONS
// ==========================================

export interface CommissionBatchRow {
  id: string;
  date: string;
  batchName: string;
  studentName: string;
  amount: string;
  referralMember: string;
  commissionType: "REFERRAL" | "LECTURER" | "STAFF";
  commissionRate: string;
  commissionAccumulated: string;
}

export interface CommissionCourseRow {
  id: string;
  date: string;
  courseName: string;
  studentName: string;
  amount: string;
  referralMember: string;
  commissionType: "REFERRAL" | "LECTURER" | "STAFF";
  commissionRate: string;
  commissionAccumulated: string;
}

export interface CommissionProductRow {
  id: string;
  date: string;
  productName: string;
  studentName: string;
  amount: string;
  referralMember: string;
  commissionType: "REFERRAL" | "LECTURER" | "STAFF";
  commissionRate: string;
  commissionAccumulated: string;
}

export interface CommissionRejectedRow {
  id: string;
  date: string;
  transactionFor: string;
  type: RejectedType;
  studentName: string;
  amount: string;
  referralMember: string;
  commissionType: "REFERRAL" | "LECTURER" | "STAFF";
  comRate: string;
  comAccumulated: string;
  rejectedReason: string;
}

// ==========================================
// COMMISSIONS API TYPES (from backend)
// ==========================================

export interface CommissionsApiItem {
  id: string;
  source_type: "BATCH" | "COURSE" | "PRODUCT";
  commission_type: "REFERRAL" | "LECTURER" | "STAFF";
  transaction_date: string;
  source_name: string | null;
  student_full_name: string | null;
  payment_amount: string | null;
  referral_member_name: string | null;
  commission_rate: string | null;
  commission_amount: string;
  rejection_reason: string | null;
}

export interface CommissionsApiMeta {
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

export interface CommissionsApiResponse {
  data: CommissionsApiItem[];
  meta: CommissionsApiMeta;
}
