const fs = require('fs');
const c = fs.readFileSync('C:/Users/Shreeya/AppData/Local/Temp/seoflow/app.html', 'utf8');
const scriptMatch = [...c.matchAll(/<script>([sS]*?)</script>/g)];
const block = scriptMatch[3][1].replace(/
/g, '
');
const lines = block.split('
');
console.log('Total lines:', lines.length);

let inBacktick = false;
let inSingleQuote = false;
let inDoubleQuote = false;
let lineNum = 0;
const BACKSLASH = String.fromCharCode(92);
const BACKTICK = String.fromCharCode(96);
const DOLLAR = String.fromCharCode(36);
for (let i = 0; i < block.length; i++) {
  const ch = block[i];
  if (ch === '
') lineNum++;
  const prev = i > 0 ? block[i-1] : '';
  if (ch === BACKTICK && !inSingleQuote && !inDoubleQuote) inBacktick = !inBacktick;
  else if (ch === "'" && !inBacktick && !inDoubleQuote && prev !== BACKSLASH) inSingleQuote = !inSingleQuote;
  else if (ch === '"' && !inBacktick && !inSingleQuote && prev !== BACKSLASH) inDoubleQuote = !inDoubleQuote;
  if (ch === DOLLAR && !inBacktick && prev !== BACKSLASH) {
    const context = block.slice(Math.max(0,i-30), i+30).replace(/
/g, '\n');
    console.log('Bare DOLLAR at line ~' + lineNum + ': ...' + context + '...');
  }
}