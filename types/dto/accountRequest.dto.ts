export type AccountRequestType = "CREATE_ACCOUNT" | "DEACTIVATE_ACCOUNT" | "CHANGE_ROLE";
export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface AccountRequestItem {
  id: string;
  type: AccountRequestType;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  employeeEmail: string;
  departmentName: string;
  requestedBy: string;
  requestedAt: string;
  status: RequestStatus;
  proposedRole?: string;
  reason: string;
  adminComment?: string;
  decisionComment?: string;
  decisionAt?: string;
  proposedUsername?: string;
}

export interface CreateAccountRequestDto {
  type: AccountRequestType;
  employeeId: string;
  proposedRole?: string;
  reason: string;
  details?: string;
  firstName?: string;
  lastName?: string;
  workEmail?: string;
  epfNo?: string;
  dob?: string;
  joinDate?: string;
  departmentId?: string;
  positionId?: string;
}

