import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from './client';

export const deleteFile = async (bucket: string, key: string) => {
  const command = new DeleteObjectCommand({ Bucket: bucket, Key: key });
  await s3Client.send(command);
  return { key };
};
