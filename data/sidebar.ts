export type SidebarNavItem = {
  id: number;
  type: "link" | "sub" | "header";
  title: string;
  icon?: string;
  url?: string;
  value?: string;
  children?: SidebarNavItem[];
  count?: number;
  external?: boolean;
};

export const sidebarData: SidebarNavItem[] = [
  {
    id: 1,
    type: "link",
    title: "Dashboard",
    url: "/dashboard",
    icon: "dashboard-icon",
    value: "dashboard",
  },

  {
    id: 2,
    type: "link",
    title: "Inquiry Management",
    icon: "question",
    value: "inquiry",
    url: "/inquiry",
  },

  {
    id: 3,
    type: "link",
    title: "Batch Management",
    icon: "customers-icon",
    value: "batch-management",
    url: "/batch-management",
  },

  {
    id: 4,
    type: "link",
    title: "Course Management",
    icon: "book-open-text",
    value: "course-management",
    url: "/course-management",
  },

  {
    id: 5,
    type: "link",
    title: "Enroll Management",
    icon: "student",
    value: "enroll-management",
    url: "/enroll-management",
  },

  {
    id: 6,
    type: "link",
    title: "Product Management",
    icon: "package",
    value: "product-management",
    url: "/product-management",
  },

  {
    id: 7,
    type: "link",
    title: "User Management",
    icon: "user-gear",
    value: "user-management",
    url: "/user-management",
  },

  {
    id: 8,
    type: "link",
    title: "Complaint Management",
    icon: "warning-circle",
    value: "complaint-management",
    url: "/complaint-management",
  },

  {
    id: 9,
    type: "sub",
    title: "Approvals",
    icon: "stamp",
    children: [
      {
        id: 91,
        type: "link",
        title: "Bank Transfers",
        url: "/approvals/bank-transfers",
        value: "bank-transfers",
      },
      {
        id: 92,
        type: "link",
        title: "Referral Commissions",
        url: "/approvals/referral-commissions",
        value: "referral-commissions",
      },
    ],
  },

  {
    id: 10,
    type: "link",
    title: "Task Management",
    icon: "list-checks",
    value: "task-management",
    url: "/task-management",
  },

  {
    id: 11,
    type: "link",
    title: "Certificate Management",
    icon: "certificate",
    value: "certificate-management",
    url: "/certificate-management",
  },

  {
    id: 12,
    type: "link",
    title: "Document Management",
    icon: "files",
    value: "document-management",
    url: "/document-management",
  },

  {
    id: 13,
    type: "link",
    title: "Branch Management",
    icon: "building",
    value: "branch-management",
    url: "/branch-management",
  },
];