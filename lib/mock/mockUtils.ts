/**
 * Helper to simulate backend latency and responses.
 * Controlled by NEXT_PUBLIC_USE_MOCK (default true).
 */
export const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK === undefined
    ? true
    : process.env.NEXT_PUBLIC_USE_MOCK === "true";

export function mockResponse<T>(
  data: T,
  options: { delay?: number; error?: string } = {}
): Promise<T> {
  const { delay = 350, error } = options;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (error) {
        reject(new Error(error));
      } else {
        // Return a structured deep clone to avoid mutation side effects
        resolve(JSON.parse(JSON.stringify(data)));
      }
    }, delay);
  });
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function paginateArray<T>(
  items: T[],
  page: number = 1,
  pageSize: number = 10
): PaginatedResult<T> {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  const startIndex = (safePage - 1) * safePageSize;
  const paginatedItems = items.slice(startIndex, startIndex + safePageSize);

  return {
    items: paginatedItems,
    total,
    page: safePage,
    pageSize: safePageSize,
    totalPages,
  };
}

