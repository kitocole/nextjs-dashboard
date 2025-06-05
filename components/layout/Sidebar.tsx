'use client';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useSidebarStore } from './SidebarStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  User as UserIcon,
  LogIn,
  Settings as SettingsIcon,
  Users as UsersIcon,
  KanbanSquare,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { status } = useSession();
  const isLoggedIn = status === 'authenticated';
  const { isOpen, toggleDrawer } = useSidebarStore();

  const base = 'px-3 rounded-md transition-colors flex items-center gap-2 py-4';
  const active = 'bg-blue-500 text-white';
  const inactive = 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800';
  const linkClasses = (href: string) => `${base} ${pathname === href ? active : inactive}`;

  const links = isLoggedIn
    ? [
        { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/kanban', icon: KanbanSquare, label: 'Kanban ' },
        { href: '/profile', icon: UserIcon, label: 'Profile' },
        { href: '/users', icon: UsersIcon, label: 'Users' },
        { href: '/settings', icon: SettingsIcon, label: 'Settings' },
      ]
    : [{ href: '/login', icon: LogIn, label: 'Login' }];

  return (
    <>
      {/* Drawer Sidebar for all screen sizes */}
      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-40" open={isOpen} onClose={toggleDrawer}>
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
          <div className="fixed inset-y-0 left-0 w-64 bg-white p-4 dark:bg-gray-900">
            <nav className="flex flex-col gap-2 pt-15">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={linkClasses(link.href)}
                  onClick={toggleDrawer}
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
