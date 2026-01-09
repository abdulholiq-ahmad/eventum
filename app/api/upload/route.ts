import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Fayl topilmadi' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Faqat rasm fayllarini yuklash mumkin' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Rasm hajmi 5MB dan kichik bo\'lishi kerak' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename with timestamp
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const filename = `event-${timestamp}.${fileExt}`;

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Write file to public/uploads
    const filepath = join(uploadsDir, filename);
    await writeFile(filepath, buffer);

    // Return the public URL with domain
    const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_URL || 'http://localhost:3000';
    const publicUrl = `${uploadUrl}/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Rasmni yuklashda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}
