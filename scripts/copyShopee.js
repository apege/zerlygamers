const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'public', 'payments');
const nodeModulesPath = path.join(__dirname, '..', 'node_modules', 'idn-finlogos');

function findFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const all = findFiles(nodeModulesPath);
console.log('All shopee files:', all.filter(f => f.toLowerCase().includes('shopee')));

all.filter(f => f.toLowerCase().includes('shopee')).forEach(f => {
  fs.copyFileSync(f, path.join(targetDir, path.basename(f)));
  console.log('Copied', path.basename(f));
});
