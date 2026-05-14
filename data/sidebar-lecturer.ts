import type { SidebarNavItem } from "./sidebar";

export const lecturerSidebarData: SidebarNavItem[] = [
  {
    id: 1,
    type: "link",
    title: "Dashboard",
    url: "/lecturer-panel/dashboard",
    icon: "dashboard-icon",
    value: "dashboard",
  },
  {
    id: 2,
    type: "link",
    title: "Courses",
    url: "/lecturer-panel/courses",
    icon: "products-icon",
    value: "courses",
  },
  {
    id: 3,
    type: "link",
    title: "Batches",
    url: "/lecturer-panel/batches",
    icon: "customers-icon",
    value: "batches",
  },
  {
    id: 4,
    type: "link",
    title: "Assignment",
    url: "/lecturer-panel/assignment",
    icon: "list-checks",
    value: "assignment",
  },
];
