import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import PageLayout from "../../components/layouts/PageLayout";
import { Title, Text } from "react-native-paper";
import AuthPINIcon from "../../assets/svgs/authpin.svg";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAppDispatch, useAppTheme } from "../../hooks";
import OTPInput from "../../components/common/OTPInput";
import AuthPINFaceIdIcon from "../../assets/svgs/facelock.svg";
import FaceIdSvg from "../../assets/svgs/face-id.svg";

import Button from "../../components/common/Button";
import {
  getAuthDetails,
  getLocalAuthStatus,
  setAuthDetails,
  validatePin,
} from "../../services/storage";
import { useRefreshAuthTokenMutation } from "../../store/services/authentication";
import { logout } from "../../store/features/auth/actions";
import { getErrorString } from "../../services/helpers";
import { authenticate } from "../../store/features/auth";
import RequestHandler from "../../components/common/RequestHandler";

const Resume = () => {
  const theme = useAppTheme();
  const [otp, setOtp] = useState("");
  const [refreshAuthToken, query] = useRefreshAuthTokenMutation();
  const [enrolledHardwardware, setEnrolledHardwardware] =
    useState<LocalAuthentication.SecurityLevel>();
  const dispatch = useAppDispatch();
  const logoutUser = () => dispatch(logout());
  const [hasLocalAuth, setHasLocalAuth] = useState(false);
  const handleAuthPass = async () => {
    try {
      const authDetails = await getAuthDetails();
      if (!authDetails) {
        throw new Error("Something went wrong!");
      }
      const data = await refreshAuthToken({
        refreshToken: authDetails.refreshToken,
        expiredToken: authDetails.token,
      }).unwrap();
      await setAuthDetails({
        ...authDetails,
        tokenExpiry: new Date(data.tokenExpiry).toISOString(),
        token: data.authToken,
      });
      dispatch(
        authenticate({
          id: data.user.id,
          primaryIdentifier: data.user.primaryIdentifier,
          refreshToken: authDetails.refreshToken,
          refreshTokenExpiry: authDetails.refreshTokenExpiry,
          registrationCompleted: data.user.registrationCompleted,
          token: data.authToken,
          tokenExpiry: new Date(data.tokenExpiry).toISOString(),
        })
      );
    } catch (error) {
      console.log(JSON.stringify(error));
      // Alert.alert("Error", getErrorString(error as any), [
      //   { isPreferred: true, onPress: handleAuthPass, text: "Retry" },
      //   {
      //     text: "Cancel",
      //     style: "destructive",
      //   },
      //   {
      //     onPress: logoutUser,
      //     text: "Log out",
      //     style: "destructive",
      //   },
      // ]);
    }
  };

  useEffect(() => {
    (async () => {
      const hardwareExists = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const localAuthEnable = await getLocalAuthStatus();
      setHasLocalAuth(hardwareExists && isEnrolled && localAuthEnable);
      if (hardwareExists && isEnrolled) {
        const hardware =
          await LocalAuthentication.supportedAuthenticationTypesAsync();
        setEnrolledHardwardware(hardware[0] as any);
      }
    })();
  }, []);
  const startLocalAuth = useCallback(async () => {
    try {
      if (hasLocalAuth) {
        const result = await LocalAuthentication.authenticateAsync({
          cancelLabel: "Use PIN",
          fallbackLabel: "Use PIN",
        });
        if (result.success) {
          await handleAuthPass();
        }
      }
    } catch (error) {}
  }, [hasLocalAuth]);

  useEffect(() => {
    startLocalAuth();
  }, [startLocalAuth]);

  const handleSubmitPin = async (code?: string) => {
    try {
      const value = code || otp;
      const isValidCode = await validatePin(value);
      if (!isValidCode) {
        throw new Error("Invalid Pin");
      }
      await handleAuthPass();
    } catch (error) {
      Alert.alert("Warning", getErrorString(error as any));
    }
  };
  return (
    <PageLayout
      // gradientBackground
      backIconName="logout"
      onBackPressed={logoutUser}
    >
      <KeyboardAwareScrollView contentContainerStyle={styles.wrapper}>
        <View style={styles.gradientImage}>
          {enrolledHardwardware === 1 ? <AuthPINIcon /> : <AuthPINFaceIdIcon />}
        </View>
        <View style={styles.container}>
          <Title style={styles.header}>Welcome back</Title>
          <Text
            style={[styles.subtitle, { color: theme.colors.defaults.grayFour }]}
          >
            Continue with Face ID, Fingerprint, or PIN.{" "}
          </Text>
          <View style={styles.input}>
            <Text style={[styles.subtitle, { marginRight: "auto" }]}>
              Enter PIN to continue
            </Text>
            <OTPInput
              onOTPReady={(code) => handleSubmitPin(code)}
              onTextChange={(text) => setOtp(text)}
              secureTextEntry
            />
          </View>
        </View>
        {hasLocalAuth && (
          <View style={styles.fingerSection}>
            <TouchableOpacity onPress={startLocalAuth}>
              {enrolledHardwardware === 1 ? (
                <MaterialCommunityIcons color={theme.colors.primary} name={"fingerprint"} size={60} />
              ) : (
                <FaceIdSvg />
              )}
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAwareScrollView>
      <RequestHandler
        show={query.isError || query.isLoading || query.isSuccess}
        isLoading={query.isLoading}
        isError={query.isError}
        isSuccess={query.isSuccess}
        onDismiss={query.reset}
        isLoadingText="processing"
        isErrorText={getErrorString(query.error)}
        isSuccessText="Done"
      />
    </PageLayout>
  );
};

export default Resume;

const styles = StyleSheet.create({
  submitBtn: {
    alignSelf: "center",
    marginTop: "10%",
  },
  gradientImage: {
    width: 259,
    height: 259,
    borderRadius: 360,
    overflow: "hidden",
    alignSelf: "center",
  },

  wrapper: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    position: "relative",
  },
  input: {
    // width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    alignItems: "center",
    marginTop: "5%",
  },

  header: {
    fontFamily: "Primary-SemiBold",
    fontWeight: "600",
    fontSize: 25,
  },
  subtitle: {
    fontFamily: "Primary-Regular",
    fontWeight: "500",
    fontSize: 15,
    textAlign: "center",
  },
  container: {
    borderRadius: 30,
    paddingHorizontal: "10%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  fingerSection: {
    alignSelf: "center",
    marginTop: "20%",
  },
});
