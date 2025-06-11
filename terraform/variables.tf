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

variable "db_name" {
  description = "Name of the RDS database"
  type        = string
}

variable "db_user" {
  description = "Username for the RDS database"
  type        = string
}

variable "db_password" {
  description = "Password for the RDS database"
  type        = string
  sensitive   = true
}

variable "environment" {
  description = "Deployment environment (dev, prod, etc.)"
  type        = string
  default     = "dev"
}

variable "vpc_id" {
  description = "VPC ID for RDS instance"
  type        = string
}

variable "allowed_cidr" {
  description = "CIDR block allowed to access RDS"
  type        = string
  default     = "0.0.0.0/0"
}
