import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function getExtension(mimeType: string, originalName?: string): string {
  switch (mimeType) {
    case 'image/jpeg':
      return '.jpg';
    case 'image/png':
      return '.png';
    case 'image/webp':
      return '.webp';
    case 'image/gif':
      return '.gif';
    case 'image/svg+xml':
      return '.svg';
    default:
      if (originalName && originalName.includes('.')) {
        return '.' + originalName.split('.').pop()?.toLowerCase();
      }
      return '.png';
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

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

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Ukuran file terlalu besar! Maksimal 10MB.' },
        { status: 400 }
      );
    }

    const rawBytes = await file.arrayBuffer();
    const fileExt = getExtension(file.type, file.name);
    const cleanPrefix = type.toLowerCase().replace(/[^a-z0-9]/g, '');
    const filename = `${cleanPrefix}-${Date.now()}${fileExt}`;

    // 1. Upload directly to Supabase Storage bucket 'proofs'
    try {
      const { data: uploadData, error: uploadErr } = await supabaseAdmin
        .storage
        .from('proofs')
        .upload(filename, rawBytes, {
          contentType: file.type,
          cacheControl: '31536000, public',
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
      } else if (uploadErr) {
        console.warn('Supabase storage upload error:', uploadErr.message);
      }
    } catch (storageErr) {
      console.warn('Supabase storage upload exception:', storageErr);
    }

    // 2. Fallback to base64 Data URL if Supabase storage is not configured / unavailable
    const base64Str = arrayBufferToBase64(rawBytes);
    const base64Data = `data:${file.type};base64,${base64Str}`;
    return NextResponse.json({
      success: true,
      url: base64Data,
      filename,
    });
  } catch (error: any) {
    console.error('Upload API route error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal mengunggah file' },
      { status: 500 }
    );
  }
}
