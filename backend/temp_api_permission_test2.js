const http = require('http');
const opts = {
  hostname: 'localhost',
  port: 80,
  path: '/app_erp/backend/public/api/v1/companies/1/permissions',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
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
req.end();
