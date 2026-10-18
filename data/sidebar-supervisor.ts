import type { SidebarNavItem } from "./sidebar";

export const supervisorSidebarData: SidebarNavItem[] = [
  {
    id: 1,
    type: "link",
    title: "Dashboard",
    url: "/supervisor-panel/dashboard",
    icon: "dashboard-icon",
    value: "dashboard",
  },
  {
    id: 2,
    type: "link",
    title: "My Team",
    url: "/supervisor-panel/team",
    icon: "customers-icon",
    value: "team",
  },
  {
    id: 3,
    type: "link",
    title: "Task Allocations",
    url: "/supervisor-panel/tasks",
    icon: "list-checks",
    value: "tasks",
  },
  {
    id: 4,
    type: "link",
    title: "Appraisals & KPIs",
    url: "/supervisor-panel/kpis",
    icon: "chart-bar",
    value: "kpis",
  },
  {
    id: 5,
    type: "link",
    title: "Leave Approvals",
    url: "/supervisor-panel/approvals",
    icon: "stamp",
    value: "approvals",
  },
];
