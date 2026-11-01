/**
 * Central response normalizer for EPMS backend APIs.
 * Unifies backend responses across paginated lists, single-entity details, and mutations.
 */

export interface NormalizedList<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface NormalizedMutation<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

/**
 * Normalizes list responses from the backend:
 * - { data: T[], meta: { total, page, pageSize, totalPages } }
 * - { data: { items: T[], total, page, pageSize } }
 * - { items: T[], total }
 * - Array T[]
 */
export function normalizeListResponse<T>(res: any, defaultPage = 1, defaultPageSize = 10): NormalizedList<T> {
  if (!res) {
    return {
      items: [],
      total: 0,
      page: defaultPage,
      pageSize: defaultPageSize,
      totalPages: 1,
    };
  }

  // 1. Direct array
  if (Array.isArray(res)) {
    return {
      items: res,
      total: res.length,
      page: defaultPage,
      pageSize: defaultPageSize,
      totalPages: Math.max(1, Math.ceil(res.length / defaultPageSize)),
    };
  }

  // 2. NestJS standard: { data: T[], meta: { total, page, pageSize, totalPages } }
  if (Array.isArray(res.data) && res.meta) {
    const total = Number(res.meta.total ?? res.data.length);
    const page = Number(res.meta.page ?? defaultPage);
    const pageSize = Number(res.meta.pageSize ?? res.meta.limit ?? defaultPageSize);
    const totalPages = Number(res.meta.totalPages ?? Math.max(1, Math.ceil(total / pageSize)));

    return {
      items: res.data,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  // 3. Nested items: { data: { items: T[], total, page, pageSize } }
  if (res.data && Array.isArray(res.data.items)) {
    const total = Number(res.data.total ?? res.data.items.length);
    const page = Number(res.data.page ?? defaultPage);
    const pageSize = Number(res.data.pageSize ?? res.data.limit ?? defaultPageSize);
    const totalPages = Number(res.data.totalPages ?? Math.max(1, Math.ceil(total / pageSize)));

    return {
      items: res.data.items,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  // 4. { items: T[], total }
  if (Array.isArray(res.items)) {
    const total = Number(res.total ?? res.items.length);
    const page = Number(res.page ?? defaultPage);
    const pageSize = Number(res.pageSize ?? res.limit ?? defaultPageSize);
    const totalPages = Number(res.totalPages ?? Math.max(1, Math.ceil(total / pageSize)));

    return {
      items: res.items,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  // 5. { data: T[] } without meta
  if (Array.isArray(res.data)) {
    const total = Number(res.total ?? res.data.length);
    const page = Number(res.page ?? defaultPage);
    const pageSize = Number(res.pageSize ?? res.limit ?? defaultPageSize);

    return {
      items: res.data,
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  }

  return {
    items: [],
    total: 0,
    page: defaultPage,
    pageSize: defaultPageSize,
    totalPages: 1,
  };
}

/**
 * Normalizes detail/entity responses:
 * Extracts data payload if wrapped in { data: ... }
 */
export function normalizeDetailResponse<T>(res: any): T {
  if (!res) return res;

  if (res.data !== undefined && !Array.isArray(res.data)) {
    return res.data as T;
  }

  return res as T;
}

/**
 * Normalizes mutation responses:
 * Extracts success indicator, message, and inner data
 */
export function normalizeMutationResponse<T = any>(res: any, defaultMessage = "Operation completed successfully"): NormalizedMutation<T> {
  if (!res) {
    return {
      success: true,
      message: defaultMessage,
    };
  }

  return {
    success: res.success !== false,
    message: res.message || defaultMessage,
    data: res.data ?? res,
  };
}

