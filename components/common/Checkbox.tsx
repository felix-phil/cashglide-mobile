import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import React, { FC, ReactNode } from "react";
import {
  CheckboxAndroidProps,
  Checkbox as RNCheckBoxPaper,
} from "react-native-paper";
import { useAppTheme } from "../../hooks";

interface IProps extends Omit<CheckboxAndroidProps, "theme"> {
  label?: ReactNode;
  textColor?: string;
  wrapperStyle?: StyleProp<ViewStyle>;
  error?: boolean;
  labelStyle?: StyleProp<TextStyle>;
}
const Checkbox: FC<IProps> = ({
  label,
  wrapperStyle,
  color,
  textColor,
  error = false,
  labelStyle,
  ...rest
}) => {
  const theme = useAppTheme();
  if (error) {
    color = theme.colors.error;
    textColor = theme.colors.error;
  }
  if (!color) {
    color = theme.colors.primary;
  }
  if (!textColor) {
    textColor = theme.colors.defaults.blackOne;
  }
  return (
    <TouchableWithoutFeedback onPress={rest.onPress}>
      <View style={[styles.wrapper, wrapperStyle]}>
        <RNCheckBoxPaper.Android
          onPress={rest.onPress}
          color={color}
          {...rest}
        />
        {label && (
          <Text
            adjustsFontSizeToFit
            style={[styles.label, { color: textColor }, labelStyle]}
          >
            {label}
          </Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Checkbox;

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontFamily: "Primary-Medium",
    fontWeight: "400",
    fontStyle: "normal",
    fontSize: 10,
    width: "100%",
    flex: 1,
    includeFontPadding: false,
  },
});
