const fs=require("fs");
const block=fs.readFileSync("C:/Users/Shreeya/AppData/Local/Temp/seoflow/extracted_script.js","utf8");
const lines=block.replace(/
/g,"
").split("
");
console.log("LINE 554:",lines[553].substring(0,200));
console.log("LINE 555:",lines[554].substring(0,200));

// Find what node --check reports
const {execSync}=require("child_process");
try{execSync("node --check C:/Users/Shreeya/AppData/Local/Temp/seoflow/extracted_script.js",{stdio:"pipe"});}catch(e){console.log("node --check error:",e.stderr.toString());}

// Also check if line 555 has issues by commenting out lines 554
const patched=lines.map((l,i)=>i===553?"//PATCHED"+l:l).join("
");
fs.writeFileSync("C:/Users/Shreeya/AppData/Local/Temp/seoflow/patched555test.js",patched);
try{execSync("node --check C:/Users/Shreeya/AppData/Local/Temp/seoflow/patched555test.js",{stdio:"pipe"});console.log("patched (554 commented): syntax OK");}catch(e){console.log("patched 554 but still error:",e.stderr.toString());}