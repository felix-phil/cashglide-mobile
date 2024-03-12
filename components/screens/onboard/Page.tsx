import { Image, StyleSheet, View } from "react-native";
import React, { FC, ReactNode } from "react";
import CashGlide from "../../common/CashGlide";
import { useAppTheme } from "../../../hooks";
import { Text } from "react-native-paper";
import Dot from "./Dot";
import Button from "../../common/Button";

interface Props {
  image: ReactNode;
  beforeText: string;
  description: string;
  hideMainText?: boolean;
  numberOfPages: number;
  currentPage: number;
  onNextPressed?: () => void;
  onSkipPressed?: () => void;
}
const Page: FC<Props> = ({ hideMainText = false, ...props }) => {
  const theme = useAppTheme();
  return (
    <View key={1} style={[styles.wrapper]}>
      <Image
        style={styles.icon}
        source={require("../../../assets/images/icon.png")}
      />
      {props.image}
      <View style={styles.texts}>
        <CashGlide hideMainText={hideMainText} beforeText={props.beforeText} />
        <Text
          style={[styles.descriptionText, { color: theme.colors.tertiary }]}
        >
          {props.description}
        </Text>
      </View>
      <View style={styles.actionContainer}>
        <View style={styles.dotsContainer}>
          {Array(props.numberOfPages)
            .fill(undefined)
            .map((num, index) => (
              <Dot key={index} active={index === props.currentPage} />
            ))}
        </View>
        <View style={styles.buttons}>
          {props.currentPage+1 !== props.numberOfPages && (
            <View style={styles.button}>
              <Button onPress={props.onNextPressed}>Next</Button>
            </View>
          )}
          <View style={styles.button}>
            <Button mode="outlined" onPress={props.onSkipPressed}>
              {props.currentPage+1 === props.numberOfPages ? "Continue":"Skip"}
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 32,
    height: 32,
  },
  texts: {
    marginTop: "10%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: "7%",
  },
  descriptionText: {
    marginTop: "5%",
    fontSize: 15,
    fontWeight: "400",
    textAlign: "center",
    fontFamily: "Primary-Regular",
  },
  actionContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  dotsContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: "10%",
  },

  buttons: {
    marginTop: "10%",
  },
  button: {
    marginTop: "4%",
  },
});
