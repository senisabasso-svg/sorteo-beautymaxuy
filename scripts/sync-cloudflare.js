const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');
const distDir = path.join(root, 'dist');

const files = [
  'index.html',
  'styles.css',
  'script.js',
  'admin.html',
  'admin.js',
  'admin.css',
  'participantes-data.js',
  'config.js',
  'api.js',
];

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });
fs.mkdirSync(path.join(distDir, 'assets'), { recursive: true });

for (const file of files) {
  fs.copyFileSync(path.join(publicDir, file), path.join(distDir, file));
}

const assetsDir = path.join(publicDir, 'assets');
if (fs.existsSync(assetsDir)) {
  for (const file of fs.readdirSync(assetsDir)) {
    fs.copyFileSync(path.join(assetsDir, file), path.join(distDir, 'assets', file));
  }
}

console.log('Front estático generado en dist/ (Cloudflare).');
