import fs from 'fs';
const path = 'c:\\\\Users\\\\User\\\\Desktop\\\\Ambiental Pro\\\\PROJETOS\\\\Aplicação IAMA\\\\script.js';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$\{/g, '${');
fs.writeFileSync(path, content, 'utf8');
