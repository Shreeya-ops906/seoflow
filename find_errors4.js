const fs = require('fs');
const c = fs.readFileSync('C:/Users/Shreeya/AppData/Local/Temp/seoflow/app.html', 'utf8');
const re = new RegExp('<script>([\s\S]*?)<\/script>', 'g');
const scriptMatch = [...c.matchAll(re)];
const block = scriptMatch[3][1].replace(/\r\n/g, '\n');
const lines = block.split('\n');
console.log('Total lines:', lines.length);

let inBacktick = false;
let inSingleQuote = false;
let inDoubleQuote = false;
let lineNum = 0;
const BACKSLASH = String.fromCharCode(92);
const BACKTICK = String.fromCharCode(96);
const DOLLAR = String.fromCharCode(36);
const SQUOTE = String.fromCharCode(39);
const DQUOTE = String.fromCharCode(34);
for (let i = 0; i < block.length; i++) {
  const ch = block[i];
  if (ch === '\n') lineNum++;
  const prev = i > 0 ? block[i-1] : '';
  if (ch === BACKTICK && !inSingleQuote && !inDoubleQuote) inBacktick = !inBacktick;
  else if (ch === SQUOTE && !inBacktick && !inDoubleQuote && prev !== BACKSLASH) inSingleQuote = !inSingleQuote;
  else if (ch === DQUOTE && !inBacktick && !inSingleQuote && prev !== BACKSLASH) inDoubleQuote = !inDoubleQuote;
  if (ch === DOLLAR && !inBacktick && prev !== BACKSLASH) {
    const ctx = block.slice(Math.max(0,i-30), i+30).replace(/\n/g, '\\n');
    console.log('Bare DOLLAR at line ~' + lineNum + ': ...' + ctx + '...');
  }
}