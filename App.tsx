import "react-native-url-polyfill/auto";
import { StatusBar } from "expo-status-bar";
import { LogBox, StyleSheet, Text, View, useColorScheme } from "react-native";
import AnimatedAppLoader from "./components/providers/AnimatedAppLoader";
import { Provider as StoreProvider } from "react-redux";
import store from "./store";
import ThemeAndNavigationProvider from "./components/providers/ThemeAndNavigationProvider";
import RootNavigation from "./routes";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import NotificationsProvider from "./components/providers/NotificationsProvider";

LogBox.ignoreLogs([
  "Constants.manifest has been deprecated in favor of Constants.expoConfig",
]);
const Main = () => {
  return (
    <StoreProvider store={store}>
      <StatusBar translucent animated networkActivityIndicatorVisible />
      <NotificationsProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <ThemeAndNavigationProvider>
              <BottomSheetModalProvider>
                <RootNavigation />
              </BottomSheetModalProvider>
            </ThemeAndNavigationProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </NotificationsProvider>
    </StoreProvider>
  );
};

const App = () => {
  const darkSplash = require("./assets/images/splash-dark.png");
  const lightSplash = require("./assets/images/splash-light.png");
  const scheme = useColorScheme();
  return (
    <AnimatedAppLoader image={scheme === "dark" ? darkSplash : lightSplash}>
      <Main />
    </AnimatedAppLoader>
  );
};
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
