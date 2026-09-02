import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

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

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Ukuran file terlalu besar! Maksimal 5MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate safe unique filename
    const ext = path.extname(file.name) || (file.type === 'image/png' ? '.png' : '.jpeg');
    const cleanPrefix = type.toLowerCase().replace(/[^a-z0-9]/g, '');
    const filename = `${cleanPrefix}-${Date.now()}${ext}`;

    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);

      const publicUrl = `/uploads/${filename}`;
      return NextResponse.json({
        success: true,
        url: publicUrl,
        filename,
      });
    } catch (fsErr) {
      // Fallback to base64 Data URL if filesystem write is blocked
      console.warn('Filesystem upload fallback to base64 data URL:', fsErr);
      const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`;
      return NextResponse.json({
        success: true,
        url: base64Data,
        filename,
      });
    }
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal mengunggah file' },
      { status: 500 }
    );
  }
}
