// app/(protected)/notifications/page.tsx
'use client';

import { useNotificationStore } from '@/components/notifications/notificationsStore';

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Notifications</h1>
        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-blue-500 hover:underline dark:text-blue-400"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="flex flex-col gap-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              className={`cursor-pointer rounded-lg border p-4 shadow-sm ${
                notif.read
                  ? 'bg-white dark:border-gray-700 dark:bg-gray-900'
                  : 'bg-blue-50 dark:border-blue-900 dark:bg-blue-900'
              } hover:bg-gray-100 dark:hover:bg-gray-800`}
            >
              <div className="flex items-center justify-between">
                <div className="font-medium text-gray-900 dark:text-gray-100">{notif.message}</div>
                {!notif.read && <span className="ml-2 h-2 w-2 rounded-full bg-blue-500"></span>}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{notif.createdAt}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-2 text-2xl font-bold text-gray-700 dark:text-gray-300">
            🎉 You&apos;re all caught up!
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">No new notifications.</div>
        </div>
      )}
    </div>
  );
}
