import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { s3Client } from './client';

export const listFiles = async (bucket: string) => {
  const command = new ListObjectsV2Command({ Bucket: bucket });
  const response = await s3Client.send(command);
  return response.Contents || [];
};
