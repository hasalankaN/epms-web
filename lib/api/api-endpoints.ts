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
    CREATE: `/api/v1/products`,
    UPDATE: (id: string) => `/api/v1/products/${id}`,
    ARCHIVE: (id: string) => `/api/v1/products/${id}/archive`,
    DELETE: (id: string) => `/api/v1/products/${id}`,
    DELETE_BULK: `/api/v1/products/bulk`,
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
  },
  certificateTemplates: {
    GET_ALL: `/api/v1/admin/certificate-templates`,
    CREATE: `/api/v1/admin/certificate-templates`,
    GET_TEMPLATE_BY_ID: (id: string) => `/api/v1/admin/certificate-templates/${id}`,
    UPDATE_TEMPLATE: (id: string) => `/api/v1/admin/certificate-templates/${id}`,
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
  },
};
