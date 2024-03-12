import {
  StyleSheet,
  Text,
  TextInputProps as RNTextInputProps,
  View,
  TextInput as RNTextInput,
} from "react-native";
import React, { FC, ReactNode, useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useAppTheme } from "../../hooks";
import { IconButton } from "react-native-paper";

interface AuthTextInputProps extends RNTextInputProps {
  right?: ReactNode;
  left?: ReactNode;
  error?: boolean;
  helperText?: ReactNode;
}
const AuthTextInput: FC<AuthTextInputProps> = ({
  right,
  left,
  error = false,
  helperText,
  ...otherPros
}) => {
  const [focused, setFocused] = useState(false);
  const theme = useAppTheme();
  const ref = useRef<RNTextInput>(null);
  return (
    <>
      <LinearGradient
        colors={[
          theme.colors.defaults.whiteOne,
          focused
            ? theme.colors.defaults.whiteOne
            : theme.colors.defaults.whiteTwo,
        ]}
        style={[
          styles.wrapper,
          {
            borderWidth: focused || error ? 1 : 0,
            borderColor: error ? theme.colors.error : theme.colors.secondary,
          },
        ]}
      >
        {left && <View style={styles.left}>{left}</View>}
        <View style={styles.inputWrapper}>
          <RNTextInput
            selectionColor={theme.colors.secondary}
            ref={ref}
            style={[
              styles.input,
              {
                color: error
                  ? theme.colors.error
                  : theme.colors.defaults.blackOne,
              },
            ]}
            onFocus={(e) => {
              if (otherPros.onFocus) {
                otherPros.onFocus(e);
              }
              setFocused(true);
            }}
            onBlur={(e) => {
              if (otherPros.onBlur) {
                otherPros.onBlur(e);
              }
              setFocused(false);
            }}
            {...otherPros}
          />
        </View>
        <View style={styles.right}>
          {right
            ? right
            : focused && (
                <IconButton
                  onPress={() => ref.current?.clear()}
                  size={14}
                  iconColor={theme.colors.defaults.grayThree}
                  icon={"close"}
                />
              )}
        </View>
      </LinearGradient>
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
    </>
  );
};

export default AuthTextInput;

const styles = StyleSheet.create({
  wrapper: {
    height: 55,
    width: "100%",
    borderRadius: 16,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 3,
    paddingHorizontal: "3%",
    paddingVertical: 5,
    overflow: "hidden",
  },
  inputWrapper: {
    width: "64%",
  },
  input: {
    height: "100%",
    width: "100%",
    fontWeight: "400",
    fontFamily: "Roboto-Regular",
    fontSize: 14,
  },
  right: {
    width: "9%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  left: {
    width: "24%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5
  },
  helperText: {
    fontSize: 10,
    fontFamily: "Primary-Regular",
    fontWeight: "400",
    alignSelf: "flex-start",
    marginLeft: 4
  },
});
