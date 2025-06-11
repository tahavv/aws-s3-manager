import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from './client';

/**
 * Uploads a file to the specified S3 bucket.
 * @param bucket The name of the S3 bucket.
 * @param key The key (path) for the file in the bucket.
 * @param file The file to upload (Buffer).
 * @returns The key of the uploaded file.
 */
export const uploadFile = async (bucket: string, key: string, file: Buffer) => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: file,
  });
  await s3Client.send(command);
  return { key };
};
