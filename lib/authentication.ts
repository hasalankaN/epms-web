"use server";

import { cookies } from "next/headers";

import { SignJWT, jwtVerify } from "jose";

import axios from "axios";

import api from "./axios";
import type { CommonResponseDataType } from "@/types/common";
import type { LoginRequest, LoginResponseData } from "@/types/dto/auth.dto";
import { securityLogger } from "./security-logger";

const secretKey = process.env.JWT_SECRET || "secret123";
const key = new TextEncoder().encode(secretKey);
const SESSION_COOKIE_NAME = "binzo-admin-session";

export type Session = {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
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

//  Login Server Action
export async function login(data: LoginRequest): Promise<CommonResponseDataType<LoginResponseData | null>> {
  try {
    const { email, password } = data;

    const response = await api.post<CommonResponseDataType<LoginResponseData>>(
      "/api/v1/auth/login",
      { email, password }
    );

    const apiResponse = response.data;

    if (apiResponse.status === "FAIL") {
      securityLogger.logLoginFailure(email, apiResponse.message || "Login failed");

      return apiResponse;
    }

    const apiData = apiResponse.data;

    const sessionExpires = data.rememberMe
      ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
      : new Date(Date.now() + 1000 * apiData.expires_in);

    const privileges = apiData.user.role === "ADMIN" ? ["all"] : [];

    const sessionPayload: Session = {
      user: {
        id: apiData.user.id,
        name: apiData.user.email,
        email: apiData.user.email,
        role: apiData.user.role,
        privileges,
      },
      tokens: {
        accessToken: apiData.id_token,
        refreshToken: apiData.refresh_token,
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
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    securityLogger.logLoginSuccess(apiData.user.id, apiData.user.email);

    return apiResponse;
  } catch (error: any) {
    console.error("Login Server Action Failed:", error);

    securityLogger.logLoginFailure(
      data.email,
      error.response?.data?.message || error.message || "Unknown error"
    );

    return {
      status: "FAIL",
      message: error.response?.data?.message || "An unexpected server error occurred.",
      data: null,
    };
  }
}

//Session Management Functions

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
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  console.log("Tokens updated in session cookie.");
  securityLogger.logTokenRefreshSuccess(session.user.id);
}

export async function refreshToken(
  token: string
): Promise<CommonResponseDataType<{ id_token: string; refresh_token: string; expires_in: number } | null>> {
  try {
    // We use a direct axios call here to avoid interceptor loops if this call itself fails.
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