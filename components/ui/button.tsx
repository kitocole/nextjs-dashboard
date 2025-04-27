// app/components/ui/button.tsx
'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles: layout, disabled, focus ring
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: [
          // Primary button: blue background, white text
          'bg-blue-500 text-white hover:bg-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500',
          // Dark mode variants
          'dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus-visible:ring-blue-400',
        ].join(' '),
        destructive: [
          'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500',
          'dark:bg-red-700 dark:hover:bg-red-800 dark:focus-visible:ring-red-400',
        ].join(' '),
        outline: [
          'border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500',
          'dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400',
        ].join(' '),
        secondary: [
          'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-blue-500',
          'dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:focus-visible:ring-blue-400',
        ].join(' '),
        ghost: [
          'bg-transparent text-gray-900 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500',
          'dark:text-gray-100 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400',
        ].join(' '),
        link: 'text-blue-500 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 gap-1 px-3',
        lg: 'h-10 px-6',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
