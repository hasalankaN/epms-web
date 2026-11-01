import type { SidebarNavItem } from "./sidebar";

export const supervisorSidebarData: SidebarNavItem[] = [
  // OVERVIEW
  {
    id: 1,
    type: "header",
    title: "OVERVIEW",
  },
  {
    id: 2,
    type: "link",
    title: "Dashboard",
    url: "/supervisor-panel/dashboard",
    icon: "dashboard-icon",
    value: "dashboard",
  },

  // TEAM MANAGEMENT
  {
    id: 3,
    type: "header",
    title: "TEAM MANAGEMENT",
  },
  {
    id: 4,
    type: "link",
    title: "My Team",
    url: "/supervisor-panel/team",
    icon: "customers-icon",
    value: "team",
  },
  {
    id: 5,
    type: "link",
    title: "Approvals",
    url: "/supervisor-panel/approvals",
    icon: "approvals",
    value: "approvals",
  },
  {
    id: 6,
    type: "link",
    title: "Team Attendance",
    url: "/supervisor-panel/attendance",
    icon: "clock",
    value: "attendance",
  },
  {
    id: 7,
    type: "link",
    title: "Task Allocations",
    url: "/supervisor-panel/tasks",
    icon: "list-checks",
    value: "tasks",
  },
  {
    id: 8,
    type: "link",
    title: "Appraisals & KPIs",
    url: "/supervisor-panel/kpis",
    icon: "star",
    value: "kpis",
  },
  {
    id: 9,
    type: "link",
    title: "Team Training",
    url: "/supervisor-panel/training",
    icon: "training",
    value: "training",
  },

  // SETTINGS & INBOX
  {
    id: 10,
    type: "header",
    title: "INBOX & ACCOUNT",
  },
  {
    id: 11,
    type: "link",
    title: "Notifications",
    url: "/supervisor-panel/notifications",
    icon: "Bell",
    value: "notifications",
    count: 2,
  },
  {
    id: 12,
    type: "link",
    title: "Profile & Settings",
    url: "/supervisor-panel/settings",
    icon: "settings",
    value: "settings",
  },
];
