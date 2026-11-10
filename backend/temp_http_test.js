const http = require('http');
function request(path) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port: 8002,
      path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Role-Id': '1',
        'X-Company-Id': '1'
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({status: res.statusCode, body: data}));
    });
    req.on('error', reject);
    req.end();
  });
}
(async () => {
  console.log(await request('/api/v1/modules'));
  console.log(await request('/api/v1/companies'));
  console.log(await request('/api/v1/companies/1/permissions'));
})();
