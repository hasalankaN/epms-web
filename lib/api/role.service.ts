import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { mockResponse, USE_MOCK } from "@/lib/mock/mockUtils";
import { mockRoles, mockPermissionModules } from "@/lib/mock/role.mock";
import type {
  RoleItem,
  PermissionModule,
  CreateRoleDto,
} from "@/types/dto/role.dto";

let rolesStore: RoleItem[] = [...mockRoles];

export const roleService = {
  /**
   * GET /api/v1/admin/roles
   */
  getRoles: async (): Promise<RoleItem[]> => {
    if (USE_MOCK) {
      return mockResponse(rolesStore);
    }
    const res = await api.get(API_ENDPOINTS.adminEpms.ROLES);
    return res.data;
  },

  /**
   * GET /api/v1/admin/permissions
   */
  getPermissionModules: async (): Promise<PermissionModule[]> => {
    if (USE_MOCK) {
      return mockResponse(mockPermissionModules);
    }
    const res = await api.get(`${API_ENDPOINTS.adminEpms.ROLES}/permissions`);
    return res.data;
  },

  /**
   * POST /api/v1/admin/roles
   */
  createRole: async (payload: CreateRoleDto): Promise<RoleItem> => {
    if (USE_MOCK) {
      const newRole: RoleItem = {
        id: `role-${Date.now()}`,
        name: payload.name,
        description: payload.description,
        userCount: 0,
        isSystem: false,
        permissions: payload.permissions,
        createdAt: new Date().toISOString().split("T")[0],
      };
      rolesStore = [...rolesStore, newRole];
      return mockResponse(newRole);
    }
    const res = await api.post(API_ENDPOINTS.adminEpms.ROLES, payload);
    return res.data;
  },

  /**
   * DELETE /api/v1/admin/roles/:id
   */
  deleteRole: async (id: string): Promise<{ success: boolean }> => {
    if (USE_MOCK) {
      const role = rolesStore.find((r) => r.id === id);
      if (role && role.userCount > 0) {
        throw new Error("Cannot delete role with assigned users. Reassign users first.");
      }
      rolesStore = rolesStore.filter((r) => r.id !== id);
      return mockResponse({ success: true });
    }
    const res = await api.delete(`${API_ENDPOINTS.adminEpms.ROLES}/${id}`);
    return res.data;
  },
};

