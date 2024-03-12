import { StyleSheet, View } from "react-native";
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
  hexToRGB,
} from "../../../services/helpers";
import TextInput from "../../../components/common/TextInput";
import Button from "../../../components/common/Button";
import { useGetWalletQuery } from "../../../store/services/wallet";
import { PROFILE_IMAGE_DEFAULT_URI } from "../../../constants/strings";

type IProp = NativeStackScreenProps<AppStackParamasType, "SendToUser">;
const SendToUser = ({ navigation, route }: IProp) => {
  const theme = useAppTheme();
  const { data: wallet, ...walletQuery } = useGetWalletQuery({});
  const user = route.params.user;
  const initialAmount = route.params.amount;
  const [amount, setAmount] = useState(
    initialAmount ? formatToNumberLocalString(initialAmount.toString()) : ""
  );
  const [description, setDescription] = useState("");
  const onReview = () => {
    navigation.navigate("SendReview", {
      to: user,
      amount: formatLocaleStringToNumber(amount),
      narration: description,
    });
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
              <Avatar.Image
                size={64}
                source={{
                  uri: user?.profileImageUrl || PROFILE_IMAGE_DEFAULT_URI,
                }}
              />
            )}
            style={[styles.listItem]}
            title={user?.fullName}
            titleStyle={styles.listItemTitle}
            description={"@" + user.username}
            descriptionStyle={[
              styles.listItemDescription,
              { color: theme.colors.primary },
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
    </View>
  );
};

export default SendToUser;

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
    fontFamily: "Primary-Bold",
    fontSize: 17,
  },
  listItemDescription: {
    fontFamily: "Primary-Bold",
    fontSize: 15,
    marginTop: "1%",
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
