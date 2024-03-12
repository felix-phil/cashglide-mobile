import { StyleSheet, Text, View } from "react-native";
import React, { FC } from "react";
import { useAppTheme } from "../../hooks";
import { Svg, Path } from "react-native-svg";
interface IProps {
  text: string;
}
const DividerWithText: FC<IProps> = (props) => {
  const theme = useAppTheme();
  return (
    <View style={styles.wrapper}>
      <View style={styles.svgWrapper}>
        <Svg
          style={styles.svg}
          height="5"
          viewBox="0 0 92 5"
          fill="none"
        >
          <Path
            d="M 0 2.5 L 91.5 0.334936V4.66506L0 2.5Z"
            fill={theme.colors.secondary}
          />
        </Svg>
      </View>
      <Text style={styles.text}>{props.text}</Text>
      <View style={styles.svgWrapper}>
        <Svg
          style={styles.svg}
          height="5"
          viewBox="0 0 92 5"
          fill="none"
        >
          <Path
            d="M 92 2.5 L 0.5 0.334936 V 4.66506 L 92 2.5 Z"
            fill={theme.colors.secondary}
          />
        </Svg>
      </View>
    </View>
  );
};

export default DividerWithText;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  svgWrapper: {
    flex: 1,
  },
  svg: {
    width: "100%",
  },
  text: {
    color: "#888585",
    fontFamily: "Primary-Medium",
    fontWeight: "500",
    fontSize: 12,
  },
});
