'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu as MenuIcon, Bell, Settings as SettingsIcon, LogOut, Moon, Sun } from 'lucide-react';
import { useSidebarStore } from './SidebarStore';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import Image from 'next/image';
import { Fragment } from 'react';
import { useTheme } from 'next-themes';
import { ThemeToggle } from '../theme/ThemeToggle';

export function Navbar() {
  const pathname = usePathname();
  const showToggle = ['/dashboard', '/notifications', '/profile', '/users'].some((p) =>
    pathname.startsWith(p),
  );
  const toggleDrawer = useSidebarStore((s) => s.toggleDrawer);
  const toggleCollapse = useSidebarStore((s) => s.toggleCollapse);

  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const { theme, systemTheme, setTheme } = useTheme();

  // Determine current theme
  const current = theme === 'system' ? systemTheme : theme;
  const isDark = current === 'dark';
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
      <div className="flex items-center gap-4">
        {/* Drawer toggle on mobile, collapse toggle on desktop */}
        {showToggle && (
          <>
            <button onClick={toggleDrawer} className="p-2 md:hidden">
              <MenuIcon className="h-6 w-6" />
            </button>
            <button onClick={toggleCollapse} className="hidden p-2 md:block">
              <MenuIcon className="h-6 w-6" />
            </button>
          </>
        )}
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
          <Link
            href="/notifications"
            className="relative rounded p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Bell className="h-6 w-6" />
          </Link>
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
                  <MenuItem>
                    {({ focus }) => (
                      <Link
                        href="/settings"
                        className={`block px-4 py-2 text-sm ${
                          focus
                            ? 'bg-gray-100 dark:bg-gray-700'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <SettingsIcon className="mr-2 inline h-4 w-4" />
                        Settings
                      </Link>
                    )}
                  </MenuItem>
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
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className={`w-full px-4 py-2 text-left text-sm ${
                          focus
                            ? 'bg-gray-100 dark:bg-gray-700'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <LogOut className="mr-2 inline h-4 w-4" />
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
