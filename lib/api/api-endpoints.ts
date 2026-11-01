export const API_ENDPOINTS = {
  auth: {
    LOGIN: `/auth/login`,
    REFRESH_TOKEN: `/auth/refresh`,
    LOGOUT: `/auth/logout`,
    CHANGE_PASSWORD: `/auth/change-password`,
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
    UPLOAD: `/files/upload`,
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
    GET_INVESTIGATION: (id: string) =>
      `/api/v1/admin/complaints/${id}/investigation`,
    ASSIGN_INVESTIGATOR: (id: string) =>
      `/api/v1/admin/complaints/${id}/assign-investigator`,
    REASSIGN_INVESTIGATOR: (id: string) =>
      `/api/v1/admin/complaints/${id}/reassign-investigator`,
    SUBMIT_FINDINGS: (id: string) =>
      `/api/v1/admin/complaints/${id}/investigation/findings`,
    RESOLVE: (id: string) => `/api/v1/admin/complaints/${id}/resolve`,
    REJECT: (id: string) => `/api/v1/admin/complaints/${id}/reject`,
    ESCALATE: (id: string) => `/api/v1/admin/complaints/${id}/escalate`,
    CLOSE: (id: string) => `/api/v1/admin/complaints/${id}/close`,
    GET_TIMELINE: (id: string) => `/api/v1/admin/complaints/${id}/timeline`,
    ASSIGNED_TO_ME: `/api/v1/admin/complaints/investigator/assigned-to-me`,
    ADD_EVIDENCE: (id: string) =>
      `/api/v1/admin/complaints/${id}/investigation/evidence`,
    REMOVE_EVIDENCE: (id: string, evidenceId: string) =>
      `/api/v1/admin/complaints/${id}/investigation/evidence/${evidenceId}`,
  },
  studentBatches: {
    GET_ACTIVE_STUDENTS_BY_BATCH_ID: (id: string) =>
      `/api/v1/admin/batches/${id}/students`,
  },
  batches: {
    GET_ALL: `/api/v1/admin/batches`,
    CREATE: `/api/v1/admin/batches`,
    GET_BY_ID: (id: string) => `/api/v1/admin/batches/${id}`,
    UPDATE: (id: string) => `/api/v1/admin/batches/${id}`,
    UPDATE_STATUS: (id: string) => `/api/v1/admin/batches/${id}/status`,
    UPDATE_MODULE_STATUS: (id: string, moduleId: string) =>
      `/api/v1/admin/batches/${id}/modules/${moduleId}/status`,
    GET_BATCH_LECTURERS: (id: string) =>
      `/api/v1/admin/batches/${id}/lecturers`,
    ASSIGN_LECTURER: (id: string) => `/api/v1/admin/batches/${id}/lecturers`,
    REMOVE_LECTURER: (id: string, lecturerId: string) =>
      `/api/v1/admin/batches/${id}/lecturers/${lecturerId}`,
    GET_ASSIGNED_MODULES_BY_BATCH_AND_LECTURER: (
      id: string,
      lecturerId: string,
    ) => `/api/v1/admin/batches/${id}/lecturers/${lecturerId}/modules`,
    GET_PAYMENTS: (id: string) => `/api/v1/admin/batches/${id}/payments`,
    GET_STUDENT_STATUS_HISTORY: (batchId: string, studentId: string) =>
      `/api/v1/admin/batches/${batchId}/students/${studentId}/status-history`,
    GET_ELIGIBLE_STUDENTS: (id: string) =>
      `/api/v1/admin/batches/${id}/eligible-students`,
    ENROLL_STUDENTS: (id: string) =>
      `/api/v1/admin/batches/${id}/enroll-students`,
    CHANGE_STUDENT_STATUS: (batchId: string, studentId: string) =>
      `/api/v1/admin/batches/${batchId}/students/${studentId}/status`,
  },
  batchTransferRequests: {
    GET_ALL: `/api/v1/admin/batch-transfers`,
    CREATE: `/api/v1/admin/batch-transfers`,
    APPROVE: (id: string) => `/api/v1/admin/batch-transfers/${id}/approve`,
    REJECT: (id: string) => `/api/v1/admin/batch-transfers/${id}/reject`,
    GET_ELIGIBLE_BATCHES: (studentId: string, currentBatchId: string) =>
      `/api/v1/admin/batch-transfers/eligible-batches?student_id=${studentId}&current_batch_id=${currentBatchId}`,
    GET_PENDING_TRANSFERS: `/api/v1/admin/batch-transfers/pending`,
  },
  courses: {
    GET_ALL: `/api/v1/admin/courses`,
    GET_ARCHIVED: `/api/v1/admin/courses/archived`,
    CREATE: `/api/v1/admin/courses`,
    UPDATE: (id: string) => `/api/v1/admin/courses/${id}`,
    RESTORE: (id: string) => `/api/v1/admin/courses/${id}/restore`,
    ARCHIVE: (id: string) => `/api/v1/admin/courses/${id}/archive`,
    GET_BY_ID: (id: string) => `/api/v1/admin/courses/${id}`,
    GET_MODULE_BY_ID: (id: string) => `/api/v1/admin/courses/modules/${id}`,
    ADD_MODULE: `/api/v1/admin/courses/modules`,
    UPDATE_MODULE: (id: string) => `/api/v1/admin/courses/modules/${id}`,
    UPDATE_STATUS: (id: string) => `/api/v1/admin/courses/${id}/status`,
    UPDATE_ORDER: `/api/v1/admin/courses/modules/order`,
    ASSIGN_PREREQUISITE_COURSE: (id: string) =>
      `/api/v1/admin/courses/${id}/prerequisites/course`,
    ASSIGN_PREREQUISITE_QUALIFICATION: (id: string) =>
      `/api/v1/admin/courses/${id}/prerequisites/qualification`,
    REMOVE_PREREQUISITE_COURSE: (id: string, courseId: string) =>
      `/api/v1/admin/courses/${id}/prerequisites/course/${courseId}`,
    REMOVE_PREREQUISITE_QUALIFICATION: (id: string, qualificationId: string) =>
      `/api/v1/admin/courses/${id}/prerequisites/qualification/${qualificationId}`,
    GET_PREREQUISITES: (id: string) =>
      `/api/v1/admin/courses/${id}/prerequisites`,
    SEARCH: `/api/v1/admin/courses/search`,
  },
  qualifications: {
    GET_ALL: `/api/v1/admin/qualifications`,
    CREATE: `/api/v1/admin/qualifications`,
    UPDATE: (id: string) => `/api/v1/admin/qualifications/${id}`,
    DELETE: (id: string) => `/api/v1/admin/qualifications/${id}`,
    GET_BY_ID: (id: string) => `/api/v1/admin/qualifications/${id}`,
    UPDATE_STATUS: (id: string) => `/api/v1/admin/qualifications/${id}/status`,
  },
  students: {
    GET_ALL: `/api/v1/admin/students`,
    CREATE: `/api/v1/admin/students`,
    UPDATE: (id: string) => `/api/v1/admin/students/${id}`,
    GET_BY_ID: (id: string) => `/api/v1/admin/students/${id}`,
    GET_ACTIVE_STUDENTS: `/api/v1/admin/students/active`,
    UPDATE_STATUS: (id: string) => `/api/v1/admin/students/${id}/status`,
    GET_STUDENT_COURSES: (id: string) =>
      `/api/v1/admin/students/${id}/courses`,
    GET_STUDENT_BATCHES: (id: string) =>
      `/api/v1/admin/students/${id}/batches`,
    GET_PAYMENTS: (id: string) => `/api/v1/admin/students/${id}/payments`,
    GET_COMMISSIONS: (id: string) =>
      `/api/v1/admin/students/${id}/commissions`,
    GENERATE_CERTIFICATE: (studentId: string, courseId: string) =>
      `/api/v1/admin/students/${studentId}/courses/${courseId}/certificate`,
    GET_STUDENT_CERTIFICATES: (studentId: string) =>
      `/api/v1/admin/students/${studentId}/certificates`,
  },
  payments: {
    GET_ALL: `/api/v1/admin/payments`,
    RECORD_OFFLINE_PAYMENT: `/api/v1/admin/payments/offline`,
    GET_BY_ID: (id: string) => `/api/v1/admin/payments/${id}`,
    VERIFY_PAYMENT: (id: string) => `/api/v1/admin/payments/${id}/verify`,
    REJECT_PAYMENT: (id: string) => `/api/v1/admin/payments/${id}/reject`,
    GET_REFUND_REQUESTS: `/api/v1/admin/payments/refund-requests`,
    APPROVE_REFUND: (id: string) =>
      `/api/v1/admin/payments/refund-requests/${id}/approve`,
    REJECT_REFUND: (id: string) =>
      `/api/v1/admin/payments/refund-requests/${id}/reject`,
    GET_STATISTICS: `/api/v1/admin/payments/statistics`,
    GET_COMMISSIONS: `/api/v1/admin/payments/commissions`,
    APPROVE_COMMISSION: (id: string) =>
      `/api/v1/admin/payments/commissions/${id}/approve`,
    REJECT_COMMISSION: (id: string) =>
      `/api/v1/admin/payments/commissions/${id}/reject`,
    DISBURSE_COMMISSION: (id: string) =>
      `/api/v1/admin/payments/commissions/${id}/disburse`,
  },
  enrollment: {
    ENROLL_STUDENT: `/api/v1/admin/enrollments`,
    GENERATE_PAYMENT_PLAN: `/api/v1/admin/enrollments/payment-plan`,
    CHECK_ELIGIBILITY: `/api/v1/admin/enrollments/eligibility`,
  },
  discounts: {
    GET_ALL: `/api/v1/admin/discounts`,
    CREATE: `/api/v1/admin/discounts`,
    UPDATE: (id: string) => `/api/v1/admin/discounts/${id}`,
    GET_BY_ID: (id: string) => `/api/v1/admin/discounts/${id}`,
    UPDATE_STATUS: (id: string) => `/api/v1/admin/discounts/${id}/status`,
    CHECK_PROMO_CODE: `/api/v1/admin/discounts/check-code`,
  },
  dashboard: {
    GET_DASHBOARD: `/api/v1/admin/dashboard`,
  },
  profile: {
    GET_PROFILE: `/api/v1/admin/profile`,
    UPDATE_PROFILE: `/api/v1/admin/profile`,
  },
  // LMS Lecturer APIs
  lecturer: {
    DASHBOARD: `/api/v1/lecturer/dashboard`,
    PROFILE: `/api/v1/lecturer/profile`,
    BATCHES: `/api/v1/lecturer/batches`,
    BATCH_BY_ID: (id: string) => `/api/v1/lecturer/batches/${id}`,
    MODULES: `/api/v1/lecturer/modules`,
    SESSIONS: `/api/v1/lecturer/sessions`,
    SESSION_BY_ID: (id: string) => `/api/v1/lecturer/sessions/${id}`,
    ATTENDANCE: (sessionId: string) =>
      `/api/v1/lecturer/sessions/${sessionId}/attendance`,
    MATERIALS: `/api/v1/lecturer/materials`,
    MATERIAL_BY_ID: (id: string) => `/api/v1/lecturer/materials/${id}`,
    STUDENTS: (batchId: string) =>
      `/api/v1/lecturer/batches/${batchId}/students`,
    STUDENT_BY_ID: (id: string) => `/api/v1/lecturer/students/${id}`,
    ANNOUNCEMENTS: `/api/v1/lecturer/announcements`,
    ANNOUNCEMENT_BY_ID: (id: string) =>
      `/api/v1/lecturer/announcements/${id}`,
    NOTIFICATIONS: `/api/v1/lecturer/notifications`,
    NOTIFICATION_MARK_AS_READ: (id: string) =>
      `/api/v1/lecturer/notifications/${id}/read`,
    NOTIFICATION_MARK_ALL_AS_READ: `/api/v1/lecturer/notifications/read-all`,
    SALARY: `/api/v1/lecturer/profile/salary`,
    SUBMIT_PROPOSAL: `/api/v1/lecturer/proposals`,
    MY_PROPOSALS: `/api/v1/lecturer/proposals/my`,
    GET_ALL_COURSES: `/api/v1/lecturer/courses`,
  },
  // LMS Student APIs
  student: {
    DASHBOARD: `/api/v1/student/dashboard`,
    PROFILE: `/api/v1/student/profile`,
    BATCHES: `/api/v1/student/batches`,
    BATCH_BY_ID: (id: string) => `/api/v1/student/batches/${id}`,
    SESSIONS: `/api/v1/student/sessions`,
    SESSION_BY_ID: (id: string) => `/api/v1/student/sessions/${id}`,
    MATERIALS: `/api/v1/student/materials`,
    PAYMENTS: `/api/v1/student/payments`,
    PAYMENT_BY_ID: (id: string) => `/api/v1/student/payments/${id}`,
    ANNOUNCEMENTS: `/api/v1/student/announcements`,
    NOTIFICATIONS: `/api/v1/student/notifications`,
    NOTIFICATION_MARK_AS_READ: (id: string) =>
      `/api/v1/student/notifications/${id}/read`,
    NOTIFICATION_MARK_ALL_AS_READ: `/api/v1/student/notifications/read-all`,
    CERTIFICATES: `/api/v1/student/certificates`,
  },
  // Departments & Positions
  departments: {
    GET_ALL: `/department`,
    CREATE: `/department/create`,
    GET_BY_ID: (id: string) => `/department/${id}`,
    UPDATE: (id: string) => `/department/${id}`,
    DELETE: (id: string) => `/department/${id}`,
  },
  positions: {
    GET_ALL: `/positions`,
    CREATE: `/positions/create`,
    GET_BY_ID: (id: string) => `/positions/${id}`,
    UPDATE: (id: string) => `/positions/${id}`,
    DELETE: (id: string) => `/positions/${id}`,
  },
  employees: {
    GET_ALL: `/employee`,
    CREATE: `/employee/register`,
    GET_BY_ID: (id: string) => `/employee/${id}`,
    GET_SUPERVISORS: `/employee/supervisors`,
  },
  employee: {
    REGISTER: `/employee/register`,
    GET_ALL: `/employee`,
    GET_SUPERVISORS: `/employee/supervisors`,
    GET_BY_ID: (id: string) => `/employee/${id}`,
  },

  // EPMS Real Endpoints (mounted without /api/v1)
  me: {
    PROFILE: "/me/profile",
    PROFILE_UPDATE_REQUESTS: "/me/profile-update-requests",
    ATTENDANCE: "/me/attendance",
    CLOCK_IN: "/me/attendance/clock-in",
    CLOCK_OUT: "/me/attendance/clock-out",
    ATTENDANCE_ADJUSTMENTS: "/me/attendance/adjustments",
    LEAVES: "/me/leaves",
    LEAVE_BALANCES: "/me/leave-balances",
    TASKS: "/me/tasks",
    TASK_STATUS: (id: string) => `/me/tasks/${id}/status`,
    PRODUCTION: "/me/production",
    TRAININGS: "/me/trainings",
    TRAINING_MATERIALS: (id: string) => `/me/trainings/${id}/materials`,
    TRAINING_EVALUATION: (id: string) => `/me/trainings/${id}/evaluation`,
    SALARY: "/me/salary",
    SALARY_SLIPS: "/me/salary-slips",
    SALARY_SLIP_DOWNLOAD: (id: string) => `/me/salary-slips/${id}/download`,
    JOB_POSTINGS: "/me/job-postings",
    APPLY_JOB: "/me/job-postings/apply",
    APPLICATIONS: "/me/applications",
    CANCEL_APPLICATION: (id: string) => `/me/applications/${id}`,
    SELF_EVALUATION_CURRENT: "/me/self-evaluations/current",
    SELF_EVALUATIONS: "/me/self-evaluations",
    PERFORMANCE_REVIEWS: "/me/performance-reviews",
    NOTIFICATIONS: "/me/notifications",
    NOTIFICATIONS_READ_ALL: "/me/notifications/read-all",
    NOTIFICATION_READ: (id: string) => `/me/notifications/${id}/read`,
  },

  supervisor: {
    PROFILE: "/supervisor/profile",
    TEAM: "/supervisor/team",
    TEAM_MEMBER: (id: string) => `/supervisor/team/${id}`,
    LEAVES: "/supervisor/leaves",
    LEAVE_DECISION: (id: string) => `/supervisor/leaves/${id}/decision`,
    ATTENDANCE: "/supervisor/attendance",
    ATTENDANCE_UPDATE: (id: string) => `/supervisor/attendance/${id}`,
    ATTENDANCE_ADJUSTMENT_DECISION: (id: string) => `/supervisor/attendance/adjustments/${id}`,
    TASKS: "/supervisor/tasks",
    TASK_DETAIL: (id: string) => `/supervisor/tasks/${id}`,
    PRODUCTION: "/supervisor/production",
    PRODUCTION_APPROVAL: (id: string) => `/supervisor/production/${id}/approval`,
    EVALUATION_MEETINGS: "/supervisor/evaluation-meetings",
    PERFORMANCE_EVALUATIONS: "/supervisor/performance-evaluations",
    TRAININGS_ATTENDANCE: "/supervisor/trainings/attendance",
  },

  hr: {
    EMPLOYEE_REQUEST: "/hr/employee-request",
    EMPLOYEE_REQUESTS: "/hr/employee-requests",
    EMPLOYEE_REQUEST_DETAIL: (id: string) => `/hr/employee-requests/${id}`,
    EMPLOYEES: "/hr/employees",
    EMPLOYEE_DETAIL: (id: string) => `/hr/employees/${id}`,
    PROFILE_REQUESTS: "/hr/requests/profile-updates",
    PROFILE_REQUEST_DECISION: (id: string) => `/hr/requests/profile-updates/${id}`,
    ATTENDANCE: "/hr/attendance",
    ATTENDANCE_SUMMARY: (empId: string) => `/hr/attendance/${empId}/summary`,
    ATTENDANCE_NOTIFY: "/hr/attendance/notify",
    OVERTIME: "/hr/attendance/overtime",
    TRAININGS: "/hr/trainings",
    TRAINING_DETAIL: (id: string) => `/hr/trainings/${id}`,
    LEAVES: "/hr/leaves",
    LEAVE_DECISION: (id: string) => `/hr/leaves/${id}/decision`,
    LEAVE_SPECIAL: "/hr/leaves/special",
    LEAVE_BALANCES: (empId: string) => `/hr/leave-balances/${empId}`,
    LEAVE_POLICIES: "/hr/leave-policies",
    LEAVE_POLICY_DETAIL: (leaveType: string) => `/hr/leave-policies/${leaveType}`,
    PRODUCTION: "/hr/production",
    PRODUCTION_REPORT: "/hr/production/report",
    PERFORMANCE_REVIEWS: "/hr/performance-reviews",
    COMPENSATION: "/hr/compensation",
    DEPARTMENT_PERFORMANCE: (id: string) => `/hr/departments/${id}/performance`,
    SALARIES: (empId: string) => `/hr/salaries/${empId}`,
    SALARY_DEDUCTIONS: (empId: string) => `/hr/salaries/${empId}/deductions`,
    SALARY_DEDUCTION_DELETE: (empId: string, id: string) => `/hr/salaries/${empId}/deductions/${id}`,
    SALARY_ALLOWANCES: (empId: string) => `/hr/salaries/${empId}/allowances`,
    SALARY_ALLOWANCE_DELETE: (empId: string, id: string) => `/hr/salaries/${empId}/allowances/${id}`,
    BONUSES: "/hr/bonuses",
    SALARY_SLIPS: "/hr/salary-slips",
    SALARY_SLIP_DOWNLOAD: (id: string) => `/hr/salary-slips/${id}/download`,
    SALARY_REPORTS: "/hr/salary-reports",
    VACANCIES: "/hr/vacancies",
    VACANCY_DETAIL: (id: string) => `/hr/vacancies/${id}`,
    VACANCY_APPLICATIONS: (id: string) => `/hr/vacancies/${id}/applications`,
    CANDIDATES: "/hr/candidates",
    CANDIDATE_DELETE: (id: string) => `/hr/candidates/${id}`,
    INTERVIEWS: "/hr/interviews",
    INTERVIEW_DETAIL: (id: string) => `/hr/interviews/${id}`,
    NOTIFICATIONS: "/hr/notifications",
    NOTIFICATION_DETAIL: (id: string) => `/hr/notifications/${id}`,
    REPORTS: "/hr/reports",
    ACCOUNT_REQUESTS: "/hr/requests/account",
  },

  adminEpms: {
    DASHBOARD: "/admin/dashboard",
    PROFILE: "/admin/profile",
    ACCOUNTS: "/admin/accounts",
    ACCOUNT_DETAIL: (id: string) => `/admin/accounts/${id}`,
    ACCOUNT_DELETE: (id: string) => `/admin/accounts/${id}/delete`,
    EMPLOYEES: "/admin/employees",
    EMPLOYEE_DETAIL: (id: string) => `/admin/employees/${id}`,
    EMPLOYEE_DELETE: (id: string) => `/admin/employees/${id}/delete`,
    EMPLOYEE_ROLE: (id: string) => `/admin/employees/${id}/role`,
    ROLES: "/admin/roles",
    ROLE_DETAIL: (id: string) => `/admin/roles/${id}`,
    ROLE_DELETE: (id: string) => `/admin/roles/${id}/delete`,
    REQUESTS: "/admin/requests",
    REQUEST_DECISION: (id: string) => `/admin/requests/${id}/decision`,
    EMPLOYEE_REQUESTS: "/admin/employee-requests",
    EMPLOYEE_REQUEST_DETAIL: (id: string) => `/admin/employee-requests/${id}`,
    EMPLOYEE_REQUEST_ACCEPT: (id: string) => `/admin/employee-requests/${id}/accept`,
    EMPLOYEE_REQUEST_REJECT: (id: string) => `/admin/employee-requests/${id}/reject`,
    NOTIFICATIONS: "/admin/notifications",
  },

  notifications: {
    GET_ALL: "/notifications",
    READ_ALL: "/notifications/read-all",
    READ: (id: string) => `/notifications/${id}/read`,
  },
};
