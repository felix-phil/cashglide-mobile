import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";
import React, { FC, ReactNode } from "react";
import { useAppTheme } from "../../hooks";
import { Text } from "react-native-paper";

interface IProps extends TouchableOpacityProps {
  checkedTextColor?: string;
  unCheckedTextColor?: string;
  checkedColor?: string;
  unCheckedColor?: string;
  children?: ReactNode;
  checked?: boolean;
  wrapperStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}
const ToggleButton: FC<IProps> = ({
  checked,
  checkedColor,
  checkedTextColor,
  unCheckedTextColor,
  unCheckedColor,
  wrapperStyle,
  textStyle,
  children,
  ...props
}) => {
  const theme = useAppTheme();
  if (!checkedTextColor) {
    checkedTextColor = theme.colors.defaults.whiteOne;
  }
  if (!unCheckedTextColor) {
    unCheckedTextColor = theme.colors.defaults.grayFive;
  }
  if (!checkedColor) {
    checkedColor = theme.colors.secondary;
  }
  if (!unCheckedColor) {
    unCheckedColor = "transparent";
  }
  return (
    <TouchableOpacity {...props}>
      <View
        style={[
          styles.wrapper,
          { backgroundColor: checked ? checkedColor : unCheckedColor },
          !checked && {
            borderWidth: 1,
            borderColor: theme.colors.defaults.grayFive,
          },
          wrapperStyle,
        ]}
      >
        <Text
          style={[
            styles.text,
            { color: checked ? checkedTextColor : unCheckedTextColor },
            textStyle,
          ]}
        >
          {children}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ToggleButton;

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: "10%",
    paddingHorizontal: "7%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  text: {
    fontFamily: "Primary-Bold",
    fontSize: 15,
  },
});
