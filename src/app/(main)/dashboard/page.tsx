'use client';

import { useState, useEffect } from 'react';
import {
  CloudLightning,
  Settings,
  User,
  RefreshCw,
  ExternalLink,
  PieChart,
  Database,
  X,
} from 'lucide-react';
import ModernUpload from '@/app/components/ModernUpload';
import ListFiles from '@/app/components/ListFiles';
import NotificationsList from '@/app/components/NotificationsList';
import mockData from '@/utils/mockData.json';

export default function DashboardPage() {
  const [files, setFiles] = useState<{ Key: string; Size: number }[]>([]);
  const [notifications, setNotifications] = useState<
    { id: string; message: string; timestamp: string; read: boolean; rawData?: any }[]
  >([]);
  const [refreshing, setRefreshing] = useState(false);
  const [useMockData, setUseMockData] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<{
    id: string;
    message: string;
    timestamp: string;
    read: boolean;
    rawData?: any;
  } | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [stats, setStats] = useState<{
    totalFiles: number;
    totalSize: number;
    lastUpload: string | null;
  }>({
    totalFiles: 0,
    totalSize: 0,
    lastUpload: null,
  });

  // Load environment variables
  const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME || 'default-bucket';
  const snsTopicName = process.env.NEXT_PUBLIC_SNS_TOPIC_NAME || 'default-sns-topic';
  const sqsQueueName = process.env.NEXT_PUBLIC_SQS_QUEUE_NAME || 'default-sqs-queue';
  const notificationEmail = process.env.NEXT_PUBLIC_NOTIFICATION_EMAIL || 'default@email.com';

  const fetchFiles = async () => {
    setRefreshing(true);
    try {
      let data;
      if (useMockData) {
        data = mockData.files;
      } else {
        const response = await fetch(`/api/list?bucket=${bucketName}`);
        if (!response.ok) throw new Error('Failed to fetch files');
        data = await response.json();
      }

      setFiles(data);

      const totalSize = data.reduce((sum: any, file: any) => sum + file.Size, 0);
      const lastUpload = data.length > 0 ? new Date().toLocaleDateString() : null;

      setStats({
        totalFiles: data.length,
        totalSize,
        lastUpload,
      });

      // Add notification for successful refresh
      setNotifications((prev) => [
        {
          id: crypto.randomUUID(),
          message: `Files refreshed successfully`,
          timestamp: new Date().toISOString(),
          read: false,
        },
        ...prev,
      ]);
    } catch (error) {
      console.error('Error fetching files:', error);
      setNotifications((prev) => [
        {
          id: crypto.randomUUID(),
          message: `Error refreshing files: ${error instanceof Error ? error.message : 'Unknown error'}`,
          timestamp: new Date().toISOString(),
          read: false,
        },
        ...prev,
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  const pollNotifications = async () => {
    try {
      const response = await fetch(`/api/notifications`);
      if (!response.ok) throw new Error('Failed to fetch notifications');

      const newNotifications = await response.json();
      const formattedNotifications = newNotifications.map((notif: any) => {
        const parsedMessage = JSON.parse(notif.message);
        const informativeMessage = parsedMessage.Message
          ? JSON.parse(parsedMessage.Message).Records[0]
          : {};

        return {
          id: notif.id,
          message: `Event: ${informativeMessage.eventName} | Bucket: ${informativeMessage.s3?.bucket.name} | Object: ${informativeMessage.s3?.object.key}`,
          timestamp: notif.timestamp,
          read: false,
          rawData: parsedMessage,
        };
      });

      setNotifications((prev) => [...formattedNotifications, ...prev]);
    } catch (error) {
      setNotifications((prev) => [
        {
          id: crypto.randomUUID(),
          message: `Error polling notifications`,
          timestamp: new Date().toISOString(),
          read: false,
        },
        ...prev,
      ]);
    }
  };

  useEffect(() => {
    fetchFiles();

    const interval = setInterval(() => {
      pollNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchFiles();
    pollNotifications();
  };

  // Handler for file deletion success
  const handleDeleteSuccess = (fileKey: string) => {
    setFiles((prev) => prev.filter((file) => file.Key !== fileKey));
    // Optionally, refresh stats or show notification
    setStats((prev) => ({
      ...prev,
      totalFiles: prev.totalFiles - 1,
    }));
  };

  // Handler for upload success
  const handleUploadSuccess = () => {
    fetchFiles();
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatJsonData = (data) => {
    if (!data) return '';
    try {
      const jsonObj = typeof data === 'string' ? JSON.parse(data) : data;
      const deepParse = (obj) => {
        if (typeof obj !== 'object' || obj === null) {
          if (typeof obj === 'string') {
            try {
              return deepParse(JSON.parse(obj));
            } catch (e) {
              return obj;
            }
          }
          return obj;
        }

        if (Array.isArray(obj)) {
          return obj.map((item) => deepParse(item));
        }

        const result = {};
        for (const key in obj) {
          result[key] = deepParse(obj[key]);
        }
        return result;
      };

      const cleanedData = deepParse(jsonObj);
      return JSON.stringify(cleanedData, null, 2);
    } catch (e) {
      console.error('Error formatting JSON:', e);
      return typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    }
  };

  const viewNotificationDetails = (notification) => {
    setSelectedNotification(notification);
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setSelectedNotification(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Stats Card */}
        <div className="col-span-1 bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
          <PieChart className="text-blue-500 mb-2" size={36} />
          <h2 className="text-xl font-bold text-blue-700 mb-2">File Stats</h2>
          <div className="text-gray-700 mb-1">
            Total Files: <span className="font-semibold">{stats.totalFiles}</span>
          </div>
          <div className="text-gray-700 mb-1">
            Total Size:{' '}
            <span className="font-semibold">{(stats.totalSize / 1024).toFixed(2)} KB</span>
          </div>
          <div className="text-gray-700">
            Last Upload: <span className="font-semibold">{stats.lastUpload || 'N/A'}</span>
          </div>
        </div>
        {/* File List & Upload */}
        <div className="col-span-1 md:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-blue-700">Files</h2>
            <button
              onClick={fetchFiles}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-2 transition disabled:opacity-50"
              disabled={refreshing}
            >
              <RefreshCw className={refreshing ? 'animate-spin' : ''} size={18} />
              Refresh
            </button>
          </div>
          <ListFiles files={files} onDeleteSuccess={handleDeleteSuccess} />
          <div className="mt-6">
            <ModernUpload onUploadSuccess={handleUploadSuccess} />
          </div>
        </div>
        {/* Notifications */}
        <div className="col-span-1 md:col-span-3 bg-white rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            <CloudLightning className="text-blue-400" /> Notifications
          </h2>
          <NotificationsList notifications={notifications} />
        </div>
      </div>
    </div>
  );
}
