import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { mockResponse, USE_MOCK } from "@/lib/mock/mockUtils";
import {
  mockEmployeeProfile,
  initialProfileUpdateRequests,
} from "@/lib/mock/profile.mock";
import {
  normalizeListResponse,
  normalizeDetailResponse,
  normalizeMutationResponse,
} from "@/lib/api/responseNormalizer";
import type {
  EmployeeProfile,
  ProfileUpdateRequest,
  CreateProfileUpdateRequestDto,
} from "@/types/dto/profile.dto";

let profileData: EmployeeProfile = { ...mockEmployeeProfile };
let updateRequestsData: ProfileUpdateRequest[] = [...initialProfileUpdateRequests];

function mapBackendProfile(data: any): EmployeeProfile {
  if (!data) return profileData;
  const emp = data.employee || data;
  const dept = data.department;
  const pos = data.position;
  const user = data.user;

  return {
    id: emp.employee_id || emp.id || "emp-me",
    employeeCode: emp.employee_no || emp.employeeCode || "EMP-0001",
    fullName: [emp.first_name, emp.last_name].filter(Boolean).join(" ") || "Employee",
    email: emp.work_email || user?.email || "",
    nic: emp.nic || "199508201234",
    dob: emp.dob || "1995-08-20",
    gender: emp.gender || "MALE",
    contactNumber: emp.mobile_no || "",
    streetAddress: emp.street || "",
    city: emp.city || "",
    province: emp.province || "",
    epfNo: emp.epf_no || "",
    joinDate: emp.join_date || "",
    qualification: data.qualifications?.[0]?.qualification_title || "Degree / Diploma",
    departmentName: dept?.departmentName || dept?.department_name || "General Department",
    positionName: pos?.position_name || pos?.positionName || "Employee",
    supervisorName: data.supervisor ? `${data.supervisor.first_name} ${data.supervisor.last_name}` : "Assigned Supervisor",
    status: (user?.status?.toUpperCase() === "ACTIVE" ? "ACTIVE" : "ACTIVE") as "ACTIVE" | "INACTIVE" | "ON_LEAVE",
    workExperiences: (data.work_experiences || []).map((w: any) => ({
      id: w.id,
      companyName: w.company_name || w.companyName,
      designation: w.designation,
      startDate: w.start_date || w.startDate,
      endDate: w.end_date || w.endDate,
    })),
    qualifications: (data.qualifications || []).map((q: any) => ({
      id: q.id,
      title: q.qualification_title || q.title,
      institute: q.institute,
      year: String(q.completed_year || q.year || ""),
    })),
    emergencyContacts: (data.emergency_contacts || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      relationship: c.relationship,
      workPhone: c.work_tp || c.workPhone || "",
      mobilePhone: c.mobile || c.mobilePhone || "",
    })),
    dependents: (data.dependents || []).map((d: any) => ({
      id: d.id,
      name: d.name,
      dob: d.dob,
      relationship: d.relationship,
      phone: d.mobile || d.phone || "",
    })),
    updateRequests: [],
  };
}

