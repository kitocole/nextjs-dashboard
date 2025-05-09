'use client';

import { create } from 'zustand';
import { INotification } from './types';

interface NotificationStore {
  notifications: INotification[];
  unreadCount: number;
  setNotifications: (notifications: INotification[]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((notif) => !notif.read).length,
    }),
  markAsRead: (id) =>
    set((state) => {
      const updatedNotifications = state.notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif,
      );
      return {
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter((notif) => !notif.read).length,
      };
    }),
  markAllAsRead: () =>
    set((state) => {
      const updatedNotifications = state.notifications.map((notif) => ({
        ...notif,
        read: true,
      }));
      return {
        notifications: updatedNotifications,
        unreadCount: 0,
      };
    }),
}));
