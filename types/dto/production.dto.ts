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
  targetUnits?: number;
  actualUnits: number;
  achievementPercentage: number;
  efficiencyRate?: number;
  rating: number; // 1-5
  supervisorComment?: string;
  supervisorComments?: string;
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
  monthlyTarget?: number;
  achievedUnits?: number;
  averageEfficiency?: number;
  averageSupervisorRating?: number;
}

export interface ReviewProductionDto {
  recordId: string;
  rating?: number;
  supervisorComment?: string;
  comments?: string;
  decision?: "APPROVED" | "REJECTED";
  approvalStatus?: "APPROVED" | "REJECTED";
}

