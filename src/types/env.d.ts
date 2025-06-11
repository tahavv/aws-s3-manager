declare namespace NodeJS {
  interface ProcessEnv {
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_REGION: string;
    S3_BUCKET_NAME: string;
    SQS_QUEUE_URL: string;
    SNS_TOPIC_ARN: string;
    NEXT_PUBLIC_APP_URL: string;
  }
}
