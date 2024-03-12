import { ActivityIndicator, StyleSheet, View } from "react-native";
import React from "react";
import { useAppTheme } from "../../../hooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamasType } from "../../../routes/app-stack";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Button from "../../../components/common/Button";
import FailedSvg from "../../../assets/svgs/failure.svg";
import { Text } from "react-native-paper";
import { hexToRGB } from "../../../services/helpers";
import { useGetWalletQuery } from "../../../store/services/wallet";
import { useGetSingleTransactionQuery } from "../../../store/services/transaction";

type IProps = NativeStackScreenProps<AppStackParamasType, "TransactionFailed">;
const TransactionFailed = ({ navigation, route }: IProps) => {
  const transactionId = route.params.transactionId;
  const { data: transaction, ...transactionQuery } =
    useGetSingleTransactionQuery(transactionId || "");
  const theme = useAppTheme();
  const { data: wallet, ...query } = useGetWalletQuery({});
  const handleButtonPress = async () => {
    await query.refetch().unwrap();
    navigation.replace("AppBottomTab");
  };
  if (transactionQuery.isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size={"large"} color={theme.colors.secondary} />
      </View>
    );
  }
  console.log(transactionId);
  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: theme.colors.backgrounds.secondary },
      ]}
    >
      <KeyboardAwareScrollView>
        <View style={styles.content}>
          <View
            style={[
              styles.elevation,
              { backgroundColor: theme.colors.defaults.whiteOne },
            ]}
          >
            <View style={styles.svg}>
              <FailedSvg />
            </View>
            <View style={styles.heading}>
              <Text style={styles.title}>Failure</Text>
              <Text
                style={[
                  styles.subtitle,
                  { color: theme.colors.defaults.grayFive },
                ]}
              >
                Your transaction failed
              </Text>
            </View>
          </View>
          <View style={styles.submitButton}>
            <Button loading={query.isLoading} onPress={handleButtonPress}>
              Home
            </Button>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default TransactionFailed;

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
    marginTop: "30%",
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
});
