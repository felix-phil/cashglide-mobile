import { StyleSheet, View, ActivityIndicator } from "react-native";
import React from "react";
import { useAppTheme } from "../../hooks";

const LoadingPage = () => {
  const theme = useAppTheme();

  return (
    <View style={styles.wrapper}>
      <ActivityIndicator size={"large"} color={theme.colors.secondary} />
    </View>
  );
};

export default LoadingPage;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
});
