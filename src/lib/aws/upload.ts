import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from './client';

export const uploadFile = async (bucket: string, key: string, file: Buffer) => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: file,
  });
  await s3Client.send(command);
  return { key };
};
