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
  MessageCircle,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { status } = useSession();
  const isLoggedIn = status === 'authenticated';
  const { isOpen, toggleDrawer } = useSidebarStore();

  const base = 'px-3 rounded-md transition-colors flex items-center gap-2 py-4';
  const active = 'bg-sidebar-primary text-sidebar-primary-foreground';
  const inactive =
    'text-sidebar-foreground hover:bg-sidebar hover:text-foreground dark:hover:bg-sidebar dark:hover:text-foreground';
  const linkClasses = (href: string) => `${base} ${pathname === href ? active : inactive}`;

  const links = isLoggedIn
    ? [
        { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/kanban', icon: KanbanSquare, label: 'Kanban ' },
        { href: '/chat', icon: MessageCircle, label: 'Chat' },
        { href: '/profile', icon: UserIcon, label: 'Profile' },
        { href: '/users', icon: UsersIcon, label: 'Users' },
        { href: '/settings', icon: SettingsIcon, label: 'Settings' },
      ]
    : [{ href: '/login', icon: LogIn, label: 'Login' }];

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-40" onClose={toggleDrawer}>
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

        <Transition
          appear
          show={isOpen}
          as={Fragment}
          enter="transition duration-300 ease-out"
          enterFrom="-translate-x-full pointer-events-none"
          enterTo="translate-x-0"
          leave="transition duration-200 ease-in"
          leaveFrom="translate-x-0 pointer-events-none"
          leaveTo="-translate-x-full"
        >
          <div className="bg-sidebar dark:bg-sidebar fixed inset-y-0 left-0 w-64 p-4 pt-6">
            <nav className="flex flex-col gap-2 pt-12">
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
        </Transition>
      </Dialog>
    </Transition>
  );
}
