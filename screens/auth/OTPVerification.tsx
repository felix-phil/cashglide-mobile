import { Alert, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../routes/auth";
import PageLayout from "../../components/layouts/PageLayout";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { LinearGradient } from "expo-linear-gradient";
import OTPSecureIcon from "../../assets/svgs/otpsecure.svg";
import { useAppDispatch, useAppSelector, useAppTheme } from "../../hooks";
import { Text } from "react-native-paper";
import {
  getErrorString,
  isEmailOrPhoneNumber,
  numberWithSpaces,
} from "../../services/helpers";
import OTPInput from "../../components/common/OTPInput";
import Button from "../../components/common/Button";
import RequestHandler from "../../components/common/RequestHandler";
import { authenticate } from "../../store/features/auth";
import { RegistrationStackParamList } from "../../routes/registration";
import {
  useAuthenticateOrVerifyMutation,
  useCurrentUserQuery,
  useInitializeMutation,
  useRequestIdentifierVerifyMutation,
} from "../../store/services/authentication";
import { APIUser } from "../../api/types";
import { setAuthDetails } from "../../services/storage";
type Props = NativeStackScreenProps<
  AuthStackParamList & RegistrationStackParamList,
  "OTPVerification"
>;
const RESEND_COUNTER_SECONDS = 120;
const OTPVerification = ({ navigation, route }: Props) => {
  const theme = useAppTheme();
  const reason = route.params.reason;
  const primaryIdentifier = route.params.primaryIdentifier;
  const identifierType = isEmailOrPhoneNumber(primaryIdentifier);
  const { data: currentUser, ...userQuery } = useCurrentUserQuery(null);
  const [otp, setOtp] = useState("");
  const dispatch = useAppDispatch();
  const [initialize, initializeQuery] = useInitializeMutation();
  const [requestVerify, requestVerifyQuery] =
    useRequestIdentifierVerifyMutation();
  const [verify, query] = useAuthenticateOrVerifyMutation();
  const [resendCounter, setResendCounter] = useState(0);
  const [resendIsCounting, setResendIsCounting] = useState(false);

  useEffect(() => {
    setResendCounter(RESEND_COUNTER_SECONDS);
    setResendIsCounting(true);
  }, []);

  useEffect(() => {
    // console.log(resendCounter);
    let interval: NodeJS.Timer;
    if (resendIsCounting) {
      interval = setInterval(() => setResendCounter((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendIsCounting]);

  // console.log(otp)
  const handleResend = async () => {
    try {
      if (reason === "authentication") {
        await initialize({ primaryIdentifier });
      } else {
        await requestVerify({ identifier: primaryIdentifier });
      }
      setResendIsCounting(true);
      setResendCounter(RESEND_COUNTER_SECONDS);
    } catch (error) {
      Alert.alert("Error", getErrorString(error));
    }
  };
  const onSubmitHandler = async (code?: string) => {
    let otpCode = "";
    if (code) {
      otpCode = code;
    } else {
      otpCode = otp;
    }
    try {
      const data = await verify({
        reason,
        body: { identifier: primaryIdentifier, otp: otpCode },
      }).unwrap();
      if ("authToken" in data) {
        await setAuthDetails({
          id: data.user.id,
          refreshToken: data.refreshToken,
          refreshTokenExpiry: new Date(data.refreshTokenExpiry).toISOString(),
          token: data.authToken,
          tokenExpiry: new Date(data.tokenExpiry).toISOString(),
        });
        dispatch(
          authenticate({
            id: data.user.id,
            primaryIdentifier: data.user.primaryIdentifier,
            refreshToken: data.refreshToken,
            refreshTokenExpiry: new Date(data.refreshTokenExpiry).toISOString(),
            registrationCompleted:
              data.user.registrationCompleted && Boolean(data.user.bvn),
            token: data.authToken,
            tokenExpiry: new Date(data.tokenExpiry).toISOString(),
          })
        );
      } else {
        await userQuery.refetch().unwrap();
        navigation.goBack();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <PageLayout onBackPressed={navigation.goBack}>
      <KeyboardAwareScrollView contentContainerStyle={styles.wrapper}>
        <View style={styles.gradientImage}>
          <OTPSecureIcon />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>OTP Verification</Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.defaults.grayFour }]}
          >
            Enter the OTP sent to{" "}
            <Text
              style={[
                styles.subtitle,
                {
                  fontWeight: "600",
                  fontFamily: "Primary-SemiBold",
                  color: theme.colors.defaults.blackOne,
                },
              ]}
            >
              {identifierType === "phone"
                ? `+${numberWithSpaces(primaryIdentifier)}`
                : primaryIdentifier}
            </Text>
          </Text>
          <OTPInput
            onOTPReady={onSubmitHandler}
            onTextChange={(value) => setOtp(value)}
          />
          <Text
            style={[styles.subtitle, { color: theme.colors.defaults.grayFour }]}
          >
            Didn’t receive an OTP?{" "}
            {resendCounter > 0 && resendIsCounting ? (
              <Text
                style={{
                  // ...styles.subtitle,
                  fontWeight: "700",
                  color: theme.colors.defaults.grayFour,
                }}
              >
                resend in {resendCounter}s{" "}
              </Text>
            ) : (
              <Text
                onPress={handleResend}
                style={[
                  styles.subtitle,
                  {
                    color: theme.colors.secondary,
                  },
                ]}
              >
                Resend OTP
              </Text>
            )}{" "}
          </Text>
        </View>
        <View style={styles.btn}>
          <Button onPress={() => onSubmitHandler()} disabled={otp.length < 4}>
            Verify
          </Button>
        </View>
      </KeyboardAwareScrollView>
      <RequestHandler
        show={query.isError || query.isLoading || query.isSuccess}
        isLoading={query.isLoading}
        isError={query.isError}
        isSuccess={query.isSuccess}
        onDismiss={query.reset}
        isLoadingText="verifying code"
        isErrorText={getErrorString(query.error)}
        isSuccessText="veried"
      />
    </PageLayout>
  );
};

export default OTPVerification;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
  },
  gradientImage: {
    width: 259,
    height: 259,
    borderRadius: 360,
    overflow: "hidden",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    marginTop: "5%",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontFamily: "Primary-SemiBold",
    fontWeight: "600",
    textAlign: "center",
  },
  subtitle: {
    fontWeight: "400",
    fontFamily: "Primary-Regular",
    fontSize: 15,
    textAlign: "center",
  },
  btn: {
    marginTop: "20%",
  },
});
