"use client";

import { useState, useEffect } from "react";
import { CloudLightning, Settings, User, RefreshCw, ExternalLink, PieChart, Database, X } from "lucide-react";
import ModernUpload from "@/app/components/ModernUpload";
import ListFiles from "@/app/components/ListFiles";
import NotificationsList from "@/app/components/NotificationsList";
import mockData from "@/utils/mockData.json"; // Import mock data

export default function DashboardPage() {
  const [files, setFiles] = useState<{ Key: string; Size: number }[]>([]);
  const [notifications, setNotifications] = useState<{ id: string; message: string; timestamp: string; read: boolean, rawData?: any }[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [useMockData, setUseMockData] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<{ id: string; message: string; timestamp: string; read: boolean, rawData?: any } | null>(null);
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
  const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME || "default-bucket";
  const snsTopicName = process.env.NEXT_PUBLIC_SNS_TOPIC_NAME || "default-sns-topic";
  const sqsQueueName = process.env.NEXT_PUBLIC_SQS_QUEUE_NAME || "default-sqs-queue";
  const notificationEmail = process.env.NEXT_PUBLIC_NOTIFICATION_EMAIL || "default@email.com";

  const fetchFiles = async () => {
    setRefreshing(true);
    try {
      let data;
      if (useMockData) {
        // Use mock data
        data = mockData.files;
      } else {
        // Fetch from API
        const response = await fetch(`/api/list?bucket=${bucketName}`);
        if (!response.ok) throw new Error("Failed to fetch files");
        data = await response.json();
      }

      setFiles(data);

      // Calculate stats
      const totalSize = data.reduce((sum: any, file: any) => sum + file.Size, 0);
      const lastUpload = data.length > 0 ? new Date().toLocaleDateString() : null;

      setStats({
        totalFiles: data.length,
        totalSize,
        lastUpload,
      });

      // Add notification for successful refresh
      setNotifications((prev) => [
        { id: crypto.randomUUID(), message: `Files refreshed successfully`, timestamp: new Date().toISOString(), read: false },
        ...prev,
      ]);
    } catch (error) {
      console.error("Error fetching files:", error);
      setNotifications((prev) => [
        { id: crypto.randomUUID(), message: `Error refreshing files: ${error instanceof Error ? error.message : "Unknown error"}`, timestamp: new Date().toISOString(), read: false },
        ...prev,
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  const pollNotifications = async () => {
    try {
      const response = await fetch(`/api/notifications`);
      if (!response.ok) throw new Error("Failed to fetch notifications");

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
          rawData: parsedMessage
        };
      });

      setNotifications((prev) => [...formattedNotifications, ...prev]);
    } catch (error) {
      setNotifications((prev) => [
        { id: crypto.randomUUID(), message: `Error polling notifications`, timestamp: new Date().toISOString(), read: false },
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

  const handleUploadSuccess = () => {
    fetchFiles();
    pollNotifications();
  };

  const handleDeleteSuccess = () => {
    fetchFiles();
    pollNotifications();
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };


  const formatJsonData = (data) => {
    if (!data) return "";
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
          return obj.map(item => deepParse(item));
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
      console.error("Error formatting JSON:", e);
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <CloudLightning className="h-8 w-8 text-blue-500" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">AWS S3 Manager</h1>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors flex items-center"
                disabled={refreshing}
              >
                <RefreshCw size={20} className={refreshing ? "animate-spin" : ""} />
              </button>

              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                <Settings size={20} />
              </button>

              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
                <User size={16} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="text-gray-700">
            <h2 className="text-lg font-bold">Bucket Statistics</h2>
          </div>
          <div className="flex items-center">
            <label htmlFor="useMockData" className="text-gray-600 mr-2">
              Use Mock Data
            </label>
            <input
              id="useMockData"
              type="checkbox"
              checked={useMockData}
              onChange={() => setUseMockData(!useMockData)}
              className="h-5 w-5 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Files</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.totalFiles}</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Storage</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{formatBytes(stats.totalSize)}</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <PieChart className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Bucket Name</p>
                <h3 className="text-xl font-bold text-gray-900 mt-1 truncate max-w-xs">
                  {bucketName}
                </h3>
              </div>
              <a
                href={`https://s3.console.aws.amazon.com/s3/buckets/${bucketName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <ExternalLink className="h-6 w-6 text-gray-600" />
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ModernUpload onUploadSuccess={handleUploadSuccess} />
            <ListFiles files={files} onDeleteSuccess={handleDeleteSuccess} />
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 sticky top-8">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Recent Activity</h2>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.slice(0, 10).map((notification, index) => (
                    <div key={index} className="mb-3 border-l-4 border-blue-500 pl-3 py-1 group">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-700">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notification.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        {notification.rawData && (
                          <button 
                            onClick={() => viewNotificationDetails(notification)}
                            className="text-blue-500 hover:text-blue-700 text-xs px-2 py-1 rounded hover:bg-blue-100 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            View
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Popup Dialog for Activity Details */}
      {showDialog && selectedNotification && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl max-h-screen overflow-hidden">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="font-medium text-lg">{selectedNotification.message}</h3>
              <button 
                onClick={closeDialog}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-96">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Notification Details</h4>
              <div className="bg-gray-100 rounded-md p-4 overflow-auto">
                <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                  {selectedNotification.rawData && formatJsonData(selectedNotification.rawData)}
                </pre>
              </div>
            </div>
            <div className="border-t p-3 flex justify-end">
              <button 
                onClick={closeDialog}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <NotificationsList notifications={notifications} />
    </div>
  );
}