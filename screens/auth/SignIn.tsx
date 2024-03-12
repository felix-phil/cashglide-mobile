import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Title, Text } from "react-native-paper";

import PageLayout from "../../components/layouts/PageLayout";
import { useAppTheme } from "../../hooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../routes/auth";

import CountryCodeSelector from "../../components/screens/auth/CountryCodeSelector";
import AuthTextInput from "../../components/common/AuthTextInput";
import Button from "../../components/common/Button";
import { Formik, FormikErrors } from "formik";
import { CountryCode } from "../../data/country-codes";
// import { numberWithSpaces } from "../../services/helpers";
import DividerWithText from "../../components/common/DividerWithText";
import SocialLogins from "../../components/screens/auth/social";
import Link from "../../components/common/Link";
import RequestHandler from "../../components/common/RequestHandler";
import { useInitializeMutation } from "../../store/services/authentication";
import { getErrorString } from "../../services/helpers";
import getEndpoint, { apiEndpoints } from "../../api/endpoints";

interface SignInForm {
  phoneNumber: string;
  code?: CountryCode;
}

type IProps = NativeStackScreenProps<AuthStackParamList, "SignIn">;
const SignIn = ({ navigation }: IProps) => {
  const themes = useAppTheme();
  const [initialize, query] = useInitializeMutation();
  const initalValues: SignInForm = {
    phoneNumber: "",
    code: undefined,
  };
  

  const validate = (values: SignInForm) => {
    const errors: FormikErrors<SignInForm> = {};
    // const phoneRegex = new RegExp("^+(?:[0-9] ?){6,14}[0-9]$");
    if (!values.code) {
      errors.phoneNumber = "Country code is required";
    }
    if (!values.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    }
    if (values.code && !values.code.regex.test(values.phoneNumber)) {
      errors.phoneNumber = "Invalid phone number format";
    }
    return errors;
  };

  const onSubmitHandler =  async(values: SignInForm) => {
    const fullNumber = values.code?.code + values.phoneNumber;
    try {
      await initialize({ primaryIdentifier: fullNumber }).unwrap();
      navigation.navigate("OTPVerification", {
        primaryIdentifier: fullNumber,
        reason: "authentication",
      });
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };
  return (
    <PageLayout
      gradientBackground
      onBackPressed={navigation.canGoBack() ? navigation.goBack : undefined}
    >
      <KeyboardAvoidingView style={styles.wrapper}>
        <View
          style={[
            styles.centerLogo,
            { backgroundColor: themes.colors.backgrounds.primary },
          ]}
        >
          <Image
            style={styles.logo}
            source={require("../../assets/images/icon.png")}
          />
        </View>
        <View style={styles.contentsWrapper}>
          <View
            style={[
              styles.modal,
              { backgroundColor: themes.colors.backgrounds.primary },
            ]}
          >
            <Formik
              validate={validate}
              initialValues={initalValues}
              onSubmit={onSubmitHandler}
            >
              {({
                values,
                errors,
                handleSubmit,
                setFieldValue,
                isValid,
                touched,
                handleBlur,
              }) => (
                <View style={styles.container}>
                  <View style={styles.input}>
                    <Title style={styles.header}>Sign in</Title>
                    <Text style={styles.subtitle}>Enter your number</Text>
                    <AuthTextInput
                      error={!!errors.phoneNumber}
                      helperText={
                        errors.phoneNumber ? (
                          errors.phoneNumber
                        ) : (
                          <Text style={styles.helperText}>
                            We will send an SMS code to verify your number
                          </Text>
                        )
                      }
                      value={values.phoneNumber}
                      onChangeText={(text: string) => {
                        if (isNaN(Number(text))) {
                          return;
                        } else {
                          setFieldValue("phoneNumber", text);
                        }
                      }}
                      keyboardType="number-pad"
                      left={
                        <CountryCodeSelector
                          onChange={(code) => setFieldValue("code", code)}
                          initialCountryCode="+234"
                        />
                      }
                      returnKeyType="go"
                      returnKeyLabel="Submit"
                      // onEndEditing={() => handleSubmit()}
                    />
                  </View>
                  <View style={styles.submitBtn}>
                    <Button disabled={!isValid} onPress={() => handleSubmit()}>
                      Sign In
                    </Button>
                  </View>
                </View>
              )}
            </Formik>
          </View>
          <View style={[styles.socialSection]}>
            <DividerWithText text="or sign in with" />
            <SocialLogins />
          </View>
          <View style={styles.bottom}>
            <Text
              style={[
                styles.bottomText,
                { color: themes.colors.defaults.grayFour },
              ]}
            >
              If you are creating a new account,{" "}
              <Link
                style={[styles.bottomText, styles.link]}
                href="https://google.com"
              >
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link
                style={[styles.bottomText, styles.link]}
                href="https://google.com"
              >
                Privacy Policy
              </Link>{" "}
              will apply
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
      <RequestHandler
        show={query.isError || query.isLoading || query.isSuccess}
        isLoading={query.isLoading}
        isError={query.isError}
        isSuccess={query.isSuccess}
        onDismiss={query.reset}
        isLoadingText="sending SMS verification code"
        isErrorText={getErrorString(query.error)}
        isSuccessText="code sent"
      />
    </PageLayout>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    position: "relative",
  },
  centerLogo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    borderRadius: 25,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 70,
    height: 65,
  },
  contentsWrapper: {
    marginTop: "10%",
    top: "20%",
    position: "absolute",
    flex: 1,
    width: "100%",
    height: "100%",
  },
  modal: {
    minHeight: 210,
    // paddingVertical: "10%",
    // paddingHorizontal: "10%",
    borderRadius: 30,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    position: "relative",
    shadowRadius: 3,
    shadowOpacity: 0.3,
    shadowOffset: { height: 4, width: -2 },
    elevation: 5,
    columnGap: 50,
  },
  header: {
    fontFamily: "Primary-Bold",
    fontWeight: "700",
    fontSize: 25,
  },
  subtitle: {
    fontFamily: "Primary-Regular",
    fontWeight: "500",
    fontSize: 15,
  },
  input: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    alignItems: "center",
  },
  container: {
    borderRadius: 30,
    paddingHorizontal: "10%",
    flex: 1,
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  helperText: {
    fontFamily: "Primary-Medium",
    fontSize: 8,
    fontWeight: "500",
  },
  submitBtn: {
    position: "absolute",
    bottom: "-10%",
    zIndex: 1,
  },
  socialSection: {
    alignSelf: "center",
    marginTop: "15%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    gap: 15,
  },
  bottom: {
    // marginTop: "auto",
    position: "absolute",
    bottom: "30%",
  },
  bottomText: {
    fontSize: 10,
    textAlign: "center",
    fontFamily: "Roboto-Medium",
  },
  link: {
    textDecorationLine: "underline",
  },
});
