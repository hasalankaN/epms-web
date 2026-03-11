import type { BranchRow, BranchType, BranchStatus } from "@/types/branch";

const branchTypes: BranchType[] = ["TYPE_1", "TYPE_2", "TYPE_3"];

export const mockBranchData: BranchRow[] = Array.from({ length: 15 }, (_, i) => ({
  id: `br-${i + 1}`,
  created_at: "2026/01/21",
  branch_code: `#${12345 + i}`,
  name: "branch",
  branch_type: branchTypes[i % branchTypes.length],
  manager_name: "name name",
  staff_count: 12,
  batch_count: 35,
  total_income: "XXX,XXX.00",
  total_expenses: 50000,
  status: (i % 5 === 4 ? "INACTIVE" : "ACTIVE") as BranchStatus,
}));
