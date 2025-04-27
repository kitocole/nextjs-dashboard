// app/components/ui/input.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // base layout & typography
        'flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-colors outline-none',
        // light/dark backgrounds and borders
        'border-gray-300 bg-white placeholder-gray-500 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500',
        'dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400',
        // invalid state
        'aria-invalid:border-red-500 aria-invalid:ring-2 aria-invalid:ring-red-500/50',
        // disabled state
        'disabled:cursor-not-allowed disabled:opacity-50',
        // text selection colors
        'selection:bg-blue-100 selection:text-blue-800 dark:selection:bg-blue-900/30 dark:selection:text-blue-300',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
