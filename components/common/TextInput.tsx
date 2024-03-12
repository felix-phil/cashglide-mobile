import {
  StyleSheet,
  Text,
  View,
  TextInputProps as RNTextInputProps,
  TextInput as RNTextInput,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import React, { FC, ReactNode, useState } from "react";
import { useAppTheme } from "../../hooks";

interface TextInputProps extends RNTextInputProps {
  error?: boolean;
  helperText?: string;
  label?: ReactNode;
  selectionColor?: string;
  color?: string;
  textColor?: string;
  placeholderTextColor?: string;
  left?: ReactNode;
  right?: ReactNode;
  wrapperStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}
const TextInput: FC<TextInputProps> = ({
  error,
  helperText,
  label,
  selectionColor,
  color,
  textColor,
  placeholderTextColor,
  left,
  right,
  style,
  wrapperStyle,
  labelStyle,
  onFocus,
  onBlur,
  ...otherProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const theme = useAppTheme();
  if (error) {
    color = theme.colors.error;
    textColor = theme.colors.error;
    placeholderTextColor = theme.colors.error;
  }
  if (!color) {
    color = theme.colors.defaults.grayTwo;
  }

  if (!textColor) {
    textColor = theme.colors.defaults.blackOne;
  }
  if (!placeholderTextColor) {
    placeholderTextColor = theme.colors.defaults.grayFour;
  }
  return (
    <View style={styles.allWrapper}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: theme.colors.primary,
            },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}
      <View
        style={[
          styles.wrapper,
          {
            borderColor: isFocused ? theme.colors.secondary : color,
            backgroundColor: isFocused
              ? theme.colors.defaults.whiteOne
              : theme.colors.defaults.whiteTwo,
          },
          wrapperStyle,
        ]}
      >
        {left && <View style={styles.left}>{left}</View>}
        <RNTextInput
          onFocus={(e) => {
            if (onFocus) onFocus(e);
            setIsFocused(true);
          }}
          onBlur={(e) => {
            if (onBlur) onBlur(e);
            setIsFocused(false);
          }}
          selectionColor={selectionColor || theme.colors.secondary}
          style={[styles.input, { color: textColor }, style]}
          placeholderTextColor={placeholderTextColor}
          {...otherProps}
        />
        {right && <View style={styles.right}>{right}</View>}
      </View>
      {helperText && (
        <Text
          style={[
            styles.helperText,
            {
              color: error
                ? theme.colors.error
                : theme.colors.defaults.blackOne,
            },
          ]}
        >
          {helperText}
        </Text>
      )}
    </View>
  );
};

export default TextInput;

const styles = StyleSheet.create({
  allWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
    width: "100%",
  },
  wrapper: {
    height: 35,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  input: {
    width: "100%",
    height: "100%",
    fontFamily: "Roboto-Light",
    fontWeight: "300",
    fontSize: 12,
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontFamily: "Primary-Medium",
    fontWeight: "600",
    alignSelf: "flex-start",
  },
  helperText: {
    fontSize: 10,
    fontFamily: "Primary-Regular",
    fontWeight: "400",
    alignSelf: "flex-start",
    marginLeft: 4,
  },
  left: {
    maxWidth: "20%",
    marginRight: 5,
  },
  right: {
    maxWidth: "20%",
    marginLeft: 5,
  },
});
