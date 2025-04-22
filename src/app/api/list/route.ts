import { NextResponse } from 'next/server';
import { listFiles } from '@/lib/aws/list';

export async function GET(request: Request) {
  const bucket = new URL(request.url).searchParams.get('bucket')!;
  const files = await listFiles(bucket);
  return NextResponse.json(files);
}
