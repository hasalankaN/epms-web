import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { mockResponse, USE_MOCK } from "@/lib/mock/mockUtils";
import {
  mockEmployeeProfile,
  initialProfileUpdateRequests,
} from "@/lib/mock/profile.mock";
import type {
  EmployeeProfile,
  ProfileUpdateRequest,
  CreateProfileUpdateRequestDto,
} from "@/types/dto/profile.dto";

// In-memory state for session mutations
let profileData: EmployeeProfile = { ...mockEmployeeProfile };
let updateRequestsData: ProfileUpdateRequest[] = [...initialProfileUpdateRequests];

export const profileService = {
  /**
   * GET /api/v1/me/profile
   */
  getProfile: async (): Promise<EmployeeProfile> => {
    if (USE_MOCK) {
      return mockResponse({ ...profileData, updateRequests: updateRequestsData });
    }
    const res = await api.get(API_ENDPOINTS.me.PROFILE);
    return res.data;
  },

  /**
   * GET /api/v1/me/profile-update-requests
   */
  getProfileUpdateRequests: async (): Promise<ProfileUpdateRequest[]> => {
    if (USE_MOCK) {
      return mockResponse(updateRequestsData);
    }
    const res = await api.get(API_ENDPOINTS.me.PROFILE_UPDATE_REQUESTS);
    return res.data;
  },

  /**
   * POST /api/v1/me/profile-update-requests
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
      if (payload.qualification && payload.qualification !== profileData.qualification) {
        changesList.push({
          field: "Qualification",
          oldValue: profileData.qualification,
          newValue: payload.qualification,
        });
      }

      const newRequest: ProfileUpdateRequest = {
        id: `req-${Date.now()}`,
        requestedAt: new Date().toLocaleString(),
        summary: `Request with ${changesList.length || 1} field modifications`,
        status: "PENDING",
        reason: payload.reason,
        employeeName: profileData.fullName,
        employeeCode: profileData.employeeCode,
        departmentName: profileData.departmentName,
        changes: changesList.length > 0 ? changesList : [
          { field: "Profile Update", oldValue: "Current details", newValue: "Updated details" }
        ],
      };

      updateRequestsData = [newRequest, ...updateRequestsData];
      return mockResponse(newRequest);
    }
    const res = await api.post(API_ENDPOINTS.me.PROFILE_UPDATE_REQUESTS, payload);
    return res.data;
  },

  /**
   * PATCH /api/v1/hr/requests/profile-updates/:id
   */
  decideProfileRequest: async (
    id: string,
    decision: "APPROVED" | "REJECTED",
    comment: string
  ): Promise<ProfileUpdateRequest> => {
    if (USE_MOCK) {
      const req = updateRequestsData.find((r) => r.id === id);
      if (req) {
        req.status = decision;
        req.decisionComment = comment;
      }
      return mockResponse(req || updateRequestsData[0]);
    }
    const res = await api.patch(API_ENDPOINTS.hr.PROFILE_REQUEST_DECISION(id), { decision, comment });
    return res.data;
  },
};

