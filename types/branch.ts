export type BranchType = "MAIN" | "DEVOTIONAL" | "CITY";

export type BranchStatus = "ACTIVE" | "INACTIVE";

export interface BranchRow {
  id: string;
  created_at: string;
  branch_code: string;
  name: string;
  branch_type: BranchType;
  status: BranchStatus;
  manager_name: string | null;
  staff_count: number;
  batch_count: number;
  total_income: string;
  total_expenses: number;
}
