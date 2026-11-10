const http = require('http');
const payload = JSON.stringify({
  company_id: 2,
  name: 'Test API User',
  email: 'testapi@example.com',
  password: 'demo123',
  role_id: 1,
  status: 'aktif',
});
const opts = {
  hostname: 'localhost',
  port: 80,
  path: '/app_erp/backend/public/index.php/api/v1/users',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
    'X-Role-Id': '1',
    'X-Company-Id': '1',
  },
};
const req = http.request(opts, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('STATUS', res.statusCode);
    console.log(data);
  });
});
req.on('error', e => console.error('ERR', e));
req.write(payload);
req.end();
