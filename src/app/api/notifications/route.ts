import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Handle incoming SNS notifications (SNS will call this endpoint)
  const body = await request.json();
  console.log('Received SNS notification:', body);
  return NextResponse.json({ message: 'Notification received' });
}
