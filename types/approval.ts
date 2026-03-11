export type EnrollType =
  | "Direct Enroll"
  | "Student Referral-Student Name"
  | "Agent Referral-Agent Name";

export type RejectedType = "Products" | "Batch" | "Course";

// ==========================================
// BANK TRANSFERS
// ==========================================

export interface BankTransferBatchRow {
  id: string;
  transactionDate: string;
  batchName: string;
  studentName: string;
  enrolledBy: EnrollType;
  whatsApp: string;
  amount: string;
  refNo: string;
  bankReceipt: string;
}

export interface BankTransferCourseRow {
  id: string;
  transactionDate: string;
  courseName: string;
  studentName: string;
  enrolledBy: EnrollType;
  whatsApp: string;
  amount: string;
  refNo: string;
  bankReceipt: string;
}

export interface BankTransferProductRow {
  id: string;
  transactionDate: string;
  productName: string;
  studentName: string;
  enrolledBy: EnrollType;
  whatsApp: string;
  amount: string;
  refNo: string;
  bankReceipt: string;
}

export interface BankTransferRejectedRow {
  id: string;
  date: string;
  transactionFor: string;
  type: RejectedType;
  studentName: string;
  enrolledBy: EnrollType;
  whatsApp: string;
  amount: string;
  refNo: string;
  rejectedReason: string;
  bankReceipt: string;
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
  comRate: string;
  comAccumulated: string;
  rejectedReason: string;
}
