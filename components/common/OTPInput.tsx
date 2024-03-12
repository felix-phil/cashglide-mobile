import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  View,
} from "react-native";
import React, { FC, ReactNode, useEffect, useRef, useState } from "react";
import { useAppTheme } from "../../hooks";

interface BoxProps extends TouchableWithoutFeedbackProps {
  text?: string;
  active?: boolean;
}
const Boxes: FC<BoxProps> = ({ text, active, ...otherProps }) => {
  const theme = useAppTheme();
  return (
    <TouchableWithoutFeedback {...otherProps}>
      <View
        style={[
          styles.boxContainer,
          {
            backgroundColor: theme.colors.defaults.whiteOne,
          },
          active && {
            borderWidth: 1,
            borderColor: theme.colors.secondary,
          },
        ]}
      >
        {text ? (
          <Text
            adjustsFontSizeToFit
            style={[styles.boxText, { color: theme.colors.defaults.blackOne }]}
          >
            {text}
          </Text>
        ) : (
          <Text
            style={[
              styles.placeholder,
              { color: theme.colors.defaults.grayFour },
            ]}
          >
            *
          </Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

interface IProps extends TextInputProps {
  onTextChange?: (value: string) => void;
  maximumCodeLength?: number;
  onOTPReady?: (code: string) => void;
  secureTextEntry?: boolean;
}
const OTPInput: FC<IProps> = ({
  maximumCodeLength = 4,
  onOTPReady = () => {},
  onTextChange = () => {},
  secureTextEntry = false,
  ...props
}) => {
  const [value, setValue] = useState("");
  const inputRef = useRef<TextInput>(null);
  const boxes = new Array(maximumCodeLength).fill(0);

  useEffect(() => {
    if (onTextChange) onTextChange(value);
    if (value.length === maximumCodeLength) {
      inputRef.current?.blur();
      if (onOTPReady) onOTPReady(value);
    }
  }, [value]);
  useEffect(() => {
    if (props.autoFocus) {
      inputRef.current?.focus();
    }
  }, [props.autoFocus]);

  return (
    <View>
      <View style={styles.boxesContainer}>
        {boxes.map((_, index) => {
          const empty = "";
          const digit = value[index] || empty;
          const isCurrentValue = index === value.length;
          const isLastValue = index === maximumCodeLength - 1;
          const isComplete = value.length === maximumCodeLength;
          const isFocused = isCurrentValue || (isLastValue && isComplete);
          return (
            <Boxes
              onPress={() => inputRef.current?.focus()}
              active={inputRef.current?.isFocused && isFocused}
              key={index}
              text={digit ? (secureTextEntry ? "*" : digit) : ""}
            />
          );
        })}
      </View>
      <TextInput
        ref={inputRef}
        keyboardType="number-pad"
        maxLength={maximumCodeLength}
        style={{ position: "absolute", opacity: 0 }}
        value={value}
        // onBlur={() => {}}
        onChangeText={(text) => setValue(text)}
      />
    </View>
  );
};

export default OTPInput;

const styles = StyleSheet.create({
  boxesContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    // justifyContent: "space-evenly",
    alignItems: "center",
    alignSelf: "center",
    gap: 20,
  },
  boxContainer: {
    // padding: 10,
    width: 48,
    height: 38,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  boxText: {
    fontFamily: "Roboto-Bold",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    fontStyle: "normal",
  },
  placeholder: {
    fontFamily: "Primary-Medium",
    fontSize: 20,
    textAlign: "center",
  },
});
