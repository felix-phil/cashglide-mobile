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
import { useAddCardMutation } from "../../../store/services/card";
import RequestHandler from "../../../components/common/RequestHandler";

interface CardFrom {
  cardNumber: string;
  cardCvv: string;
  cardExpiry: string;
  cardFullName: string;
}
type IProps = NativeStackScreenProps<AppStackParamasType, "NewCard">;
const NewCard = ({ navigation, route }: IProps) => {
  const amount = route.params.amount;
  const theme = useAppTheme();
  const [addCard, query] = useAddCardMutation();
  const initialState: CardFrom = {
    cardNumber: "",
    cardCvv: "",
    cardFullName: "",
    cardExpiry: "",
  };
  const validate = (values: CardFrom) => {
    const errors: FormikErrors<CardFrom> = {};
    if (!values.cardFullName) {
      errors.cardFullName = "Required";
    }
    if (!cardValidator.isValidCardNumber(values.cardNumber)) {
      errors.cardNumber = "Invalid card number";
    }
    if (!cardValidator.isValidExpiry(values.cardExpiry)) {
      errors.cardExpiry = "Invalid card expiry";
    }
    if (values.cardCvv.length < 3) {
      errors.cardCvv = "Invalid CVV";
    }
    return errors;
  };
  const onSubmitHandler = async (values: CardFrom) => {
    try {
      const cardExpirySplit = values.cardExpiry.split("/");
      const cardNumber = values.cardNumber.replaceAll(" ", "");
      const cardDetails = {
        cardNumber,
        cardCvv: values.cardCvv,
        cardExpiryMonth: cardExpirySplit[0],
        cardExpiryYear: cardExpirySplit[1],
        cardFullName: values.cardFullName,
      };
      const response = await addCard({
        ...cardDetails,
        amount: amount,
        chargeType: "NONE",
      }).unwrap();
      if (response.authRequired) {
        if (response.authMode == "pin" || response.authMode == "avs_noauth") {
          navigation.navigate("CardCompleteAuthFields", {
            cardDetails: cardDetails,
            amount: amount,
            authFields: response.authFields!,
            authMode: response.authMode!,
          });
        } else if (response.authMode == "redirect") {
          navigation.navigate("CompleteCardWeb", {
            url: response.redirect_uri!,
          });
        } else {
          Alert.alert("Bad Request");
          return;
        }
      } else if (response.completed && !response.validationRequired) {
        Alert.alert("Transaction Successful", "Success");
      } else {
        Alert.alert("Transaction Failed", "Something went wrong");
      }
    } catch (error) {}
  };
  console.log(amount)
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
                  <View style={styles.item}>
                    <TextInput
                      label="Card number"
                      labelStyle={styles.inputLabel}
                      value={values.cardNumber}
                      placeholder="5366 4567 7876 9077"
                      wrapperStyle={styles.inputWrapper}
                      onChangeText={(text) =>
                        setFieldValue(
                          "cardNumber",
                          cardValidator.formatCardNumber(text)
                        )
                      }
                      style={styles.input}
                      keyboardType="number-pad"
                      autoComplete="cc-number"
                      maxLength={19}
                      right={
                        values.cardNumber && (
                          <FontAwesome
                            size={16}
                            color={theme.colors.secondary}
                            name={cardValidator.getCardType(values.cardNumber)}
                          />
                        )
                      }
                      error={dirty && !!errors.cardNumber}
                      helperText={
                        dirty && errors.cardNumber ? errors.cardNumber : ""
                      }
                    />
                  </View>
                  <View style={styles.expiryAndCvv}>
                    <View style={styles.item}>
                      <TextInput
                        label="Expiry Date"
                        labelStyle={styles.inputLabel}
                        value={values.cardExpiry}
                        placeholder="MM/YY"
                        wrapperStyle={styles.inputWrapper}
                        onChangeText={(text) =>
                          setFieldValue(
                            "cardExpiry",
                            cardValidator.formatExpiry(text)
                          )
                        }
                        style={styles.input}
                        keyboardType="number-pad"
                        autoComplete="cc-exp"
                        maxLength={5}
                        error={dirty && !!errors.cardExpiry}
                        helperText={
                          dirty && errors.cardExpiry ? errors.cardExpiry : ""
                        }
                      />
                    </View>
                    <View style={styles.item}>
                      <TextInput
                        label="CVV"
                        labelStyle={styles.inputLabel}
                        value={values.cardCvv}
                        placeholder="000"
                        wrapperStyle={styles.inputWrapper}
                        onChangeText={(text) => setFieldValue("cardCvv", text)}
                        style={styles.input}
                        keyboardType="number-pad"
                        maxLength={3}
                        secureTextEntry
                        error={dirty && !!errors.cardCvv}
                        helperText={
                          dirty && errors.cardCvv ? errors.cardCvv : ""
                        }
                      />
                    </View>
                  </View>
                  <View style={styles.item}>
                    <TextInput
                      label="Card Holder Name"
                      labelStyle={styles.inputLabel}
                      value={values.cardFullName}
                      placeholder="John Doe"
                      wrapperStyle={styles.inputWrapper}
                      onChangeText={(text) =>
                        setFieldValue("cardFullName", text)
                      }
                      autoCapitalize="words"
                      style={styles.input}
                      error={dirty && !!errors.cardFullName}
                      helperText={
                        dirty && errors.cardFullName ? errors.cardFullName : ""
                      }
                    />
                  </View>
                </View>
              </View>
              <View style={styles.submitButton}>
                <Button
                  onPress={() => handleSubmit()}
                  disabled={isSubmitting || !isValid}
                >
                  Add Card
                </Button>
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

export default NewCard;

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
