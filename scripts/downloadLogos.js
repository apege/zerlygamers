const fs = require('fs');
const path = require('path');
const https = require('https');

const targetDir = path.join(__dirname, '..', 'public', 'payments');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Verified vector SVGs & CDNs from payment repositories
const logos = [
  {
    name: 'qris.svg',
    url: 'https://raw.githubusercontent.com/yudhatp/indonesia-payment-logo/main/svg/qris.svg'
  },
  {
    name: 'dana.svg',
    url: 'https://raw.githubusercontent.com/yudhatp/indonesia-payment-logo/main/svg/dana.svg'
  },
  {
    name: 'ovo.svg',
    url: 'https://raw.githubusercontent.com/yudhatp/indonesia-payment-logo/main/svg/ovo.svg'
  },
  {
    name: 'gopay.svg',
    url: 'https://raw.githubusercontent.com/yudhatp/indonesia-payment-logo/main/svg/gopay.svg'
  },
  {
    name: 'shopeepay.svg',
    url: 'https://raw.githubusercontent.com/yudhatp/indonesia-payment-logo/main/svg/shopeepay.svg'
  },
  {
    name: 'bca.svg',
    url: 'https://raw.githubusercontent.com/yudhatp/indonesia-payment-logo/main/svg/bca.svg'
  },
  {
    name: 'mandiri.svg',
    url: 'https://raw.githubusercontent.com/yudhatp/indonesia-payment-logo/main/svg/mandiri.svg'
  },
  {
    name: 'bni.svg',
    url: 'https://raw.githubusercontent.com/yudhatp/indonesia-payment-logo/main/svg/bni.svg'
  },
  {
    name: 'bri.svg',
    url: 'https://raw.githubusercontent.com/yudhatp/indonesia-payment-logo/main/svg/bri.svg'
  }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Status ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(dest));
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  for (const item of logos) {
    const dest = path.join(targetDir, item.name);
    try {
      console.log(`Downloading ${item.name}...`);
      await download(item.url, dest);
      console.log(`Saved ${item.name}`);
    } catch (e) {
      console.error(`Error downloading ${item.name}:`, e.message);
    }
  }
}

run();
