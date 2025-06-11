"use client";

import { useState, useEffect } from "react";
import { Bell, Check, X, AlertCircle, Upload, Download, Trash2 } from "lucide-react";

interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
  rawData?: string;
}

interface NotificationItemProps {
  notification: Notification;
}

export default function NotificationItem({ notification }: NotificationItemProps) {
  const [isNew, setIsNew] = useState(!notification.read);
  const [isVisible, setIsVisible] = useState(true);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => {
        setIsNew(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isNew]);

  const getNotificationType = (message: string) => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes("upload") || lowerMessage.includes("added")) {
      return "upload";
    } else if (lowerMessage.includes("delete") || lowerMessage.includes("removed")) {
      return "delete";
    } else if (lowerMessage.includes("download")) {
      return "download";
    } else if (lowerMessage.includes("error") || lowerMessage.includes("failed")) {
      return "error";
    } else {
      return "info";
    }
  };

  const notificationType = getNotificationType(notification.message);

  const iconMap = {
    upload: <Upload size={16} className="text-green-500" />,
    delete: <Trash2 size={16} className="text-red-500" />,
    download: <Download size={16} className="text-blue-500" />,
    error: <AlertCircle size={16} className="text-red-500" />,
    info: <Bell size={16} className="text-blue-500" />,
  };

  const bgColorMap = {
    upload: "bg-green-50",
    delete: "bg-red-50",
    download: "bg-blue-50",
    error: "bg-red-50",
    info: "bg-blue-50",
  };

  const handleDismiss = (e) => {
    e.stopPropagation();
    setIsVisible(false);
  };

  const handleMarkAsRead = (e) => {
    e.stopPropagation();
    setIsNew(false);
  };

  const handleViewData = (e) => {
    e.stopPropagation();
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
  };

  // Format JSON data for display
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


  if (!isVisible) return null;

  return (
    <>
      <div
        className={`relative flex items-start p-3 mb-2 rounded-lg border transition-all duration-300 transform ${
          bgColorMap[notificationType]
        } ${
          isNew ? "border-l-4 border-l-blue-500 shadow-md" : "border-gray-200"
        }`}
      >
        <div className="flex-shrink-0 mt-0.5 mr-3">{iconMap[notificationType]}</div>

        <div className="flex-grow">
          <p className="text-sm text-gray-700">{notification.message}</p>
          <p className="text-xs text-gray-500 mt-1">{new Date(notification.timestamp).toLocaleTimeString()}</p>
        </div>

        <div className="flex-shrink-0 flex gap-1 ml-2">
          {notification.rawData && (
            <button 
              onClick={handleViewData} 
              className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-100 transition-colors"
              title="View Details"
            >
              View
            </button>
          )}
          {isNew && (
            <button
              onClick={handleMarkAsRead}
              className="p-1 hover:bg-blue-100 rounded-full transition-colors"
              title="Mark as read"
            >
              <Check size={14} className="text-blue-500" />
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            title="Dismiss"
          >
            <X size={14} className="text-gray-500" />
          </button>
        </div>

        {isNew && <span className="absolute right-2 top-2 w-2 h-2 bg-blue-500 rounded-full"></span>}
      </div>

      {/* Popup Dialog */}
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl max-h-screen overflow-hidden">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="font-medium text-lg">{notification.message}</h3>
              <button 
                onClick={closeDialog}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-96">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Raw Data</h4>
              <div className="bg-gray-100 rounded-md p-4 overflow-auto">
                <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                  {notification.rawData && formatJsonData(notification.rawData)}
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
    </>
  );
}