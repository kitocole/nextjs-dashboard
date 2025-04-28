// app/components/ThemeToggle.tsx

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();

  // Determine current theme
  const current = theme === 'system' ? systemTheme : theme;
  const isDark = current === 'dark';

  const toggle = () => setTheme(isDark ? 'light' : 'dark');

  return (
    <button onClick={toggle} aria-label="Toggle dark mode" className="flex items-center">
      <div
        className={`relative h-6 w-12 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-300'} transition-colors`}
      >
        {/* sliding thumb */}
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 transform rounded-full bg-white shadow transition-transform ${isDark ? 'translate-x-6' : 'translate-x-0'} flex items-center justify-center`}
        >
          {isDark ? (
            <Moon className="h-4 w-4 text-gray-600" />
          ) : (
            <Sun className="h-4 w-4 text-yellow-500" />
          )}
        </span>
      </div>
    </button>
  );
}
