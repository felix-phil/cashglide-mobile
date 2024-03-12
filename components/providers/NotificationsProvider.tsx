import { Platform } from "react-native";
import React, { FC, ReactNode, useCallback, useEffect } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { useAppSelector } from "../../hooks";
import {
  useLazyCurrentUserQuery,
  useUpdateUserProfileMutation,
} from "../../store/services/authentication";
import {
  checkUserHasSyncTokenWithServer,
  storeUserPushTokenToDevice,
} from "../../services/storage";
import Constants from "expo-constants";

interface IProp {
  children: ReactNode | ReactNode[];
}
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const NotificationsProvider: FC<IProp> = ({ children }) => {
  const auth = useAppSelector((state) => state.auth);
  const [getUser] = useLazyCurrentUserQuery();
  const [updateUser] = useUpdateUserProfileMutation();

  const syncPushToken = useCallback(async () => {
    if (auth.status === "authenticated" && auth.token) {
      try {
        const user = await getUser({}).unwrap();
        const storedToken = await checkUserHasSyncTokenWithServer();
        if (storedToken !== user.pushToken) {
          const newToken = await registerForPushNotificationsAsync();
          if (newToken) {
            await updateUser({ pushToken: newToken }).unwrap();
            await storeUserPushTokenToDevice(newToken);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [auth.status, auth.token]);
  useEffect(() => {
    syncPushToken();
  }, [syncPushToken]);

  return <React.Fragment>{children}</React.Fragment>;
};
const registerForPushNotificationsAsync = async () => {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      })
    ).data;
    console.log(token);
  } else {
    alert("This device does not support push notifications");
  }

  return token;
};
export default NotificationsProvider;
