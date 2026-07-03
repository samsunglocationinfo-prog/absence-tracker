import { create } from 'zustand';
import { ThemeMode } from '../types';

type AppStore = {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
};

export const useAppStore = create<AppStore>((set) => ({
  themeMode: 'dark',
  setThemeMode: (mode) => set({ themeMode: mode }),
}));
