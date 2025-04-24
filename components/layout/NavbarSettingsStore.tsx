import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type NavbarSettings = {
  enableShadow: boolean;
  enableAutoHide: boolean;
  setEnableShadow: (value: boolean) => void;
  setEnableAutoHide: (value: boolean) => void;
};

export const useNavbarSettings = create<NavbarSettings>()(
  persist(
    (set) => ({
      enableShadow: true,
      enableAutoHide: false,
      setEnableShadow: (value) => set({ enableShadow: value }),
      setEnableAutoHide: (value) => set({ enableAutoHide: value }),
    }),
    {
      name: 'navbar-settings-storage', // Key inside localStorage
    },
  ),
);
