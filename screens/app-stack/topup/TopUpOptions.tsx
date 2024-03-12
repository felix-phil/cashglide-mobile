import {  StyleSheet, View } from "react-native";
import React from "react";
import { useAppTheme } from "../../../hooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamasType } from "../../../routes/app-stack";
import CustomHeader from "../../../components/layouts/CustomHeader";
import { List, Text } from "react-native-paper";

import BankSvg from "../../../assets/svgs/bank.svg";
import LogoSvg from "../../../assets/svgs/logo.svg";
import CardSvg from "../../../assets/svgs/card.svg";

type IProps = NativeStackScreenProps<AppStackParamasType, "TopUp">;
const TopUp = ({ navigation }: IProps) => {
  const theme = useAppTheme();
  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: theme.colors.backgrounds.secondary },
      ]}
    >
      <CustomHeader onPressBack={navigation.goBack} title="Top Up" />
      <View style={[styles.curve, { backgroundColor: theme.colors.primary }]}>
        <View
          style={[
            styles.topCont,
            { backgroundColor: theme.colors.backgrounds.primary },
          ]}
        >
          <Text
            style={[
              styles.subTitle,
              { color: theme.colors.defaults.grayFive, marginBottom: "1%" },
            ]}
          >
            Select how you want to fund your wallet.
          </Text>
          <List.Item
            style={[
              styles.listItem,
              { backgroundColor: theme.colors.backgrounds.secondary },
            ]}
            // rippleColor={theme.colors.backgrounds.secondary}
            onPress={() => navigation.navigate("QRCode")}
            title="Cashglide User"
            titleStyle={[styles.listItemTitle]}
            description="Send funds easily with just a Cashglide username"
            descriptionEllipsizeMode="tail"
            descriptionNumberOfLines={2}
            descriptionStyle={styles.listItemDescription}
            left={(prop) => (
              <View style={styles.leftSvg}>
                <LogoSvg />
              </View>
            )}
            right={(prop) => (
              <List.Icon
                {...prop}
                style={{}}
                icon={"chevron-right"}
                color={theme.colors.primary}
              />
            )}
          />
          <List.Item
            style={[
              styles.listItem,
              { backgroundColor: theme.colors.backgrounds.secondary },
            ]}
            // rippleColor={theme.colors.backgrounds.secondary}
            onPress={() => navigation.navigate("TopUpBank")}
            title="Bank Account"
            titleStyle={[styles.listItemTitle]}
            description="Deposit money straight into recipient’s account"
            descriptionEllipsizeMode="tail"
            descriptionNumberOfLines={2}
            descriptionStyle={styles.listItemDescription}
            left={(prop) => (
              <View style={styles.leftSvg}>
                <BankSvg />
              </View>
            )}
            right={(prop) => (
              <List.Icon
                {...prop}
                style={{}}
                icon={"chevron-right"}
                color={theme.colors.primary}
              />
            )}
          />
          <List.Item
            style={[
              styles.listItem,
              { backgroundColor: theme.colors.backgrounds.secondary },
            ]}
            // rippleColor={theme.colors.backgrounds.secondary}
            onPress={() => navigation.navigate("TopUpCard")}
            title="Card"
            titleStyle={[styles.listItemTitle]}
            description="Add money using your bank card"
            descriptionEllipsizeMode="tail"
            descriptionNumberOfLines={2}
            descriptionStyle={styles.listItemDescription}
            left={(prop) => (
              <View style={styles.leftSvg}>
                <CardSvg />
              </View>
            )}
            right={(prop) => (
              <List.Icon
                {...prop}
                style={{}}
                icon={"chevron-right"}
                color={theme.colors.primary}
              />
            )}
          />
        </View>
      </View>
    </View>
  );
};

export default TopUp;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    // paddingHorizontal: "5%",
  },
  contents: {
    marginTop: "30%",
    paddingHorizontal: "5%",
  },
  curve: {
    height: 80,
    width: "100%",
    position: "relative",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowRadius: 3,
    shadowOpacity: 0.3,
    shadowOffset: { height: 4, width: -2 },
    elevation: 5,
  },
  topCont: {
    width: "90%",
    zIndex: 2,
    position: "absolute",
    borderRadius: 30,
    display: "flex",
    flexDirection: "column",
    paddingVertical: "10%",
    paddingHorizontal: "4%",
    // gap: 10,
  },

  topBox: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    borderWidth: 1,
    paddingHorizontal: "2%",
    paddingVertical: "3%",
    borderRadius: 10,
  },
  title: {
    fontFamily: "Primary-Medium",
    fontSize: 22,
  },
  subTitle: {
    fontFamily: "Primary-Medium",
    fontSize: 13,
  },
  listItemTitle: {
    fontFamily: "Primary-Medium",
    fontSize: 17,
  },
  listItemDescription: {
    fontFamily: "Primary-Medium",
    fontSize: 11,
    marginTop: "2%",
  },
  listItem: {
    marginBottom: "5%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    alignContent: "center",
    overflow: "hidden",
  },
  listItemImage: {
    // width: 27,
    // height: 27,
    resizeMode: "center",
  },
  leftSvg: {
    // flex: 1,
    marginLeft: "5%",
    height: 30,
    width: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
});
