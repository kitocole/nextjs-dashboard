//app/(protected)/notifications/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useNotificationStore } from '@/components/notifications/notificationsStore';

interface Notification {
  id: number;
  message: string;
  time: string;
}

export default function NotificationsPage() {
  const { setUnreadCount } = useNotificationStore();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications');
        const data = await res.json();
        setNotifications(data);
        setUnreadCount(0);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [setUnreadCount]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Notifications</h1>
      {!loading && notifications.length > 0 && (
        <button
          onClick={() => {
            setNotifications([]);
          }}
          className="text-primary ml-auto text-sm hover:underline"
        >
          Mark all as read
        </button>
      )}

      {loading ? (
        <div className="space-y-4">
          <div className="h-16 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
          <div className="h-16 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
          <div className="h-16 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
        </div>
      ) : notifications.length > 0 ? (
        <div className="animate-fade-in flex flex-col gap-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="flex flex-col rounded-lg border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="font-medium text-gray-900 dark:text-gray-100">{notif.message}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{notif.time}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="animate-fade-in flex flex-col items-center justify-center py-20">
          <div className="mb-2 text-2xl font-bold text-gray-700 dark:text-gray-300">
            🎉 You&apos;re all caught up!
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">No new notifications.</div>
        </div>
      )}
    </div>
  );
}
