import React, { FC, ReactNode, useState } from "react";
import {
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAppTheme } from "../../../hooks";
import { IconButton, Text } from "react-native-paper";
import QrCodeSvg from "../../../assets/svgs/qrcpde.svg";
import TopUpSvg from "../../../assets/svgs/topup.svg";
import SendSvg from "../../../assets/svgs/send.svg";
import RecvSvg from "../../../assets/svgs/recieve.svg";
import { hexToRGB } from "../../../services/helpers";
import { useGetWalletQuery } from "../../../store/services/wallet";
import { Wallet as WalletType } from "../../../api/types";
import { useNavigation } from "@react-navigation/native";
import BottomSheet from "@gorhom/bottom-sheet";

const Action: FC<{
  onPress: () => void;
  title: string;
  icon: ReactNode;
}> = ({ onPress, title, icon }) => {
  const theme = useAppTheme();
  return (
    <View style={[styles.action]}>
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        <View
          style={[
            styles.actionBtn,
            {
              backgroundColor: hexToRGB(
                theme.colors.defaults.primaryLight,
                0.3
              ),
            },
          ]}
        >
          {icon}
        </View>
      </TouchableOpacity>

      <Text
        style={[styles.actionText, { color: theme.colors.defaults.whiteOne }]}
      >
        {title}
      </Text>
    </View>
  );
};

const Wallet: FC<{
  wallet?: WalletType;
  isLoading?: boolean;
  handleOpenReceive: () => void;
}> = (props) => {
  const theme = useAppTheme();
  const [showBalance, setshowBalance] = useState(true);
  const navigation = useNavigation();
  return (
    <React.Fragment>
      <LinearGradient
        style={[styles.wrapper, { backgroundColor: "transparent" }]}
        colors={[theme.colors.primary, theme.colors.defaults.primaryLighter2]}
        locations={[0.58, 1]}
      >
        <View style={styles.wallet}>
          <View style={styles.walletBalanceTitle}>
            <Text
              style={[styles.title, { color: theme.colors.defaults.whiteOne }]}
            >
              Account Balance
            </Text>
            <IconButton
              size={20}
              disabled={props.isLoading}
              onPress={() => setshowBalance((prev) => !prev)}
              iconColor={theme.colors.defaults.whiteOne}
              icon={showBalance ? "eye-outline" : "eye-off-outline"}
            />
          </View>
          {props.isLoading ? (
            <ActivityIndicator
              style={{ alignSelf: "flex-start" }}
              color={theme.colors.defaults.whiteOne}
            />
          ) : (
            <View style={styles.walletBalanceTitle}>
              <Text
                style={[
                  styles.currency,
                  { color: theme.colors.defaults.whiteOne },
                ]}
              >
                N
              </Text>

              <Text
                style={[
                  styles.amount,
                  { color: theme.colors.defaults.whiteOne },
                ]}
              >
                {showBalance
                  ? props.wallet?.balance?.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : "***"}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.actions}>
          <Action
            icon={<QrCodeSvg />}
            onPress={() => navigation.getParent()?.navigate("Scan")}
            title="Scan"
          />
          <Action
            icon={<TopUpSvg />}
            onPress={() => navigation.getParent()?.navigate("TopUp")}
            title="Top Up"
          />
          <Action
            icon={<SendSvg />}
            onPress={() => navigation.getParent()?.navigate("Send")}
            title="Send"
          />
          <Action icon={<RecvSvg />} onPress={props.handleOpenReceive} title="Receive" />
        </View>
      </LinearGradient>
    </React.Fragment>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    borderRadius: 20,
    paddingHorizontal: "5%",
    paddingVertical: "2%",
    shadowColor: "black",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  wallet: {
    display: "flex",
    flexDirection: "column",
  },
  walletBalanceTitle: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    // justifyContent: "center",
  },
  title: {
    fontFamily: "Primary-Regular",
    fontWeight: "400",
    fontSize: 13,
  },
  currency: {
    textDecorationLine: "line-through",
    textDecorationStyle: "double",
    fontFamily: "Primary-Bold",
    fontSize: 22,
  },
  amount: {
    fontFamily: "Primary-Bold",
    fontSize: 22,
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: "10%",
  },
  action: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  actionBtnGradient: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 360,
  },
  actionBtn: {
    height: 60,
    width: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // overflow: "hidden",
    borderRadius: 360,
    padding: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  actionText: {
    fontFamily: "Primary-Medium",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 14.63,
  },
});
