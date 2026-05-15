import type {
  CommissionBatchRow,
  CommissionCourseRow,
  CommissionProductRow,
  CommissionRejectedRow,
} from "@/types/approval";

export const mockCommissionBatchesData: CommissionBatchRow[] = Array.from({
  length: 15,
}).map((_, i) => ({
  id: `batch-${i + 1}`,
  date: "01/21",
  batchName: "Batch Name",
  studentName: "Amali Perera",
  amount: "XXXX.00",
  referralMember:
    i % 3 === 0
      ? "Direct Enroll"
      : i % 3 === 1
        ? "Student Referral-Student Name"
        : "Agent Referral-Agent Name",
  commissionType: (i % 3 === 0
    ? "STAFF"
    : i % 3 === 1
      ? "LECTURER"
      : "REFERRAL") as "REFERRAL" | "LECTURER" | "STAFF",
  commissionRate: "#%",
  commissionAccumulated: "XXX.00",
}));

export const mockCommissionCoursesData: CommissionCourseRow[] = Array.from({
  length: 15,
}).map((_, i) => ({
  id: `course-${i + 1}`,
  date: "01/21",
  courseName: "Course Name",
  studentName: "Amali Perera",
  amount: "XXXX.00",
  referralMember:
    i % 3 === 0
      ? "Direct Enroll"
      : i % 3 === 1
        ? "Student Referral-Student Name"
        : "Agent Referral-Agent Name",
  commissionType: (i % 3 === 0
    ? "STAFF"
    : i % 3 === 1
      ? "LECTURER"
      : "REFERRAL") as "REFERRAL" | "LECTURER" | "STAFF",
  commissionRate: "#%",
  commissionAccumulated: "XXX.00",
}));

export const mockCommissionProductsData: CommissionProductRow[] = Array.from({
  length: 15,
}).map((_, i) => ({
  id: `product-${i + 1}`,
  date: "01/21",
  productName: "Product Name",
  studentName: "Amali Perera",
  amount: "XXXX.00",
  referralMember:
    i % 3 === 0
      ? "Direct Enroll"
      : i % 3 === 1
        ? "Student Referral-Student Name"
        : "Agent Referral-Agent Name",
  commissionType: (i % 3 === 0
    ? "STAFF"
    : i % 3 === 1
      ? "LECTURER"
      : "REFERRAL") as "REFERRAL" | "LECTURER" | "STAFF",
  commissionRate: "#%",
  commissionAccumulated: "XXX.00",
}));

export const mockCommissionRejectedData: CommissionRejectedRow[] = Array.from({
  length: 15,
}).map((_, i) => {
  const isCourse = i % 2 === 0;

  return {
    id: `rejected-${i + 1}`,
    date: "01/21",
    transactionFor: isCourse ? "Course Name" : "Batch Name",
    type: isCourse ? "Course" : "Batch",
    studentName: "Amali Perera",
    amount: "XXXX.00",
    referralMember:
      i % 3 === 0
        ? "Direct Enroll"
        : i % 3 === 1
          ? "Student Referral-Student Name"
          : "Agent Referral-Agent Name",
    commissionType: (i % 3 === 0
      ? "STAFF"
      : i % 3 === 1
        ? "LECTURER"
        : "REFERRAL") as "REFERRAL" | "LECTURER" | "STAFF",
    comRate: "#%",
    comAccumulated: "XXX.00",
    rejectedReason: "Reason here",
  };
});
