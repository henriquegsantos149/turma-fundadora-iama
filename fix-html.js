import fs from 'fs';
import { execSync } from 'child_process';
const oldHtml = execSync('git show HEAD:index.html', {encoding: 'utf8'});
let newHtml = fs.readFileSync('index.html', 'utf8');

// Extrai o modal da versao antiga
const modalStart = oldHtml.indexOf('<!-- Floating CTA -->');
const modalHtml = oldHtml.substring(modalStart, oldHtml.indexOf('<script type="module" src="/script.js"></script>'));

// Injeta na versao nova antes da tag do script
newHtml = newHtml.replace('<script type="module" src="/script.js"></script>', modalHtml + '\n  <script type="module" src="/script.js"></script>');

// Altera os links #inscricao ou botoes existentes para abrir o chatbot
newHtml = newHtml.replace(/href="#inscricao"/g, 'href="#"');
newHtml = newHtml.replace(/href="#hero"/g, 'href="#"');
newHtml = newHtml.replace(/class="btn btn-primary/g, 'class="btn btn-primary chatbot-trigger');

fs.writeFileSync('index.html', newHtml, 'utf8');
