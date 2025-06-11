output "s3_bucket_id" {
  value = aws_s3_bucket.s3_bucket.id
}

output "s3_bucket_arn" {
  value = aws_s3_bucket.s3_bucket.arn
}

output "sns_topic_arn" {
  value = aws_sns_topic.sns_topic.arn
}

output "sqs_queue_url" {
  value = aws_sqs_queue.sqs_queue.url
}

output "sqs_queue_arn" {
  value = aws_sqs_queue.sqs_queue.arn
}

output "rds_endpoint" {
  value = aws_db_instance.user_db.endpoint
}

output "rds_db_name" {
  value = aws_db_instance.user_db.db_name
}

output "rds_username" {
  value = aws_db_instance.user_db.username
}
