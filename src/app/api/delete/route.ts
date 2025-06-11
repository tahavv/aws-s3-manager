import { NextResponse } from 'next/server';
import { deleteFile } from '@/lib/aws/delete';

export async function DELETE(request: Request) {
  const { bucket, key } = await request.json();
  await deleteFile(bucket, key);
  return NextResponse.json({ message: 'File deleted successfully', key });
}
