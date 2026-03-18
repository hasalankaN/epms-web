import type { IncomeFromStudentData } from "./IncomeFromStudent/IncomeFromStudentTable";
import type { OtherIncomeData } from "./OtherIncome/OtherIncomeTable";

// ===== INCOME FROM STUDENT MOCK DATA =====
const sources = ["Batch", "Course", "Product"];
const pMethods = ["Gateway", "Bank Slip"];
const pTypes = ["1st Installment", "Complete Payment", "2nd Installment"];
const pVias = ["BOC", "Peoples", "HNB", "NDB"];
const statuses: Array<"Pending" | "Completed"> = ["Pending", "Completed"];

export const mockIncomeFromStudentData: IncomeFromStudentData[] = Array.from({ length: 15 }, (_, i) => ({
  id: `ifs-${i + 1}`,
  date: "2026/01/21",
  description: "Lorem Ipsum",
  source: sources[i % sources.length],
  paymentMethod: pMethods[i % pMethods.length],
  paymentType: pTypes[i % pTypes.length],
  paymentVia: pVias[(i + 1) % pVias.length],
  amount: "XXXX.00",
  studentName: "Student Name",
  status: statuses[i % statuses.length],
}));

// ===== OTHER INCOME MOCK DATA =====
export const mockOtherIncomeData: OtherIncomeData[] = Array.from({ length: 15 }, (_, i) => ({
  id: `oi-${i + 1}`,
  date: "2026/01/21",
  description: "Lorem Ipsum",
  branch: "Branch 1",
  transactionVia: pVias[i % pVias.length],
  amount: "XXXX.00",
}));
