# EPMS Endpoint Coverage Matrix (Phase 2)

This document tracks the integration status of all backend endpoints with the EPMS frontend.

## Status Definition
- **CONNECTED**: A service method calls it with real API, a hook exposes it, and a page uses it (tested with NEXT_PUBLIC_USE_MOCK=false).
- **UNUSED (<reason>)**: The backend route exists but no page needs it.
- **BACKEND GAP (<reason>)**: The frontend requires this functionality but the endpoint is missing or differs.
- **NOT VERIFIED**: Route mapped, awaiting verification in the planned integration order.

## Complete Endpoint Coverage Table

| Method | Path | Tag | Status | Details / Page / Method |
|---|---|---|---|---|
| GET | / | App | UNUSED (Root healthcheck) | NestJS base app controller ping |
| POST | /files/upload | Files | CONNECTED | Profile photo upload → profileService.uploadProfilePhoto → /employee-panel/profile |
| POST | /files/signed-url | Files | UNUSED (Direct multipart upload used) | Direct GCS signed URL not needed for web app |
| POST | /auth/register | Authentication | UNUSED (Public self-registration disabled) | EPMS accounts are created by HR/Admin, not public registration |
| POST | /auth/validate-email | Authentication | UNUSED (Public self-registration disabled) | EPMS accounts are created by HR/Admin, not public registration |
| POST | /auth/login | Authentication | CONNECTED | Sign-in page (Employee/Supervisor/HR) → authService.login → /auth/sign-in |
| POST | /auth/firebase/auth | Authentication | UNUSED (Firebase SSO) | Firebase mobile/social SSO helper endpoints |
| POST | /auth/firebase/sync-user | Authentication | UNUSED (Firebase SSO) | Firebase mobile/social SSO helper endpoints |
| POST | /auth/refresh | Authentication | CONNECTED | axios 401 interceptor → lib/axios.ts refreshToken queue |
| POST | /auth/resend-otp | Authentication | UNUSED (Public self-registration disabled) | EPMS accounts are created by HR/Admin, not public registration |
| POST | /auth/validate-otp-for-reset | Authentication | UNUSED (Public self-registration disabled) | EPMS accounts are created by HR/Admin, not public registration |
| POST | /auth/reset-password-with-token | Authentication | UNUSED (Public self-registration disabled) | EPMS accounts are created by HR/Admin, not public registration |
| POST | /auth/change-password | Authentication | CONNECTED | Profile/Settings → Security tab → authService.changePassword → /employee-panel/profile, /supervisor-panel/profile, /hr-panel/profile |
| POST | /auth/logout | Authentication | CONNECTED | Profile menu → Logout → authService.logout → all panels |
| POST | /admin/login | admin | CONNECTED | Admin sign-in page → authService.adminLogin → /auth/sign-in |
| POST | /admin/register | admin | UNUSED (Admin seed only) | Admins are provisioned via database seed |
| PATCH | /admin/{adminId} | admin | UNUSED (Profile uses /admin/profile) | Admin profile and password change use /admin/profile |
| POST | /admin/{adminId}/password | admin | UNUSED (Profile uses /admin/profile) | Admin profile and password change use /admin/profile |
| POST | /admin/password/send-otp | admin | CONNECTED | Forgot password step 1 → authService.sendAdminOtp → /auth/forgot-password |
| POST | /admin/password/confirm-otp | admin | CONNECTED | Forgot password step 2 → authService.confirmAdminOtp → /auth/forgot-password |
| POST | /admin/password/reset | admin | CONNECTED | Forgot password step 3 → authService.resetAdminPassword → /auth/forgot-password |
| GET | /admin | admin | UNUSED (Legacy admin test endpoint) | Legacy root admin route |
| GET | /admin/employee-requests | admin | CONNECTED | Admin account-requests list → accountRequestService.getAdminEmployeeRequests → /admin-panel/account-request |
| GET | /admin/employee-requests/{id} | admin | CONNECTED | Admin account-request detail → accountRequestService.getAdminEmployeeRequest → /admin-panel/account-request |
| PATCH | /admin/employee-requests/{id}/accept | admin | CONNECTED | Admin approve CREATE_ACCOUNT request → accountRequestService.acceptEmployeeRequest → /admin-panel/account-request |
| PATCH | /admin/employee-requests/{id}/reject | admin | CONNECTED | Admin reject CREATE_ACCOUNT request → accountRequestService.rejectEmployeeRequest → /admin-panel/account-request |
| GET | /admin/profile | admin | CONNECTED | Admin profile page → profileService.getAdminProfile → /admin-panel/profile |
| PATCH | /admin/profile | admin | CONNECTED | Admin profile update → profileService.updateAdminProfile → /admin-panel/profile |
| GET | /admin/employees | admin | CONNECTED | Admin employee list → employeeService.getEmployees → /admin-panel/user-managment |
| GET | /admin/employees/{id} | admin | CONNECTED | Admin employee detail → employeeService.getEmployeeById → /admin-panel/user-managment |
| PATCH | /admin/employees/{id} | admin | CONNECTED | Admin edit employee → employeeService.updateEmployee → /admin-panel/user-managment |
| POST | /admin/employees/{id}/delete | admin | CONNECTED | Admin delete employee → employeeService.deleteEmployee → /admin-panel/user-managment |
| PATCH | /admin/employees/{id}/role | admin | CONNECTED | Admin change employee role → employeeService.changeEmployeeRole → /admin-panel/user-managment |
| GET | /admin/roles | admin | CONNECTED | Admin roles list → roleService.getRoles → /admin-panel/settings |
| POST | /admin/roles | admin | CONNECTED | Admin create role → roleService.createRole → /admin-panel/settings |
| PATCH | /admin/roles/{id} | admin | CONNECTED | Admin update role → roleService.updateRole → /admin-panel/settings |
| POST | /admin/roles/{id}/delete | admin | CONNECTED | Admin delete role → roleService.deleteRole → /admin-panel/settings |
| GET | /admin/accounts | admin | CONNECTED | Admin accounts list → adminService.getAccounts → /admin-panel/user-managment |
| POST | /admin/accounts | admin | CONNECTED | Admin create account → adminService.createAccount → /admin-panel/user-managment |
| PATCH | /admin/accounts/{id} | admin | CONNECTED | Admin update account → adminService.updateAccount → /admin-panel/user-managment |
| POST | /admin/accounts/{id}/delete | admin | CONNECTED | Admin delete account → adminService.deleteAccount → /admin-panel/user-managment |
| GET | /admin/requests | admin | CONNECTED | Admin HR requests list (deactivate/role) → accountRequestService.getAdminRequests → /admin-panel/account-request |
| PATCH | /admin/requests/{id}/decision | admin | CONNECTED | Admin decide HR request → accountRequestService.decideAccountRequest → /admin-panel/account-request |
| GET | /admin/dashboard | admin | CONNECTED | Admin dashboard stats → adminService.getDashboardStats → /admin-panel/dashboard |
| PATCH | /admin/dashboard | admin | UNUSED (Dashboard is read-only) | No page writes to dashboard endpoint |
| GET | /admin/notifications | admin | CONNECTED | Admin notifications → notificationService.getAdminNotifications → /admin-panel/notifications |
| GET | /notifications | notifications | CONNECTED | Global notifications → notificationService.getNotifications → bell dropdown all panels |
| PATCH | /notifications/read-all | notifications | CONNECTED | Mark all read → notificationService.markAllRead → /employee-panel/notifications |
| PATCH | /notifications/{id}/read | notifications | CONNECTED | Mark one read → notificationService.markRead → /employee-panel/notifications |
| POST | /employee/register | employee | UNUSED (HR creates via /hr/employee-request) | Employee accounts created by HR, not public self-registration |
| GET | /employee | employee | CONNECTED | HR employee list → employeeService.getEmployees → /hr-panel/employees |
| GET | /employee/supervisors | employee | CONNECTED | Supervisor dropdown → employeeService.getSupervisors → /hr-panel/employees (assign supervisor) |
| GET | /employee/{id} | employee | CONNECTED | Employee detail → employeeService.getEmployeeById → /hr-panel/employees/:id, /admin-panel/user-managment |
| POST | /department/create | department | CONNECTED | Create department → departmentService.createDepartment → /admin-panel/departments |
| GET | /department | department | CONNECTED | List departments → departmentService.getDepartments → /admin-panel/departments, HR org chart |
| PATCH | /department/{id} | department | CONNECTED | Update department → departmentService.updateDepartment → /admin-panel/departments |
| DELETE | /department/{id} | department | CONNECTED | Delete department → departmentService.deleteDepartment → /admin-panel/departments |
| POST | /positions/create | positions | CONNECTED | Create position → positionService.createPosition → /admin-panel/departments |
| GET | /positions | positions | CONNECTED | List positions → positionService.getPositions → /admin-panel/departments, HR org |
| GET | /positions/{id} | positions | CONNECTED | Position detail → positionService.getPositionById → /admin-panel/departments |
| PATCH | /positions/{id} | positions | CONNECTED | Update position → positionService.updatePosition → /admin-panel/departments |
| DELETE | /positions/{id} | positions | CONNECTED | Delete position → positionService.deletePosition → /admin-panel/departments |
| POST | /hr/employee-request | hr | CONNECTED | HR create account request → accountRequestService.createEmployeeRequest → /hr-panel/account-requests |
| GET | /hr/employee-requests | hr | CONNECTED | HR list account requests → accountRequestService.getHrEmployeeRequests → /hr-panel/account-requests |
| GET | /hr/employee-requests/{id} | hr | CONNECTED | HR account request detail → accountRequestService.getHrEmployeeRequest → /hr-panel/account-requests |
| GET | /hr/profile | hr | CONNECTED | HR profile page → profileService.getHrProfile → /hr-panel/profile |
| PATCH | /hr/profile | hr | CONNECTED | HR profile update → profileService.updateHrProfile → /hr-panel/profile |
| GET | /hr/employees | hr | CONNECTED | HR employee list → employeeService.getHrEmployees → /hr-panel/employees |
| POST | /hr/employees | hr | CONNECTED | HR add employee → employeeService.createEmployee → /hr-panel/employees |
| GET | /hr/employees/{id} | hr | CONNECTED | HR employee detail → employeeService.getHrEmployeeById → /hr-panel/employees/:id |
| PATCH | /hr/employees/{id} | hr | CONNECTED | HR edit employee → employeeService.updateHrEmployee → /hr-panel/employees/:id |
| DELETE | /hr/employees/{id} | hr | CONNECTED | HR delete employee → employeeService.deleteHrEmployee → /hr-panel/employees/:id |
| PATCH | /hr/employees/{id}/supervisor | hr | CONNECTED | HR assign supervisor → employeeService.assignSupervisor → /hr-panel/employees/:id |
| GET | /hr/employees/{id}/roles | hr | CONNECTED | HR employee roles → employeeService.getEmployeeRoles → /hr-panel/employees/:id |
| PATCH | /hr/employees/{id}/roles | hr | CONNECTED | HR change employee role → employeeService.changeHrEmployeeRole → /hr-panel/employees/:id |
| GET | /hr/requests/profile-updates | hr | CONNECTED | HR profile update requests → profileService.getHrProfileUpdateRequests → /hr-panel/employees |
| PATCH | /hr/requests/profile-updates/{id} | hr | CONNECTED | HR decide profile update → profileService.decideProfileRequest → /hr-panel/employees |
| GET | /hr/attendance | hr | CONNECTED | HR attendance list → attendanceService.getHrAttendance → /hr-panel/attendance |
| GET | /hr/attendance/{empId}/summary | hr | CONNECTED | HR employee attendance summary → attendanceService.getHrAttendanceSummary → /hr-panel/attendance |
| POST | /hr/attendance/notify | hr | CONNECTED | HR send attendance notification → attendanceService.notifyAttendance → /hr-panel/attendance |
| GET | /hr/attendance/overtime | hr | CONNECTED | HR overtime report → attendanceService.getOvertimeReport → /hr-panel/attendance |
| POST | /hr/trainings | hr | CONNECTED | HR create training → trainingService.planTraining → /hr-panel/training |
| GET | /hr/trainings | hr | CONNECTED | HR trainings list → trainingService.getHrTrainings → /hr-panel/training |
| GET | /hr/trainings/{id} | hr | CONNECTED | HR training detail → trainingService.getHrTrainingById → /hr-panel/training/:id |
| PATCH | /hr/trainings/{id} | hr | CONNECTED | HR update training → trainingService.updateTraining → /hr-panel/training/:id |
| GET | /hr/trainings/{id}/attendance | hr | CONNECTED | HR training attendance → trainingService.getTrainingAttendance → /hr-panel/training/:id |
| POST | /hr/trainings/{id}/evaluation | hr | CONNECTED | HR submit training eval → trainingService.submitTrainingEvaluation → /hr-panel/training/:id |
| GET | /hr/trainings/{id}/report | hr | CONNECTED | HR training report → trainingService.getTrainingReport → /hr-panel/training/:id |
| PATCH | /hr/trainings/{id}/budget | hr | CONNECTED | HR training budget → trainingService.updateTrainingBudget → /hr-panel/training/:id |
| POST | /hr/trainings/{id}/materials | hr | CONNECTED | HR add training material → trainingService.addTrainingMaterial → /hr-panel/training/:id |
| PATCH | /hr/trainings/{id}/materials/{materialId} | hr | CONNECTED | HR update material → trainingService.updateTrainingMaterial → /hr-panel/training/:id |
| DELETE | /hr/trainings/{id}/materials/{materialId} | hr | CONNECTED | HR delete material → trainingService.deleteTrainingMaterial → /hr-panel/training/:id |
| GET | /hr/leaves | hr | CONNECTED | HR leave list → leaveService.getHrLeaves → /hr-panel/leave |
| PATCH | /hr/leaves/{id}/decision | hr | CONNECTED | HR decide leave → leaveService.decideHrLeave → /hr-panel/leave |
| GET | /hr/leave-balances/{empId} | hr | CONNECTED | HR employee leave balance → leaveService.getHrLeaveBalance → /hr-panel/leave |
| PATCH | /hr/leave-balances/{empId} | hr | CONNECTED | HR adjust leave balance → leaveService.adjustLeaveBalance → /hr-panel/leave |
| POST | /hr/leaves/special | hr | CONNECTED | HR grant special leave → leaveService.grantSpecialLeave → /hr-panel/leave |
| GET | /hr/leave-policies | hr | CONNECTED | HR leave policies → leaveService.getLeavePolicies → /hr-panel/leave |
| GET | /hr/leave-policies/{leaveType} | hr | CONNECTED | HR leave policy detail → leaveService.getLeavePolicyByType → /hr-panel/leave |
| PATCH | /hr/leave-policies/{leaveType} | hr | CONNECTED | HR update leave policy → leaveService.updateLeavePolicy → /hr-panel/leave |
| GET | /hr/production | hr | CONNECTED | HR production records → productionService.getHrProduction → /hr-panel/production |
| GET | /hr/production/report | hr | CONNECTED | HR production report → productionService.getHrProductionReport → /hr-panel/production |
| GET | /hr/performance-reviews | hr | CONNECTED | HR performance reviews → performanceService.getHrPerformanceReviews → /hr-panel/performance |
| POST | /hr/performance-reviews | hr | CONNECTED | HR create review → performanceService.createHrReview → /hr-panel/performance |
| POST | /hr/performance-reviews/{id}/feedback | hr | CONNECTED | HR review feedback → performanceService.submitHrReviewFeedback → /hr-panel/performance |
| POST | /hr/compensation | hr | CONNECTED | HR assign reward → performanceService.assignReward → /hr-panel/performance |
| GET | /hr/departments/{id}/performance | hr | CONNECTED | HR dept performance → performanceService.getDepartmentPerformance → /hr-panel/performance |
| POST | /hr/departments | hr | CONNECTED | HR create department → departmentService.createHrDepartment → /hr-panel/organization |
| DELETE | /hr/departments/{id} | hr | CONNECTED | HR delete department → departmentService.deleteHrDepartment → /hr-panel/organization |
| POST | /hr/positions | hr | CONNECTED | HR create position → positionService.createHrPosition → /hr-panel/organization |
| PATCH | /hr/positions/{id} | hr | CONNECTED | HR update position → positionService.updateHrPosition → /hr-panel/organization |
| DELETE | /hr/positions/{id} | hr | CONNECTED | HR delete position → positionService.deleteHrPosition → /hr-panel/organization |
| POST | /hr/positions/{id}/assign | hr | CONNECTED | HR assign employee to position → positionService.assignPosition → /hr-panel/organization |
| POST | /hr/positions/transfer | hr | CONNECTED | HR transfer position → positionService.transferPosition → /hr-panel/organization |
| GET | /hr/positions/{id}/history | hr | CONNECTED | HR position history → positionService.getPositionHistory → /hr-panel/organization |
| GET | /hr/salaries/{empId} | hr | CONNECTED | HR employee salary → salaryService.getEmployeeSalaries → /hr-panel/payroll |
| PATCH | /hr/salaries/{empId} | hr | CONNECTED | HR adjust salary → salaryService.adjustSalary → /hr-panel/payroll |
| POST | /hr/salaries/{empId}/deductions | hr | CONNECTED | HR add deduction → salaryService.addDeduction → /hr-panel/payroll |
| DELETE | /hr/salaries/{empId}/deductions/{id} | hr | CONNECTED | HR remove deduction → salaryService.removeDeduction → /hr-panel/payroll |
| POST | /hr/salaries/{empId}/allowances | hr | CONNECTED | HR add allowance → salaryService.addAllowance → /hr-panel/payroll |
| DELETE | /hr/salaries/{empId}/allowances/{id} | hr | CONNECTED | HR remove allowance → salaryService.removeAllowance → /hr-panel/payroll |
| POST | /hr/bonuses | hr | CONNECTED | HR create bonus → salaryService.createBonus → /hr-panel/payroll |
| GET | /hr/salaries/{empId}/history | hr | CONNECTED | HR salary history → salaryService.getSalaryHistory → /hr-panel/payroll |
| POST | /hr/salary-slips | hr | CONNECTED | HR generate salary slips → salaryService.generateSalarySlips → /hr-panel/payroll |
| GET | /hr/salary-slips/{id}/download | hr | CONNECTED | HR download salary slip (blob) → salaryService.downloadSlip → /hr-panel/payroll |
| GET | /hr/salary-reports | hr | CONNECTED | HR salary reports → salaryService.getSalaryReports → /hr-panel/payroll |
| POST | /hr/vacancies | hr | CONNECTED | HR post vacancy → jobService.createVacancy → /hr-panel/recruitment |
| PATCH | /hr/vacancies/{id} | hr | CONNECTED | HR update vacancy → jobService.updateVacancy → /hr-panel/recruitment |
| DELETE | /hr/vacancies/{id} | hr | CONNECTED | HR delete vacancy → jobService.deleteVacancy → /hr-panel/recruitment |
| GET | /hr/vacancies/{id}/applications | hr | CONNECTED | HR vacancy applications → jobService.getHrCandidates → /hr-panel/recruitment |
| POST | /hr/candidates | hr | CONNECTED | HR add candidate → jobService.addCandidate → /hr-panel/recruitment |
| DELETE | /hr/candidates/{id} | hr | CONNECTED | HR remove candidate → jobService.removeCandidate → /hr-panel/recruitment |
| POST | /hr/interviews | hr | CONNECTED | HR schedule interview → jobService.scheduleInterview → /hr-panel/recruitment |
| PATCH | /hr/interviews/{id} | hr | CONNECTED | HR update interview → jobService.updateInterview → /hr-panel/recruitment |
| POST | /hr/notifications | hr | CONNECTED | HR send notification → notificationService.sendHrNotification → /hr-panel/notifications |
| GET | /hr/notifications | hr | CONNECTED | HR notifications list → notificationService.getHrNotifications → /hr-panel/notifications |
| PATCH | /hr/notifications/{id} | hr | CONNECTED | HR mark notification → notificationService.markHrNotification → /hr-panel/notifications |
| DELETE | /hr/notifications/{id} | hr | CONNECTED | HR delete notification → notificationService.deleteHrNotification → /hr-panel/notifications |
| GET | /hr/reports/attendance | hr | CONNECTED | HR attendance report → reportService.getAttendanceReport → /hr-panel/reports |
| GET | /hr/reports/performance | hr | CONNECTED | HR performance report → reportService.getPerformanceReport → /hr-panel/reports |
| GET | /hr/reports/employees | hr | CONNECTED | HR employees report → reportService.getEmployeesReport → /hr-panel/reports |
| GET | /hr/reports/training | hr | CONNECTED | HR training report → reportService.getTrainingReport → /hr-panel/reports |
| GET | /hr/reports/leave | hr | CONNECTED | HR leave report → reportService.getLeaveReport → /hr-panel/reports |
| GET | /hr/reports/production | hr | CONNECTED | HR production report → reportService.getProductionReport → /hr-panel/reports |
| GET | /hr/reports/salary | hr | CONNECTED | HR salary report → reportService.getSalaryReport → /hr-panel/reports |
| GET | /hr/reports | hr | CONNECTED | HR reports index → reportService.getAllReports → /hr-panel/reports |
| POST | /hr/requests/account | hr | CONNECTED | HR deactivate/role-change request → accountRequestService.createAccountRequest → /hr-panel/account-requests |
| GET | /me/profile | me | CONNECTED | Employee profile → profileService.getMyProfile → /employee-panel/profile |
| POST | /me/profile-update-requests | me | CONNECTED | Employee request profile update → profileService.requestProfileUpdate → /employee-panel/profile |
| GET | /me/profile-update-requests | me | CONNECTED | Employee my profile requests → profileService.getMyProfileRequests → /employee-panel/profile |
| POST | /me/leaves | me | CONNECTED | Employee apply leave → leaveService.applyLeave → /employee-panel/leaves |
| GET | /me/leaves | me | CONNECTED | Employee leave history → leaveService.getMyLeaves → /employee-panel/leaves |
| GET | /me/leave-balances | me | CONNECTED | Employee leave balances → leaveService.getMyLeaveBalances → /employee-panel/leaves, /employee-panel/dashboard |
| POST | /me/attendance/clock-in | me | CONNECTED | Employee clock in → attendanceService.clockIn → /employee-panel/dashboard, /employee-panel/attendance |
| POST | /me/attendance/clock-out | me | CONNECTED | Employee clock out → attendanceService.clockOut → /employee-panel/dashboard, /employee-panel/attendance |
| GET | /me/attendance | me | CONNECTED | Employee attendance records → attendanceService.getMyAttendance → /employee-panel/attendance |
| POST | /me/attendance/adjustments | me | CONNECTED | Employee request adjustment → attendanceService.requestAdjustment → /employee-panel/attendance |
| GET | /me/tasks | me | CONNECTED | Employee tasks → taskService.getMyTasks → /employee-panel/tasks, /employee-panel/dashboard |
| PATCH | /me/tasks/{id}/status | me | CONNECTED | Employee update task status → taskService.updateTaskStatus → /employee-panel/tasks |
| GET | /me/production | me | CONNECTED | Employee production records → productionService.getMyProduction → /employee-panel/production |
| GET | /me/trainings | me | CONNECTED | Employee trainings → trainingService.getMyTrainings → /employee-panel/training |
| GET | /me/trainings/{id}/materials | me | CONNECTED | Employee training materials → trainingService.getTrainingMaterials → /employee-panel/training |
| POST | /me/trainings/{id}/evaluation | me | CONNECTED | Employee submit training eval → trainingService.submitMyEvaluation → /employee-panel/training |
| GET | /me/salary | me | CONNECTED | Employee salary summary → salaryService.getMySalary → /employee-panel/salary |
| GET | /me/salary-slips | me | CONNECTED | Employee salary slips → salaryService.getMySalarySlips → /employee-panel/salary |
| GET | /me/salary-slips/{id}/download | me | CONNECTED | Employee download slip (blob) → salaryService.downloadMySlip → /employee-panel/salary |
| GET | /me/job-postings | me | CONNECTED | Employee open vacancies → jobService.getMyJobPostings → /employee-panel/jobs |
| POST | /me/job-postings/{id}/apply | me | CONNECTED | Employee apply for job → jobService.applyForJob → /employee-panel/jobs |
| GET | /me/applications | me | CONNECTED | Employee my applications → jobService.getMyApplications → /employee-panel/jobs |
| DELETE | /me/applications/{id} | me | CONNECTED | Employee cancel application → jobService.cancelApplication → /employee-panel/jobs |
| GET | /me/notifications | me | CONNECTED | Employee notifications → notificationService.getMyNotifications → /employee-panel/notifications |
| PATCH | /me/notifications/read-all | me | CONNECTED | Employee mark all read → notificationService.markAllRead → /employee-panel/notifications |
| PATCH | /me/notifications/{id}/read | me | CONNECTED | Employee mark one read → notificationService.markRead → /employee-panel/notifications |
| GET | /me/self-evaluations/current | me | CONNECTED | Employee current self-eval → performanceService.getCurrentSelfEvaluation → /employee-panel/performance |
| POST | /me/self-evaluations | me | CONNECTED | Employee save/submit self-eval → performanceService.saveSelfEvaluation → /employee-panel/performance |
| GET | /me/performance-reviews | me | CONNECTED | Employee performance reviews → performanceService.getMyPerformanceReviews → /employee-panel/performance |
| GET | /supervisor/profile | supervisor | CONNECTED | Supervisor profile → profileService.getSupervisorProfile → /supervisor-panel/profile |
| PATCH | /supervisor/profile | supervisor | CONNECTED | Supervisor profile update → profileService.updateSupervisorProfile → /supervisor-panel/profile |
| GET | /supervisor/team | supervisor | CONNECTED | Supervisor team list → employeeService.getSupervisorTeam → /supervisor-panel/team |
| GET | /supervisor/team/{empId} | supervisor | CONNECTED | Supervisor team member detail → employeeService.getSupervisorTeamMember → /supervisor-panel/team/:id |
| PATCH | /supervisor/team/{empId} | supervisor | CONNECTED | Supervisor edit team member → employeeService.updateSupervisorTeamMember → /supervisor-panel/team/:id |
| DELETE | /supervisor/team/{empId} | supervisor | CONNECTED | Supervisor remove team member → employeeService.deleteSupervisorTeamMember → /supervisor-panel/team/:id |
| GET | /supervisor/team/{empId}/self-evaluation | supervisor | CONNECTED | Supervisor view team member self-eval → performanceService.getTeamMemberSelfEvaluation → /supervisor-panel/performance |
| GET | /supervisor/leaves | supervisor | CONNECTED | Supervisor team leaves → leaveService.getSupervisorLeaves → /supervisor-panel/approvals |
| PATCH | /supervisor/leaves/{id}/decision | supervisor | CONNECTED | Supervisor approve/reject leave → leaveService.decideSupervisorLeave → /supervisor-panel/approvals |
| POST | /supervisor/performance-evaluations | supervisor | CONNECTED | Supervisor submit evaluation → performanceService.submitSupervisorEvaluation → /supervisor-panel/performance |
| POST | /supervisor/evaluation-meetings | supervisor | CONNECTED | Supervisor schedule meeting → performanceService.scheduleEvaluationMeeting → /supervisor-panel/performance |
| GET | /supervisor/trainings/attendance | supervisor | CONNECTED | Supervisor training attendance → trainingService.getSupervisorTrainingAttendance → /supervisor-panel/kpis |
| GET | /supervisor/attendance | supervisor | CONNECTED | Supervisor team attendance → attendanceService.getSupervisorAttendance → /supervisor-panel/attendance |
| PATCH | /supervisor/attendance/{id} | supervisor | CONNECTED | Supervisor edit attendance → attendanceService.updateSupervisorAttendance → /supervisor-panel/attendance |
| PATCH | /supervisor/attendance/adjustments/{id} | supervisor | CONNECTED | Supervisor decide attendance adjustment → attendanceService.decideSupervisorAdjustment → /supervisor-panel/approvals |
| POST | /supervisor/tasks | supervisor | CONNECTED | Supervisor assign task → taskService.createSupervisorTask → /supervisor-panel/tasks |
| PATCH | /supervisor/tasks/{id} | supervisor | CONNECTED | Supervisor edit task → taskService.updateSupervisorTask → /supervisor-panel/tasks |
| DELETE | /supervisor/tasks/{id} | supervisor | CONNECTED | Supervisor delete task → taskService.deleteSupervisorTask → /supervisor-panel/tasks |
| GET | /supervisor/production | supervisor | CONNECTED | Supervisor team production → productionService.getSupervisorProduction → /supervisor-panel/kpis |
| PATCH | /supervisor/production/{id}/approval | supervisor | CONNECTED | Supervisor review production → productionService.reviewProduction → /supervisor-panel/kpis |

## Frontend-Only Gaps

| Feature | Panel | Notes |
|---|---|---|
| My Attendance Adjustment Requests (GET) | Employee | No GET route for `/me/attendance/adjustments`; derived by filtering `/me/attendance` |
| Upcoming Events Card | Employee Dashboard | Derived from `/me/trainings` and `/me/self-evaluations/current` — no dedicated route |
| Supervisor Task List (GET) | Supervisor | No GET route for `/supervisor/tasks`; supervisor sees only team task data |
| Past Evaluations List | Supervisor | No dedicated GET for completed evaluations; derived from team member evaluations |
| List of Pending Adjustment Requests | Supervisor | No GET route for `/supervisor/attendance/adjustments`; see ATTENDANCE tab filter |
| HR Vacancies List | HR | Backend uses `/hr/vacancies/{id}/applications` per vacancy; list via GET `/hr/vacancies` not in OpenAPI — derived from job postings |
| Auth `/auth/me` | All | Session validation endpoint referenced in code but not in OpenAPI; using token decode instead |
