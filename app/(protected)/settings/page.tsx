'use client';

import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const { theme, resolvedTheme } = useTheme();
  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 text-gray-900 shadow dark:bg-gray-900 dark:text-gray-100">
      <p>theme: {theme}</p>
      <p>resolved: {resolvedTheme}</p>
      <h1 className="mb-8 text-3xl font-bold">Settings</h1>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span>Dark Mode</span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
