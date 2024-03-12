import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import React, { FC } from "react";
import { useAppTheme } from "../../../hooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamasType } from "../../../routes/app-stack";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Button from "../../../components/common/Button";
import DoneSvg from "../../../assets/svgs/done.svg";
import { Text, Button as PaperButton } from "react-native-paper";
import { hexToRGB } from "../../../services/helpers";
import { useGetWalletQuery } from "../../../store/services/wallet";
import { useGetSingleTransactionQuery } from "../../../store/services/transaction";
import colors from "../../../constants/colors";
import moment from "moment";

type IProps = NativeStackScreenProps<
  AppStackParamasType,
  "TransactionCompleted"
>;
interface InfoProps {
  leftTitle?: string;
  leftSubtitle?: string;
  rightTitle?: string;
  rightSubtitle?: string;
}
const Info: FC<InfoProps> = ({
  leftSubtitle,
  leftTitle,
  rightSubtitle,
  rightTitle,
}) => {
  return (
    <View style={styles.info}>
      <View style={styles.infoSide}>
        <Text style={[styles.infoSideTitle, { textAlign: "left" }]}>
          {leftTitle}
        </Text>
        <Text style={[styles.infoSideSubtitle, { textAlign: "left" }]}>
          {leftSubtitle}
        </Text>
      </View>
      <View style={styles.infoSide}>
        <Text
          numberOfLines={1}
          style={[styles.infoSideTitle, { textAlign: "right" }]}
        >
          {rightTitle}
        </Text>
        <Text style={[styles.infoSideSubtitle, { textAlign: "right" }]}>
          {rightSubtitle}
        </Text>
      </View>
    </View>
  );
};
const TransactionCompleted = ({ navigation, route }: IProps) => {
  const transactionId = route.params.transactionId;
  const { data: transaction, ...transactionQuery } =
    useGetSingleTransactionQuery(transactionId || "");
  const theme = useAppTheme();
  const { data: wallet, ...query } = useGetWalletQuery({});
  const handleButtonPress = async () => {
    query.refetch();
    navigation.replace("AppBottomTab");
  };
  if (transactionQuery.isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size={"large"} color={theme.colors.secondary} />
      </View>
    );
  }
  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: theme.colors.backgrounds.secondary },
      ]}
    >
      <ScrollView>
        <View style={styles.content}>
          <View
            style={[
              styles.elevation,
              { backgroundColor: theme.colors.defaults.whiteOne },
            ]}
          >
            <View style={styles.svg}>
              <DoneSvg />
            </View>
            <View style={styles.heading}>
              <Text style={styles.title}>Success</Text>
              <Text
                style={[
                  styles.subtitle,
                  { color: theme.colors.defaults.grayFive },
                ]}
              >
                Your transaction is successful
              </Text>
            </View>
            {transaction && transactionId && (
              <View
                style={[
                  styles.amountBox,
                  {
                    backgroundColor: hexToRGB(
                      theme.colors.defaults.grayFive,
                      0.1
                    ),
                  },
                ]}
              >
                <Text style={[styles.amount, { color: theme.colors.primary }]}>
                  {transaction?.amount?.toLocaleString("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  })}
                </Text>
                <Text
                  style={[
                    styles.subtitle,
                    { color: theme.colors.defaults.grayFive },
                  ]}
                >
                  Amount
                </Text>
              </View>
            )}
            {transaction && transactionId &&(
              <View style={styles.infos}>
                <Info
                  leftTitle="From:"
                  leftSubtitle="CashGlide"
                  rightTitle={transaction?.fromName?.toUpperCase()}
                  rightSubtitle={transaction?.fromNumber}
                />
                <Info
                  leftTitle="To:"
                  leftSubtitle="CashGlide"
                  rightTitle={transaction?.recipientName || "CashGlide"}
                  rightSubtitle={transaction?.recipientNumber}
                />
                <Info
                  leftTitle="Date:"
                  // leftSubtitle="CashGlide"
                  rightTitle={moment(transaction?.updatedAt).format(
                    "DD MMM, YYYY"
                  )}
                  rightSubtitle={moment(transaction?.updatedAt).format(
                    "hh:mm:ss A"
                  )}
                />
                <Info
                  leftTitle="Transaction ID"
                  // leftSubtitle="CashGlide"
                  rightTitle={transaction?.id}
                />
              </View>
            )}
            {transaction && transactionId && (
              <View style={{ paddingVertical: "5%" }}>
                <PaperButton
                  textColor={theme.colors.defaults.grayFive}
                  icon={"receipt"}
                >
                  Download Receipt
                </PaperButton>
              </View>
            )}
          </View>
          <View style={styles.submitButton}>
            <Button loading={query.isLoading} onPress={handleButtonPress}>
              Done
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default TransactionCompleted;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center"
  },
  content: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  elevation: {
    width: "87%",
    marginTop: "20%",
    borderRadius: 10,
    // elevation: 10,
    // shadowColor: "#000",
    // shadowRadius: 3,
    // shadowOpacity: 0.3,
    // shadowOffset: { height: 4, width: -2 },
    paddingHorizontal: "5%",
    paddingVertical: "5%",
  },
  heading: {
    alignSelf: "center",
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontFamily: "Primary-SemiBold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Primary-Medium",
    textAlign: "center",
    marginTop: "3%",
  },
  submitButton: {
    marginTop: "10%",
    alignSelf: "center",
  },
  svg: {
    marginVertical: "10%",
    alignSelf: "center",
  },
  amountBox: {
    paddingVertical: "5%",
    paddingHorizontal: "5%",
    marginTop: "10%",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  amount: {
    fontFamily: "Primary-SemiBold",
    fontSize: 20,
  },
  loader: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  infos: {
    display: "flex",
    flexDirection: "column",
  },
  info: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: "5%",
    borderBottomWidth: 1,
    borderBottomColor: colors.default.graySix,
  },
  infoSide: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  infoSideTitle: {
    fontSize: 14,
    fontFamily: "Primary-Medium",
    color: colors.default.blackOne,
    flex: 1,
  },
  infoSideSubtitle: {
    fontSize: 14,
    fontFamily: "Primary-Medium",
    color: colors.default.grayFive,
  },
});
