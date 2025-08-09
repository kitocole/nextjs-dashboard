'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
  Menu as MenuIcon,
  Bell,
  Settings as SettingsIcon,
  LogOut,
  Moon,
  Sun,
  User as UserIcon,
} from 'lucide-react';
import { useSidebarStore } from './SidebarStore';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import Image from 'next/image';
import { Fragment, useEffect, useState, useRef } from 'react';
import { useTheme } from 'next-themes';
import { ThemeToggle } from '../theme/ThemeToggle';
import { INotification } from '../notifications/types';
import { useNotificationStore } from '@/components/notifications/notificationsStore';

export function Navbar() {
  const toggleDrawer = useSidebarStore((s) => s.toggleDrawer);

  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const { theme, systemTheme, setTheme } = useTheme();

  // Determine current theme
  const current = theme === 'system' ? systemTheme : theme;
  const isDark = current === 'dark';
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  const { notifications, unreadCount, setNotifications, markAsRead, markAllAsRead } =
    useNotificationStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await fetch('/api/notifications');
      const data: INotification[] = await res.json();
      setNotifications(data);
    };

    fetchNotifications();
  }, [setNotifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const recentNotifications = notifications.slice(0, 5); // Show the most recent 5 notifications

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
      <div className="flex items-center gap-4">
        <button onClick={toggleDrawer} className="p-2">
          <MenuIcon className="h-6 w-6" />
        </button>

        <Link href="/" className="text-xl font-bold">
          Home
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated && (
          <Link
            href="/dashboard"
            className="rounded px-3 py-1 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Dashboard
          </Link>
        )}
        {isAuthenticated && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="relative rounded p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Bell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-gray-800">
                {/* Scrollable Notifications */}
                <div className="max-h-80 overflow-y-auto py-2">
                  {recentNotifications.length > 0 ? (
                    recentNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={`cursor-pointer px-4 py-2 text-sm ${
                          notif.read
                            ? 'bg-gray-100 dark:bg-gray-700'
                            : 'bg-blue-50 dark:bg-blue-900'
                        } hover:bg-gray-200 dark:hover:bg-gray-600`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {notif.message}
                          </div>
                          {!notif.read && (
                            <span className="ml-2 h-2 w-2 rounded-full bg-blue-500"></span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {notif.createdAt}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                      No new notifications.
                    </div>
                  )}
                </div>

                {/* Fixed Footer */}
                <div className="border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={markAllAsRead}
                    className="block w-full px-4 py-2 text-center text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Mark All as Read
                  </button>
                  <Link
                    href="/notifications"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 text-center text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    View All
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {status === 'loading' ? (
          <div className="rounded bg-gray-600 px-3 py-1 text-white">…</div>
        ) : isAuthenticated && session?.user ? (
          <Menu as="div" className="relative">
            <MenuButton className="flex items-center space-x-2 rounded-full p-1 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
              <Image
                src={session.user.image || '/assets/default-avatar.svg'}
                alt="Avatar"
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover"
                unoptimized
              />
            </MenuButton>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-gray-800">
                <div className="py-1">
                  {/* Greeting */}
                  <div className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                    Hello, {session.user.firstName || 'User'}!
                  </div>
                  {/* Profile Link */}
                  <MenuItem>
                    {({ focus }) => (
                      <Link
                        href="/profile"
                        className={`flex items-center px-4 py-2 text-sm ${
                          focus
                            ? 'bg-gray-100 dark:bg-gray-700'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <UserIcon className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    )}
                  </MenuItem>
                  {/* Dark Mode Toggle */}
                  <MenuItem
                    as="div"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleTheme();
                    }}
                  >
                    {({ focus }) => (
                      <div
                        className={`flex w-full items-center justify-between px-4 py-2 text-sm ${
                          focus
                            ? 'bg-gray-100 dark:bg-gray-700'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          {isDark ? (
                            <Moon className="h-4 w-4 text-gray-600" />
                          ) : (
                            <Sun className="h-4 w-4 text-yellow-500" />
                          )}
                          <span>Dark Mode</span>
                        </div>
                        <ThemeToggle />
                      </div>
                    )}
                  </MenuItem>
                  {/* Settings Link */}
                  <MenuItem>
                    {({ focus }) => (
                      <Link
                        href="/settings"
                        className={`flex items-center px-4 py-2 text-sm ${
                          focus
                            ? 'bg-gray-100 dark:bg-gray-700'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <SettingsIcon className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        onClick={() => signOut({ callbackUrl: '/login?noAuto=1' })}
                        className={`flex w-full items-center px-4 py-2 text-left text-sm ${
                          focus
                            ? 'bg-gray-100 dark:bg-gray-700'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </button>
                    )}
                  </MenuItem>
                </div>
              </MenuItems>
            </Transition>
          </Menu>
        ) : (
          <Link
            href="/login"
            className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
