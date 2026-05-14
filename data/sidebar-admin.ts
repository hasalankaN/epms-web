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
    count: 8,
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
    count: 5,
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
    count: 2,
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
        count: 4,
      },
      {
        id: 92,
        type: "link",
        title: "Referral Commissions",
        url: "/admin-panel/approvals/referral-commissions",
        value: "referral-commissions",
        count: 3,
      },
    ],
  },

  {
    id: 10,
    type: "link",
    title: "Website Management",
    icon: "globe",
    value: "website-management",
    url: "/admin-panel/website-management",
  },

  {
    id: 11,
    type: "link",
    title: "Task Management",
    icon: "list-checks",
    value: "task-management",
    url: "/admin-panel/task-management",
    count: 12,
  },

  {
    id: 12,
    type: "link",
    title: "Certificate Management",
    icon: "certificate",
    value: "certificate-management",
    url: "/admin-panel/certificate-management",
  },

  {
    id: 13,
    type: "link",
    title: "Document Management",
    icon: "files",
    value: "document-management",
    url: "/admin-panel/document-management",
  },

  {
    id: 14,
    type: "sub",
    title: "Referral Management",
    icon: "handshake",
    children: [
      {
        id: 141,
        type: "link",
        title: "Referral Listing",
        url: "/admin-panel/referral-management/referral-listing",
        value: "referral-listing",
      },
      {
        id: 142,
        type: "link",
        title: "Referral Request",
        url: "/admin-panel/referral-management/referral-request",
        value: "referral-request",
      },
    ],
  },

  {
    id: 15,
    type: "link",
    title: "Branch Management",
    icon: "building",
    value: "branch-management",
    url: "/admin-panel/branch-management",
  },

  {
    id: 16,
    type: "sub",
    title: "Finance",
    icon: "invoice",
    children: [
      {
        id: 161,
        type: "link",
        title: "Income",
        url: "/admin-panel/finance/income",
        value: "income",
      },
      {
        id: 162,
        type: "link",
        title: "General Finance",
        url: "/admin-panel/finance/finance",
        value: "finance-sub",
      },
      {
        id: 163,
        type: "link",
        title: "Profit & Loss",
        url: "/admin-panel/finance/profit-and-loss",
        value: "profit-and-loss",
      },
      {
        id: 164,
        type: "link",
        title: "Expenses",
        url: "/admin-panel/finance/expenses",
        value: "expenses",
      },
      {
        id: 165,
        type: "link",
        title: "Source Wise Report",
        url: "/admin-panel/finance/source-wise-report",
        value: "source-wise-report",
      },
    ],
  },

  {
    id: 17,
    type: "link",
    title: "Notification Management",
    icon: "notification-bell-icon",
    value: "notification-management",
    url: "/admin-panel/notification-management",
  },

  {
    id: 18,
    type: "sub",
    title: "Report & Analytics",
    icon: "chart-bar",
    children: [
      {
        id: 181,
        type: "link",
        title: "Report by Batches",
        url: "/admin-panel/report-and-analytics/report-by-batches",
        value: "report-by-batches",
      },
      {
        id: 182,
        type: "link",
        title: "Report by Courses",
        url: "/admin-panel/report-and-analytics/report-by-courses",
        value: "report-by-courses",
      },
      {
        id: 183,
        type: "link",
        title: "Report by Products",
        url: "/admin-panel/report-and-analytics/report-by-products",
        value: "report-by-products",
      },
      {
        id: 184,
        type: "link",
        title: "All Batches Analytics",
        url: "/admin-panel/report-and-analytics/all-batches-analytics",
        value: "all-batches-analytics",
      },
      {
        id: 185,
        type: "link",
        title: "All Courses Analytics",
        url: "/admin-panel/report-and-analytics/all-courses-analytics",
        value: "all-courses-analytics",
      },
      {
        id: 186,
        type: "link",
        title: "Sales by Items",
        url: "/admin-panel/report-and-analytics/sales-by-items",
        value: "sales-by-items",
      },
    ],
  },
];
