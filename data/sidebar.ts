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
    count: 8,
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
    count: 5,
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
        url: "/approvals/bank-transfers",
        value: "bank-transfers",
        count: 4,
      },
      {
        id: 92,
        type: "link",
        title: "Referral Commissions",
        url: "/approvals/referral-commissions",
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
    url: "/website-management",
  },

  {
    id: 11,
    type: "link",
    title: "Task Management",
    icon: "list-checks",
    value: "task-management",
    url: "/task-management",
    count: 12,
  },

  {
    id: 12,
    type: "link",
    title: "Certificate Management",
    icon: "certificate",
    value: "certificate-management",
    url: "/certificate-management",
  },

  {
    id: 13,
    type: "link",
    title: "Document Management",
    icon: "files",
    value: "document-management",
    url: "/document-management",
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
        url: "/referral-management/referral-listing",
        value: "referral-listing",
      },
      {
        id: 142,
        type: "link",
        title: "Referral Request",
        url: "/referral-management/referral-request",
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
    url: "/branch-management",
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
        url: "/finance/income",
        value: "income",
      },
      {
        id: 162,
        type: "link",
        title: "General Finance",
        url: "/finance/finance",
        value: "finance-sub",
      },
      {
        id: 163,
        type: "link",
        title: "Profit & Loss",
        url: "/finance/profit-and-loss",
        value: "profit-and-loss",
      },
      {
        id: 164,
        type: "link",
        title: "Expenses",
        url: "/finance/expenses",
        value: "expenses",
      },
      {
        id: 165,
        type: "link",
        title: "Source Wise Report",
        url: "/finance/source-wise-report",
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
    url: "/notification-management",
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
        url: "/report-and-analytics/report-by-batches",
        value: "report-by-batches",
      },
      {
        id: 182,
        type: "link",
        title: "Report by Courses",
        url: "/report-and-analytics/report-by-courses",
        value: "report-by-courses",
      },
      {
        id: 183,
        type: "link",
        title: "Report by Products",
        url: "/report-and-analytics/report-by-products",
        value: "report-by-products",
      },
      {
        id: 184,
        type: "link",
        title: "All Batches Analytics",
        url: "/report-and-analytics/all-batches-analytics",
        value: "all-batches-analytics",
      },
      {
        id: 185,
        type: "link",
        title: "All Courses Analytics",
        url: "/report-and-analytics/all-courses-analytics",
        value: "all-courses-analytics",
      },
      {
        id: 186,
        type: "link",
        title: "Sales by Items",
        url: "/report-and-analytics/sales-by-items",
        value: "sales-by-items",
      },
    ],
  },
];