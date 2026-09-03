import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import fs from 'fs/promises';
import path from 'path';
import JSZip from 'jszip';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filterExpiring = searchParams.get('expiring_only') === 'true';

    let orders;
    if (filterExpiring) {
      // Orders created between 83 and 90 days ago
      orders = await sql`
        SELECT 
          id,
          order_code,
          roblox_username,
          robux,
          price,
          payment_proof_path,
          created_at
        FROM "public"."orders"
        WHERE payment_proof_path IS NOT NULL 
          AND payment_proof_path != ''
          AND created_at <= NOW() - INTERVAL '83 days'
        ORDER BY created_at ASC;
      `;
    } else {
      // All orders with payment proof
      orders = await sql`
        SELECT 
          id,
          order_code,
          roblox_username,
          robux,
          price,
          payment_proof_path,
          created_at
        FROM "public"."orders"
        WHERE payment_proof_path IS NOT NULL 
          AND payment_proof_path != ''
        ORDER BY created_at DESC;
      `;
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Tidak ada file bukti transfer yang dapat diunduh.' },
        { status: 404 }
      );
    }

    const zip = new JSZip();
    const manifestList: string[] = [
      '=== ARSIP CADANGAN BUKTI TRANSFER ZERLYGAMERS ===',
      `Tanggal Unduh: ${new Date().toLocaleString('id-ID')}`,
      `Total Bukti Transfer: ${orders.length}`,
      '--------------------------------------------------',
      'NO | INVOICE | USERNAME | ROBUX | HARGA | TANGGAL ORDER',
    ];

    let fileCount = 0;

    for (let i = 0; i < orders.length; i++) {
      const ord = orders[i];
      const cleanCode = ord.order_code.replace(/[^a-zA-Z0-9_-]/g, '');
      const cleanUser = (ord.roblox_username || 'user').replace(/[^a-zA-Z0-9_-]/g, '');
      const proofPath = ord.payment_proof_path;

      manifestList.push(
        `${i + 1}. ${ord.order_code} | @${cleanUser} | ${ord.robux} Robux | Rp ${Number(ord.price).toLocaleString('id-ID')} | ${new Date(ord.created_at).toLocaleDateString('id-ID')}`
      );

      try {
        if (proofPath.startsWith('data:image')) {
          // Base64 image
          const matches = proofPath.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
          if (matches) {
            const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
            const buffer = Buffer.from(matches[2], 'base64');
            const fileName = `${cleanCode}_${cleanUser}_bukti.${ext}`;
            zip.file(fileName, buffer);
            fileCount++;
          }
        } else {
          // File stored on disk / public
          const relativePath = proofPath.startsWith('/') ? proofPath.slice(1) : proofPath;
          const fullFilePath = path.join(process.cwd(), 'public', relativePath);

          try {
            const fileBuffer = await fs.readFile(fullFilePath);
            const ext = path.extname(relativePath).replace('.', '') || 'png';
            const fileName = `${cleanCode}_${cleanUser}_bukti.${ext}`;
            zip.file(fileName, fileBuffer);
            fileCount++;
          } catch {
            // If file missing on disk, log in manifest
            manifestList.push(`   [Peringatan: File fisik tidak ditemukan di ${relativePath}]`);
          }
        }
      } catch (fileErr) {
        console.error(`Error processing proof for order ${ord.order_code}:`, fileErr);
      }
    }

    // Add text manifest inside the zip
    zip.file('DAFTAR_PESANAN_ARSIP.txt', manifestList.join('\n'));

    const zipBuffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    });

    const dateStr = new Date().toISOString().slice(0, 10);
    const fileName = filterExpiring
      ? `Bukti_Transfer_Expiring_H7_${dateStr}.zip`
      : `Bukti_Transfer_ZerlyGamers_Archive_${dateStr}.zip`;

    return new Response(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': zipBuffer.length.toString(),
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: any) {
    console.error('Error creating ZIP archive:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal membuat file ZIP bukti transfer' },
      { status: 500 }
    );
  }
}
