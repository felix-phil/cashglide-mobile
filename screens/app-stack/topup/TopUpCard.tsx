import { ScrollView, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { useAppTheme } from "../../../hooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamasType } from "../../../routes/app-stack";
import CustomHeader from "../../../components/layouts/CustomHeader";
import TextInput from "../../../components/common/TextInput";
import WalletBalanceSVG from "../../../assets/svgs/walletbalance.svg";
import { Text } from "react-native-paper";
import { useGetWalletQuery } from "../../../store/services/wallet";
import ToggleButton from "../../../components/common/ToggleButton";
import Button from "../../../components/common/Button";
import {
  formatLocaleStringToNumber,
  formatToNumberLocalString,
} from "../../../services/helpers";

type IProps = NativeStackScreenProps<AppStackParamasType, "TopUpCard">;
const TopUpCard = ({ navigation }: IProps) => {
  const theme = useAppTheme();
  const { data: wallet } = useGetWalletQuery({});
  const [amount, setAmount] = useState(formatToNumberLocalString("1000"));

  const MIN = 100;
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
            styles.balanceCont,
            { backgroundColor: theme.colors.backgrounds.primary },
          ]}
        >
          <Text style={styles.balanceText}>Balance</Text>
          <View
            style={[
              styles.balanceBox,
              { borderColor: theme.colors.defaults.grayFive },
            ]}
          >
            <View style={styles.balanceBoxLeft}>
              <WalletBalanceSVG />
            </View>
            <View style={styles.balanceBoxRight}>
              <Text style={[styles.balance, styles.currency]}>N</Text>
              <Text style={[styles.balance]}>
                {wallet?.wallet?.balance?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <ScrollView style={styles.contents}>
        <View style={styles.amount}>
          <Text style={styles.balanceText}>Amount</Text>
          <View style={styles.toggleButtons}>
            <ToggleButton
              onPress={() => setAmount(formatToNumberLocalString("1000"))}
              checked={formatLocaleStringToNumber(amount) === 1000}
            >
              {(1000).toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
              })}
            </ToggleButton>
            <ToggleButton
              onPress={() => setAmount(formatToNumberLocalString("2000"))}
              checked={formatLocaleStringToNumber(amount) === 2000}
            >
              {(2000).toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
              })}
            </ToggleButton>
            <ToggleButton
              onPress={() => setAmount(formatToNumberLocalString("5000"))}
              checked={formatLocaleStringToNumber(amount) === 5000}
            >
              {(5000).toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
              })}
            </ToggleButton>
          </View>
          <TextInput
            label={"or type the amount here"}
            color={theme.colors.defaults.grayFive}
            labelStyle={{
              color: theme.colors.defaults.grayFive,
              marginBottom: 3,
            }}
            value={String(amount)}
            onChangeText={(text) => setAmount(formatToNumberLocalString(text))}
            placeholder={`Min ${MIN.toLocaleString("en-NG", {
              style: "currency",
              currency: "NGN",
            })}`}
            wrapperStyle={{
              height: 50,
              borderRadius: 10,
              paddingHorizontal: "5%",
            }}
            keyboardType="decimal-pad"
            style={{
              fontSize: 14,
              fontFamily: "Roboto-Bold",
              letterSpacing: 0.5,
            }}
          />
        </View>
        <View style={styles.submitBtn}>
          <Button
            onPress={() =>
              navigation.navigate("SelectCard", {
                amount: formatLocaleStringToNumber(amount),
              })
            }
            disabled={!amount || formatLocaleStringToNumber(amount) < 100}
          >
            Top Up
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default TopUpCard;

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
    columnGap: 50,
  },
  balanceCont: {
    // height: 150,
    width: "90%",
    zIndex: 2,
    position: "absolute",
    borderRadius: 30,
    display: "flex",
    flexDirection: "column",
    paddingVertical: "10%",
    paddingHorizontal: "8%",
    gap: 10,
  },
  balanceText: {
    fontFamily: "Primary-Medium",
    fontSize: 20,
  },
  section: {
    marginTop: "5%",
  },
  balanceBox: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    borderWidth: 1,
    paddingHorizontal: "2%",
    paddingVertical: "3%",
    borderRadius: 10,
  },
  balanceBoxLeft: {
    marginRight: "auto",
  },
  balanceBoxRight: {
    marginRight: "auto",
    flexDirection: "row",
    gap: 2,
  },
  balance: {
    fontFamily: "Primary-Bold",
    fontSize: 20,
  },
  currency: {
    textDecorationLine: "line-through",
    textDecorationStyle: "double",
  },
  amount: {
    flexDirection: "column",
    gap: 10,
  },
  toggleButtons: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },
  submitBtn: {
    marginTop: "20%",
    alignSelf: "center",
  },
});
