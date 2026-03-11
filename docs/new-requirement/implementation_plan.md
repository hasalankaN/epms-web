# Implementation Plan - Role-Based Panels Restructuring

Restructure the application into three distinct panels: Admin, Lecturer, and Referral, each with its own routes, dashboard, and sidebar. We will use Next.js Middleware for role-based route protection.

## Proposed Changes

### [Application Structure]

#### [MOVE] Existing Admin directories

Move all current feature directories from `app/(main)/` to `app/(main)/admin-panel/`:

- `approvals/` -> `app/(main)/admin-panel/approvals/`
- `batch-management/` -> `app/(main)/admin-panel/batch-management/`
- `branch-management/` -> `app/(main)/admin-panel/branch-management/`
- `certificate-management/` -> `app/(main)/admin-panel/certificate-management/`
- `complaint-management/` -> `app/(main)/admin-panel/complaint-management/`
- `course-management/` -> `app/(main)/admin-panel/course-management/`
- `dashboard/` -> `app/(main)/admin-panel/dashboard/`
- `document-management/` -> `app/(main)/admin-panel/document-management/`
- `enroll-management/` -> `app/(main)/admin-panel/enroll-management/`
- `inquiry/` -> `app/(main)/admin-panel/inquiry/`
- `product-management/` -> `app/(main)/admin-panel/product-management/`
- `task-management/` -> `app/(main)/admin-panel/task-management/`
- `user-management/` -> `app/(main)/admin-panel/user-management/`

#### [NEW] Lecturer and Referral Panels

- `app/(main)/lecturer-panel/dashboard/page.tsx` [NEW]
- `app/(main)/referral-panel/dashboard/page.tsx` [NEW]

### [Navigation & Routing]

#### [NEW] [middleware.ts](file:///d:/Wise/binzo-lms-admin-web/middleware.ts)

- Create a Next.js middleware `middleware.ts` in the root (or `src/`) directory.
- **Functionality**:
  - Extract the session cookie (`binzo-admin-session`).
  - Decrypt and parse the session payload to determine the user's role (`ADMIN`, `LECTURER`, `REFERRAL`).
  - Intercept requests to `/admin-panel/*`, `/lecturer-panel/*`, and `/referral-panel/*`.
  - If the user tries to access a panel that doesn't match their role, redirect them to `/{role.toLowerCase()}-panel/dashboard`.
  - If there is no session and the user requests a protected route, redirect to `/sign-in?callbackUrl={requested_url}`.

#### [MODIFY] [page.tsx](file:///d:/Wise/binzo-lms-admin-web/app/page.tsx)

- Update root page redirect to just hit a logic gate (or rely on middleware intercepting `/dashboard` to decide where they go).

#### [MODIFY] [LoginForm.tsx](file:///d:/Wise/binzo-lms-admin-web/components/auth/LoginForm.tsx)
- Extract the `callbackUrl` query parameter from the URL.
- Upon successful login, if `callbackUrl` exists and is a valid relative path, redirect the user to it.
- If no `callbackUrl` exists, redirect the user to their respective default dashboard (`/{role.toLowerCase()}-panel/dashboard`) based on the role returned from the login API.

#### [MODIFY] [layout.tsx](<file:///d:/Wise/binzo-lms-admin-web/app/(main)/layout.tsx>)

- Remove existing route protection logic, as it will now be handled inside `middleware.ts`.
- Dynamically load the correct `sidebarData` based on the user's role/current path panel, and pass it to `MainLayoutClient`.

#### [MODIFY] [DynamicBreadcrumb.tsx](file:///d:/Wise/binzo-lms-admin-web/components/common/DynamicBreadcrumb.tsx)

- Update to accept `sidebarData` as a prop rather than importing it directly.
- Ensure `Navbar.tsx` forwards this prop down.

#### [NEW] [sidebar-admin.ts](file:///d:/Wise/binzo-lms-admin-web/data/sidebar-admin.ts)

- Move current `sidebarData` here.

#### [NEW] [sidebar-lecturer.ts](file:///d:/Wise/binzo-lms-admin-web/data/sidebar-lecturer.ts)

- Define a simple sidebar with only the `Dashboard` item.

#### [NEW] [sidebar-referral.ts](file:///d:/Wise/binzo-lms-admin-web/data/sidebar-referral.ts)

- Define a simple sidebar with only the `Dashboard` item.

### [Imports Update]

The user will handle correcting internal nested relative imports manually after the restructuring.

## Verification Plan

### Manual Verification

1. **Admin Verification**:
   - Log in as Admin -> redirected to `/admin-panel/dashboard`.
2. **Lecturer Verification**:
   - Log in as Lecturer -> redirected to `/lecturer-panel/dashboard`.
3. **Cross-Access Protection**:
   - Log in as Lecturer. Try to access `/admin-panel/...`.
   - Verify that `middleware.ts` intercepts and redirects back to `/lecturer-panel/dashboard`.

login response
{
    "status": "SUCCESS",
    "message": null,
    "data": {
        "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjJhYWM0MWY3NTA4OGZlOGUwOWEwN2Q0NDRjZmQ2YjhjZTQ4MTJhMzEiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiU3VwZXIgQWRtaW4iLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbG1zLWJpbnpvIiwiYXVkIjoibG1zLWJpbnpvIiwiYXV0aF90aW1lIjoxNzczMTk5MzgyLCJ1c2VyX2lkIjoiVklvMFg5alJyNFNyZmFCbTBRN0NiS3RnSVkwMyIsInN1YiI6IlZJbzBYOWpScjRTcmZhQm0wUTdDYkt0Z0lZMDMiLCJpYXQiOjE3NzMxOTkzODIsImV4cCI6MTc3MzIwMjk4MiwiZW1haWwiOiJzdXBlcmFkbWluQGJpbnpvLmxrIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbInN1cGVyYWRtaW5AYmluem8ubGsiXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.AcSiiBm94h5eLOzsg9GLjbkCx--5MOx1ZSOXi_LpLwxnjh_fwTjRC_SXZFtzH-w6tYT4SdgmxtS1zqs3zLlMAZR4HzSvJj8XJ5m6gl-Xv9Rdzy4eMvuModsiThu4QX_JjfJpZU_qRKOzoYh7hCd15AhsrFMZGi648lbCBbJMqvjk5FfqIc4V_w3RT26H9EdP7ibhAZ0OR1LQAotbIAfDLtghTeYzvuOXIQVovw7NWLSf6fPbmgnCDocsbzXyA_Fp2H8uT9BJwfjymXfYAktEmI-SSCc1vpGECqHJjdVDwtdM7nsrlSB6GzgOYBg6JTLlKqk1srm79_OaCKEY1LVHVQ",
        "refresh_token": "AMf-vBxc7bPWsu2l1CtG5xt54EQ71gDx2fAmr8xJT6OmoPC_xttrc2G4Pktd99k7FnTWX2khWlyUBnaJfx8LmpHYDSc4GOiHi3JQEOBnt0p8ie5K7Us36qi2Eb8fCKFcatYx1Z796RyfO7gepLBs7CeoLx1Hnp7XYE3wO4LAilqKXByHPpF9mJGx6lSPofOpqFoVv5nYqfaHGZIWN2a02P8KxGgV7HbWkQ",
        "expires_in": 3600,
        "user": {
            "id": "0de88415-6a7a-477c-ad1b-778c57f3ab72",
            "email": "superadmin@binzo.lk",
            "role": "ADMIN",
            "status": "ACTIVE"
        }
    }
}