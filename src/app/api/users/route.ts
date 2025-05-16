import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Pool } from 'pg';
import { validateEnv, validateFileUpload } from '@/utils/validateEnv';
import { uploadFile } from '@/lib/aws/upload';
import { migrateUsersTable } from '@/utils/dbMigrate';

// Run migration on cold start
let migrationPromise: Promise<void> | null = null;
async function ensureMigration() {
  if (!migrationPromise) {
    migrationPromise = migrateUsersTable();
  }
  await migrationPromise;
}

// Initialize environment validation
try {
  validateEnv();
} catch (error: any) {
  console.error('Environment validation failed:', error.message);
  process.exit(1);
}

// Initialize PostgreSQL client
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export async function POST(request: NextRequest) {
  await ensureMigration();
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const photo = formData.get('photo') as File;

    if (!name || !email || !photo) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate file upload
    const fileValidationError = validateFileUpload(photo);
    if (fileValidationError) {
      return NextResponse.json({ error: fileValidationError }, { status: 400 });
    }

    // Upload photo to S3 using shared logic
    const photoBuffer = Buffer.from(await photo.arrayBuffer());
    const photoKey = `profile-photos/${Date.now()}-${photo.name}`;
    await uploadFile(process.env.NEXT_PUBLIC_S3_BUCKET_NAME!, photoKey, photoBuffer);

    const photoUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${photoKey}`;

    // Insert user into database
    const result = await pool.query(
      'INSERT INTO users (name, email, photo_url) VALUES ($1, $2, $3) RETURNING id, name, email, photo_url as "photoUrl", created_at as "createdAt"',
      [name, email, photoUrl]
    );

    return NextResponse.json({ user: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

export async function GET() {
  await ensureMigration();
  try {
    const result = await pool.query(
      'SELECT id, name, email, photo_url as "photoUrl", created_at as "createdAt" FROM users ORDER BY created_at DESC'
    );
    return NextResponse.json({ users: result.rows });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
