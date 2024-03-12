import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import type { RootState, AppDispatch } from "../store";
import type { AppTheme } from "../constants/themes";
import { useTheme } from "react-native-paper";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppTheme = () => {
  const theme = useTheme<AppTheme>();
  return theme;
};
