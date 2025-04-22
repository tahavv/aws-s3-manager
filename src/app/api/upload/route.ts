import { NextResponse } from 'next/server';
import { uploadFile } from '@/lib/aws/upload';

export async function POST(request: Request) {
  const { bucket, key, file } = await request.json();
  await uploadFile(bucket, key, Buffer.from(file, 'base64'));
  return NextResponse.json({ message: 'File uploaded successfully', key });
}
