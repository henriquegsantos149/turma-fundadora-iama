import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('src="/logo.webp"', 'src="/logo-icon.webp"');
html = html.replace('<strong>30/06</strong>', '<strong style="color: #fff;">30/06</strong>');
html = html.replace('<span>às 20h</span>', '<span style="color: var(--color-primary);">às 20h</span>');
html = html.replace('class="v-icon" style="color: var(--color-accent);"', 'style="color: var(--color-accent); border: none;"');
html = html.replace(/<!-- Sticky CTA -->[\s\S]*?<\/div>/, '');
html = html.replace('padding: 12px 24px; font-weight: 600;', 'padding: 18px 32px; font-weight: 800; font-size: 1.2rem; bottom: 30px; right: 30px;');
fs.writeFileSync('index.html', html, 'utf8');

let css = fs.readFileSync('styles.css', 'utf8');
css = css.replace('.chat-msg {', '.chat-msg {\n  margin-bottom: 16px;');
css = css.replace('.user-msg {', '.user-msg {\n  margin-top: 10px;');
fs.writeFileSync('styles.css', css, 'utf8');

let js = fs.readFileSync('script.js', 'utf8');
js = js.replace('wrapper.scrollTo({', 'setTimeout(() => {\n      wrapper.scrollTo({');
js = js.replace('behavior: \'smooth\'\n    });', 'behavior: \'smooth\'\n      });\n    }, 50);');
if(!js.includes('this.scrollToBottom();')) {
  // Just in case
} else {
  // Render input area auto scroll
  js = js.replace('this.inputArea.innerHTML = html;', 'this.inputArea.innerHTML = html;\n    this.scrollToBottom();');
}
fs.writeFileSync('script.js', js, 'utf8');
