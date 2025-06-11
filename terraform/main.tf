terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
  required_version = ">= 1.3.0"
}

provider "aws" {
  region = var.aws_region
}

# S3 Bucket
resource "aws_s3_bucket" "s3_bucket" {
  bucket = var.s3_bucket_name
}

# Disable Block Public Access (if public access is required)
resource "aws_s3_bucket_public_access_block" "public_access" {
  bucket = aws_s3_bucket.s3_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = true
  restrict_public_buckets = false
}

# S3 Bucket Policy - Public Read Access (Optional)
resource "aws_s3_bucket_policy" "s3_bucket_policy" {
  bucket = aws_s3_bucket.s3_bucket.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.s3_bucket.arn}/*"
      }
    ]
  })
  depends_on = [aws_s3_bucket.s3_bucket]
}

# SNS Topic
resource "aws_sns_topic" "sns_topic" {
  name = var.sns_topic_name
}

# SNS Topic Policy to allow S3 to publish messages
resource "aws_sns_topic_policy" "sns_topic_policy" {
  arn = aws_sns_topic.sns_topic.arn
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowS3ToPublishToSNS"
        Effect = "Allow"
        Principal = {
          Service = "s3.amazonaws.com"
        }
        Action   = "sns:Publish"
        Resource = aws_sns_topic.sns_topic.arn
        Condition = {
          ArnLike = {
            "aws:SourceArn" = aws_s3_bucket.s3_bucket.arn
          }
        }
      }
    ]
  })
}

# Add an optional email subscription to the SNS topic
resource "aws_sns_topic_subscription" "email_subscription" {
  count     = var.notification_email != "" ? 1 : 0
  topic_arn = aws_sns_topic.sns_topic.arn
  protocol  = "email"
  endpoint  = var.notification_email
}

# SQS Queue
resource "aws_sqs_queue" "sqs_queue" {
  name = var.sqs_queue_name
}

# SQS Queue Policy to allow messages from SNS
resource "aws_sqs_queue_policy" "sqs_queue_policy" {
  queue_url = aws_sqs_queue.sqs_queue.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowSNSMessages"
        Effect = "Allow"
        Principal = {
          Service = "sns.amazonaws.com"
        }
        Action   = "sqs:SendMessage"
        Resource = aws_sqs_queue.sqs_queue.arn
        Condition = {
          ArnEquals = {
            "aws:SourceArn" = aws_sns_topic.sns_topic.arn
          }
        }
      }
    ]
  })
}

# Subscribe SQS to SNS Topic
resource "aws_sns_topic_subscription" "sqs_subscription" {
  topic_arn = aws_sns_topic.sns_topic.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.sqs_queue.arn
}

# S3 Bucket Notification Configuration
resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = aws_s3_bucket.s3_bucket.id

  topic {
    topic_arn = aws_sns_topic.sns_topic.arn
    events    = ["s3:ObjectCreated:*"]
  }

  topic {
    topic_arn = aws_sns_topic.sns_topic.arn
    events    = ["s3:ObjectRemoved:*"]
  }

  depends_on = [
    aws_sns_topic_policy.sns_topic_policy
  ]
}

# RDS PostgreSQL Instance
resource "aws_db_instance" "user_db" {
  allocated_storage          = 20
  engine                     = "postgres"
  engine_version             = "15.4"
  instance_class             = "db.t3.micro"
  db_name                    = var.db_name
  username                   = var.db_user
  password                   = var.db_password
  parameter_group_name       = "default.postgres15"
  skip_final_snapshot        = true
  publicly_accessible        = false
  vpc_security_group_ids     = [aws_security_group.rds_sg.id]
  backup_retention_period    = 7
  storage_encrypted          = true
  multi_az                   = false
  auto_minor_version_upgrade = true
  apply_immediately          = true
  tags = {
    Name        = "user-db-instance"
    Environment = var.environment
  }
}

# Security Group for RDS
resource "aws_security_group" "rds_sg" {
  name        = "rds-sg"
  description = "Allow inbound PostgreSQL access"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [var.allowed_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
