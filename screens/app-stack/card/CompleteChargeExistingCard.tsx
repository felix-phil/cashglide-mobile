import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomHeader from "../../../components/layouts/CustomHeader";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamasType } from "../../../routes/app-stack";
import useOpenClose from "../../../hooks/use-open-close";
import { List } from "react-native-paper";
import { useAppTheme } from "../../../hooks";
import { FontAwesome } from "@expo/vector-icons";
import { cardValidator, getErrorString } from "../../../services/helpers";
import Button from "../../../components/common/Button";
import AuthRequest from "../../../components/common/AuthRequest";
import { useCurrentUserQuery } from "../../../store/services/authentication";
import LoadingPage from "../../../components/layouts/LoadingPage";
import { useTopupWithCardMutation } from "../../../store/services/card";
import RequestHandler from "../../../components/common/RequestHandler";

type IProps = NativeStackScreenProps<
  AppStackParamasType,
  "CompleteChargeExistingCard"
>;
const CompleteChargeExistingCard = ({ navigation, route }: IProps) => {
  const { open, handleClose, handleOpen } = useOpenClose(false);
  const theme = useAppTheme();
  const { amount, card } = route.params;
  const { data: user, ...userQuery } = useCurrentUserQuery({});
  const [topupWithCard, query] = useTopupWithCardMutation();

  const onSubmitHandler = async (pin: string) => {
    try {
      const response = await topupWithCard({
        amount: amount,
        cardId: card.id,
        pin,
      }).unwrap();
      navigation.navigate("TransactionCompleted", {
        transactionId: response.id,
      });
    } catch (error) {}
  };

  if (!user && userQuery.isLoading) {
    return <LoadingPage />;
  }
  return (
    <View style={styles.wrapper}>
      <CustomHeader title="Top Up With Card" onPressBack={navigation.goBack} />

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
          <View style={[styles.section, { marginTop: "5%" }]}>
            <List.Item
              left={(prop) => (
                <FontAwesome
                  size={30}
                  color={theme.colors.secondary}
                  name={cardValidator.getCardType(card.cardNumber)}
                />
              )}
              style={[
                styles.listItem,
                {
                  borderWidth: 1,
                  paddingHorizontal: "2%",
                  borderColor: theme.colors.primary,
                  borderRadius: 2,
                },
              ]}
              title={card.cardFullName}
              titleStyle={[styles.headTitle, { fontSize: 14 }]}
              description={cardValidator.maskCardNumber(
                cardValidator.formatCardNumber(card.cardNumber)
              )}
              descriptionStyle={[
                styles.subheadTitle,
                { color: theme.colors.primary },
              ]}
              right={(prop) => (
                <List.Icon
                  color={theme.colors.secondary}
                  icon={"credit-card-check-outline"}
                />
              )}
            />
          </View>
          {/* <View style={styles.section}>
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
          </View> */}
        </View>
        <View style={styles.submitBtn}>
          <Button onPress={handleOpen}>Top Up</Button>
        </View>
      </ScrollView>
      <AuthRequest
        onAuthPassed={onSubmitHandler}
        visible={open}
        handleClose={handleClose}
      />
      <RequestHandler
        show={query.isError || query.isLoading || query.isSuccess}
        isLoading={query.isLoading}
        isError={query.isError}
        isSuccess={query.isSuccess}
        onDismiss={query.reset}
        isLoadingText="processing"
        isErrorText={getErrorString(query.error)}
        isSuccessText="done"
      />
    </View>
  );
};

export default CompleteChargeExistingCard;

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
