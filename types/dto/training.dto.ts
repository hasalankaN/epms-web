export type TrainingMode = "ONLINE" | "PHYSICAL" | "HYBRID";
export type TrainingStatus = "UPCOMING" | "ONGOING" | "COMPLETED";
export type AttendanceStatus = "ATTENDED" | "ABSENT" | "PENDING";

export interface TrainingMaterial {
  id: string;
  name: string;
  type: string;
  size: string;
  downloadUrl: string;
}

export interface TrainingParticipant {
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  departmentName: string;
  attendance: AttendanceStatus;
  evaluated: boolean;
  rating?: number;
  comments?: string;
}

export interface TrainingItem {
  id: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  mode: TrainingMode;
  venue: string;
  instructors: string[];
  status: TrainingStatus;
  attendanceStatus: AttendanceStatus;
  materials: TrainingMaterial[];
  budget?: number;
  budgetStatus?: "PENDING" | "APPROVED" | "REJECTED";
  participantsCount?: number;
  participants?: TrainingParticipant[];
  hasEvaluated?: boolean;
}

export interface TrainingEvaluationDto {
  trainingId: string;
  rating: number; // 1-5
  whatWentWell: string;
  whatCanImprove: string;
  wouldRecommend: boolean;
}

export interface PlanTrainingDto {
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  mode: TrainingMode;
  venue: string;
  instructors: string[];
  participantIds: string[];
  budget: number;
}

