import type { SidebarNavItem } from "./sidebar";

export const adminSidebarData: SidebarNavItem[] = [
  {
    id: 1,
    type: "link",
    title: "Dashboard",
    url: "/admin-panel/dashboard",
    icon: "dashboard-icon",
    value: "dashboard",
  },

  {
    id: 2,
    type: "link",
    title: "Inquiry Management",
    icon: "question",
    value: "inquiry",
    url: "/admin-panel/inquiry",
  },

  {
    id: 3,
    type: "link",
    title: "Batch Management",
    icon: "customers-icon",
    value: "batch-management",
    url: "/admin-panel/batch-management",
  },

  {
    id: 4,
    type: "link",
    title: "Course Management",
    icon: "book-open-text",
    value: "course-management",
    url: "/admin-panel/course-management",
  },

  {
    id: 5,
    type: "link",
    title: "Enroll Management",
    icon: "student",
    value: "enroll-management",
    url: "/admin-panel/enroll-management",
  },

  {
    id: 6,
    type: "link",
    title: "Product Management",
    icon: "package",
    value: "product-management",
    url: "/admin-panel/product-management",
  },

  {
    id: 7,
    type: "link",
    title: "User Management",
    icon: "user-gear",
    value: "user-management",
    url: "/admin-panel/user-management",
  },

  {
    id: 8,
    type: "link",
    title: "Complaint Management",
    icon: "warning-circle",
    value: "complaint-management",
    url: "/admin-panel/complaint-management",
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
        url: "/admin-panel/approvals/bank-transfers",
        value: "bank-transfers",
      },
      {
        id: 92,
        type: "link",
        title: "Referral Commissions",
        url: "/admin-panel/approvals/referral-commissions",
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
    url: "/admin-panel/task-management",
  },

  {
    id: 11,
    type: "link",
    title: "Certificate Management",
    icon: "certificate",
    value: "certificate-management",
    url: "/admin-panel/certificate-management",
  },

  {
    id: 12,
    type: "link",
    title: "Document Management",
    icon: "files",
    value: "document-management",
    url: "/admin-panel/document-management",
  },

  {
    id: 13,
    type: "link",
    title: "Branch Management",
    icon: "building",
    value: "branch-management",
    url: "/admin-panel/branch-management",
  },

  {
    id: 14,
    type: "sub",
    title: "Finance",
    icon: "invoice",
    children: [
      {
        id: 141,
        type: "link",
        title: "Income",
        url: "/admin-panel/finance/income",
        value: "income",
      },
      {
        id: 142,
        type: "link",
        title: "Finance",
        url: "/admin-panel/finance/finance",
        value: "finance-sub",
      },
      {
        id: 143,
        type: "link",
        title: "Profit & Loss",
        url: "/admin-panel/finance/profit-and-loss",
        value: "profit-and-loss",
      },
      {
        id: 144,
        type: "link",
        title: "Expenses",
        url: "/admin-panel/finance/expenses",
        value: "expenses",
      },
      {
        id: 145,
        type: "link",
        title: "Source Wise Report",
        url: "/admin-panel/finance/source-wise-report",
        value: "source-wise-report",
      },
    ],
  },
];
