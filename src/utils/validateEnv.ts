const requiredEnvVars = {
  aws: [
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_REGION',
    'NEXT_PUBLIC_S3_BUCKET_NAME',
    'NEXT_PUBLIC_SNS_TOPIC_ARN',
    'NEXT_PUBLIC_SQS_QUEUE_URL',
  ],
  database: ['DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_NAME', 'DB_PORT'],
  application: ['NEXT_PUBLIC_API_URL', 'NEXT_PUBLIC_ENV'],
};

export function validateEnv(): void {
  const missingVars: string[] = [];

  Object.values(requiredEnvVars)
    .flat()
    .forEach((envVar) => {
      if (!process.env[envVar]) {
        missingVars.push(envVar);
      }
    });

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missingVars.join('\n')}\n\n` +
        'Please check your .env file and ensure all required variables are set.'
    );
  }

  // Validate specific values
  if (!['development', 'production', 'local'].includes(process.env.NEXT_PUBLIC_ENV || '')) {
    throw new Error('NEXT_PUBLIC_ENV must be one of: development, production, local');
  }

  // Validate AWS region format
  if (!/^[a-z]{2}-[a-z]+-\d{1}$/.test(process.env.AWS_REGION || '')) {
    throw new Error('AWS_REGION must be in format: region-name-number (e.g., us-east-1)');
  }
}

export function validateFileUpload(file: File): string | null {
  const maxSize = parseInt(process.env.MAX_FILE_SIZE || '5242880', 10); // 5MB default
  const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/*').split(',');

  if (file.size > maxSize) {
    return `File size must be less than ${maxSize / 1024 / 1024}MB`;
  }

  const isAllowedType = allowedTypes.some((type) => {
    if (type.endsWith('/*')) {
      return file.type.startsWith(type.replace('/*', '/'));
    }
    return file.type === type || file.name.endsWith(type);
  });

  if (!isAllowedType) {
    return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
  }

  return null;
}
