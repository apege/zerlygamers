const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Read .env.local
const envFile = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf-8');
const match = envFile.match(/DATABASE_URL=["']?([^"'\r\n]+)/);
const databaseUrl = match ? match[1] : '';

const sql = neon(databaseUrl);

async function main() {
  try {
    await sql`ALTER TABLE "public"."store_settings" ADD COLUMN IF NOT EXISTS "admin_notes" text DEFAULT 'Catatan penting untuk tim admin...\nContoh: Stok Robux normal, promo weekend aktif, cek komplain pelanggan setiap hari.';`;
    console.log('SUCCESS: admin_notes column is ready in store_settings table.');
  } catch (err) {
    console.error('ERROR:', err);
  }
}

main();
