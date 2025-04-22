# AWS S3 Uploader and Manager with Terraform Integration

This project is an AWS S3 uploader and manager application that leverages **Terraform** for provisioning AWS resources such as S3 buckets, SNS topics, and SQS queues. The project integrates with `.env` files for configuration and uses Terraform outputs to seamlessly manage the created resources.

---

## Features

- **File Management**:
  - Upload, list, and delete files in an S3 bucket.
- **Notifications**:
  - Use SNS to send notifications.
  - Subscribe SQS queues and email addresses to the SNS topic.
- **Infrastructure as Code**:
  - Automatically create and manage AWS resources using Terraform.
  - Dynamically load environment-specific configurations via `.env` files.

---

## Prerequisites

1. **Tools**:
   - [Node.js](https://nodejs.org) and npm.
   - [Terraform CLI](https://developer.hashicorp.com/terraform/downloads).
   - [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).

2. **AWS Account Configuration**:
   - Set up an AWS account.
   - Configure an AWS CLI profile (e.g., `aws configure`).

3. **Environment Variables**:
   - Prepare `.env` files for local, production, and development environments:
     - `.env.local`
     - `.env.production`
     - `.env.development`

---

## Project Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/aws-s3-uploader.git
cd aws-s3-uploader
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create `.env` files for your environment. For example:

#### `.env.local`
```plaintext
AWS_REGION=us-east-1
AWS_PROFILE=local-profile
S3_BUCKET_NAME=my-local-bucket
SNS_TOPIC_NAME=my-local-sns-topic
SQS_QUEUE_NAME=my-local-sqs-queue
NOTIFICATION_EMAIL=youremail@example.com
```

---

## Terraform Integration

### 1. Initialize Terraform
Terraform is used to create AWS resources such as S3 buckets, SNS topics, and SQS queues.

#### Directory Structure
Terraform files are stored in the `terraform/` directory:
```plaintext
terraform/
├── main.tf        # AWS resources definition
├── variables.tf   # Input variables
├── outputs.tf     # Outputs for created resources
├── terraform.tfvars # Auto-generated variables (do not edit manually)
```

#### Generate `terraform.tfvars`
Run the following command to dynamically generate the `terraform.tfvars` file based on the current `.env` file:

```bash
ENVIRONMENT=local node generate-tfvars.js
```

The `ENVIRONMENT` variable determines which `.env` file is used (e.g., `.env.local`, `.env.production`, `.env.development`).

---

### 2. Apply Terraform Configuration

#### Initialize Terraform
```bash
cd terraform
terraform init
```

#### Validate Configuration
```bash
terraform validate
```

#### Apply Configuration
```bash
terraform apply
```
- Review the plan and type `yes` to confirm.

#### Example Outputs
Once the Terraform configuration is applied, you will see outputs like this:
```plaintext
s3_bucket_name = "my-local-bucket"
sns_topic_arn  = "arn:aws:sns:us-east-1:123456789012:my-local-sns-topic"
sqs_queue_arn  = "arn:aws:sqs:us-east-1:123456789012:my-local-sqs-queue"
```

---

### 3. Confirm Email Subscription
If you added an email subscription to the SNS topic, check your inbox and confirm the subscription.

---

## Project Usage

### Upload Files to S3
1. Use the UI or API to upload files.
2. Files will be stored in the configured S3 bucket.

### Notifications
- Publishing a message to the SNS topic will:
  - Send an email to the subscribed address (if configured).
  - Deliver the message to the subscribed SQS queue.

---

## Cleanup

To destroy the resources created by Terraform, run:
```bash
terraform destroy
```

---

## Directory Structure

```plaintext
project/
├── src/                     # Application source code
├── terraform/               # Terraform configuration files
├── .env.local               # Local environment variables
├── .env.production          # Production environment variables
├── .env.development         # Development environment variables
├── generate-tfvars.js       # Script to generate terraform.tfvars
├── README.md                # Project documentation
```

---

## Scripts

### Generate `terraform.tfvars`
```bash
ENVIRONMENT=local node generate-tfvars.js
```

### Lint and Format Code
```bash
npm run lint
npm run format
```

### Run the Application
```bash
npm run dev
```

---

## Contribution Guidelines

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Create a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.