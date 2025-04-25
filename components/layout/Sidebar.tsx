// app/components/layout/Sidebar.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useNotificationStore } from '@/components/notifications/notificationsStore';
import {
  LayoutDashboard,
  User,
  LogIn,
  ChevronLeft,
  ChevronRight,
  Settings,
  Bell,
  DollarSign,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { status } = useSession();
  const isLoggedIn = status === 'authenticated';
  const [collapsed, setCollapsed] = useState(false);
  const { unreadCount, setUnreadCount } = useNotificationStore();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications');
        const data = await res.json();
        setUnreadCount(data.length); // Count number of notifications
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    };

    fetchNotifications();
  }, [setUnreadCount]);

  useEffect(() => {
    // Auto-collapse if screen width is small
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    // Clean up listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const linkClasses = (href: string) =>
    `px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
      pathname === href
        ? 'font-semibold bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]'
        : 'hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]'
    }`;

  return (
    <div
      className={`flex h-screen flex-col p-4 shadow-lg transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      } border-r border-[var(--sidebar-border)] bg-[var(--sidebar)] text-[var(--sidebar-foreground)]`}
    >
      {/* 1) Scrollable nav area */}
      <nav className="flex flex-1 flex-col gap-2 text-gray-700 dark:text-gray-300">
        {isLoggedIn ? (
          <>
            <Link href="/dashboard" className={linkClasses('/dashboard')}>
              <LayoutDashboard className="h-10 w-5" />
              {!collapsed && 'Dashboard'}
            </Link>
            <Link href="/notifications" className={linkClasses('/notifications')}>
              <div className="flex h-10 items-center gap-2">
                <div className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white">
                      {unreadCount}
                    </span>
                  )}
                </div>
                {!collapsed && 'Notifications'}
              </div>
            </Link>
            <Link href="/profile" className={linkClasses('/profile')}>
              <User className="h-10 w-5" />
              {!collapsed && 'Profile'}
            </Link>
            <Link href="/pricing" className={linkClasses('/pricing')}>
              <DollarSign className="h-10 w-5" />
              {!collapsed && 'Pricing'}
            </Link>
            <Link href="/settings" className={linkClasses('/settings')}>
              <Settings className="h-10 w-5" />
              {!collapsed && 'Settings'}
            </Link>
          </>
        ) : (
          <Link href="/login" className={linkClasses('/login')}>
            <LogIn className="h-5 w-5" />
            {!collapsed && 'Login'}
          </Link>
        )}
      </nav>

      {/* 2) Always‐visible collapse control */}
      <div className="flex justify-end border-t p-2">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="hover:text-primary text-gray-500"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
