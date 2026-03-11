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
export type SalaryStatus = "Over Due" | "Pending" | "Paid";

/**
 * Member status options (shared by Lecturer + Staff)
 */
export type MemberStatus = "active" | "inactive";

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
  salaryStatus: SalaryStatus;
  status: MemberStatus;
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
  "Over Due": { bg: "#FFDEDE", text: "#FB2C36" },
  "Pending": { bg: "#FFF7D7", text: "#F59E0B" },
  "Paid": { bg: "#DFFFF0", text: "#16A34A" },
};

export const MEMBER_STATUS_CONFIG: Record<MemberStatus, { bg: string; text: string }> = {
  "active": { bg: "#D9E9FF", text: "#2563EB" },
  "inactive": { bg: "#F1F5F9", text: "#000000" },
};
