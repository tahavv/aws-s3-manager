import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { validateEnv } from '@/utils/validateEnv';
import { deleteFile } from '@/lib/aws/delete';

// Initialize environment validation
try {
  validateEnv();
} catch (error: any) {
  console.error('Environment validation failed:', error.message);
  process.exit(1);
}

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

export async function DELETE(request: Request, { params }: { params: Promise<{ user: string }> }) {
  try {
    const userId = await params;
    // Get user's photo URL before deletion
    const userResult = await pool.query('SELECT photo_url FROM users WHERE id = $1', [userId]);

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const photoUrl = userResult.rows[0].photo_url;
    const photoKey = photoUrl.split('.amazonaws.com/')[1];

    // Delete photo from S3 using shared logic
    await deleteFile(process.env.NEXT_PUBLIC_S3_BUCKET_NAME!, photoKey);

    // Delete user from database
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
