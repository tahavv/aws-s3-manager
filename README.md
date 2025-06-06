# AWS S3 Uploader and Manager with SQS and SNS

This project is a web-based application for managing files in an AWS S3 bucket. It provides capabilities for uploading, listing, and deleting files, while leveraging AWS services like **SQS (Simple Queue Service)** and **SNS (Simple Notification Service)** to handle notifications and events. The application also includes a real-time notification system to keep users updated about bucket activity.

## Features

### 1. **File Management**

- **Upload Files**: Upload files directly to an S3 bucket using a user-friendly interface.
- **List Files**: View a list of all files in the bucket, including their metadata (e.g., size, name).
- **Delete Files**: Remove unwanted files from the bucket.

### 2. **Real-Time Notifications**

- Notifications are displayed in a notification panel for actions such as file uploads, deletions, and errors.
- The system uses **AWS SNS** to send push notifications and **AWS SQS** to queue events.

### 3. **Dashboard**

- A visually appealing dashboard displays:
  - Total number of files.
  - Total storage used in the bucket.
  - Name of the active bucket.
- Allows toggling between **mock data** and **real API calls** for development and testing.

### 4. **Mock Data Support**

- Developers can toggle between using mock data (from `utils/mockData.json`) and real AWS APIs for testing purposes.

### 5. **Responsive Design**

- The app is fully responsive and works seamlessly on both desktop and mobile devices.

---

## Technologies Used

### Frontend

- **React.js**: Built with the modern React framework.
- **Next.js**: Utilized for performance optimization and server-side rendering.
- **Tailwind CSS**: For responsive and modern styling.
- **Lucide Icons**: Used for intuitive and visually appealing icons in the UI.

### Backend

- **AWS S3**: For file storage.
- **AWS SQS**: For event queuing.
- **AWS SNS**: For real-time push notifications.

### Infrastructure as Code

- **Terraform**: Used for creating and managing AWS resources like S3, SQS, and SNS.

---

## Folder Structure

```
src/
├── app/
│   ├── (main)/
│   │   ├── dashboard/
│   │   │   ├── page.tsx    # Main dashboard page
│   │   ├── components/     # Reusable React components
│   │   │   ├── ModernUpload.tsx  # File upload component
│   │   │   ├── ListFiles.tsx    # Component to list files
│   │   │   ├── NotificationsList.tsx  # Notifications panel
│   │   │   ├── NotificationItem.tsx   # Single notification item
├── utils/
│   ├── aws/                # AWS-specific utilities
│   │   ├── upload.ts       # AWS S3 upload logic
│   │   ├── list.ts         # AWS S3 list files logic
│   │   ├── delete.ts       # AWS S3 delete logic
│   ├── mockData.json       # Mock data for development
├── terraform/              # Terraform scripts for AWS infrastructure
```

---

## Infrastructure as Code (Terraform)

**Terraform** scripts are provided to automate the creation and configuration of AWS resources required for this project. This includes:

### Resources Created

1. **S3 Bucket**

   - Used for file storage.
   - Configured with event notifications for SNS.

2. **SQS Queue**

   - Used for queuing notifications from SNS.

3. **SNS Topic**
   - Used for sending notifications about S3 bucket events.

### Terraform Scripts

The Terraform configuration is located in the `terraform/` directory and includes:

- `main.tf`: Defines the S3 bucket, SQS queue, and SNS topic.
- `variables.tf`: Defines configurable variables like bucket name, region, and tags.
- `outputs.tf`: Outputs the created resource ARNs and URLs.

### How to Execute Terraform

1. Navigate to the `terraform/` directory:

   ```bash
   cd terraform
   ```

2. Initialize Terraform:

   ```bash
   terraform init
   ```

3. Plan the infrastructure:

   ```bash
   terraform plan
   ```

4. Apply the infrastructure:

   ```bash
   terraform apply
   ```

   - You will be prompted to confirm. Type `yes` to proceed.

5. Once the infrastructure is created, note down the output values (e.g., bucket name, SQS URL, SNS ARN).

---

## Prerequisites

1. **AWS Account**: Ensure you have an active AWS account with permissions for S3, SQS, and SNS.
2. **PostgreSQL Database**: An RDS instance running PostgreSQL (created via Terraform).
3. **Environment Variables**: Configure the following environment variables in a `.env` file:

```env
# AWS Credentials
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-1

# S3 Configuration
NEXT_PUBLIC_S3_BUCKET_NAME=your-bucket-name
NEXT_PUBLIC_SQS_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/your-account-id/your-queue-name
NEXT_PUBLIC_SNS_TOPIC_ARN=arn:aws:sns:us-east-1:your-account-id:your-topic-name

# PostgreSQL Database Configuration
DB_USER=postgres
DB_PASSWORD=your_db_password_here
DB_HOST=your-rds-endpoint.region.rds.amazonaws.com
DB_NAME=users_db
DB_PORT=5432
```

> **Note**: Replace the placeholder values with your actual AWS and RDS credentials.

---

## Environment Configuration

This project uses different environment configurations for different stages of development:

### Development (.env.development)

- Used for development environment
- Connects to local PostgreSQL database
- Uses development AWS resources
- Enables debug mode and mock data

### Local (.env.local)

