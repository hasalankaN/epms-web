import type { SidebarNavItem } from "./sidebar";

export const adminSidebarData: SidebarNavItem[] = [
  {
    id: 1,
    type: "header",
    title: "OVERVIEW",
  },
  {
    id: 2,
    type: "link",
    title: "Dashboard",
    url: "/admin-panel/dashboard",
    icon: "LayoutDashboard",
    value: "dashboard",
  },
  {
    id: 3,
    type: "header",
    title: "ADMINISTRATION",
  },
  {
    id: 4,
    type: "link",
    title: "User Management",
    url: "/admin-panel/users",
    icon: "User",
    value: "users",
  },
  {
    id: 5,
    type: "link",
    title: "Departments & Roles",
    url: "/admin-panel/departments",
    icon: "Building2",
    value: "departments",
  },
  {
    id: 6,
    type: "link",
    title: "Account Requests",
    url: "/admin-panel/account-request",
    icon: "ClipboardCheck",
    value: "audit-logs",
  },
  {
    id: 7,
    type: "link",
    title: "System Settings",
    url: "/admin-panel/settings",
    icon: "Settings",
    value: "settings",
  },
  {
    id: 8,
    type: "header",
    title: "INBOX",
  },
  {
    id: 9,
    type: "link",
    title: "Notifications",
    url: "/admin-panel/notifications",
    icon: "Bell",
    value: "notifications",
    count: 5,
  },
];
