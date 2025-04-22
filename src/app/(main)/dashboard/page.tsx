"use client";

import { useState, useEffect } from "react";
import { CloudLightning, Settings, User, RefreshCw, ExternalLink, PieChart, Database } from "lucide-react";
import ModernUpload from "@/app/components/ModernUpload";
import ListFiles from "@/app/components/ListFiles";
import NotificationsList from "@/app/components/NotificationsList";
import mockData from "@/utils/mockData.json"; // Import mock data

export default function DashboardPage() {
  const [files, setFiles] = useState<{ Key: string; Size: number }[]>([]);
  const [notifications, setNotifications] = useState<{ id: string; message: string; timestamp: string; read: boolean }[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [bucketName, setBucketName] = useState("your-bucket-name");
  const [useMockData, setUseMockData] = useState(false); // State to toggle between mock and API data
  const [stats, setStats] = useState<{
    totalFiles: number;
    totalSize: number;
    lastUpload: string | null;
  }>({
    totalFiles: 0,
    totalSize: 0,
    lastUpload: null
  });

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
      const totalSize = data.reduce((sum:any, file:any) => sum + file.Size, 0);
      const lastUpload = data.length > 0 ? new Date().toLocaleDateString() : null;

      setStats({
        totalFiles: data.length,
        totalSize,
        lastUpload
      });

      // Add notification for successful refresh
      setNotifications(prev => [
        { id: crypto.randomUUID(), message: `Files refreshed successfully`, timestamp: new Date().toISOString(), read: false },
        ...prev
      ]);
    } catch (error) {
      console.error("Error fetching files:", error);
      setNotifications(prev => [
        { id: crypto.randomUUID(), message: `Error refreshing files: ${error instanceof Error ? error.message : "Unknown error"}`, timestamp: new Date().toISOString(), read: false },
        ...prev
      ]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let eventCounter = 0;
    fetchFiles();

    // Simulate SSE for notifications if using mock data
    if (useMockData) {
      const timer = setInterval(() => {
        if (eventCounter < mockData.events.length) {
          setNotifications(prev => [
            { id: crypto.randomUUID(), message: mockData.events[eventCounter], timestamp: new Date().toISOString(), read: false },
            ...prev
          ]);
          eventCounter++;
        } else {
          clearInterval(timer);
        }
      }, 8000); // Add a new notification every 8 seconds

      return () => clearInterval(timer);
    }
  }, [useMockData]);

  const handleRefresh = () => {
    fetchFiles();
  };

  const handleUploadSuccess = () => {
    setNotifications(prev => [
      { id: crypto.randomUUID(), message: `File uploaded successfully`, timestamp: new Date().toISOString(), read: false },
      ...prev
    ]);
    fetchFiles();
  };

  const handleDeleteSuccess = () => {
    setNotifications(prev => [
      { id: crypto.randomUUID(), message: `File deleted successfully`, timestamp: new Date().toISOString(), read: false },
      ...prev
    ]);
    fetchFiles();
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <CloudLightning className="h-8 w-8 text-blue-500" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">AWS S3 Dashboard</h1>
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
                    <div key={index} className="mb-3 border-l-4 border-blue-500 pl-3 py-1">
                      <p className="text-sm text-gray-700">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </p>
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

      <NotificationsList notifications={notifications} />
    </div>
  );
}

function setIsLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}
