// components/layout/SidebarStore.ts
import { create } from 'zustand';

interface SidebarState {
  // Desktop collapse state
  collapsed: boolean;
  toggleCollapse: () => void;
  setCollapsed: (val: boolean) => void;

  // Mobile drawer state
  isOpen: boolean;
  toggleDrawer: () => void;
  setOpen: (val: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  // Desktop collapse defaults
  collapsed: false,
  toggleCollapse: () => set((s) => ({ collapsed: !s.collapsed })),
  setCollapsed: (val) => set({ collapsed: val }),

  // Mobile drawer defaults
  isOpen: false,
  toggleDrawer: () => set((s) => ({ isOpen: !s.isOpen })),
  setOpen: (val) => set({ isOpen: val }),
}));
