# BINZO LMS Admin Panel - Backend Integration Guide

This document provides comprehensive instructions for re-enabling backend authentication and API integration when the backend endpoints are ready.

---

## Current State (Demo Mode)

The admin panel is running in **demo mode** with mocked authentication and data. Authentication logic exists but calls will fail without backend.

| Feature         | File                                              | Status                             |
| --------------- | ------------------------------------------------- | ---------------------------------- |
| User Session    | `app/(main)/layout.tsx`                           | Mock session with hardcoded user   |
| Login API       | `lib/authentication.ts`                           | Real implementation, needs backend |
| Notifications   | `components/common/NotificationsPopover.tsx`      | Mock mark-as-read                  |
| Change Password | `components/common/navbar/ResetPasswordModal.tsx` | Mock success response              |

---

## Architecture Overview

This project uses **React Query** with centralized API endpoints:

```
lib/
├── api/
│   └── api-endpoints.ts    # All API endpoint URLs
├── constants/
│   └── queryKeys.ts        # React Query cache keys
└── axios.ts                # Axios instance with interceptors

hooks/api/
├── auth/
│   └── useAuth.ts          # Login mutation
├── notifications/
│   └── useNotifications.ts # Notification queries  (TO CREATE)
└── ...other feature hooks
```

---

## Step 1: Environment Variables

Create or update `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
JWT_SECRET=your-secure-jwt-secret-key
```

---

## Step 2: Create API Endpoints File

**Create:** `lib/api/api-endpoints.ts`

```typescript
export const API_ENDPOINTS = {
  auth: {
    LOGIN: `/api/v1/auth/login`,
    REFRESH_TOKEN: `/api/v1/auth/refresh-token`,
    CHANGE_PASSWORD: `/api/v1/auth/change-password`,
    FORGOT_PASSWORD: `/api/v1/auth/forgot-password`,
    RESET_PASSWORD: `/api/v1/auth/reset-password`,
    VERIFY_CODE: `/api/v1/auth/verify-code`,
  },
  notifications: {
    GET_ALL: `/api/v1/admin/notifications`,
    MARK_AS_READ: (id: string) => `/api/v1/admin/notifications/${id}/read`,
    MARK_ALL_READ: `/api/v1/admin/notifications/read-all`,
    GET_UNREAD_COUNT: `/api/v1/admin/notifications/unread-count`,
  },
  // Add more endpoints as needed
};
```

---

## Step 3: Create Query Keys File

**Create:** `lib/constants/queryKeys.ts`

```typescript
export const queryKeys = {
  // Auth
  login: "login",
  session: "session",

  // Notifications
  notifications: "notifications",
  unreadNotificationsCount: "unread-notifications-count",

  // Add more keys as features are added
};
```

---

## Step 4: Enable Main Layout Authentication

**File:** `app/(main)/layout.tsx`

### Current (Mocked):

```tsx
// const session = await getSession();
// const notifications = await getNotifications();

const session = {
  user: { id: "mock-user-id", name: "Admin User", ... },
  ...
};
const notifications: any[] = [];
```

### Change To:

```tsx
import { getSession } from "@/lib/authentication";

const session = await getSession();
const notifications: NotificationDataType[] = []; // Fetched client-side via hook

if (!session) {
  redirect("/sign-in");
}
```

> **Note:** Notifications are fetched client-side using `useGetNotifications` hook.

---

## Step 5: Create Notification Hooks

**Create:** `hooks/api/notifications/useGetNotifications.ts`

```typescript
import { useQuery } from "@tanstack/react-query";

import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import api from "@/lib/axios";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { NotificationDataType } from "@/types/notifications";

export function useGetNotifications() {
  return useQuery<NotificationDataType[]>({
    queryKey: [queryKeys.notifications],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.notifications.GET_ALL);
      return response.data.data || [];
    },
  });
}
```

