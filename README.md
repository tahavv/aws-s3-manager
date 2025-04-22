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

### Other Tools
- **Mock Data**: `utils/mockData.json` for development and testing.
- **TypeScript**: Strongly typed development for better maintainability.

---

## Folder Structure

```
src/
├── app/
│   ├── (main)/
│   │   ├── dashboard/
│   │   │   ├── page.tsx    # Main dashboard page
│   │   ├── components/     # Reusable React components
│   │   │   ├── Upload.tsx  # File upload component
│   │   │   ├── ListFiles.tsx    # Component to list files
│   │   │   ├── FileItem.tsx     # Individual file item component
│   │   │   ├── NotificationsList.tsx  # Notifications panel
│   │   │   ├── NotificationItem.tsx   # Single notification item
├── utils/
│   ├── aws/                # AWS-specific utilities
│   │   ├── upload.ts       # AWS S3 upload logic
│   │   ├── list.ts         # AWS S3 list files logic
│   │   ├── delete.ts       # AWS S3 delete logic
│   ├── mockData.json       # Mock data for development
```

---

## Prerequisites

1. **AWS Account**: Ensure you have an active AWS account with permissions for S3, SQS, and SNS.
2. **Environment Variables**: Configure the following environment variables in a `.env` file:
   - `AWS_ACCESS_KEY_ID`: Your AWS access key.
   - `AWS_SECRET_ACCESS_KEY`: Your AWS secret key.
   - `AWS_REGION`: AWS region (e.g., `us-east-1`).
   - `S3_BUCKET_NAME`: Name of the S3 bucket.
   - `SQS_QUEUE_URL`: URL of the SQS queue.
   - `SNS_TOPIC_ARN`: ARN of the SNS topic.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/aws-s3-uploader.git
   cd aws-s3-uploader
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

---

## Screens