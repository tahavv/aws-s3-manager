import { NextResponse } from 'next/server';
import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import { getQueueUrl } from '@/lib/aws/getQueueUrl';

const sqsClient = new SQSClient({ region: process.env.AWS_REGION });

export async function GET() {
  const queueName = process.env.NEXT_PUBLIC_SQS_QUEUE_NAME;

  if (!queueName) {
    return NextResponse.json({ error: 'SQS Queue name is not configured' }, { status: 500 });
  }

  try {
    const queueUrl = await getQueueUrl(queueName);
    const command = new ReceiveMessageCommand({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 5,
    });
    const response = await sqsClient.send(command);

    const messages = response.Messages || [];

    // Delete messages after processing
    for (const message of messages) {
      const deleteCommand = new DeleteMessageCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: message.ReceiptHandle,
      });
      await sqsClient.send(deleteCommand);
    }

    // Parse and return messages
    const notifications = messages.map((message) => ({
      id: message.MessageId || '',
      message: message.Body || '',
      timestamp: new Date().toISOString(),
      read: false,
    }));

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error polling SQS messages:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}
