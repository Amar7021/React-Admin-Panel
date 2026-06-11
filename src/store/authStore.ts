import { create } from "zustand";

interface AuthState {
  currentUser: any | null;
  setCurrentUser: (user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  let initialUser = null;
  try {
    const stored = localStorage.getItem("user");
    initialUser = stored ? JSON.parse(stored) : null;
  } catch (err) {
    console.error("Failed to parse user from localStorage", err);
  }

  return {
    currentUser: initialUser,
    setCurrentUser: (user) => {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
      set({ currentUser: user });
    },
    logout: () => {
      localStorage.removeItem("user");
      set({ currentUser: null });
    },
  };
});
