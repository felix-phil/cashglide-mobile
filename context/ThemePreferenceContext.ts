import { useContext, createContext } from "react";

export type ThemePreferenceContextType = {
  isThemeDark: boolean;
  toggleTheme: () => void;
};
export const ThemePreferenceContext = createContext<ThemePreferenceContextType>(
  {
    isThemeDark: false,
    toggleTheme: () => {},
  }
);

export const useThemePreferenceContext = () =>
  useContext(ThemePreferenceContext);
