"use server";

import { cookies } from "next/headers";

import { SignJWT, jwtVerify } from "jose";
import axios from "axios";

import api from "./axios";
import type { CommonResponseDataType } from "@/types/common";
import type { LoginRequest, LoginResponseData } from "@/types/dto/auth.dto";
import type { UserRole } from "@/types/roles";
import { securityLogger } from "./security-logger";

const secretKey = process.env.JWT_SECRET || "epms-jwt-secret-2026";
const key = new TextEncoder().encode(secretKey);
const SESSION_COOKIE_NAME = "epms-session";

export type Session = {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    privileges: string[];
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  expires: Date;
};

// Core JWT Functions
export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, { algorithms: ["HS256"] });

    
return payload;
  } catch {
    return null;
  }
}

// Login Server Action
export async function login(data: LoginRequest): Promise<CommonResponseDataType<LoginResponseData | null>> {
  try {
    const { email, password } = data;

    // Send payload matching backend expectations
    const payload = {
      email: email.trim(),
      password,
      rememberMe: Boolean(data.rememberMe),
      deviceToken: "fcm_token_web_12345",
      deviceId: "device-web-client",
      deviceType: "web",
      appVersion: "1.3.0",
      timeZone: "Asia/Colombo",
    };

    const response = await api.post("/auth/login", payload);
    const apiData = response.data;

    // The backend returns { access_token, refresh_token, user: { userId, firstName, lastName, email, role, status, ... } }
    const accessToken = apiData.access_token || apiData.id_token || apiData.data?.access_token || apiData.data?.id_token;
    const refreshToken = apiData.refresh_token || apiData.data?.refresh_token;
    const rawUser = apiData.user || apiData.data?.user;

    if (!accessToken || !rawUser) {
      securityLogger.logLoginFailure(email, "Invalid response from server");

      return {
        status: "FAIL",
        message: "Invalid response from server",
        data: null,
      };
    }

    const roleUpper = (rawUser.role || "EMPLOYEE").toUpperCase() as UserRole;
    const fullName = [rawUser.firstName, rawUser.lastName].filter(Boolean).join(" ").trim() || rawUser.name || rawUser.email;

    const normalizedUser = {
      id: rawUser.userId || rawUser.id || "user-id",
      name: fullName,
      email: rawUser.email || email,
      role: roleUpper,
      status: rawUser.status || "Active",
    };

    const sessionExpires = data.rememberMe
      ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days
      : new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

    const privileges = roleUpper === "ADMIN" ? ["all"] : [];

    const sessionPayload: Session = {
      user: {
        id: normalizedUser.id,
        name: normalizedUser.name,
        email: normalizedUser.email,
        role: roleUpper,
        privileges,
      },
      tokens: {
        accessToken: accessToken,
        refreshToken: refreshToken || accessToken,
      },
      expires: sessionExpires,
    };

    const encryptedSession = await encrypt({
      ...sessionPayload,
      exp: Math.floor(sessionExpires.getTime() / 1000),
    });

    (await cookies()).set(SESSION_COOKIE_NAME, encryptedSession, {
      expires: sessionExpires,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    securityLogger.logLoginSuccess(normalizedUser.id, normalizedUser.email);

    return {
      status: "SUCCESS",
      message: "Login successful",
      data: {
        id_token: accessToken,
        refresh_token: refreshToken || accessToken,
        expires_in: 86400,
        user: normalizedUser,
      },
    };
  } catch (error: any) {
    console.error("Login Server Action Failed:", error?.response?.data || error?.message || error);

    const errorMessage = error?.response?.data?.message || error?.message || "Invalid credentials";

    securityLogger.logLoginFailure(
      data.email,
      errorMessage
    );

    return {
      status: "FAIL",
      message: errorMessage,
      data: null,
    };
  }
}

// Session Management Functions
export async function getSession(): Promise<Session | null> {
  const sessionCookie = (await cookies()).get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) return null;

  const decrypted = await decrypt(sessionCookie);

  if (decrypted) {
    decrypted.expires = new Date(decrypted.expires);

    // Check if session has expired
    if (new Date() > decrypted.expires) {
      securityLogger.logSessionExpired(decrypted.user?.id);
      await removeSession();
      
return null;
    }
  }

  return decrypted;
}

export async function logout() {
  const session = await getSession();

  if (session?.user?.id) {
    securityLogger.logLogout(session.user.id);
  }

  (await cookies()).set(SESSION_COOKIE_NAME, "", { expires: new Date(0) });
}

export async function removeSession() {
  await logout();
}

// Session Update Function (for Token Refresh)
export async function updateTokensInSession(newAccessToken: string, newRefreshToken: string): Promise<void> {
  const session = await getSession();

  if (!session) {
    console.warn("Attempted to update tokens, but no session was found.");
    
return;
  }

  session.tokens.accessToken = newAccessToken;
  session.tokens.refreshToken = newRefreshToken;

  const encryptedSession = await encrypt({
    ...session,
    exp: Math.floor(new Date(session.expires).getTime() / 1000),
  });

  (await cookies()).set(SESSION_COOKIE_NAME, encryptedSession, {
    expires: new Date(session.expires),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  console.log("Tokens updated in session cookie.");
  securityLogger.logTokenRefreshSuccess(session.user.id);
}

export async function refreshToken(
  token: string
): Promise<CommonResponseDataType<{ id_token: string; refresh_token: string; expires_in: number } | null>> {
  try {
    const response = await axios.post<CommonResponseDataType<{ id_token: string; refresh_token: string; expires_in: number }>>(
      `${api.defaults.baseURL}/api/v1/auth/refresh`,
      { refresh_token: token }
    );

    return response.data;
  } catch (error: any) {
    console.error("Refresh token action failed:", error.response?.data?.message);

    securityLogger.logTokenRefreshFailure(
      error.response?.data?.message || error.message || "Unknown error"
    );

    return {
      status: "FAIL",
      message: error.response?.data?.message || "Session expired. Please log in again.",
      data: null,
    };
  }
}