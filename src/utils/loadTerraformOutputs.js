const fs = require('fs');

function loadTerraformOutputs() {
  const outputs = JSON.parse(fs.readFileSync('terraform-outputs.json', 'utf8'));
  return {
    s3BucketName: outputs.s3_bucket_name.value,
    snsTopicArn: outputs.sns_topic_arn.value,
    sqsQueueArn: outputs.sqs_queue_arn.value,
  };
}

module.exports = loadTerraformOutputs;