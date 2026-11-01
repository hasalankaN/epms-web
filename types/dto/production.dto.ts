export type ProductionApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ProductionRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode?: string;
  departmentName?: string;
  date: string;
  projectName: string;
  clientName: string;
  expectedUnits: number;
  actualUnits: number;
  achievementPercentage: number;
  rating: number; // 1-5
  supervisorComment?: string;
  specialRemarks?: string;
  approvalStatus: ProductionApprovalStatus;
}

export interface ProductionStats {
  avgRating: number;
  targetAchievementPct: number;
  recordsThisMonth: number;
  approvedPct: number;
  totalExpected?: number;
  totalActual?: number;
}

export interface ReviewProductionDto {
  recordId: string;
  rating: number;
  supervisorComment: string;
  approvalStatus: "APPROVED" | "REJECTED";
}

