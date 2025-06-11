export interface S3File {
  Key: string;
  Size: number;
  LastModified: string;
}

export interface Notification {
  MessageId: string;
  Timestamp: string;
  Message: string;
}
