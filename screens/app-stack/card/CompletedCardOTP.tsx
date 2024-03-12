import { Alert, StyleSheet, View } from "react-native";
import React from "react";
import CustomHeader from "../../../components/layouts/CustomHeader";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamasType } from "../../../routes/app-stack";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAppTheme } from "../../../hooks";
import { Divider, Text } from "react-native-paper";
import { Formik, FormikErrors } from "formik";
import TextInput from "../../../components/common/TextInput";
import { cardValidator, getErrorString } from "../../../services/helpers";
import { FontAwesome } from "@expo/vector-icons";
import Button from "../../../components/common/Button";
import RequestHandler from "../../../components/common/RequestHandler";
import {
  useAddCardMutation,
  useCompleteCardOTPMutation,
} from "../../../store/services/card";

type IProps = NativeStackScreenProps<AppStackParamasType, "CompleteCardOTP">;
const CompleteCardOTP = ({ navigation, route }: IProps) => {
  const cardId = route.params.cardId;

  const [completeCard, query] = useCompleteCardOTPMutation();
  const theme = useAppTheme();
  const initialState = {
    otp: "",
  };
  const validate = (values: typeof initialState) => {
    const errors: FormikErrors<typeof initialState> = {};
    if (!values.otp) {
      errors.otp = "Required";
    }
    return errors;
  };
  const onSubmitHandler = async (values: typeof initialState) => {
    try {
      const response = await completeCard({ otp: values.otp, cardId }).unwrap();
      if (response.completed) {
        navigation.push("TransactionCompleted", {
          transactionId: response.transactionId,
        });
      } else {
        Alert.alert("Transaction failed", "Something went wrong");
      }
    } catch (error) {}
  };
  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: theme.colors.backgrounds.secondary },
      ]}
    >
      <CustomHeader title="Add Card" onPressBack={navigation.goBack} />
      <KeyboardAwareScrollView>
        <Formik
          validate={validate}
          initialValues={initialState}
          onSubmit={onSubmitHandler}
        >
          {({
            dirty,
            errors,
            values,
            setFieldValue,
            isValid,
            isSubmitting,
            handleSubmit,
          }) => (
            <View style={styles.content}>
              <View
                style={[
                  styles.elevation,
                  { backgroundColor: theme.colors.defaults.whiteOne },
                ]}
              >
                <View>
                  <Text style={styles.title}>Complete Transaction</Text>
                </View>
                <Divider style={{ marginVertical: "3%" }} />

                <View style={styles.form}>
                  <View style={styles.item}>
                    <TextInput
                      label={"OTP"}
                      labelStyle={styles.inputLabel}
                      value={values.otp}
                      placeholder={"******"}
                      wrapperStyle={styles.inputWrapper}
                      onChangeText={(text) => setFieldValue("otp", text)}
                      style={styles.input}
                      error={dirty && !!errors.otp}
                      helperText={dirty && errors.otp ? errors.otp : ""}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.submitButton}>
                <Button onPress={() =>handleSubmit()} disabled={isSubmitting || !isValid}>Continue</Button>
              </View>
            </View>
          )}
        </Formik>
      </KeyboardAwareScrollView>
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

export default CompleteCardOTP;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  elevation: {
    width: "90%",
    marginTop: "20%",
    borderRadius: 10,
    elevation: 10,
    shadowColor: "#000",
    shadowRadius: 3,
    shadowOpacity: 0.3,
    shadowOffset: { height: 4, width: -2 },
    paddingHorizontal: "5%",
    paddingVertical: "5%",
  },
  title: {
    fontSize: 14,
    fontFamily: "Primary-SemiBold",
  },
  amount: {
    fontSize: 16,
    fontFamily: "Primary-Bold",
    marginTop: "2%",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  inputWrapper: {
    height: 45,
    paddingHorizontal: "3%",
  },
  input: {
    fontSize: 16,
    width: "100%",
  },
  inputLabel: {
    fontFamily: "Primary-SemiBold",
    marginBottom: "1%",
    // textTransform: "capitalize",
  },
  item: {
    flex: 1,
  },
  expiryAndCvv: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  submitButton: {
    marginTop: "30%",
    alignSelf: "center",
  },
});
