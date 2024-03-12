import { ScrollView, StyleSheet, View } from "react-native";
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
import { useSendToCashGlideUserMutation } from "../../../store/services/wallet";
import RequestHandler from "../../../components/common/RequestHandler";
import { getErrorString } from "../../../services/helpers";

type IProp = NativeStackScreenProps<AppStackParamasType, "SendReview">;
const SendReview = ({ navigation, route }: IProp) => {
  const theme = useAppTheme();
  const { to: recipient, amount, narration } = route.params;
  const { data: currentUser, ...currentUserQuery } = useCurrentUserQuery({});
  const [sendToCashGlideUser, sendQuery] = useSendToCashGlideUserMutation();
  const { open, handleClose, handleOpen } = useOpenClose(false);
  if (!currentUser && currentUserQuery.isLoading) {
    return <LoadingPage />;
  }
  const onSubmitHandler = async (pin: string) => {
    try {
      const transaction = await sendToCashGlideUser({
        amount,
        pin,
        narration,
        recipientId: recipient.id,
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
            <Text
              style={[
                styles.subheadTitle,
                { color: theme.colors.defaults.grayFive },
              ]}
            >
              Amount
            </Text>
            <Text style={[styles.headTitle, { color: theme.colors.primary }]}>
              {amount?.toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
              })}
            </Text>
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
                <Avatar.Image
                  source={{
                    uri: recipient.profileImageUrl || PROFILE_IMAGE_DEFAULT_URI,
                  }}
                />
              )}
              style={styles.listItem}
              title={recipient.fullName}
              titleStyle={[styles.headTitle, { fontSize: 14 }]}
              description={"@" + recipient.username}
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

export default SendReview;

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
});
