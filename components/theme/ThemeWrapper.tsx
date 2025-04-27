// app/components/theme/ThemeWrapper.tsx
'use client';

import React from 'react';

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white dark:bg-gray-900">{children}</div>
  );
}
