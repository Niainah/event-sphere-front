import { create } from "zustand";

const useThemeStore = create((set) => ({
  isDark: (() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      try {
        return savedTheme !== null ? JSON.parse(savedTheme) : false;
      } catch (error) {
        console.error("Erreur lors du parsing de localStorage theme:", error);
        return false; 
      }
    }
    return false;
  })(),
  toggleTheme: () =>
    set((state:any) => {
      const newTheme = !state.isDark;
      localStorage.setItem("theme", JSON.stringify(newTheme));
      document.documentElement.classList.toggle("dark", newTheme);
      return { isDark: newTheme };
    }),
}));

export default useThemeStore;