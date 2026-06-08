const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');

const files = [
  'index.html',
  'styles.css',
  'script.js',
  'admin.html',
  'admin.js',
  'admin.css',
  '_redirects',
];

for (const file of files) {
  fs.copyFileSync(path.join(publicDir, file), path.join(root, file));
}

console.log('Front estático copiado de public/ a la raíz (Cloudflare).');
