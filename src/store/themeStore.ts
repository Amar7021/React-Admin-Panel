import { create } from "zustand";

interface ThemeState {
  darkMode: boolean;
  setLightMode: () => void;
  setDarkMode: () => void;
  toggleDarkMode: () => void;
}

export const useThemeStore = create<ThemeState>((set) => {
  // Check localstorage or default to false
  const initialDarkMode = localStorage.getItem("darkMode") === "true";
  
  // Sync HTML class
  if (initialDarkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  return {
    darkMode: initialDarkMode,
    setLightMode: () => {
      localStorage.setItem("darkMode", "false");
      document.documentElement.classList.remove("dark");
      set({ darkMode: false });
    },
    setDarkMode: () => {
      localStorage.setItem("darkMode", "true");
      document.documentElement.classList.add("dark");
      set({ darkMode: true });
    },
    toggleDarkMode: () => {
      set((state) => {
        const newMode = !state.darkMode;
        localStorage.setItem("darkMode", String(newMode));
        if (newMode) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        return { darkMode: newMode };
      });
    },
  };
});
