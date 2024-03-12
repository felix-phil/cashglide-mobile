import { NavigationContainer } from "@react-navigation/native";
import React, { FC, ReactNode, useCallback, useMemo, useState } from "react";
import { Provider as PaperThemeProvider } from "react-native-paper";
import { CombinedDarkTheme, CombinedLightTheme } from "../../constants/themes";
import {
  ThemePreferenceContext,
  ThemePreferenceContextType,
} from "../../context/ThemePreferenceContext";
import * as Notifications from "expo-notifications";
import * as Linking from "expo-linking";
import { Text } from "react-native-svg";

const ThemeAndNavigationProvider: FC<{
  children: ReactNode | ReactNode[];
}> = ({ children }) => {
  const [isThemeDark, setIsThemeDark] = useState<boolean>(false);

  const toggleTheme = useCallback(() => {
    return setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);

  const themePrefrenceMemo = useMemo<ThemePreferenceContextType>(
    () => ({
      isThemeDark,
      toggleTheme,
    }),
    [isThemeDark, toggleTheme]
  );
  const theme = isThemeDark ? CombinedDarkTheme : CombinedLightTheme;
  return (
    <ThemePreferenceContext.Provider value={themePrefrenceMemo}>
      <PaperThemeProvider theme={theme}>
        <NavigationContainer
          theme={theme}
          linking={{
            prefixes: [
              Linking.createURL("/"),
              "cashglide://",
              "https://cashglide.xyz",
            ],
            config: {
              screens: {
                TransactionDetail: "transactions/:transactionId",
              },
            },
            async getInitialURL() {
              const url = await Linking.getInitialURL();
              if (url != null) {
                return url;
              }
              const response =
                await Notifications.getLastNotificationResponseAsync();
              return response?.notification.request.content.data.url;
            },
            subscribe(listener) {
              const onReceiveURL = ({ url }: { url: string }) => listener(url);
              const eventListenerSubscription = Linking.addEventListener(
                "url",
                onReceiveURL
              );
              const subscription =
                Notifications.addNotificationResponseReceivedListener(
                  (response) => {
                    const url = response.notification.request.content.data.url;
                    console.log(url);
                    listener(url);
                  }
                );
              return () => {
                eventListenerSubscription.remove();
                subscription.remove();
              };
            },
          }}
          fallback={<Text>Loading...</Text>}
        >
          {children}
        </NavigationContainer>
      </PaperThemeProvider>
    </ThemePreferenceContext.Provider>
  );
};
export default ThemeAndNavigationProvider;
