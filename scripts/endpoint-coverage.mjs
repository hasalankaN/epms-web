import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Load OpenAPI JSON
let openApi = null;
const localOpenApiPath = path.join(rootDir, 'backend-openapi.json');

if (fs.existsSync(localOpenApiPath)) {
  openApi = JSON.parse(fs.readFileSync(localOpenApiPath, 'utf8'));
} else {
  try {
    const res = await fetch('https://hasavps.ooguy.com/api-json');
    openApi = await res.json();
  } catch {
    console.error('Error: Could not load backend OpenAPI JSON from backend-openapi.json or https://hasavps.ooguy.com/api-json');
    process.exit(1);
  }
}

// 2. Normalize path helper
function normalizePath(p) {
  return p
    .trim()
    .replace(/^\/api\/v1/, '')
    .replace(/\{[^}]+\}/g, ':param')
    .replace(/\/:[a-zA-Z0-9_]+/g, '/:param')
    .replace(/\$\{[^}]+\}/g, ':param')
    .toLowerCase();
}

// 3. Collect backend routes
const backendRoutes = [];
for (const [routePath, methods] of Object.entries(openApi.paths || {})) {
  for (const [method, details] of Object.entries(methods)) {
    if (['get', 'post', 'put', 'patch', 'delete'].includes(method.toLowerCase())) {
      backendRoutes.push({
        method: method.toUpperCase(),
        path: routePath,
        normPath: normalizePath(routePath),
        summary: details.summary || '',
        tags: details.tags || [],
      });
    }
  }
}

// 4. Read ENDPOINT_COVERAGE.md strictly from table lines
const coverageDocPath = path.join(rootDir, 'ENDPOINT_COVERAGE.md');
const docEntries = new Map();

if (fs.existsSync(coverageDocPath)) {
  const coverageDoc = fs.readFileSync(coverageDocPath, 'utf8');
  const lines = coverageDoc.split('\n');
  for (const line of lines) {
    if (line.startsWith('|') && !line.includes('---')) {
      const parts = line.split('|').map((p) => p.trim());
      // parts[1]: Method, parts[2]: Path, parts[3]: Tag, parts[4]: Status, parts[5]: Details
      if (parts.length >= 5) {
        const method = parts[1].toUpperCase();
        const pathStr = parts[2];
        const status = parts[4];
        const details = parts[5] || '';
        const key = `${method} ${pathStr}`;
        docEntries.set(key, { status, details });
      }
    }
  }
}

// 5. Evaluate strict status
const results = backendRoutes.map((route) => {
  const key = `${route.method} ${route.path}`;
  const docEntry = docEntries.get(key);

  let status = 'NOT VERIFIED';
  let reason = '';

  if (docEntry) {
    if (/^CONNECTED/i.test(docEntry.status)) {
      status = 'CONNECTED';
      reason = docEntry.details;
    } else if (/^UNUSED/i.test(docEntry.status)) {
      status = 'UNUSED';
      reason = docEntry.status;
    } else if (/^BACKEND GAP/i.test(docEntry.status)) {
      status = 'BACKEND GAP';
      reason = docEntry.status;
    } else {
      status = 'NOT VERIFIED';
      reason = docEntry.details || 'Pending live integration and test';
    }
  }

  return {
    ...route,
    status,
    reason,
  };
});

// 6. Summary Output
console.log('\n================================================================================');
console.log('                 EPMS BACKEND ENDPOINT COVERAGE REPORT');
console.log('================================================================================\n');

const connected = results.filter((r) => r.status === 'CONNECTED');
const unused = results.filter((r) => r.status === 'UNUSED');
const backendGap = results.filter((r) => r.status === 'BACKEND GAP');
const notVerified = results.filter((r) => r.status === 'NOT VERIFIED');

console.log(`Total Backend Endpoints: ${results.length}`);
console.log(`  - CONNECTED:    ${connected.length}`);
console.log(`  - UNUSED:       ${unused.length}`);
console.log(`  - BACKEND GAP:  ${backendGap.length}`);
console.log(`  - NOT VERIFIED: ${notVerified.length}`);
console.log('--------------------------------------------------------------------------------\n');

if (notVerified.length > 0) {
  console.log(`Pending routes (${notVerified.length} remaining):`);
  notVerified.slice(0, 15).forEach((r) => {
    console.log(`  [${r.method.padEnd(6)}] ${r.path}`);
  });
  if (notVerified.length > 15) {
    console.log(`  ... and ${notVerified.length - 15} more`);
  }
  console.log('\nEndpoints check: In progress (Routes pending real flow verification).\n');
  // Exit code 0 during incremental block reports or 1 if full verification requested
  process.exit(notVerified.length > 0 ? 1 : 0);
} else {
  console.log('Coverage check PASSED: All 100% backend endpoints are CONNECTED or accounted for!\n');
  process.exit(0);
}
