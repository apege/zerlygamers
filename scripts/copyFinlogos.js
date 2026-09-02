const fs = require('fs');
const path = require('path');

function findSvgFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findSvgFiles(filePath, fileList);
    } else if (file.endsWith('.svg') || file.endsWith('.png')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const nodeModulesPath = path.join(__dirname, '..', 'node_modules', 'idn-finlogos');
console.log('Searching in:', nodeModulesPath);
const files = findSvgFiles(nodeModulesPath);
console.log('Found files:', files.slice(0, 30));

const targetDir = path.join(__dirname, '..', 'public', 'payments');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Copy relevant payment logos
const needed = ['dana', 'ovo', 'gopay', 'qris', 'shopeepay', 'bca', 'mandiri', 'bni', 'bri'];

files.forEach(f => {
  const base = path.basename(f).toLowerCase();
  for (const n of needed) {
    if (base.includes(n)) {
      const dest = path.join(targetDir, path.basename(f));
      fs.copyFileSync(f, dest);
      console.log(`Copied ${path.basename(f)} to public/payments/`);
    }
  }
});
