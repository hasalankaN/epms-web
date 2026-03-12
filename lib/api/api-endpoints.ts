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
    GET_ALL: `/api/v1/v1/products`,
    GET_BY_ID: (id: string) => `/api/v1/v1/products/${id}`,
  },
  lecturers: {
    GET_ALL: `/api/v1/admin/lecturers`,
  },
};
