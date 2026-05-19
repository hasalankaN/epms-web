const axios = require('axios');

async function run() {
  const baseURL = 'https://lms-binzo-backend-dev-956769189464.asia-southeast1.run.app';
  const id1 = '72132d68-2a47-4c72-bc4f-2f1917fec5bd';
  const id2 = '006065fd-d06d-4503-a0ad-96a44c31faa0';

  try {
    const res1 = await axios.get(`${baseURL}/api/v1/admin/lookup`, {
      params: { type: 'STUDENT', search: id1, limit: 1, status: 'ALL' }
    });
    console.log('ID1 result (status ALL):', res1.data);
  } catch (e) {
    console.error('Error ID1:', e.message);
  }

  try {
    const res2 = await axios.get(`${baseURL}/api/v1/admin/lookup`, {
      params: { type: 'STUDENT', search: id1, limit: 1 }
    });
    console.log('ID1 result (default ACTIVE):', res2.data);
  } catch (e) {
    console.error('Error ID1 default:', e.message);
  }
}

run();
