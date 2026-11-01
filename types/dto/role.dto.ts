export interface PermissionModule {
  module: string;
  label: string;
  permissions: {
    key: string;
    label: string;
    description: string;
  }[];
}

export interface RoleItem {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  isSystem?: boolean;
  createdAt: string;
}

export interface CreateRoleDto {
  name: string;
  description: string;
  permissions: string[];
}

