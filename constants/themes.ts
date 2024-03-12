import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
  MD3Theme,
} from "react-native-paper";
import {
  DefaultTheme as NavigationLightTheme,
  DarkTheme as NavigationDarkTheme,
} from "@react-navigation/native";
import deepmerge from "deepmerge";
import colors from "./colors";

const PaperLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    tertiary: colors.tertiary,
    error: colors.error,
    backgrounds: {
      primary: colors.background.primaryLight,
      secondary: colors.background.secondaryLight,
    },
    defaults: {
      ...colors.default,
    },
  },
};
const PaperDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    tertiary: colors.tertiary,
    error: colors.error,
    backgrounds: {
      primary: colors.background.primaryDark,
      secondary: colors.background.secondaryLight,
    },
    defaults: {
      ...colors.default,
    },
  },
};

//   const { LightTheme: NavLightTheme, DarkTheme: NavDarkTheme } =
//   adaptNavigationTheme({
//     light: NavigationLightTheme,
//     dark: NavigationDarkTheme,
//   });
export const CombinedLightTheme = deepmerge(
  PaperLightTheme,
  NavigationLightTheme
);
export const CombinedDarkTheme = deepmerge(PaperDarkTheme, NavigationDarkTheme);

export type AppTheme = typeof CombinedLightTheme | typeof CombinedDarkTheme;
