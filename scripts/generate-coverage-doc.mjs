import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const sw = JSON.parse(fs.readFileSync(path.join(rootDir, 'backend-openapi.json'), 'utf8'));

const rows = [];
for (const p in sw.paths) {
  for (const m in sw.paths[p]) {
    const op = sw.paths[p][m];
    rows.push({
      method: m.toUpperCase(),
      path: p,
      tag: (op.tags && op.tags[0]) || 'General',
      summary: op.summary || ''
    });
  }
}

let md = '# EPMS Endpoint Coverage Matrix (Phase 2)\n\n';
md += 'This document tracks the integration status of all backend endpoints with the EPMS frontend.\n\n';
md += '## Status Definition\n';
md += '- **CONNECTED**: A service method calls it with real API, a hook exposes it, and a page uses it (tested with NEXT_PUBLIC_USE_MOCK=false).\n';
md += '- **UNUSED (<reason>)**: The backend route exists but no page needs it.\n';
md += '- **BACKEND GAP (<reason>)**: The frontend requires this functionality but the endpoint is missing or differs.\n';
md += '- **NOT VERIFIED**: Route mapped, awaiting verification in the planned integration order.\n\n';

md += '## Complete Endpoint Coverage Table\n\n';
md += '| Method | Path | Tag | Status | Details / Page / Method |\n';
md += '|---|---|---|---|---|\n';

for (const r of rows) {
  let status = 'NOT VERIFIED';
  let details = 'Pending verification';

  // Mark confirmed UNUSED endpoints
  if (r.path === '/') {
    status = 'UNUSED (Root healthcheck)';
    details = 'NestJS base app controller ping';
  } else if (r.path === '/admin') {
    status = 'UNUSED (Legacy admin test endpoint)';
    details = 'Legacy root admin route';
  } else if (r.path === '/admin/register') {
    status = 'UNUSED (Admin seed only)';
    details = 'Admins are provisioned via database seed';
  } else if (r.path.startsWith('/admin/{adminId}')) {
    status = 'UNUSED (Profile uses /admin/profile)';
    details = 'Admin profile and password change use /admin/profile';
  } else if (r.path.includes('/firebase/')) {
    status = 'UNUSED (Firebase SSO)';
    details = 'Firebase mobile/social SSO helper endpoints';
  } else if (r.path.includes('/files/signed-url')) {
    status = 'UNUSED (Direct multipart upload used)';
    details = 'Direct GCS signed URL not needed for web app';
  } else if (
    r.path === '/auth/register' ||
    r.path === '/auth/validate-email' ||
    r.path === '/auth/resend-otp' ||
    r.path === '/auth/validate-otp-for-reset' ||
    r.path === '/auth/reset-password-with-token'
  ) {
    status = 'UNUSED (Public self-registration disabled)';
    details = 'EPMS accounts are created by HR/Admin, not public registration';
  }

  md += `| ${r.method} | ${r.path} | ${r.tag} | ${status} | ${details} |\n`;
}

md += '\n## Frontend-Only Gaps\n\n';
md += '1. **E3 Employee Punch Adjustments History**: No dedicated GET `/me/attendance/adjustments` route; adjustments are tracked in attendance logs.\n';
md += '2. **S3 Supervisor Task List for Team**: S3 tasks table displays tasks aggregated from supervisor task allocations.\n';
md += '3. **S4 Supervisor Past Evaluation Records & Meetings**: Schedule meeting exists (`POST /supervisor/evaluation-meetings`), but list endpoint is aggregated from employee evaluations.\n';
md += '4. **H10 Vacancy List (`GET /hr/vacancies`)**: Vacancies creation and deletion exist, vacancies list is queried from job postings.\n';

fs.writeFileSync(path.join(rootDir, 'ENDPOINT_COVERAGE.md'), md, 'utf8');
console.log(`Reset ENDPOINT_COVERAGE.md with ${rows.length} endpoints.`);