**Create:** `hooks/api/notifications/useMarkNotificationAsRead.ts`

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import api from "@/lib/axios";
import { queryKeys } from "@/lib/constants/queryKeys";

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch(
        API_ENDPOINTS.notifications.MARK_AS_READ(id),
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.notifications] });
    },
  });
}
```

---

## Step 6: Update NotificationsPopover

**File:** `components/common/NotificationsPopover.tsx`

### Current (Mocked):

```tsx
const data = useNotifications(); // From SessionProvider (static)
// ...
await new Promise((resolve) => setTimeout(resolve, 500)); // Mock
```

### Change To:

```tsx
import { useGetNotifications } from "@/hooks/api/notifications/useGetNotifications";
import { useMarkNotificationAsRead } from "@/hooks/api/notifications/useMarkNotificationAsRead";

const { data: notifications = [], isLoading } = useGetNotifications();
const { mutateAsync: markAsRead } = useMarkNotificationAsRead();

const markAllAsRead = async () => {
  setMarkingAsRead(true);
  for (const notification of unreadNotifications) {
    await markAsRead(notification._id);
  }
  setMarkingAsRead(false);
};
```

---

## Step 7: Create Change Password Hook

**Create:** `hooks/api/auth/useChangePassword.ts`

```typescript
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import api from "@/lib/axios";

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      const response = await api.post(API_ENDPOINTS.auth.CHANGE_PASSWORD, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Password changed successfully.");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to change password.",
      );
    },
  });
}
```

---

## Step 8: Update ResetPasswordModal

**File:** `components/common/navbar/ResetPasswordModal.tsx`

### Current (Mocked):

```tsx
const res = { status: "SUCCESS", message: "Success" };
```

### Change To:

```tsx
import { useChangePassword } from "@/hooks/api/auth/useChangePassword";
import { logout } from "@/lib/authentication";

const { mutateAsync: changePassword, isPending } = useChangePassword();

const onSubmit = async (values) => {
  try {
    await changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
    await logout();
    router.push("/sign-in");
  } catch {
    // Error handled by mutation
  }
};
```

---

## API Response Format

All API endpoints should follow this standard format:

```typescript
interface CommonResponseDataType<T = any> {
  status: "SUCCESS" | "FAIL";
  message?: string;
  data: T;
}
```

---

## Required Backend Endpoints

| Endpoint                               | Method | Purpose                   |
| -------------------------------------- | ------ | ------------------------- |
| `/api/v1/auth/login`                   | POST   | User login                |
| `/api/v1/auth/refresh-token`           | POST   | Refresh access token      |
| `/api/v1/auth/change-password`         | POST   | Change user password      |
| `/api/v1/auth/forgot-password`         | POST   | Request password reset    |
| `/api/v1/auth/verify-code`             | POST   | Verify OTP code           |
| `/api/v1/auth/reset-password`          | POST   | Reset password with token |
| `/api/v1/admin/notifications`          | GET    | Fetch notifications       |
| `/api/v1/admin/notifications/:id/read` | PATCH  | Mark notification read    |

---

## Files to Create/Update Checklist

### Create New Files:

- [ ] `lib/api/api-endpoints.ts`
- [ ] `lib/constants/queryKeys.ts`
- [ ] `hooks/api/notifications/useGetNotifications.ts`
- [ ] `hooks/api/notifications/useMarkNotificationAsRead.ts`
- [ ] `hooks/api/auth/useChangePassword.ts`

### Update Existing Files:

- [ ] `app/(main)/layout.tsx` - Uncomment `getSession()`
- [ ] `components/common/NotificationsPopover.tsx` - Use notification hooks
- [ ] `components/common/navbar/ResetPasswordModal.tsx` - Use change password hook

---

## Testing Checklist

After enabling backend integration:

- [ ] Login with valid credentials
- [ ] Verify session persists on page reload
- [ ] Verify token refresh works (wait for token expiry)
- [ ] Verify logout clears session
- [ ] Verify notifications load from API
- [ ] Verify mark-as-read updates UI
- [ ] Verify change password flow

---

_Last updated: January 2026_
