//node generate-tfvars.js
const fs = require('fs');
const dotenv = require('dotenv');

const environment = process.env.ENVIRONMENT || 'local';
const envFilePath = `.env.${environment}`;

if (!fs.existsSync(envFilePath)) {
  console.error(`Error: Environment file '${envFilePath}' not found.`);
  process.exit(1);
}
const envConfig = dotenv.parse(fs.readFileSync(envFilePath));

const tfVars = Object.entries(envConfig)
  .map(([key, value]) => `${key.toLowerCase()} = "${value}"`)
  .join('\n');

fs.writeFileSync('terraform/terraform.tfvars', tfVars);
console.log(`terraform.tfvars generated successfully from '${envFilePath}'.`);