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
import { useAddCardMutation } from "../../../store/services/card";

type IProps = NativeStackScreenProps<
  AppStackParamasType,
  "CardCompleteAuthFields"
>;
const CardCompleteAuthFields = ({ navigation, route }: IProps) => {
  const amount = route.params.amount;
  const prevCardDetails = route.params.cardDetails;
  const authMode = route.params.authMode;
  const authFields = route.params.authFields;
  const [addCard, query] = useAddCardMutation();
  const theme = useAppTheme();
  const initialState: any = {};
  const validate = (values: any) => {
    const errors: FormikErrors<any> = {};
    Object.keys(values).forEach((key) => {
      if (!values[key]) {
        errors[key] = "Required";
      }
    });
    return errors;
  };
  const onSubmitHandler = async (values: any) => {
    try {
      const response = await addCard({
        ...prevCardDetails,
        amount: amount,
        chargeType: "AUTH",
        authMode: authMode,
        authFields: authFields,
        authFieldValues: { ...values },
      }).unwrap();
      if (
        response.validationRequired &&
        response.validationMode == "otp" &&
        response.cardId
      ) {
        navigation.navigate("CompleteCardOTP", {
          cardId: response.cardId,
        });
      } else if (
        response.validationRequired &&
        response.validationMode == "otp" &&
        response.redirect_uri
      ) {
        navigation.navigate("CompleteCardWeb", { url: response.redirect_uri });
      } else if (response.completed && response.transactionId) {
        navigation.replace("TransactionCompleted", {
          transactionId: response.transactionId,
        });
      } else {
        Alert.alert("Transaction Failed", "Something went wrong");
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
                  <Text style={styles.title}>Add new card</Text>
                  <Text style={styles.amount}>
                    {amount.toLocaleString("en-NG", {
                      style: "currency",
                      currency: "NGN",
                      // maximumFractionDigits: 2,
                      // maximumSignificantDigits: 2,
                    })}
                  </Text>
                </View>
                <Divider style={{ marginVertical: "3%" }} />

                <View style={styles.form}>
                  {authFields.map((field) => (
                    <View style={styles.item} key={field}>
                      <TextInput
                        label={field}
                        labelStyle={styles.inputLabel}
                        value={values[field]}
                        placeholder={field}
                        wrapperStyle={styles.inputWrapper}
                        onChangeText={(text) => setFieldValue(field, text)}
                        style={styles.input}
                        error={dirty && !!errors[field]}
                        helperText={
                          dirty && errors[field]
                            ? errors[field]?.toString()
                            : ""
                        }
                      />
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.submitButton}>
                <Button onPress={() => handleSubmit()} disabled={isSubmitting || !isValid}>Continue</Button>
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

export default CardCompleteAuthFields;

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
    textTransform: "capitalize",
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
