import type { SidebarNavItem } from "./sidebar";

export const referralSidebarData: SidebarNavItem[] = [
  {
    id: 1,
    type: "link",
    title: "Dashboard",
    url: "/referral-panel/dashboard",
    icon: "dashboard-icon",
    value: "dashboard",
  },
  {
    id: 2,
    type: "link",
    title: "My Student",
    url: "/referral-panel/my-students",
    icon: "student",
    value: "my-student",
  },
  {
    id: 3,
    type: "link",
    title: "My Commissions",
    url: "/referral-panel/my-commissions",
    icon: "money-wavy",
    value: "my-commissions",
  },
];
