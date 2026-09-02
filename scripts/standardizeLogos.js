const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'public', 'payments');

const mappings = [
  { from: 'dana@2x.png', to: 'dana.png' },
  { from: 'ovo@2x.png', to: 'ovo.png' },
  { from: 'gopay@2x.png', to: 'gopay.png' },
  { from: 'qris@2x.png', to: 'qris.png' },
  { from: 'shopee-pay@2x.png', to: 'shopeepay.png' },
  { from: 'bca@2x.png', to: 'bca.png' },
  { from: 'mandiri@2x.png', to: 'mandiri.png' },
  { from: 'bni@2x.png', to: 'bni.png' },
  { from: 'bri@2x.png', to: 'bri.png' },
];

mappings.forEach(({ from, to }) => {
  const src = path.join(targetDir, from);
  const dest = path.join(targetDir, to);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Standardized ${to} from ${from}`);
  } else {
    console.warn(`File ${from} not found in ${targetDir}`);
  }
});
