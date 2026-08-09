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
  'config.js',
  'api.js',
];

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });
fs.mkdirSync(path.join(distDir, 'assets'), { recursive: true });

for (const file of files) {
  fs.copyFileSync(path.join(publicDir, file), path.join(distDir, file));
}

const logoSrc = path.join(publicDir, 'assets', 'logo-beautymax.png');
const logoDest = path.join(distDir, 'assets', 'logo-beautymax.png');
if (fs.existsSync(logoSrc)) {
  fs.copyFileSync(logoSrc, logoDest);
}

console.log('Front estático generado en dist/ (Cloudflare).');