export const profileService = {
  /**
   * GET /me/profile
   */
  getProfile: async (): Promise<EmployeeProfile> => {
    if (USE_MOCK) {
      return mockResponse({ ...profileData, updateRequests: updateRequestsData });
    }

    const res = await api.get(API_ENDPOINTS.me.PROFILE);
    const detail = normalizeDetailResponse(res.data);
    const profile = mapBackendProfile(detail);

    // Fetch own update requests in parallel
    try {
      const reqRes = await api.get(API_ENDPOINTS.me.PROFILE_UPDATE_REQUESTS);
      const reqList = normalizeListResponse<any>(reqRes.data);
      profile.updateRequests = reqList.items.map((r: any) => ({
        id: r.request_id || r.id,
        requestedAt: r.requested_date || r.created_at || new Date().toISOString(),
        summary: r.reason || "Profile update request",
        status: (r.status || "PENDING") as "PENDING" | "APPROVED" | "REJECTED",
        reason: r.reason || "",
        changes: Object.entries(r.request_data || {}).map(([key, val]) => ({
          field: key,
          oldValue: "—",
          newValue: String(val),
        })),
      }));
    } catch {
      profile.updateRequests = [];
    }

    return profile;
  },

  /**
   * GET /me/profile-update-requests
   */
  getProfileUpdateRequests: async (): Promise<ProfileUpdateRequest[]> => {
    if (USE_MOCK) {
      return mockResponse(updateRequestsData);
    }

    const res = await api.get(API_ENDPOINTS.me.PROFILE_UPDATE_REQUESTS);
    const normalized = normalizeListResponse<any>(res.data);
    return normalized.items.map((r: any) => ({
      id: r.request_id || r.id,
      requestedAt: r.requested_date || r.created_at || new Date().toISOString(),
      summary: r.reason || "Profile update request",
      status: (r.status || "PENDING") as "PENDING" | "APPROVED" | "REJECTED",
      reason: r.reason || "",
      changes: Object.entries(r.request_data || {}).map(([key, val]) => ({
        field: key,
        oldValue: "—",
        newValue: String(val),
      })),
    }));
  },

  /**
   * POST /me/profile-update-requests
   */
  createUpdateRequest: async (
    payload: CreateProfileUpdateRequestDto
  ): Promise<ProfileUpdateRequest> => {
    if (USE_MOCK) {
      const changesList: { field: string; oldValue: string; newValue: string }[] = [];
      if (payload.contactNumber && payload.contactNumber !== profileData.contactNumber) {
        changesList.push({
          field: "Contact Number",
          oldValue: profileData.contactNumber,
          newValue: payload.contactNumber,
        });
      }
      if (payload.streetAddress && payload.streetAddress !== profileData.streetAddress) {
        changesList.push({
          field: "Street Address",
          oldValue: profileData.streetAddress,
          newValue: payload.streetAddress,
        });
      }
      if (payload.city && payload.city !== profileData.city) {
        changesList.push({
          field: "City",
          oldValue: profileData.city,
          newValue: payload.city,
        });
      }

      const newReq: ProfileUpdateRequest = {
        id: `pur-${Date.now()}`,
        requestedAt: new Date().toLocaleString(),
        summary: `Updated: ${changesList.map((c) => c.field).join(", ") || "General Info"}`,
        status: "PENDING",
        reason: payload.reason,
        changes: changesList.length > 0 ? changesList : [
          { field: "Profile Update", oldValue: "Previous", newValue: "Updated values" }
        ],
      };

      updateRequestsData = [newReq, ...updateRequestsData];
      return mockResponse(newReq);
    }

    const res = await api.post(API_ENDPOINTS.me.PROFILE_UPDATE_REQUESTS, {
      updateData: {
        mobile_no: payload.contactNumber,
        street: payload.streetAddress,
        city: payload.city,
        province: payload.province,
      },
      reason: payload.reason,
    });
    const record = normalizeDetailResponse<any>(res.data);

    return {
      id: record.request_id || `pur-${Date.now()}`,
      requestedAt: new Date().toISOString(),
      summary: payload.reason || "Profile update requested",
      status: "PENDING",
      reason: payload.reason,
      changes: [
        { field: "Contact Number", oldValue: "—", newValue: payload.contactNumber || "—" },
        { field: "Address", oldValue: "—", newValue: payload.streetAddress || "—" },
      ],
    };
  },

  /**
   * GET /hr/requests/profile-updates
   */
  getHrProfileUpdateRequests: async (): Promise<ProfileUpdateRequest[]> => {
    if (USE_MOCK) {
      return mockResponse(updateRequestsData);
    }

    const res = await api.get(API_ENDPOINTS.hr.PROFILE_REQUESTS);
    const normalized = normalizeListResponse<any>(res.data);

    return normalized.items.map((item: any) => ({
      id: item.request?.request_id || item.request_id || item.id,
      employeeName: item.employee ? `${item.employee.first_name} ${item.employee.last_name}` : "Employee",
      employeeCode: item.employee?.employee_no || "EMP",
      departmentName: item.department?.department_name || "General",
      requestedAt: item.request?.requested_date || item.created_at || new Date().toISOString(),
      summary: item.request?.reason || "Profile Update",
      status: (item.request?.status || item.status || "PENDING") as "PENDING" | "APPROVED" | "REJECTED",
      reason: item.request?.reason || item.reason || "",
      changes: Object.entries(item.request?.request_data || {}).map(([k, v]) => ({
        field: k,
        oldValue: "—",
        newValue: String(v),
      })),
    }));
  },

  /**
   * PATCH /hr/requests/profile-updates/:id
   */
  decideProfileUpdateRequest: async (
    id: string,
    decision: "APPROVED" | "REJECTED",
    comment?: string
  ): Promise<ProfileUpdateRequest> => {
    if (USE_MOCK) {
      const r = updateRequestsData.find((item) => item.id === id);
      if (r) {
        r.status = decision;
        r.decisionComment = comment;
      }
      return mockResponse(r || updateRequestsData[0]);
    }

    const res = await api.patch(API_ENDPOINTS.hr.PROFILE_REQUEST_DECISION(id), {
      decision,
      comment,
    });
    return normalizeDetailResponse(res.data);
  },

  decideProfileRequest: async (
    id: string,
    decision: "APPROVED" | "REJECTED",
    comment?: string
  ): Promise<ProfileUpdateRequest> => {
    return profileService.decideProfileUpdateRequest(id, decision, comment);
  },
};
