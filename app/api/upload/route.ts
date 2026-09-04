import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import sharp from 'sharp';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as string) || 'image';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Tidak ada file yang diunggah!' },
        { status: 400 }
      );
    }

    // Validate mime type
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Format file tidak didukung! Gunakan JPG, PNG, atau WEBP.' },
        { status: 400 }
      );
    }

    // Validate size (max 10MB before compression)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Ukuran file terlalu besar! Maksimal 10MB.' },
        { status: 400 }
      );
    }

    const rawBytes = await file.arrayBuffer();
    const rawBuffer = Buffer.from(rawBytes);

    // Compress image using Sharp to WebP with max 1200px (typically 20KB - 60KB)
    let optimizedBuffer = rawBuffer;
    let contentType = file.type;
    const fileExt = '.webp';

    try {
      optimizedBuffer = await sharp(rawBuffer)
        .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 75 })
        .toBuffer();
      contentType = 'image/webp';
    } catch (sharpErr) {
      console.warn('Sharp compression fallback to raw buffer:', sharpErr);
    }

    const cleanPrefix = type.toLowerCase().replace(/[^a-z0-9]/g, '');
    const filename = `${cleanPrefix}-${Date.now()}${fileExt}`;

    // 1. Attempt Supabase Storage Upload to bucket 'proofs'
    try {
      const { data: uploadData, error: uploadErr } = await supabaseAdmin
        .storage
        .from('proofs')
        .upload(filename, optimizedBuffer, {
          contentType,
          upsert: true,
        });

      if (!uploadErr && uploadData) {
        const { data: publicUrlData } = supabaseAdmin.storage.from('proofs').getPublicUrl(filename);
        if (publicUrlData?.publicUrl) {
          return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl,
            filename,
          });
        }
      }
    } catch (storageErr) {
      console.warn('Supabase storage upload fallback:', storageErr);
    }

    // 2. Fallback to ultra-compressed WebP base64 Data URL (~30KB vs 5MB uncompressed)
    const base64Data = `data:${contentType};base64,${optimizedBuffer.toString('base64')}`;
    return NextResponse.json({
      success: true,
      url: base64Data,
      filename,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal mengunggah file' },
      { status: 500 }
    );
  }
}
