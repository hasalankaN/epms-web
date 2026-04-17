# Backend Issues & Missing Values Tracker

This document tracks bugs, missing fields, and inconsistencies found in the backend APIs during frontend integration.

| Date | Endpoint | Issue / Missing Values | Status |
| :--- | :--- | :--- | :--- |
| 2026-04-08 | `GET /api/v1/admin/certificate-requests` | **Missing Field**: `verification_no` is required by the design but missing from the API response. | Pending |
| 2026-04-08 | `GET /api/v1/admin/certificate-requests` | **Missing Field**: `issued_at` date is missing. Currently falling back to `created_at`. | Pending |
| 2026-04-08 | `GET /api/v1/admin/certificate-requests` | **Data Inconsistency**: API provides `IN_PROGRESS` but the design requires "Printing in progress". | Pending |
| 2026-04-08 | `GET /api/v1/admin/certificate-requests` | **Missing Status**: "Issued" status is shown in the design but not listed in the API's available values. | Pending |
| 2026-04-08 | `PATCH /api/v1/admin/certificate-requests/:id/status` | **Missing Endpoint**: Required to update certificate status (e.g., "Mark as Delivered"). Mocked on frontend. | Pending |
| 2026-04-08 | `DELETE /api/v1/admin/certificate-requests/bulk` | **Missing Endpoint**: Required for bulk deleting certificate requests. Mocked on frontend. | Pending |
| 2026-04-16 | `GET /api/v1/admin/students/{id}` | **Granularity Issue**: Aggregate API returns global lists of `paymentHistory` and `installments` for the student. The UI requires grouped data per enrollment (Course/Batch) to populate "View Payment" and "Add Discount" details accurately. | Pending |
| 2026-04-16 | `GET /api/v1/admin/students/{id}` | **Missing Field**: `total_commissions_earned` and `referral_count` are included in `profile`, but individual `referralCommissions` items lack details on *who* triggered the commission (currently workaround using `triggered_by_student_name`). | Pending |
| 2026-04-16 | `GET /api/v1/admin/students/{id}` | **Missing Feedback**: `certificate_status` for individual courses/batches was expected but sometimes returns null or inconsistent values compared to the "Certificate Requests" module. | Pending |
| 2026-04-16 | `GET /api/v1/admin/enrollments/{id}/payment-details` | **Requirement**: Dedicated endpoint for fetching grouped payment/installment data for a specific enrollment. This avoids manual filtering and potential pagination issues on the frontend. | Pending |
| 2026-04-16 | `GET /api/v1/admin/students/{id}` | **Missing Fields**: `paymentHistory` items require `bank_name` and `account_info` to fully populate the "View Payment" modal. | Pending |
| 2026-04-16 | `GET /api/v1/admin/students/{id}` | **Missing Fields**: `installments` items require `discount_offered_by` (admin name) to populate the "Offer By" field in the discount history. | Pending |
| 2026-04-16 | `GET /api/v1/admin/students/{id}` | **Missing Field**: `installments` records need an `invoice_url` or `receipt_url` for the "View Invoice" action in the UI. | Pending |
| 2026-04-16 | `POST /api/v1/admin/enrollments/{id}/discounts` | **Missing Endpoint**: Required to actually submit and apply a discount to an enrollment or specific installment. Currently only mocked/logged on frontend. | Pending |
| 2026-04-16 | `POST /api/v1/admin/enrollments/{id}/email-invoice` | **Missing Endpoint**: Action required to trigger an automated invoice email to the student for a specific enrollment. | Pending |
| 2026-04-17 | `GET /api/v1/admin/certificate-requests` | **SQL Failure**: API returns `FAIL` with a complex SQL query error involving case-when exists and issued_certificates join. | Pending |
| 2026-04-17 | `GET /api/v1/admin/students/{id}` | **500 Error**: Internal Server Error with SQL failure in the query selecting from `payments` and joining `enrollments`. | Pending |
