import type { PermissionModule, RoleItem } from "@/types/dto/role.dto";

export const mockPermissionModules: PermissionModule[] = [
  {
    module: "employees",
    label: "Employees",
    permissions: [
      { key: "employees:view", label: "View Employees", description: "Can view employee directory and profiles" },
      { key: "employees:create", label: "Add Employee", description: "Can register new employees" },
      { key: "employees:edit", label: "Edit Employee", description: "Can update employee personal and job details" },
      { key: "employees:delete", label: "Deactivate Employee", description: "Can deactivate employee records" },
    ],
  },
  {
    module: "attendance",
    label: "Attendance",
    permissions: [
      { key: "attendance:view", label: "View Attendance", description: "Can view attendance logs and summaries" },
      { key: "attendance:edit", label: "Edit Attendance", description: "Can adjust punch in and out times" },
      { key: "attendance:approve", label: "Approve Adjustments", description: "Can decide on attendance adjustment requests" },
    ],
  },
  {
    module: "leave",
    label: "Leave Management",
    permissions: [
      { key: "leave:view", label: "View Leaves", description: "Can view employee leave applications and balances" },
      { key: "leave:approve", label: "Approve Leave", description: "Can approve or reject leave requests" },
      { key: "leave:policies", label: "Manage Policies", description: "Can edit company leave policies and quotas" },
    ],
  },
  {
    module: "training",
    label: "Training",
    permissions: [
      { key: "training:view", label: "View Training", description: "Can view training programs and materials" },
      { key: "training:manage", label: "Manage Programs", description: "Can plan trainings, upload materials, and manage budgets" },
    ],
  },
  {
    module: "salary",
    label: "Salary & Payroll",
    permissions: [
      { key: "salary:view", label: "View Payroll", description: "Can view salary records and compensation" },
      { key: "salary:manage", label: "Manage Payroll", description: "Can adjust salaries, grant bonuses, and generate slips" },
    ],
  },
  {
    module: "recruitment",
    label: "Recruitment",
    permissions: [
      { key: "recruitment:manage", label: "Manage Vacancies", description: "Can post vacancies, review candidates, and schedule interviews" },
    ],
  },
  {
    module: "reports",
    label: "Reports",
    permissions: [
      { key: "reports:view", label: "Generate Reports", description: "Can preview and export organizational reports" },
    ],
  },
  {
    module: "admin",
    label: "Administration",
    permissions: [
      { key: "admin:users", label: "User Management", description: "Can manage user accounts and credentials" },
      { key: "admin:roles", label: "Role & Permissions", description: "Can configure custom system roles and privileges" },
      { key: "admin:system", label: "System Settings", description: "Can configure organization-wide settings" },
    ],
  },
];

export const mockRoles: RoleItem[] = [
  {
    id: "role-admin",
    name: "Administrator",
    description: "Full system administration access across all modules and security settings.",
    userCount: 2,
    isSystem: true,
    permissions: [
      "employees:view", "employees:create", "employees:edit", "employees:delete",
      "attendance:view", "attendance:edit", "attendance:approve",
      "leave:view", "leave:approve", "leave:policies",
      "training:view", "training:manage",
      "salary:view", "salary:manage",
      "recruitment:manage",
      "reports:view",
      "admin:users", "admin:roles", "admin:system",
    ],
    createdAt: "2024-01-01",
  },
  {
    id: "role-hr",
    name: "HR Manager",
    description: "Full access to employee lifecycles, attendance, leaves, payroll, and recruitment.",
    userCount: 4,
    isSystem: true,
    permissions: [
      "employees:view", "employees:create", "employees:edit", "employees:delete",
      "attendance:view", "attendance:edit", "attendance:approve",
      "leave:view", "leave:approve", "leave:policies",
      "training:view", "training:manage",
      "salary:view", "salary:manage",
      "recruitment:manage",
      "reports:view",
    ],
    createdAt: "2024-01-01",
  },
  {
    id: "role-supervisor",
    name: "Supervisor",
    description: "Team management, task allocations, leave approvals, and appraisals.",
    userCount: 15,
    isSystem: true,
    permissions: [
      "employees:view",
      "attendance:view", "attendance:approve",
      "leave:view", "leave:approve",
      "training:view",
      "reports:view",
    ],
    createdAt: "2024-01-01",
  },
  {
    id: "role-employee",
    name: "Employee",
    description: "Standard employee access for self-service attendance, leaves, and tasks.",
    userCount: 180,
    isSystem: true,
    permissions: [
      "employees:view",
      "attendance:view",
      "leave:view",
      "training:view",
    ],
    createdAt: "2024-01-01",
  },
  {
    id: "role-finance-auditor",
    name: "Finance Auditor",
    description: "Read-only access for payroll auditing and salary slips inspection.",
    userCount: 3,
    isSystem: false,
    permissions: [
      "salary:view",
      "reports:view",
    ],
    createdAt: "2025-06-15",
  },
];

