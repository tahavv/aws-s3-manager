import { S3Client, ListObjectsCommand } from '@aws-sdk/client-s3';

// Create an S3 client
const s3Client = new S3Client({ region: process.env.AWS_REGION });

/**
 * Lists files from the given S3 bucket.
 * @param bucketName The name of the S3 bucket.
 * @returns A list of files with their keys and sizes.
 */
export async function listFiles(bucketName: string): Promise<{ Key: string; Size: number }[]> {
  try {
    const command = new ListObjectsCommand({ Bucket: bucketName });
    const response = await s3Client.send(command);

    return (
      response.Contents?.map((file) => ({
        Key: file.Key || '',
        Size: file.Size || 0,
      })) || []
    );
  } catch (error) {
    console.error('Error listing files from S3:', error);
    throw new Error('Failed to list files from S3');
  }
}
