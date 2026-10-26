export const API_ENDPOINTS = {
  auth: {
    LOGIN: `/api/v1/auth/login`,
    REFRESH_TOKEN: `/api/v1/auth/refresh`,
  },
  branches: {
    GET_ALL: `/api/v1/admin/branches`,
    GET_BY_ID: (id: string) => `/api/v1/admin/branches/${id}`,
    UPDATE_STATUS: (id: string) => `/api/v1/admin/branches/${id}/status`,
  },
  products: {
    GET_ALL: `/api/v1/products`,
    GET_BY_ID: (id: string) => `/api/v1/products/${id}`,
    GET_ARCHIVED: `/api/v1/products/archive`,
    CREATE: `/api/v1/products`,
    UPDATE: (id: string) => `/api/v1/products/${id}`,
    ARCHIVE: (id: string) => `/api/v1/products/${id}/archive`,
    ARCHIVE_BULK: `/api/v1/products/bulk/archive`,
    RESTORE: (id: string) => `/api/v1/products/${id}/restore`,
    DELETE: (id: string) => `/api/v1/products/${id}`,
    DELETE_BULK: `/api/v1/products/bulk`,
  },
  productCategories: {
    GET_ALL: `/api/v1/admin/product-categories`,
    CREATE: `/api/v1/admin/product-categories`,
    UPDATE: (id: string) => `/api/v1/admin/product-categories/${id}`,
    TOGGLE_STATUS: (id: string) =>
      `/api/v1/admin/product-categories/${id}/toggle-status`,
    GET_PRODUCTS: (id: string) =>
      `/api/v1/admin/product-categories/${id}/products`,
  },
  files: {
    UPLOAD: `/api/v1/files/upload`,
  },
  lecturers: {
    GET_ALL: `/api/v1/admin/lecturers`,
    CREATE: `/api/v1/admin/lecturers`,
    GET_BY_ID: (id: string) => `/api/v1/admin/lecturers/${id}`,
    UPDATE: (id: string) => `/api/v1/admin/lecturers/${id}`,
    UPDATE_STATUS: (id: string) => `/api/v1/admin/lecturers/${id}/status`,
    RECORD_SALARY_PAYMENT: (id: string) =>
      `/api/v1/admin/lecturers/${id}/salary-payments`,
  },
  certificateTemplates: {
    GET_ALL: `/api/v1/admin/certificate-templates`,
    CREATE: `/api/v1/admin/certificate-templates`,
    GET_TEMPLATE_BY_ID: (id: string) =>
      `/api/v1/admin/certificate-templates/${id}`,
    UPDATE_TEMPLATE: (id: string) =>
      `/api/v1/admin/certificate-templates/${id}`,
    ACTIVATE_TEMPLATE: (id: string) =>
      `/api/v1/admin/certificate-templates/${id}/activate`,
    DEACTIVATE_TEMPLATE: (id: string) =>
      `/api/v1/admin/certificate-templates/${id}/deactivate`,
    DELETE_TEMPLATE: (id: string) =>
      `/api/v1/admin/certificate-templates/${id}`,
    DELETE_BULK: `/api/v1/admin/certificate-templates/bulk`,
  },
  documentTemplates: {
    GET_ALL: `/api/v1/admin/documents/templates`,
    GET_BY_ID: (id: string) => `/api/v1/admin/documents/templates/${id}`,
    CREATE: `/api/v1/admin/documents/templates`,
    UPDATE: (id: string) => `/api/v1/admin/documents/templates/${id}`,
    TOGGLE_STATUS: (id: string) =>
      `/api/v1/admin/documents/templates/${id}/toggle-active`,
    DELETE: (id: string) => `/api/v1/admin/documents/templates/${id}`,
    DELETE_BULK: "/api/v1/admin/documents/templates/bulk",
  },
  issuedDocuments: {
    GET_ALL: `/api/v1/admin/documents/issued`,
    GET_BY_ID: (id: string) => `/api/v1/admin/documents/issued/${id}`,
    ISSUE: `/api/v1/admin/documents/issue`,
    RESEND: (id: string) => `/api/v1/admin/documents/issued/${id}/resend`,
    REISSUE: (id: string) => `/api/v1/admin/documents/issued/${id}/reissue`,
    DELETE: (id: string) => `/api/v1/admin/documents/issued/${id}`,
    DELETE_BULK: `/api/v1/admin/documents/issued/bulk`,
  },

  courseCategories: {
    GET_ALL: `/api/v1/categories`,
    CREATE: `/api/v1/categories`,
    UPDATE: (id: string) => `/api/v1/categories/${id}`,
    UPDATE_STATUS: (id: string) => `/api/v1/categories/${id}/status`,
  },
  staff: {
    GET_ALL: `/api/v1/admin/staff`,
    CREATE: `/api/v1/admin/staff`,
    GET_BY_ID: (id: string) => `/api/v1/admin/staff/${id}`,
    UPDATE: (id: string) => `/api/v1/admin/staff/${id}`,
    UPDATE_STATUS: (id: string) => `/api/v1/admin/staff/${id}/status`,
    UPDATE_PRIVILEGES: (id: string) => `/api/v1/admin/staff/${id}/privileges`,
    GET_ASSIGNED_COURSES: (id: string) => `/api/v1/admin/staff/${id}/courses`,
    GET_ASSIGNED_BATCHES: (id: string) => `/api/v1/admin/staff/${id}/batches`,
    MARK_COMMISSION_PAID: (commissionId: string) =>
      `/api/v1/admin/staff/commissions/${commissionId}/pay`,
  },
  complaints: {
    GET_ALL: `/api/v1/admin/complaints`,
    GET_PENDING_ASSIGNMENT: `/api/v1/admin/complaints/pending-assignment`,
    GET_BY_ID: (id: string) => `/api/v1/admin/complaints/${id}`,
    CREATE: `/api/v1/admin/complaints`,
    ASSIGN: (id: string) => `/api/v1/admin/complaints/${id}/assign`,
    UPDATE_STATUS: (id: string) => `/api/v1/admin/complaints/${id}/status`,
    DELETE: () => `/api/v1/admin/complaints`,
  },
  batches: {
    GET_ALL: `/api/v1/batches`,
    CREATE: `/api/v1/batches`,
    GET_BY_ID: (id: string) => `/api/v1/batches/${id}`,
    GET_ANALYTICS: (id: string) => `/api/v1/batches/${id}/analytics`,
    GET_STUDENTS: (id: string) => `/api/v1/batches/${id}/students`,
    UPDATE: (id: string) => `/api/v1/batches/${id}`,
    UPDATE_STATUS: (id: string) => `/api/v1/batches/${id}/status`,
    DEACTIVATE: (id: string) => `/api/v1/batches/${id}/deactivate`,
    GET_SUMMARY: `/api/v1/admin/batches-view/analytics/summary`,
  },
  courses: {
    GET_ALL: `/api/v1/courses`,
    CREATE: `/api/v1/courses`,
    GET_BY_ID: (id: string) => `/api/v1/courses/${id}`,
    UPDATE: (id: string) => `/api/v1/courses/${id}`,
    UPDATE_STATUS: (id: string) => `/api/v1/courses/${id}/status`,
    DEACTIVATE: (id: string) => `/api/v1/courses/${id}/deactivate`,
    GET_STATS: `/api/v1/courses/stats`,

    // Analytics
    GET_ANALYTICS_ALL: `/api/v1/admin/courses-analytics/all-courses`,
    GET_ANALYTICS_SUMMARY: `/api/v1/admin/courses-analytics/all-courses/course-summary`,
    GET_ANALYTICS_STUDENTS: `/api/v1/admin/courses-analytics/all-courses/student-summary`,
    GET_ANALYTICS_DISTRICTS: `/api/v1/admin/courses-analytics/all-courses/enrollment-by-district`,
    GET_ANALYTICS_BREAKDOWN: `/api/v1/admin/courses-analytics/all-courses/breakdown`,
  },
  referrals: {
    GET_AGENTS: `/api/v1/admin/referrals/agents`,
    CREATE: `/api/v1/admin/referrals/agents`,
    GET_SUMMARY: (id: string) => `/api/v1/admin/referrals/agents/${id}/summary`,
    UPDATE: (id: string) => `/api/v1/admin/referrals/agents/${id}`,
    UPDATE_STATUS: (id: string) =>
      `/api/v1/admin/referrals/agents/${id}/status`,
    GET_PAYMENT_REQUESTS_PENDING: `/api/v1/admin/referrals/payment-requests/pending`,
    GET_PAYMENT_REQUESTS_COMPLETED: `/api/v1/admin/referrals/payment-requests/completed`,
    PROCESS_PAYMENT: (id: string) =>
      `/api/v1/admin/referrals/payment-requests/${id}/pay`,
    GET_PAYMENT_HISTORY: (id: string) =>
      `/api/v1/admin/referrals/agents/${id}/payment-history`,
    AGENT_COURSES: (agentId: string) =>
      `/api/v1/admin/referrals/agents/${agentId}/courses`,
    AGENT_BATCHES: (agentId: string) =>
      `/api/v1/admin/referrals/agents/${agentId}/batches`,
    AGENT_TEAM: (agentId: string) =>
      `/api/v1/admin/referrals/agents/${agentId}/team`,
    AGENT_PRODUCTS: (agentId: string) =>
      `/api/v1/admin/referrals/agents/${agentId}/products`,
    STUDENTS: `/api/v1/admin/referrals/students`,
    STUDENT_STATUS: (studentUserId: string) =>
      `/api/v1/admin/referrals/students/${studentUserId}/status`,
  },
  enquiries: {
    GET_ALL: `/api/v1/admin/enquiries`,
    CREATE: `/api/v1/admin/enquiries`,
    GET_BY_ID: (id: string) => `/api/v1/admin/enquiries/${id}`,
    UPDATE: (id: string) => `/api/v1/admin/enquiries/${id}`,
    ADD_FOLLOWUP: (id: string) => `/api/v1/admin/enquiries/${id}/followups`,
    ASSIGN_STAFF: (id: string) => `/api/v1/admin/enquiries/${id}/assign`,
    DELETE: (id: string) => `/api/v1/admin/enquiries/${id}`,
    DELETE_BULK: `/api/v1/admin/enquiries`,
    GET_DASHBOARD: `/api/v1/admin/enquiries/dashboard`,
    BULK_UPDATE_STATUS: `/api/v1/admin/enquiries/bulk/status`,
    BULK_UPDATE_PRIORITY: `/api/v1/admin/enquiries/bulk/priority`,
  },
  certificateRequests: {
    GET_ALL: `/api/v1/admin/certificate-requests`,
    DELETE: (id: string) => `/api/v1/admin/certificate-requests/${id}`,
    DELETE_BULK: `/api/v1/admin/certificate-requests/bulk`,
    UPDATE_STATUS: (id: string) =>
      `/api/v1/admin/certificate-requests/${id}/status`,
  },
  adminStudents: {
    GET_ALL: `/api/v1/admin/students`,
    CREATE: `/api/v1/admin/students`,
    GET_BY_ID: (id: string) => `/api/v1/admin/students/${id}`,
    UPDATE_STATUS: (id: string) => `/api/v1/admin/students/${id}/status`,
  },
  enrollments: {
    GET_ALL: `/api/v1/admin/enrollments`,
    GET_SUMMARY: `/api/v1/admin/enrollments/summary`,
    GET_PAYMENT_DETAILS: (id: string) =>
      `/api/v1/admin/enrollments/${id}/payment-details`,
    ADD_DISCOUNT: (id: string) => `/api/v1/admin/enrollments/${id}/discounts`,
    EMAIL_INVOICE: (id: string) =>
      `/api/v1/admin/enrollments/${id}/email-invoice`,
  },
  approvals: {
    GET_ALL: `/api/v1/admin/approvals`,
    APPROVE: (source: string, paymentId: string) =>
      `/api/v1/admin/approvals/${source}/${paymentId}/approve`,
    REJECT: (source: string, paymentId: string) =>
      `/api/v1/admin/approvals/${source}/${paymentId}/reject`,
  },
  commissions: {
    GET_ALL: `/api/v1/admin/commissions`,
    APPROVE: (id: string) => `/api/v1/admin/commissions/${id}/approve`,
    REJECT: (id: string) => `/api/v1/admin/commissions/${id}/reject`,
  },
  orders: {
    CREATE_ORDER: `/api/v1/admin/orders`,
    GET_ALL: `/api/v1/admin/orders`,
    GET_BY_ID: (id: string) => `/api/v1/admin/orders/${id}`,
    GET_SUMMARY: `/api/v1/admin/orders/summary`,
    GET_INVOICE: (id: string) => `/api/v1/admin/orders/${id}/invoice`,
    GET_WAYBILL: (id: string) => `/api/v1/admin/orders/${id}/delivery-waybill`,
    BULK_UPDATE_STATUS: `/api/v1/admin/orders/bulk/status`,
    UPDATE_STATUS: (id: string) => `/api/v1/admin/orders/${id}/status`,
    EXPORT_ADDRESSES: `/api/v1/admin/orders/export/addresses`,
  },
  finances: {
    OVERVIEW_SUMMARY: `/api/v1/admin/finances/overview/summary`,
    OVERVIEW_GRAPH: `/api/v1/admin/finances/overview/graph`,
    OVERVIEW_TABLE: `/api/v1/admin/finances/overview/table`,
    OVERVIEW_EXPORT: `/api/v1/admin/finances/overview/export`,
    INCOME_SUMMARY: `/api/v1/admin/finances/income/summary`,
    INCOME_LEDGER: `/api/v1/admin/finances/income`,
    INCOME_EXPORT: `/api/v1/admin/finances/income/export`,
    OTHER_INCOME_LIST: `/api/v1/admin/finances/other-income`,
    OTHER_INCOME_CREATE: `/api/v1/admin/finances/other-income`,
    OTHER_INCOME_EXPORT: `/api/v1/admin/finances/other-income/export`,
    PNL_SUMMARY: `/api/v1/admin/finances/pnl/summary`,
    PNL_LIST: `/api/v1/admin/finances/pnl`,
    PNL_DETAIL: (sourceType: string, id: string) =>
      `/api/v1/admin/finances/pnl/${sourceType}/${id}`,
    PNL_EXPORT: `/api/v1/admin/finances/pnl/export`,
    EXPENSES_LIST: `/api/v1/admin/finances/expenses`,
    EXPENSES_CREATE: `/api/v1/admin/finances/expenses`,
    EXPENSES_EXPORT: `/api/v1/admin/finances/expenses/export`,
    BATCH_WISE_SUMMARY: `/api/v1/admin/finances/batch-wise/summary`,
    BATCH_WISE_TABLE: `/api/v1/admin/finances/batch-wise/table`,
    BATCH_WISE_GRAPH: `/api/v1/admin/finances/batch-wise/graph`,
    SALES_BY_ITEMS_TOP5: `/api/v1/admin/products-analytics/items/sales/top-five`,
    SALES_BY_ITEMS_TABLE: `/api/v1/admin/products-analytics/items/sales/table`,
    SALES_BY_ITEMS_EXPORT: `/api/v1/admin/products-analytics/items/sales/export-csv`,
    COURSE_ANALYTICS_SUMMARY: `/api/v1/admin/courses-analytics/all-courses/course-summary`,
    COURSE_ANALYTICS_STUDENT_SUMMARY: `/api/v1/admin/courses-analytics/all-courses/student-summary`,
    COURSE_ANALYTICS_BY_DISTRICT: `/api/v1/admin/courses-analytics/all-courses/enrollment-by-district`,
    COURSE_ANALYTICS_BREAKDOWN: `/api/v1/admin/courses-analytics/all-courses/breakdown`,
    BATCH_ANALYTICS_SUMMARY: `/api/v1/admin/batches-view/analytics/summary`,
    BATCH_ANALYTICS_STUDENT_SUMMARY: `/api/v1/admin/batches-view/analytics/student-summary`,
    BATCH_ANALYTICS_BY_DISTRICT: `/api/v1/admin/batches-view/analytics/enrollment-by-district`,
    BATCH_ANALYTICS_BREAKDOWN: `/api/v1/admin/batches-view/analytics/batch-wise-breakdown`,
    PRODUCT_WISE_SUMMARY: `/api/v1/admin/products-analytics/sales/summary`,
    PRODUCT_WISE_TABLE: `/api/v1/admin/products-analytics/sales/table`,
    PRODUCT_WISE_CHART: `/api/v1/admin/products-analytics/sales/chart`,
    PRODUCT_WISE_EXPORT: `/api/v1/admin/products-analytics/sales/export-csv`,
    COURSE_WISE_SUMMARY: `/api/v1/admin/finances/courses/summary`,
    COURSE_WISE_PAYMENTS: `/api/v1/admin/finances/courses/payments`,
    COURSE_WISE_DISCOUNTS: `/api/v1/admin/finances/courses/discounts`,
    COURSE_WISE_COMMISSIONS: `/api/v1/admin/finances/courses/commissions`,
    COURSE_WISE_EXPENSES: `/api/v1/admin/finances/courses/expenses`,
    COURSE_WISE_NET_PROFIT: `/api/v1/admin/finances/courses/net-profit`,
    COURSE_WISE_CHART: `/api/v1/admin/finances/courses/chart`,
    SOURCE_WISE_SUMMARY: `/api/v1/admin/finances/source-wise/summary`,
    SOURCE_WISE_DETAIL: (via: string) =>
      `/api/v1/admin/finances/source-wise/detail/${via}`,
    SOURCE_WISE_EXPORT: (via: string) =>
      `/api/v1/admin/finances/source-wise/export/${via}`,
  },
  notifications: {
    CREATE: `/api/v1/admin/notifications`,
    GET_SENT: `/api/v1/admin/notifications/sent`,
    GET_SCHEDULED: `/api/v1/admin/notifications/scheduled`,
    UPDATE_SCHEDULED: (id: string) =>
      `/api/v1/admin/notifications/scheduled/${id}`,
    DELETE_SCHEDULED: (id: string) =>
      `/api/v1/admin/notifications/scheduled/${id}`,
    GET_RESPONSE_LOGS: `/api/v1/admin/notifications/response-tracking`,
  },
  website: {
    BANNERS: `/api/v1/website/banners`,
    BANNER: (id: string) => `/api/v1/website/banners/${id}`,
    BANNERS_REORDER: `/api/v1/website/banners/bulk/reorder`,
    GALLERY: `/api/v1/website/gallery`,
    ALBUM: (id: string) => `/api/v1/website/gallery/${id}`,
    ALBUM_IMAGES: (albumId: string) =>
      `/api/v1/website/gallery/${albumId}/images`,
    ALBUM_IMAGE: (albumId: string, imageId: string) =>
      `/api/v1/website/gallery/${albumId}/images/${imageId}`,
    TESTIMONIALS: `/api/v1/website/testimonials`,
    TESTIMONIAL: (id: string) => `/api/v1/website/testimonials/${id}`,
    TESTIMONIALS_REORDER: `/api/v1/website/testimonials/bulk/reorder`,
    TESTIMONIAL_VISIBILITY: (id: string) =>
      `/api/v1/website/testimonials/${id}/visibility`,
    NEWS_POSTS: `/api/v1/website/news-posts`,
    NEWS_POST: (id: string) => `/api/v1/website/news-posts/${id}`,
    NEWS_POST_STATUS: (id: string) => `/api/v1/website/news-posts/${id}/status`,
    TERMS: `/api/v1/website/terms`,
  },
  chat: {
    GET_ROOMS: `/api/v1/chat/rooms`,
    CREATE_DIRECT_ROOM: `/api/v1/chat/rooms/direct`,
    GET_MESSAGES: (roomId: string) => `/api/v1/chat/rooms/${roomId}/messages`,
    MARK_AS_READ: (roomId: string) => `/api/v1/chat/rooms/${roomId}/read`,
    DELETE_MESSAGE: (messageId: string) => `/api/v1/chat/messages/${messageId}`,
    GET_UNREAD_COUNT: `/api/v1/chat/unread-count`,
    UPLOAD_FILE: `/api/v1/chat/upload`,
    GET_PARTICIPANTS: (roomId: string) =>
      `/api/v1/chat/rooms/${roomId}/participants`,
  },
  lecturer: {
    PROFILE: `/api/v1/lecturer/profile`,
    DASHBOARD: `/api/v1/lecturer/dashboard`,
    ASSIGNMENTS: `/api/v1/lecturer/profile/assignments`,
    ASSIGNMENTS_LIST: `/api/v1/lecturer/assignments`,
    ASSIGNMENT: (id: string) => `/api/v1/lecturer/assignments/${id}`,
    ASSIGNMENT_SUBMISSIONS: (assignmentId: string) => `/api/v1/lecturer/assignments/${assignmentId}/submissions`,
    SUBMISSION: (submissionId: string) => `/api/v1/lecturer/assignments/submissions/${submissionId}`,
    SUBMISSION_GRADE: (submissionId: string) => `/api/v1/lecturer/assignments/submissions/${submissionId}/grade`,
    SUBMISSION_COMMENTS: (submissionId: string) => `/api/v1/lecturer/assignments/submissions/${submissionId}/comments`,
    SUBMISSION_FEEDBACK: (submissionId: string) => `/api/v1/lecturer/assignments/submissions/${submissionId}/feedback`,
    SUBMISSIONS: `/api/v1/lecturer/assignments/global/submissions`,
    SALARY: `/api/v1/lecturer/profile/salary`,
    PAYMENTS: `/api/v1/lecturer/profile/payments`,
    CONTENT_TIERS: `/api/v1/lecturer/content/tiers`,
    CONTENT_TIER: (id: string) => `/api/v1/lecturer/content/tiers/${id}`,
    CONTENT_MATERIALS: `/api/v1/lecturer/content/materials`,
    CONTENT_MATERIAL: (id: string) => `/api/v1/lecturer/content/materials/${id}`,
  },
  learning: {
    TIERS: `/api/v1/admin/learning/tiers`,
    TIER_MATERIALS: (tierId: string) => `/api/v1/admin/learning/tiers/${tierId}/materials`,
  },
  dashboard: {
    OVERVIEW: `/api/v1/admin/dashboard/overview`,
    REFERRAL: `/api/v1/admin/dashboard/referral`,
    ANALYTICS: `/api/v1/admin/dashboard/analytics`,
  },
  lookup: {
    GET: `/api/v1/admin/lookup`,
  },
  tasks: {
    GET_ALL: `/api/v1/admin/tasks`,
    CREATE: `/api/v1/admin/tasks`,
    GET_BY_ID: (id: string) => `/api/v1/admin/tasks/${id}`,
    DELETE: (id: string) => `/api/v1/admin/tasks/${id}`,
    DELETE_BULK: `/api/v1/admin/tasks/bulk/delete`,
    FEEDBACK: (submissionId: string) =>
      `/api/v1/admin/tasks/submissions/${submissionId}/feedback`,
  },
  departments: {
    GET_ALL: `/department`,
    CREATE: `/department/create`,
    UPDATE: (id: string) => `/department/${id}`,
    DELETE: (id: string) => `/department/${id}`,
  },
  positions: {
    GET_ALL: `/positions`,
    CREATE: `/positions/create`,
  },
};
