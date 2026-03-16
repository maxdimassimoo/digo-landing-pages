const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

// Subdomain → file mapping
const subdomainMap = {
  'rally': './the-30-year-rally.html',
  'work': './digo-healthcare-work-share.html',
};

http.createServer((req, res) => {
  const host = (req.headers.host || '').split(':')[0];
  const subdomain = host.split('.')[0];

  let filePath;

  // If request hits a known subdomain, serve that page directly
  if (subdomainMap[subdomain] && req.url.split('?')[0] === '/') {
    filePath = subdomainMap[subdomain];
  } else {
    filePath = '.' + decodeURIComponent(req.url.split('?')[0]);
    if (filePath === './') filePath = './the-30-year-rally.html';
    if (!path.extname(filePath)) filePath += '.html';
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 - Not Found</h1>');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
}).listen(PORT, () => console.log(`Server running on port ${PORT}`));
