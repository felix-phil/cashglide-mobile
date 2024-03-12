import { StyleSheet, Text, View } from "react-native";
import React, { FC, ReactNode } from "react";
import { Appbar } from "react-native-paper";
import { useAppTheme } from "../../hooks";

interface IProps {
  onPressBack?: () => void;
  title?: string;
  right?: ReactNode;
  iconColor?: string;
  backgroundColor?: string;
  titleColor?: string;
}
const CustomHeader: FC<IProps> = ({
  title = "",
  backgroundColor,
  iconColor,
  titleColor,
  ...props
}) => {
  const theme = useAppTheme();
  if (!backgroundColor) {
    backgroundColor = theme.colors.primary;
  }
  if(!iconColor){
    iconColor = theme.colors.defaults.whiteOne
  }
  if(!titleColor){
    titleColor = theme.colors.defaults.whiteOne
  }
  return (
    <Appbar.Header style={{ backgroundColor: backgroundColor }}>
      <Appbar.BackAction
        color={iconColor}
        onPress={props.onPressBack}
        size={28}
      />
      <Appbar.Content
        color={titleColor}
        title={title}
        titleStyle={styles.title}
      />
      {props.right}
    </Appbar.Header>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  title: {
    fontFamily: "Primary-SemiBold",
    fontSize: 20,
  },
});
