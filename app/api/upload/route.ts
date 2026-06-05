import { NextResponse } from 'next/server';
import { supabaseAdmin, supabase } from '@/lib/supabase';

const db = supabaseAdmin || supabase;

export async function POST(request: Request) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucketName = 'product-images';

    if (!file) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 });
    }

    // Attempt to create the bucket (it will fail silently if it already exists)
    try {
      await db.storage.createBucket(bucketName, { public: true });
    } catch (e) {
      // Ignore if exists
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload using supabaseAdmin to bypass RLS policies
    const { data, error } = await db.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      throw error;
    }

    const { data: publicUrlData } = db.storage.from(bucketName).getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrlData.publicUrl }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
  }
}
