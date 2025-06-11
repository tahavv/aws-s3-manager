const fs = require('fs');
const path = require('path');

// Default paths
const terraformOutputPath = path.join(__dirname, 'terraform', 'output.json');
const envOutputPath = path.join(__dirname, '.env.generated');

function loadTerraformOutputs(outputPath = terraformOutputPath, targetEnvPath = envOutputPath) {
  if (!fs.existsSync(outputPath)) {
    console.error(`❌ Terraform output file not found at ${outputPath}`);
    process.exit(1);
  }

  const outputJson = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));

  // Convert Terraform output format to .env key=value format
  const envContent = Object.entries(outputJson)
    .map(([key, value]) => `${key.toUpperCase()}=${value.value}`)
    .join('\n');

  fs.writeFileSync(targetEnvPath, envContent);
  console.log(`✅ Loaded Terraform outputs into ${targetEnvPath}`);
}

// Run the function
loadTerraformOutputs();
