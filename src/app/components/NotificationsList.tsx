"use client";

import { useState, useEffect } from "react";
import { Bell, X, CheckSquare } from "lucide-react";
import NotificationItem from "./NotificationItem"; // This would need to be updated to use the modernized NotificationItem

interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationsListProps {
  notifications: Notification[];
}

export default function NotificationsList({ notifications }: NotificationsListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [displayedNotifications, setDisplayedNotifications] = useState<Notification[]>([]);
  
  // Update unread count when notifications change
  useEffect(() => {
    setUnreadCount(notifications.length);
    setDisplayedNotifications(notifications);
  }, [notifications]);

  const markAllAsRead = () => {
    setUnreadCount(0);
  };

  const clearAll = () => {
    setDisplayedNotifications([]);
    setUnreadCount(0);
  };

  // Animation effect for the bell icon when new notifications arrive
  useEffect(() => {
    if (unreadCount > 0) {
      const bellElement = document.getElementById("notification-bell");
      bellElement?.classList.add("animate-bounce");
      
      const timeout = setTimeout(() => {
        bellElement?.classList.remove("animate-bounce");
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [unreadCount]);

  return (
    <div className="relative">
      {/* Floating notification button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50"
      >
        <Bell id="notification-bell" size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {/* Notifications panel */}
      <div 
        className={`fixed inset-y-0 right-0 max-w-sm w-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-bold flex items-center text-gray-800">
              <Bell className="mr-2 text-blue-500" size={20} />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {unreadCount} new
                </span>
              )}
            </h2>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          
          <div className="flex items-center justify-between px-4 py-2 bg-gray-50">
            <button 
              onClick={markAllAsRead}
              className="text-sm flex items-center text-blue-500 hover:text-blue-700 transition-colors"
              disabled={unreadCount === 0}
            >
              <CheckSquare size={14} className="mr-1" />
              Mark all as read
            </button>
            <button 
              onClick={clearAll}
              className="text-sm flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              disabled={displayedNotifications.length === 0}
            >
              <X size={14} className="mr-1" />
              Clear all
            </button>
          </div>
          
          <div className="flex-grow overflow-y-auto p-4">
            {displayedNotifications.length > 0 ? (
              displayedNotifications.map((notification, index) => (
                <NotificationItem key={index} notification={notification} />
              ))
            ) : (
              <div className="py-12 text-center text-gray-500">
                <div className="flex justify-center mb-3">
                  <Bell size={32} className="text-gray-300" />
                </div>
                <p className="text-lg font-medium">No notifications</p>
                <p className="text-sm">You're all caught up!</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Overlay for closing when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-opacity-25 z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}