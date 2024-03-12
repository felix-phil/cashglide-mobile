import { Image, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import CustomHeader from "../../../components/layouts/CustomHeader";
import { useAppTheme } from "../../../hooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamasType } from "../../../routes/app-stack";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Avatar, List, Text } from "react-native-paper";
import {
  formatLocaleStringToNumber,
  formatToNumberLocalString,
  getErrorString,
  hexToRGB,
} from "../../../services/helpers";
import TextInput from "../../../components/common/TextInput";
import Button from "../../../components/common/Button";
import { useGetWalletQuery } from "../../../store/services/wallet";
import { PROFILE_IMAGE_DEFAULT_URI } from "../../../constants/strings";
import { getBankLogoByCode } from "../../../data/bank-logo";
import { useGetTransferFeeMutation } from "../../../store/services/features";
import RequestHandler from "../../../components/common/RequestHandler";

type IProp = NativeStackScreenProps<AppStackParamasType, "SendToBank">;
const SendToBank = ({ navigation, route }: IProp) => {
  const theme = useAppTheme();
  const { data: wallet, ...walletQuery } = useGetWalletQuery({});
  const {accountName, accountNumber, bank} = route.params
  const initialAmount = route.params.amount;
  const [amount, setAmount] = useState(
    initialAmount ? formatToNumberLocalString(initialAmount.toString()) : ""
  );
  const [getTransferFee, query] = useGetTransferFeeMutation();
  const [description, setDescription] = useState("");
  const onReview = async() => {
    try {
      const fee = await getTransferFee({amount: formatLocaleStringToNumber(amount)}).unwrap()
      navigation.navigate("SendReviewBank", {
        to: {
         ...route.params,
        },
        fee,
        amount: formatLocaleStringToNumber(amount),
        narration: description,
      });
    } catch (error) {
      
    }
    
  };
  const amountError =
    wallet && wallet.wallet.balance < formatLocaleStringToNumber(amount);

  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: theme.colors.backgrounds.secondary },
      ]}
    >
      <CustomHeader
        backgroundColor="transparent"
        iconColor={theme.colors.defaults.blackOne}
        titleColor={theme.colors.defaults.blackOne}
        title="Send"
        onPressBack={navigation.goBack}
      />
      <KeyboardAwareScrollView contentContainerStyle={styles.contents}>
        <View style={styles.userInfo}>
          <List.Item
            left={(prop) => (
              <Image
                style={{ height: 40, width:40 }}
                source={{
                  uri: getBankLogoByCode(bank.code),
                }}
              />
            )}
            style={[styles.listItem]}
            title={accountName}
            titleEllipsizeMode="middle"
            descriptionEllipsizeMode="middle"
            titleStyle={styles.listItemTitle}
            description={`${bank.name}(${accountNumber})`}
            descriptionStyle={[
              styles.listItemDescription,
              { color: theme.colors.defaults.blackOne },
            ]}
          />
        </View>
        <View
          style={[styles.amount, { backgroundColor: theme.colors.primary }]}
        >
          <Text
            style={[styles.title, { color: theme.colors.defaults.whiteOne }]}
          >
            Amount
          </Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.defaults.whiteOne }]}
          >
            Type the amount you want to send
          </Text>
          <View style={styles.input}>
            <TextInput
              left={<Text style={[styles.title, styles.currency]}>N</Text>}
              value={amount}
              wrapperStyle={{
                height: 50,
                borderRadius: 10,
              }}
              placeholder="0.00"
              right={<Text style={[styles.title, { opacity: 0 }]}>N</Text>}
              style={[styles.title, styles.textInput]}
              keyboardType="decimal-pad"
              onChangeText={(text) =>
                setAmount(formatToNumberLocalString(text))
              }
              error={amountError}
              helperText={amountError ? "Insufficient funds" : ""}
            />
          </View>
        </View>
        <View style={styles.descriptionWrapper}>
          <TextInput
            wrapperStyle={[
              styles.description,
              {
                backgroundColor: theme.colors.backgrounds.primary,
                paddingHorizontal: "5%",
                paddingVertical: "3%",
              },
            ]}
            value={description}
            onChangeText={(text) => setDescription(text)}
            label={"Description"}
            style={{ fontSize: 14 }}
            multiline
            textAlignVertical="top"
            labelStyle={[
              styles.descriptionLabel,
              { color: theme.colors.defaults.blackOne },
            ]}
            placeholder="Add a message (Optional)"
          />
        </View>

        <View style={styles.submitBtn}>
          <Button
            onPress={onReview}
            disabled={
              formatLocaleStringToNumber(amount) < 100 ||
              (wallet &&
                wallet.wallet.balance < formatLocaleStringToNumber(amount))
            }
          >
            Continue
          </Button>
        </View>
      </KeyboardAwareScrollView>
      <RequestHandler
        show={query.isError || query.isLoading || query.isSuccess}
        isLoading={query.isLoading}
        isError={query.isError}
        isSuccess={query.isSuccess}
        onDismiss={query.reset}
        isLoadingText="preparing transaction"
        isErrorText={getErrorString(query.error)}
        isSuccessText="done"
      />
    </View>
  );
};

export default SendToBank;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  contents: {
    paddingHorizontal: "5%",
  },
  userInfo: {
    width: "80%",
    alignSelf: "center",
  },
  listItem: {
    marginVertical: "3%",
    borderRadius: 10,
  },
  listItemTitle: {
    fontFamily: "Primary-SemiBold",
    fontSize: 17,
    textTransform: "capitalize"

  },
  listItemDescription: {
    fontFamily: "Primary-Regular",
    fontSize: 11,
    marginTop: "1%",
    textTransform: "capitalize"
  },
  amount: {
    paddingVertical: "6%",
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  input: {
    width: "80%",
  },
  title: {
    fontFamily: "Primary-SemiBold",
    fontSize: 20,
  },
  currency: {
    marginLeft: 3,
    textDecorationLine: "line-through",
    textDecorationStyle: "double",
  },
  textInput: {
    textAlign: "center",
    marginLeft: "auto",
  },
  subtitle: {
    fontFamily: "Primary-Regular",
    fontSize: 12,
  },
  descriptionWrapper: {
    marginTop: "8%",
  },
  description: {
    height: 88,
    borderRadius: 10,
    borderWidth: 0,
  },
  descriptionLabel: {
    fontFamily: "Primary-Medium",
    fontSize: 15,
    marginVertical: 5,
  },
  submitBtn: {
    alignSelf: "center",
    marginTop: "10%",
  },
});
