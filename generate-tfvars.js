const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const VALID_ENVS = new Set(['local', 'development', 'production']);
const environment = process.env.ENVIRONMENT || 'local';

if (!VALID_ENVS.has(environment)) {
  console.error(`Invalid environment: ${environment}`);
  process.exit(1);
}

const envFilePath = path.join(__dirname, `.env.${environment}`);

// List of required env vars
const ALLOWED_ENV_VARS = [
  'NEXT_PUBLIC_AWS_REGION',
  'NEXT_PUBLIC_S3_BUCKET_NAME',
  'NEXT_PUBLIC_SNS_TOPIC_NAME',
  'NEXT_PUBLIC_SQS_QUEUE_NAME',
  'NEXT_PUBLIC_NOTIFICATION_EMAIL'
];

if (fs.existsSync('terraform/terraform.tfvars')) {
  require('readline')
    .createInterface({ input: process.stdin, output: process.stdout })
    .question('terraform.tfvars exists. Overwrite? (y/n) ', (answer) => {
      if (answer.toLowerCase() !== 'y') process.exit(0);
      generateTfVars();
    });
} else {
  generateTfVars();
}

function generateTfVars() {
  const envConfig = dotenv.parse(fs.readFileSync(envFilePath));

  const tfVars = ALLOWED_ENV_VARS
    .filter((key) => envConfig[key] !== undefined)
    .map((key) => {
      const tfKey = key.replace('NEXT_PUBLIC_', '').toLowerCase();
      return `${tfKey} = "${envConfig[key]}"`;
    })
    .join('\n');

  fs.writeFileSync('terraform/terraform.tfvars', tfVars);
  console.log(`Generated terraform.tfvars from ${envFilePath}`);
}
