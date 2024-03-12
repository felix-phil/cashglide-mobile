import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import CustomHeader from "../../../components/layouts/CustomHeader";
import { useAppTheme } from "../../../hooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamasType } from "../../../routes/app-stack";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Bank } from "../../../api/types";
import TextInput from "../../../components/common/TextInput";
import BankSelector from "../../../components/common/BankSelector";
import {
  useBankListQuery,
  useGetAccountDetailsMutation,
} from "../../../store/services/features";
import LoadingPage from "../../../components/layouts/LoadingPage";
import Button from "../../../components/common/Button";
import { getErrorString } from "../../../services/helpers";

type IProp = NativeStackScreenProps<AppStackParamasType, "SelectBank">;
const SelectBank = ({ navigation }: IProp) => {
  const { data: banks, isLoading } = useBankListQuery({});
  const [
    getAccountDetails,
    { reset, data: accountDetails, error, isLoading: isLoadingVerify },
  ] = useGetAccountDetailsMutation();
  const theme = useAppTheme();
  const [form, setform] = useState<{ accountNumber: string; bank?: Bank }>({
    accountNumber: "",
    bank: undefined,
  });

  const handleNext = async () => {
    if (!accountDetails || !form.bank) {
      Alert.alert(
        "",
        "Account details could not be retrieved, please try again."
      );
      return;
    }
    navigation.navigate("SendToBank", {
      accountNumber: accountDetails.accountNumber,
      accountName: accountDetails.accountName,
      bank: form.bank,
    });
  };
  if (isLoading) {
    return <LoadingPage />;
  }
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
        title="Send To Bank Account"
        onPressBack={navigation.goBack}
      />
      <KeyboardAwareScrollView
        style={{ marginTop: 28 }}
        contentContainerStyle={styles.scrollView}
      >
        <TextInput
          wrapperStyle={[
            styles.input,
            { backgroundColor: theme.colors.defaults.whiteOne },
          ]}
          placeholder="Enter 10 Digits Account Number"
          style={styles.textInput}
          keyboardType="number-pad"
          maxLength={10}
          onChangeText={(text) =>
            setform((prev) => ({ ...prev, accountNumber: text }))
          }
        />

        {banks && (
          <View style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <BankSelector
              disabled={form.accountNumber.length !== 10}
              options={banks}
              wrapperStyle={[
                styles.input,
                { backgroundColor: theme.colors.defaults.whiteOne },
              ]}
              onChange={(bank) => {
                reset();
                setform((prev) => ({ ...prev, bank }));
                getAccountDetails({
                  accountNumber: form.accountNumber,
                  bankCode: bank.code,
                });
              }}
              textStyle={styles.textInput}
            />
            {accountDetails && (
              <Text
                style={[
                  styles.infoText,
                  { color: theme.colors.defaults.credit },
                ]}
              >
                {accountDetails?.accountName}
              </Text>
            )}
            {error && (
              <Text
                style={[
                  styles.infoText,
                  { color: theme.colors.defaults.debit },
                ]}
              >
                {getErrorString(error)}
              </Text>
            )}
            {isLoadingVerify && (
              <ActivityIndicator
                color={theme.colors.primary}
                size={"small"}
                style={{ alignSelf: "flex-start" }}
              />
            )}
          </View>
        )}
        <View style={styles.submitBtn}>
          <Button
            onPress={handleNext}
            disabled={!form.accountNumber || !accountDetails}
          >
            Next
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default SelectBank;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 22,
    gap: 20,
  },
  input: {
    height: 50,
    borderRadius: 10,
  },
  textInput: {
    paddingHorizontal: 13,
    fontSize: 14,
    fontFamily: "Primary-Medium",
  },
  submitBtn: {
    alignSelf: "center",
    marginTop: "25%",
  },
  infoText: {
    fontFamily: "Primary-Medium",
    fontSize: 14,
  },
});
