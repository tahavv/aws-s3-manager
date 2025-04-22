variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
}
variable "s3_bucket_name" {
  description = "Name of the S3 bucket"
  type        = string
}

variable "sns_topic_name" {
  description = "Name of the SNS topic"
  type        = string
}

variable "sqs_queue_name" {
  description = "Name of the SQS queue"
  type        = string
}

variable "notification_email" {
  description = "Email address to subscribe to SNS topic"
  type        = string
}
