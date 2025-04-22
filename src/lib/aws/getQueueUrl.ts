import { SQSClient, GetQueueUrlCommand } from '@aws-sdk/client-sqs';

const sqsClient = new SQSClient({ region: process.env.AWS_REGION });

/**
 * Retrieves the SQS Queue URL by its name.
 * @param queueName The name of the SQS queue.
 * @returns The SQS queue URL.
 */
export const getQueueUrl = async (queueName: string): Promise<string> => {
  try {
    const command = new GetQueueUrlCommand({ QueueName: queueName });
    const response = await sqsClient.send(command);

    if (!response.QueueUrl) {
      throw new Error('Queue URL not found for the given queue name.');
    }

    return response.QueueUrl;
  } catch (error) {
    console.error('Failed to get SQS Queue URL:', error);
    throw error;
  }
};
