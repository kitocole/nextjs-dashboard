// app/(protected)/settings/page.tsx
'use client';

import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useNavbarSettings } from '@/components/layout/NavbarSettingsStore';

export default function SettingsPage() {
  const { enableShadow, enableAutoHide, setEnableShadow, setEnableAutoHide } = useNavbarSettings();

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>

      {/* Form box */}

      {/* Divider */}
      <div className="my-6 h-px w-full bg-gray-200 dark:bg-gray-700" />

      {/* Preferences Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
          <ThemeToggle />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Navbar Shadow on Scroll
          </span>
          <input
            type="checkbox"
            checked={enableShadow}
            onChange={(e) => setEnableShadow(e.target.checked)}
            className="accent-primary h-5 w-5"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Auto-Hide Navbar
          </span>
          <input
            type="checkbox"
            checked={enableAutoHide}
            onChange={(e) => setEnableAutoHide(e.target.checked)}
            className="accent-primary h-5 w-5"
          />
        </div>
      </div>
    </div>
  );
}
