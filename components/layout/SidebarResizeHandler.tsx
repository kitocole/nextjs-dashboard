// components/layout/SidebarResizeHandler.tsx
'use client';

import { useEffect } from 'react';
import { useSidebarStore } from './useSidebarStore';

export function SidebarResizeHandler() {
  const setCollapsed = useSidebarStore((s) => s.setCollapsed);

  useEffect(() => {
    function onResize() {
      // collapse when narrower than md (768px)
      setCollapsed(window.innerWidth < 768);
    }
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [setCollapsed]);

  return null;
}
