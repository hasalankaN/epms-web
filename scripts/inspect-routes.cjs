const fs = require('fs');
const doc = JSON.parse(fs.readFileSync('backend-openapi.json', 'utf8'));
const tags = {};
for (const [p, methods] of Object.entries(doc.paths)) {
  for (const [m, op] of Object.entries(methods)) {
    const tag = (op.tags && op.tags[0]) || 'Other';
    if (!tags[tag]) tags[tag] = [];
    tags[tag].push(m.toUpperCase() + ' ' + p);
  }
}
for (const [t, routes] of Object.entries(tags)) {
  console.log(`\n### ${t} (${routes.length})`);
  routes.forEach(r => console.log('  ' + r));
}

