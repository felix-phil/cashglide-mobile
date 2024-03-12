import { StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomHeader from "../../../components/layouts/CustomHeader";
import { useAppTheme } from "../../../hooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamasType } from "../../../routes/app-stack";
import { WebView, WebViewNavigation } from "react-native-webview";

type IProps = NativeStackScreenProps<AppStackParamasType, "CompleteCardWeb">;
const CompleteCardWeb = ({ navigation, route }: IProps) => {
  const url = route.params.url;
  const theme = useAppTheme();

  const handleNavigationChange = (event: WebViewNavigation) => {
    try {
      const url = new URL(event.url);
      if (url.hostname.includes("cashglide")) {
        const params = Object.fromEntries(Array(...url.searchParams.entries()));
        const response = JSON.parse(params?.response);
        if (
          response?.status?.startsWith("success") ||
          response?.status?.startsWith("pending")
        ) {
          navigation.replace("TransactionCompleted", {});
        } else {
          navigation.replace("TransactionFailed", {});
        }
      }
    } catch (error) {}
  };
  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: theme.colors.backgrounds.secondary },
      ]}
    >
      <CustomHeader title="Add Card" onPressBack={navigation.goBack} />
      <WebView
        onNavigationStateChange={handleNavigationChange}
        style={styles.webview}
        source={{ uri: url }}
      />
    </View>
  );
};

export default CompleteCardWeb;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  webview: {
    flex: 1,
    paddingHorizontal: "1%",
  },
});
