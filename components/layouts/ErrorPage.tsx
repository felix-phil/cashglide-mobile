import { StyleSheet, Text, View } from "react-native";
import React, { ComponentProps, FC, ReactNode } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppTheme } from "../../hooks";
import { Button } from "react-native-paper";

interface IProps {
  retry?: () => void;
  errorText?: ReactNode;
  icon?: ComponentProps<typeof MaterialCommunityIcons>["name"];
  retryText?: ReactNode;
}
const ErrorPage: FC<IProps> = ({
  retry,
  errorText = "An error occured",
  icon = "lan-disconnect",
  retryText = "Retry",
}) => {
  const theme = useAppTheme();
  return (
    <View style={styles.wrapper}>
      <MaterialCommunityIcons
        size={52}
        name={icon}
        color={theme.colors.defaults.grayFour}
      />
      <Text
        style={[styles.errorText, { color: theme.colors.defaults.blackOne }]}
      >
        {errorText}
      </Text>
      {retry && (
        <Button onPress={retry} mode="text" textColor={theme.colors.primary}>
          {retryText}
        </Button>
      )}
    </View>
  );
};

export default ErrorPage;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontFamily: "Primary-Medium",
    fontSize: 16,
    marginVertical: 20,
  },
});
