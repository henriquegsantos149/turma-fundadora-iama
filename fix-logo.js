import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('src="/logo-icon.webp"', 'src="/logo.webp"');
fs.writeFileSync('index.html', html, 'utf8');
