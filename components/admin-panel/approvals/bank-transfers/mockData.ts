import type {
  BankTransferBatchRow,
  BankTransferCourseRow,
  BankTransferProductRow,
  BankTransferRejectedRow,
} from "@/types/approval";

export const mockBatchesData: BankTransferBatchRow[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `B${i + 1}`,
  transactionDate: "11/02/2026",
  batchName: "Batch Name",
  studentName: "Amali Perera",
  enrolledBy: i % 4 === 1 ? "Student Referral-Student Name" : i % 4 === 2 ? "Agent Referral-Agent Name" : "Direct Enroll",
  whatsApp: "+9470 492 2345",
  amount: "XXXX.00",
  refNo: "Ref no",
  bankReceipt: "View",
}));

export const mockCoursesData: BankTransferCourseRow[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `C${i + 1}`,
  transactionDate: "11/02/2026",
  courseName: "Course Name",
  studentName: "Amali Perera",
  enrolledBy: i % 4 === 1 ? "Student Referral-Student Name" : i % 4 === 2 ? "Agent Referral-Agent Name" : "Direct Enroll",
  whatsApp: "+9470 492 2345",
  amount: "XXIX.00",
  refNo: "Ref no",
  bankReceipt: "View",
}));

export const mockProductsData: BankTransferProductRow[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `P${i + 1}`,
  transactionDate: "11/02/2026",
  productName: "Products Name",
  studentName: "Amali Perera",
  enrolledBy: i % 4 === 1 ? "Student Referral-Student Name" : i % 4 === 2 ? "Agent Referral-Agent Name" : "Direct Enroll",
  whatsApp: "+9470 492 2345",
  amount: "XXXX.00",
  refNo: "Ref no",
  bankReceipt: "View",
}));

export const mockRejectedData: BankTransferRejectedRow[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `R${i + 1}`,
  date: "11/02/2026",
  transactionFor: i % 3 === 0 ? "Product Name" : i % 3 === 1 ? "Batch Name" : "Course Name",
  type: i % 3 === 0 ? "Products" : i % 3 === 1 ? "Batch" : "Course",
  studentName: "Amali Perera",
  enrolledBy: i % 4 === 1 ? "Student Referral-Student Name" : i % 4 === 2 ? "Agent Referral-Agent Name" : "Direct Enroll",
  whatsApp: "+9470 492 2345",
  amount: "XXXX.00",
  refNo: "Ref no",
  rejectedReason: "Reason here",
  bankReceipt: "View",
}));
