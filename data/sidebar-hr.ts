import type { SidebarNavItem } from "./sidebar";

export const hrSidebarData: SidebarNavItem[] = [
  {
    id: 1,
    type: "link",
    title: "Dashboard",
    url: "/hr-panel/dashboard",
    icon: "dashboard-icon",
    value: "dashboard",
  },
  {
    id: 2,
    type: "link",
    title: "Employee Directory",
    url: "/hr-panel/employees",
    icon: "customers-icon",
    value: "employees",
  },
  {
    id: 3,
    type: "link",
    title: "Recruitment & Onboarding",
    url: "/hr-panel/recruitment",
    icon: "student",
    value: "recruitment",
  },
  {
    id: 4,
    type: "link",
    title: "Leave & Attendance",
    url: "/hr-panel/attendance",
    icon: "calendar",
    value: "attendance",
  },
  {
    id: 5,
    type: "link",
    title: "Payroll & Compensation",
    url: "/hr-panel/payroll",
    icon: "invoice",
    value: "payroll",
  },
  {
    id: 6,
    type: "link",
    title: "Performance Reviews",
    url: "/hr-panel/reviews",
    icon: "chart-bar",
    value: "reviews",
  },
  {
    id: 7,
    type: "header",
    title: "INBOX",
  },
  {
    id: 8,
    type: "link",
    title: "Notifications",
    url: "/hr-panel/notifications",
    icon: "Bell",
    value: "notifications",
    count: 2,
  },
];

