/**
 * Student status options
 */
export type StudentStatus = "active" | "inactive";

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
export type SalaryStatus = "OVER_DUE" | "PENDING" | "PAID";

/**
 * Member status options (shared by Lecturer + Staff)
 */
export type MemberStatus = "ACTIVE" | "SUSPENDED";

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
  certificateStatus: CertificateStatus;
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
  commissions: string;
  branch: string;
  salaryStatus: SalaryStatus;
  status: MemberStatus;
  role: string;
}

/**
 * Status badge configurations
 */
export const STUDENT_STATUS_CONFIG: Record<StudentStatus, { bg: string; text: string }> = {
  "active": { bg: "#D9E9FF", text: "#2563EB" },
  "inactive": { bg: "#F1F5F9", text: "#000000" },
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
};

export const MEMBER_STATUS_CONFIG: Record<MemberStatus, { bg: string; text: string }> = {
  "ACTIVE": { bg: "#D9E9FF", text: "#2563EB" },
  "SUSPENDED": { bg: "#F1F5F9", text: "#000000" },
};
