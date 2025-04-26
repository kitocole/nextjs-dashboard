// components/layout/Navbar.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu as MenuIcon, Bell, Settings } from 'lucide-react';
import { useSidebarStore } from './useSidebarStore';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import Image from 'next/image';
import { Fragment } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const showToggle = ['/dashboard', '/notifications', '/profile', '/users'].some((p) =>
    pathname.startsWith(p),
  );
  const { toggle } = useSidebarStore();
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return (
    <header className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-b bg-[var(--sidebar)] px-4 py-4 text-[var(--sidebar-foreground)]">
      <div className="flex items-center gap-4">
        {showToggle && (
          <button onClick={toggle} className="p-2">
            <MenuIcon className="h-6 w-6" />
          </button>
        )}
        <Link href="/" className="text-xl font-bold">
          Company Name
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated && (
          <Link
            href="/dashboard"
            className="rounded px-3 py-1 transition hover:bg-[var(--sidebar-accent)]"
          >
            Dashboard
          </Link>
        )}
        {isAuthenticated && (
          <Link
            href="/notifications"
            className="relative rounded p-2 transition hover:bg-[var(--sidebar-accent)]"
          >
            <Bell className="h-6 w-6" />
          </Link>
        )}

        {status === 'loading' ? (
          <div className="rounded bg-gray-600 px-3 py-1 text-white">…</div>
        ) : isAuthenticated && session?.user ? (
          <Menu as="div" className="relative">
            <MenuButton className="flex items-center space-x-2 rounded-full p-1 transition hover:bg-[var(--sidebar-accent)]">
              <Image
                src={session.user.image || '/default-avatar.png'}
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
              <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/10 focus:outline-none dark:bg-gray-800">
                <div className="py-1">
                  <MenuItem>
                    {({ focus }) => (
                      <Link
                        href="/settings"
                        className={`block px-4 py-2 text-sm ${
                          focus ? 'bg-gray-100 dark:bg-gray-700' : ''
                        }`}
                      >
                        <Settings className="mr-2 inline h-4 w-4" />
                        Settings
                      </Link>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className={`block w-full px-4 py-2 text-left text-sm ${
                          focus ? 'bg-gray-100 dark:bg-gray-700' : ''
                        }`}
                      >
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
            className="rounded bg-blue-600 px-3 py-1 text-white transition hover:bg-blue-700"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
