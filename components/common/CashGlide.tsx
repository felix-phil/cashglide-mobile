import { StyleSheet } from "react-native";
import React, { FC } from "react";
import { Text } from "react-native-paper";
import { useAppTheme } from "../../hooks";

interface CashGlideTextProps {
  beforeText?: string;
  afterText?: string;
  hideMainText?: boolean;
}
const CashGlide: FC<CashGlideTextProps> = ({
  hideMainText = false,
  ...props
}) => {
  const textStyle = { ...styles.text };
  const theme = useAppTheme();
  return (
    <Text style={[styles.container]}>
      <Text style={[textStyle]}>{props.beforeText}</Text>
      {!hideMainText && (
        <React.Fragment>
          <Text style={[textStyle, { color: theme.colors.primary }]}>Cash</Text>
          <Text style={[textStyle, { color: theme.colors.secondary }]}>
            Glide
          </Text>
        </React.Fragment>
      )}
      <Text style={[textStyle]}>{props.afterText}</Text>
    </Text>
  );
};

export default CashGlide;

const styles = StyleSheet.create({
  container: {
    fontSize: 23,
    width: "100%",
  },
  text: {
    color: "#000",
    fontFamily: "Primary-Bold",
    fontWeight: "700",
  },
});
