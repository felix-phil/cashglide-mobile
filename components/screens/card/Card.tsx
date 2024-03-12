import { StyleSheet, View } from "react-native";
import React, { FC } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useAppTheme } from "../../../hooks";
import colors from "../../../constants/colors";
import MasterCardSvg from "../../../assets/svgs/mastercard.svg";
import { Text } from "react-native-paper";
import ChipSvg from "../../../assets/svgs/chip.svg";
import ChipAltSvg from "../../../assets/svgs/chip-alt.svg";
import VisaSvg from "../../../assets/svgs/visa.svg";
import { cardValidator, formatATMCardNumber } from "../../../services/helpers";
import { TouchableOpacity } from "@gorhom/bottom-sheet";

interface IProps {
  onPress?: () => void;
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
}
const Card: FC<IProps> = (props) => {
  const theme = useAppTheme();
  const colorStyle = { color: theme.colors.defaults.whiteOne };
  const cardType = cardValidator.getCardType(props.cardNumber || "")
  return cardType === "cc-mastercard" ? (
    <TouchableOpacity onPress={props.onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={colors.gradients.mastercard}
        start={[0.9, 0.1]}
        end={[0.1, 0.9]}
        locations={[0.1, 0.9]}
        style={styles.wrapper}
      >
        <View style={styles.top}>
          <MasterCardSvg />
          <Text style={[styles.title, colorStyle]}>Debit</Text>
        </View>
        <View style={styles.section}>
          <ChipSvg />
        </View>
        <View style={styles.section}>
          <Text style={[styles.cardNumber, colorStyle]}>
            {formatATMCardNumber(props.cardNumber || " ")}
          </Text>
        </View>
        <View style={[styles.section, styles.details]}>
          <View style={styles.expirySection}>
            <View style={styles.validThru}>
              <Text style={[styles.valid, colorStyle]}>VALID</Text>
              <Text style={[styles.valid, colorStyle]}>THRU</Text>
            </View>
            <Text style={[styles.expiryDate, colorStyle]}>
              {props.cardExpiry}
            </Text>
          </View>
          <Text numberOfLines={1} style={[styles.cardName, colorStyle]}>
            {props.cardName}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity onPress={props.onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={colors.gradients.visa}
        start={[0.1, 0.9]}
        end={[0.9, 0.1]}
        locations={[0.9, 0.1]}
        style={styles.wrapper}
      >
        <View style={styles.top}>
          <View style={styles.cardNoV}>
            <Text style={[styles.cardNoText, colorStyle]}>CARD NUMBER</Text>
            <Text style={[styles.cardNumber, colorStyle]}>
              {cardValidator.maskCardNumber(formatATMCardNumber(props.cardNumber || " "))}
            </Text>
          </View>
          <Text style={[styles.title, colorStyle]}>Debit</Text>
        </View>
        <View style={styles.section}>
          <ChipAltSvg />
        </View>
        <View style={styles.section}>
        <View style={styles.cardNoV}>
            <Text style={[styles.cardNoText, colorStyle]}>EXPIRATION DATE</Text>
            <Text style={[styles.cardExpiryV, colorStyle]}>
              {props.cardExpiry}
            </Text>
          </View>
        </View>
        <View style={[styles.section, styles.details]}>
          <Text numberOfLines={1} style={[styles.cardNameV, colorStyle]}>
            {props.cardName}
          </Text>
        <VisaSvg />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default Card;

const styles = StyleSheet.create({
  wrapper: {
    width: 315,
    maxWidth: "100%",
    // height: 196,
    borderRadius: 10,
    overflow: "hidden",
    paddingHorizontal: "5%",
    paddingVertical: "5%",
  },
  top: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "Primary-Bold",
    fontSize: 20,
  },
  section: {
    marginTop: "7%",
  },
  cardNumber: {
    fontSize: 18,
    fontFamily: "Primary-Medium",
  },
  details: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  expirySection: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    flex: 1,
  },
  validThru: {
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },
  valid: {
    fontSize: 5,
    fontFamily: "Primary-Medium",
  },
  expiryDate: {
    fontSize: 10,
    fontFamily: "Primary-Medium",
  },
  cardName: {
    flex: 3,
    fontSize: 12,
    fontFamily: "Primary-Medium",
    textAlign: "right",
    textTransform: "uppercase",
  },
  cardNoV: {
    flexDirection: "column",
    gap: 2
  },
  cardNoText: {
    fontFamily: "Roboto-Bold",
    fontSize: 10,
  },
  cardExpiryV: {
    fontSize: 18,
    fontFamily: "Primary-Medium",
  },
  cardNameV: {
    flex: 3,
    fontSize: 12,
    fontFamily: "Primary-Medium",
    textAlign: "left",
    textTransform: "uppercase",
  },
});
