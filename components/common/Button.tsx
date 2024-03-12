import React, { FC, ReactNode } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import { useAppTheme } from "../../hooks";
import { hexToRGB } from "../../services/helpers";
import { ActivityIndicator } from "react-native-paper";

interface ButtonProps extends TouchableOpacityProps {
  children: ReactNode;
  backgroundColor?: string;
  color?: string;
  loading?: boolean;
  mode?: "contained" | "outlined";
  labelStyle?: StyleProp<TextStyle>;
}
const Button: FC<ButtonProps> = ({
  children,
  backgroundColor,
  color,
  mode = "contained",
  labelStyle,
  loading = false,
  ...otherProps
}) => {
  const theme = useAppTheme();
  if (!backgroundColor) {
    backgroundColor = theme.colors.primary;
  }
  if (!color) {
    color = theme.colors.defaults.whiteOne;
  }
  return (
    <TouchableOpacity {...otherProps} activeOpacity={0.5}>
      <View
        style={[
          styles.buttonContainer,
          !otherProps.disabled && {
            elevation: 10,
            shadowColor: "#000",
            shadowRadius: 3,
            shadowOpacity: 0.3,
            shadowOffset: { height: 4, width: -2 },
            paddingHorizontal: "5%",
            paddingVertical: "5%",
          },
          {
            opacity: otherProps.disabled ? 0.7 : 1,
            backgroundColor:
              mode === "outlined" ? "transparent" : backgroundColor,
            borderColor: backgroundColor,
          },
          otherProps.style,
        ]}
      >
        {loading && (
          <ActivityIndicator
            size={20}
            style={styles.activityIndicator}
            color={color}
          />
        )}
        <Text
          style={[
            styles.buttonText,
            { color: mode === "outlined" ? backgroundColor : color },
            labelStyle,
          ]}
        >
          {children}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  activityIndicator: {
    marginHorizontal: "5%",
  },
  buttonContainer: {
    height: 42,
    width: 240,
    maxWidth: "100%",
    display: "flex",
    flexDirection: "row",
    // flexWrap: "wrap",
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 1,
  },
  buttonText: {
    marginTop: "auto",
    marginBottom: "auto",
    fontFamily: "Primary-SemiBold",
    fontWeight: "500",
    fontSize: 15,
    textAlign: "center",
  },
});
