export const NOTIFICATION_TYPES = {
  UPLOAD: 'UPLOAD',
  DELETE: 'DELETE',
};

export const S3_BUCKET_NAME = process.env.NEXT_PUBLIC_S3_BUCKET_NAME!;
export const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL!;
export const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN!;
