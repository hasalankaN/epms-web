export interface WorkExperience {
  id: string;
  companyName: string;
  designation: string;
  startDate: string;
  endDate: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  workPhone: string;
  mobilePhone: string;
}

export interface Dependent {
  id: string;
  name: string;
  dob: string;
  relationship: string;
  phone: string;
}

export interface ProfileUpdateRequest {
  id: string;
  requestedAt: string;
  summary: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  decisionComment?: string;
  reason: string;
  employeeName?: string;
  employeeCode?: string;
  departmentName?: string;
  changes: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
}

export interface EmployeeProfile {
  id: string;
  employeeCode: string;
  fullName: string;
  email: string;
  nic: string;
  dob: string;
  gender: string;
  contactNumber: string;
  streetAddress: string;
  city: string;
  province: string;
  epfNo: string;
  joinDate: string;
  qualification: string;
  departmentName: string;
  positionName: string;
  supervisorName: string;
  status: "ACTIVE" | "INACTIVE" | "ON_LEAVE";
  avatarUrl?: string;
  workExperiences: WorkExperience[];
  emergencyContacts: EmergencyContact[];
  dependents: Dependent[];
  updateRequests: ProfileUpdateRequest[];
}

export interface CreateProfileUpdateRequestDto {
  contactNumber?: string;
  streetAddress?: string;
  city?: string;
  province?: string;
  qualification?: string;
  emergencyContacts?: EmergencyContact[];
  workExperiences?: WorkExperience[];
  dependents?: Dependent[];
  reason: string;
}

