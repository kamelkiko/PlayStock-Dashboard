import { create } from 'zustand';

interface UIState {
    sidebarOpen: boolean;
    sidebarCollapsed: boolean;
    sidebarWidth: number;
    darkMode: boolean;
    language: string;

    // Actions
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    toggleSidebarCollapsed: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
    toggleDarkMode: () => void;
    setLanguage: (lang: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
    sidebarOpen: true,
    sidebarCollapsed: false,
    sidebarWidth: 260,
    darkMode: false,
    language: 'en',

    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    toggleSidebarCollapsed: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
    toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    setLanguage: (lang) => set({ language: lang }),
}));

export default useUIStore;
