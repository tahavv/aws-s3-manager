"use client";

import { useState, useEffect } from "react";
import { Bell, Check, X, AlertCircle, Upload, Download, Trash2 } from "lucide-react";

interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationItemProps {
  notification: Notification;
}

export default function NotificationItem({ notification }: NotificationItemProps) {
  const [isNew, setIsNew] = useState(!notification.read);
  const [isVisible, setIsVisible] = useState(true);

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

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
  };

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsNew(false);
  };

  if (!isVisible) return null;

  return (
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
  );
}