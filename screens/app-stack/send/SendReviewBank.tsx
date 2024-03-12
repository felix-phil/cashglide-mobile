import { Image, ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import CustomHeader from "../../../components/layouts/CustomHeader";
import { useAppTheme } from "../../../hooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamasType } from "../../../routes/app-stack";
import { Avatar, List, Text } from "react-native-paper";
import { PROFILE_IMAGE_DEFAULT_URI } from "../../../constants/strings";
import { useCurrentUserQuery } from "../../../store/services/authentication";
import LoadingPage from "../../../components/layouts/LoadingPage";
import Button from "../../../components/common/Button";
import AuthRequest from "../../../components/common/AuthRequest";
import useOpenClose from "../../../hooks/use-open-close";
import {
  useSendToBankMutation,
  useSendToCashGlideUserMutation,
} from "../../../store/services/wallet";
import RequestHandler from "../../../components/common/RequestHandler";
import { getErrorString } from "../../../services/helpers";
import { getBankLogoByCode } from "../../../data/bank-logo";

type IProp = NativeStackScreenProps<AppStackParamasType, "SendReviewBank">;
const SendReviewBank = ({ navigation, route }: IProp) => {
  const theme = useAppTheme();
  const { to: recipient, amount, fee, narration } = route.params;
  const { data: currentUser, ...currentUserQuery } = useCurrentUserQuery({});
  const [sendToBank, sendQuery] = useSendToBankMutation();
  const { open, handleClose, handleOpen } = useOpenClose(false);
  if (!currentUser && currentUserQuery.isLoading) {
    return <LoadingPage />;
  }
  const onSubmitHandler = async (pin: string) => {
    try {
      const transaction = await sendToBank({
        amount,
        pin,
        narration,
        accountNumber: recipient.accountNumber,
        bankCode: recipient.bank.code,
      }).unwrap();
      navigation.navigate("TransactionCompleted", {
        transactionId: transaction.id,
      });
    } catch (error) {}
  };
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
        title="Review"
        onPressBack={navigation.goBack}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.colors.defaults.whiteOne },
          ]}
        >
          <View style={styles.section}>
            <View style={styles.amountSection}>
              <View style={styles.amounts}>
                <Text
                  style={[
                    styles.subheadTitle,
                    { color: theme.colors.defaults.grayFive },
                  ]}
                >
                  Amount
                </Text>
                <Text
                  style={[styles.headTitle, { color: theme.colors.primary }]}
                >
                  {amount?.toLocaleString("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  })}
                </Text>
              </View>
              <View style={styles.amounts}>
                <Text
                  style={[
                    styles.subheadTitle,
                    { color: theme.colors.defaults.grayFive },
                  ]}
                >
                  VAT + Fee
                </Text>
                <Text
                  style={[styles.headTitle, { color: theme.colors.primary }]}
                >
                  {fee?.toLocaleString("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  })}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.section}>
            <Text
              style={[
                styles.subheadTitle,
                { color: theme.colors.defaults.grayFive },
              ]}
            >
              To
            </Text>
            <List.Item
              left={(prop) => (
                <Image
                  style={{ height: 40, width: 40 }}
                  source={{
                    uri: getBankLogoByCode(recipient.bank.code),
                  }}
                />
              )}
              style={styles.listItem}
              title={recipient.accountName}
              titleStyle={[styles.headTitle, { fontSize: 14 }]}
              description={`${recipient.bank.name}(${recipient.accountNumber})`}
              descriptionStyle={[
                styles.subheadTitle,
                { color: theme.colors.primary },
              ]}
            />
          </View>
          <View style={styles.section}>
            <Text
              style={[
                styles.subheadTitle,
                { color: theme.colors.defaults.grayFive },
              ]}
            >
              From
            </Text>
            <List.Item
              left={(prop) => (
                <Avatar.Image
                  source={{
                    uri:
                      currentUser?.profileImageUrl || PROFILE_IMAGE_DEFAULT_URI,
                  }}
                />
              )}
              style={styles.listItem}
              title={currentUser?.fullName}
              titleStyle={[styles.headTitle, { fontSize: 14 }]}
              description={"@" + currentUser?.username}
              descriptionStyle={[
                styles.subheadTitle,
                { color: theme.colors.primary },
              ]}
            />
          </View>
        </View>
        <View style={styles.submitBtn}>
          <Button onPress={handleOpen}>Confirm</Button>
        </View>
      </ScrollView>
      <AuthRequest
        onAuthPassed={onSubmitHandler}
        visible={open}
        handleClose={handleClose}
      />
      <RequestHandler
        show={sendQuery.isError || sendQuery.isLoading || sendQuery.isSuccess}
        isLoading={sendQuery.isLoading}
        isError={sendQuery.isError}
        isSuccess={sendQuery.isSuccess}
        onDismiss={sendQuery.reset}
        isLoadingText="processing transaction"
        isErrorText={getErrorString(sendQuery.error)}
        isSuccessText="transaction successful"
      />
    </View>
  );
};

export default SendReviewBank;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    marginTop: "20%",
    width: "87%",
    // height: 316,
    borderRadius: 20,
    paddingVertical: "10%",
    paddingHorizontal: "5%",
    gap: 12,
  },
  subheadTitle: {
    fontSize: 14,
    fontFamily: "Primary-Medium",
  },
  section: {
    gap: 12,
  },
  headTitle: {
    fontSize: 18,
    fontFamily: "Primary-SemiBold",
  },
  listItem: {},
  submitBtn: {
    marginTop: "20%",
  },
  amountSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amounts: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
});
