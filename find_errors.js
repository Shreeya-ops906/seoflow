
const fs2 = require('fs');
const c = fs2.readFileSync('C:/Users/Shreeya/AppData/Local/Temp/seoflow/app.html', 'utf8');
const scriptMatch = [...c.matchAll(/<script>([\s\S]*?)<\/script>/g)];
const block = scriptMatch[3][1].replace(/\r\n/g, '\n');
const lines = block.split('\n');
console.log('Total lines:', lines.length);

let inBacktick = false;
let inSingleQuote = false;
let inDoubleQuote = false;
let lineNum = 0;
for (let i = 0; i < block.length; i++) {
  const ch = block[i];
  if (ch === '\n') lineNum++;
  const prev = i > 0 ? block[i-1] : '';
  if (ch === '\x60' && !inSingleQuote && !inDoubleQuote) inBacktick = !inBacktick;
  else if (ch === "'" && !inBacktick && !inDoubleQuote && prev !== '\') inSingleQuote = !inSingleQuote;
  else if (ch === '"' && !inBacktick && !inSingleQuote && prev !== '\') inDoubleQuote = !inDoubleQuote;
  if (ch === '$' && !inBacktick && prev !== '\') {
    const context = block.slice(Math.max(0,i-30), i+30).replace(/\n/g, '\n');
    console.log('Bare $ at line ~' + lineNum + ': ...' + context + '...');
  }
}
