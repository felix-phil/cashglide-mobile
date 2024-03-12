import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import PageLayout from "../../components/layouts/PageLayout";
import { Title, Text } from "react-native-paper";
import AuthPINFaceIdIcon from "../../assets/svgs/facelock.svg";
import AuthPINFingerPrintIcon from "../../assets/svgs/authpin.svg";
import FaceIdSvg from "../../assets/svgs/face-id.svg";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAppDispatch, useAppTheme } from "../../hooks";
import Button from "../../components/common/Button";
import { enableLocalAuth } from "../../services/storage";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RegistrationStackParamList } from "../../routes/registration";

type IProps = NativeStackScreenProps<
  RegistrationStackParamList,
  "EnableLocalAuth"
>;

const EnableLocalAuth = ({ navigation, route }: IProps) => {
  const theme = useAppTheme();
  const [otp, setOtp] = useState("");
  const [enrolledHardwardware, setEnrolledHardwardware] =
    useState<LocalAuthentication.SecurityLevel>();
  const dispatch = useAppDispatch();
  const [hasLocalAuth, setHasLocalAuth] = useState(false);
  const isNewUser = route.params.newUser;
  useEffect(() => {
    (async () => {
      const hardwareExists = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      setHasLocalAuth(hardwareExists && isEnrolled);
      const devices =
        await LocalAuthentication.supportedAuthenticationTypesAsync();
      console.log(devices);
      if (hardwareExists && isEnrolled) {
        const hardwares =
          await LocalAuthentication.supportedAuthenticationTypesAsync();
        setEnrolledHardwardware(hardwares[0] as any);
      }
    })();
  }, []);
  const startLocalAuth = async () => {
    try {
      if (hasLocalAuth) {
        const result = await LocalAuthentication.authenticateAsync({
          cancelLabel: "Use PIN",
          fallbackLabel: "Cancel",
          promptMessage: "Use biometrics to log in to CashGlide",
        });
        if (result.success) {
          await enableLocalAuth();
          if (isNewUser) {
            navigation.navigate("RegistrationCompleted");
          } else {
            navigation.getParent()?.navigate("App");
          }
        }
      }
    } catch (error) {}
  };
  return (
    <PageLayout onBackPressed={navigation.goBack}>
      <KeyboardAwareScrollView contentContainerStyle={styles.wrapper}>
        <View style={styles.gradientImage}>
          {enrolledHardwardware === 1 ? (
            <AuthPINFingerPrintIcon />
          ) : (
            <AuthPINFaceIdIcon />
          )}
        </View>
        <View style={styles.container}>
          <Title style={styles.header}>
            {enrolledHardwardware === 1 ? "Fingerprint" : "Face ID"}
          </Title>
          <Text
            style={[styles.subtitle, { color: theme.colors.defaults.grayFour }]}
          >
            {enrolledHardwardware === 1
              ? "Place your finger in fingerprint sensor"
              : "Tap the icon below to enable face ID"}
          </Text>
        </View>

        <View style={styles.fingerSection}>
          <TouchableOpacity onPress={startLocalAuth}>
            {enrolledHardwardware === 1 ? (
              <MaterialCommunityIcons
                color={theme.colors.primary}
                name={"fingerprint"}
                size={60}
              />
            ) : (
              <FaceIdSvg />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.submitBtn}>
          <Button onPress={startLocalAuth}>Enable</Button>
        </View>
        <View style={{ alignSelf: "center", marginTop: "5%" }}>
          <Button
            color={theme.colors.primary}
            mode="outlined"
            style={{
              backgroundColor: theme.colors.defaults.whiteOne,
              borderRadius: 20,
            }}
            onPress={() => navigation.getParent()?.navigate("App")}
          >
            Skip
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </PageLayout>
  );
};

export default EnableLocalAuth;

const styles = StyleSheet.create({
  submitBtn: {
    alignSelf: "center",
    marginTop: "15%",
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
