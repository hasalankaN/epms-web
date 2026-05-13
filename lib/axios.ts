import type { AxiosError } from "axios";
import axios from "axios";

import { toast } from "sonner";

import type { CommonResponseDataType } from "@/types/common";
import {
  getSession,
  removeSession,
  updateTokensInSession,
} from "@/lib/authentication";

let isRefreshing = false;
let failedQueue: {
  resolve: (value: string) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null,
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor: Attach bearer token
api.interceptors.request.use(async (config) => {
  const session = await getSession();

  if (session?.tokens.accessToken) {
    config.headers.Authorization = `Bearer ${session.tokens.accessToken}`;
  }

  return config;
});

// Response Interceptor: Handle token refresh and errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<CommonResponseDataType>) => {
    const originalRequest = error.config as typeof error.config & {
      _retry?: boolean;
    };

    // Don't try to refresh token for login/auth endpoints
    // Add safety check: originalRequest might be undefined if error occurs before request is formed
    const isAuthEndpoint = originalRequest?.url
      ? originalRequest.url.includes("/auth/login") ||
        originalRequest.url.includes("/auth/register") ||
        originalRequest.url.includes("/auth/refresh") ||
        originalRequest.url.includes("/auth/verify-and-sync") ||
        originalRequest.url.includes("/forgot-password") ||
        originalRequest.url.includes("/reset-password")
      : false;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers!["Authorization"] = "Bearer " + token;

          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const session = await getSession();

        if (!session?.tokens.refreshToken)
          throw new Error("No refresh token available.");

        //  Use a direct, unintercepted axios call for the refresh endpoint
        const { data } = await axios.post<
          CommonResponseDataType<{
            id_token: string;
            refresh_token: string;
            expires_in: number;
          }>
        >(`${api.defaults.baseURL}/api/v1/auth/refresh`, {
          refresh_token: session.tokens.refreshToken,
        });

        const newAccessToken = data.data.id_token;
        const newRefreshToken = data.data.refresh_token;

        await updateTokensInSession(newAccessToken, newRefreshToken);
        api.defaults.headers.common["Authorization"] =
          "Bearer " + newAccessToken;
        processQueue(null, newAccessToken);
        originalRequest.headers!["Authorization"] = "Bearer " + newAccessToken;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        await removeSession();

        // Use client-side redirect if this runs in the browser context
        if (typeof window !== "undefined") window.location.href = "/sign-in";

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Global error toast for other errors
    // Don't show toast for auth endpoints - let them handle their own errors
    // Also ensure we only toast on the client side
    if (typeof window !== "undefined") {
      if (error.response && !isAuthEndpoint) {
        toast.error(error.response.data.message || "An error occurred.");
      } else if (!error.response && !isAuthEndpoint) {
        toast.error(error.message);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
export { api };
