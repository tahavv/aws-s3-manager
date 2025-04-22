"use client";

import { useEffect, useState } from "react";

export default function NotificationList() {
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    // Simulate fetching notifications
    const eventSource = new EventSource("/api/notifications");
    eventSource.onmessage = (event) => {
      setNotifications((prev) => [...prev, event.data]);
    };
    return () => eventSource.close();
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification}</li>
        ))}
      </ul>
    </div>
  );
}