- Used for local development
- Override any environment-specific variables
- Not committed to version control
- Enables hot reload and watch mode

### Production (.env.production)

- Used for production deployment
- Connects to RDS instance
- Uses production AWS resources
- Enables security features and performance optimizations

To set up your environment:

1. Copy the appropriate .env file:

   ```bash
   # For development
   cp .env.development .env.local

   # For production
   cp .env.production .env.local
   ```

2. Update the values in your `.env.local` with your actual credentials:

   - AWS credentials and region
   - Database connection details
   - S3 bucket names
   - SNS topic ARNs
   - SQS queue URLs

3. Make sure to never commit `.env.local` to version control

### Environment Variables Reference

#### AWS Configuration

- `AWS_ACCESS_KEY_ID`: Your AWS access key
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
- `AWS_REGION`: AWS region (e.g., us-east-1)
- `NEXT_PUBLIC_S3_BUCKET_NAME`: S3 bucket for file storage
- `NEXT_PUBLIC_SNS_TOPIC_ARN`: SNS topic ARN for notifications
- `NEXT_PUBLIC_SQS_QUEUE_URL`: SQS queue URL for message processing

#### Database Configuration

- `DB_USER`: PostgreSQL username
- `DB_PASSWORD`: PostgreSQL password
- `DB_HOST`: Database host (localhost or RDS endpoint)
- `DB_NAME`: Database name
- `DB_PORT`: Database port (default: 5432)

#### Application Settings

- `NEXT_PUBLIC_API_URL`: API base URL
- `NEXT_PUBLIC_ENV`: Environment name (development/production)
- `DEBUG_MODE`: Enable debug logging
- `LOG_LEVEL`: Logging level
- `ENABLE_MOCK_DATA`: Toggle mock data mode
- `MAX_FILE_SIZE`: Maximum file upload size
- `ALLOWED_FILE_TYPES`: Allowed file upload types

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/tahavv/aws-s3-manager.git
   cd aws-s3-manager
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root and add your AWS credentials and bucket information.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the application in your browser:
   ```
   http://localhost:3000
   ```

---

## Usage

### 1. **Uploading Files**

- Navigate to the "Upload" section on the dashboard.
- Click "Choose File" and select a file from your system.
- Click "Upload" to save the file to the S3 bucket.

### 2. **Viewing Files**

- Navigate to the "Files" section to view a list of all files in the bucket.
- Metadata like file size and last modified date will be displayed.

### 3. **Deleting Files**

- Click the "Delete" button next to any file to remove it from the bucket.
- A confirmation will appear in the notification panel.

### 4. **Notifications**

- Open the notification panel to view all recent activities (e.g., uploads, deletions).
- Notifications are categorized by type (e.g., "Upload", "Delete").
- Click "View" on a notification to see the full formatted JSON details.

---

## Mock Data

### When to Use Mock Data

Mock data is useful during development when the AWS services are not set up or when you want to test the UI without making real API calls.

### How to Enable Mock Data

1. Toggle the **"Use Mock Data"** checkbox in the dashboard.
2. The system will start using `utils/mockData.json` for file lists and notifications.

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Acknowledgments

- **AWS**: For providing the cloud infrastructure.
- **Next.js**: For the awesome React framework.
- **Tailwind CSS**: For styling the application.
- **Lucide Icons**: For the amazing icon set.

## Screenshots

Below are some screenshots of the application in action:

### 1. **Dashboard**

![Dashboard Screenshot](screenshots/dashboard.png)

### 2. **Uploading Files**

![Uploading Files Screenshot](screenshots/upload.png)

### 3. **Notification Panel**

![Notification Panel Screenshot](screenshots/notifications.png)

### 4. **Detailed Notification View**

![Formatted JSON View Screenshot](screenshots/formatted-json-view.png)

---

## Contribution Guidelines for Screenshots

- When contributing new features, include relevant screenshots in the `screenshots/` directory.
- Use clear, high-quality images in `.png` format.
- Update the **Screenshots** section in the `README.md` file to include your new screenshots.

---

## Running with Docker Compose

This project provides Docker Compose files to easily run the application and the PostgreSQL database in both development and production environments.

### 1. **Production**

To run the application in production mode:

```bash
docker compose up --build
```

- This will start both the app and the database using `.env.production` settings.
- The app will be available on `http://localhost:3000`.

### 2. **Development**

To run the application in development mode:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

- This will start both the app and the database using `.env.local` settings.
- The app will be available on `http://localhost:3000`.

### 3. **Stopping the Containers**

To stop and remove containers, networks, and volumes:

```bash
docker compose down
```

### 4. **Accessing the Application**

- Once the containers are up, access the application at `http://localhost:3000`.
- The backend API will be available at `http://localhost:3000/api`.

### 5. **Database Access**

- The PostgreSQL database can be accessed from the app using the hostname `db` (as defined in the Docker Compose file).
- Default credentials:
  - User: `postgres`
  - Password: `your_db_password_here` (as defined in your `.env` file)

### 6. **Notes**

- Ensure that the ports used in the Docker Compose files are not in use by other services on your host machine.
- For development, file changes are synced between the host and the container, enabling hot-reloading of the app.
- In production, consider using a reverse proxy like Nginx for better performance and security.
