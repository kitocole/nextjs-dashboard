// components/layout/SidebarStore.ts
import { create } from 'zustand';

interface SidebarState {
  //  drawer state
  isOpen: boolean;
  toggleDrawer: () => void;
  setOpen: (val: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  //drawer defaults
  isOpen: false,
  toggleDrawer: () => set((s) => ({ isOpen: !s.isOpen })),
  setOpen: (val) => set({ isOpen: val }),
}));
