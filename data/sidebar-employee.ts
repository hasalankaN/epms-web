import type { SidebarNavItem } from "./sidebar";

export const employeeSidebarData: SidebarNavItem[] = [
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
    url: "/employee-panel/dashboard",
    icon: "LayoutDashboard",
    value: "dashboard",
  },

  // MY WORK
  {
    id: 3,
    type: "header",
    title: "MY WORK",
  },
  {
    id: 4,
    type: "link",
    title: "My Profile",
    url: "/employee-panel/profile",
    icon: "User",
    value: "profile",
  },
  {
    id: 5,
    type: "link",
    title: "Attendance",
    url: "/employee-panel/attendance",
    icon: "Clock",
    value: "attendance",
  },
  {
    id: 6,
    type: "link",
    title: "Leave",
    url: "/employee-panel/leaves",
    icon: "Calendar",
    value: "leaves",
  },
  {
    id: 7,
    type: "link",
    title: "Tasks",
    url: "/employee-panel/tasks",
    icon: "ClipboardCheck",
    value: "tasks",
  },
  {
    id: 8,
    type: "link",
    title: "Training",
    url: "/employee-panel/training",
    icon: "GraduationCap",
    value: "training",
  },
  {
    id: 9,
    type: "link",
    title: "Salary",
    url: "/employee-panel/salary",
    icon: "DollarSign",
    value: "salary",
  },
  {
    id: 10,
    type: "link",
    title: "Self Evaluation",
    url: "/employee-panel/performance",
    icon: "Star",
    value: "performance",
  },
  {
    id: 11,
    type: "link",
    title: "Internal Jobs",
    url: "/employee-panel/jobs",
    icon: "Briefcase",
    value: "jobs",
  },

  // INBOX
  {
    id: 12,
    type: "header",
    title: "INBOX",
  },
  {
    id: 13,
    type: "link",
    title: "Notifications",
    url: "/employee-panel/notifications",
    icon: "Bell",
    value: "notifications",
    count: 3,
  },
];
