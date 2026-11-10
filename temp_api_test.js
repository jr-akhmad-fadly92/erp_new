const http = require('http');
const url = new URL('http://localhost/app_erp/backend/public/index.php/api/v1/users');
const opts = {
  hostname: url.hostname,
  port: url.port,
  path: url.pathname + url.search,
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
