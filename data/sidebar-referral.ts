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
  {
    id: 4,
    type: "link",
    title: "My Teams",
    url: "/referral-panel/my-teams",
    icon: "users-three",
    value: "my-teams",
  },
  {
    id: 5,
    type: "link",
    title: "My Payments",
    url: "/referral-panel/my-payments",
    icon: "invoice",
    value: "my-payments",
  },
  {
    id: 6,
    type: "link",
    title: "Courses and Batches",
    url: "/referral-panel/courses-and-batches",
    icon: "book-open-text",
    value: "courses-and-batches",
  },
];
