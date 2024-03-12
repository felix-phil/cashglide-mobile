import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { IconButton, Title } from "react-native-paper";
import * as LocalAuthentication from "expo-local-authentication";
import { useAppTheme } from "../../hooks";
import FaceIdSvg from "../../assets/svgs/face-id.svg";
import { getLocalAuthStatus, getPlainPin } from "../../services/storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../constants/colors";

interface IProp {
  visible?: boolean;
  onAuthPassed?: (pin: string) => void;
  handleClose?: () => void;
  maxInputLength?: number;
}
const numpadData = (hardware: number) => [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
  { label: "6", value: 6 },
  { label: "7", value: 7 },
  { label: "8", value: 8 },
  { label: "9", value: 9 },
  {
    label: hardware === 1 ? (
      <MaterialCommunityIcons
        color={colors.primary}
        name={hardware === 1 ? "fingerprint" : "face-recognition"}
        size={30}
      />
    ): <FaceIdSvg height={30} width={30} style={{ marginVertical: "auto" }} />,
    value: "action",
  },
  { label: "0", value: 0 },
  {
    label: (
      <MaterialCommunityIcons
        key={10}
        name="backspace"
        color={colors.default.blackOne}
        size={25}
      />
    ),
    value: "backspace",
  },
];
interface NumberTextProps {
  children: ReactNode;
}
const NumberText: FC<NumberTextProps> = ({ children }) => {
  const theme = useAppTheme();
  return (
    <Text
      adjustsFontSizeToFit
      style={[styles.textLabel, { color: theme.colors.defaults.blackOne }]}
    >
      {children}
    </Text>
  );
};
const AuthRequest: FC<IProp> = ({
  visible,
  maxInputLength = 4,
  handleClose,
  onAuthPassed,
}) => {
  const theme = useAppTheme();
  const [enrolledHardwardware, setEnrolledHardwardware] =
    useState<LocalAuthentication.SecurityLevel>();
  const [hasLocalAuth, setHasLocalAuth] = useState(false);
  const [input, setInput] = useState<string[]>([]);

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
  useEffect(() => {
    if (input.length === maxInputLength) {
      if (onAuthPassed) onAuthPassed(input.join(""));
      setInput([]);
      if (handleClose) handleClose();
    }
  }, [input]);

  const handleClosePress = () => {
    Alert.alert("", "Do you want to cancel this payment?", [
      {
        style: "cancel",
        text: "Cancel",
        onPress: handleClose,
      },
      {
        isPreferred: true,
        text: "Continue",
        style: "default",
      },
    ]);
  };
  const handleLocalAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        cancelLabel: "Use PIN",
        promptMessage: "Use biometric to complete transaction",
        // disableDeviceFallback: true,
      });
      const plainPin = await getPlainPin();
      if (!plainPin || !result.success) {
        Alert.alert(
          "Something went wrong",
          "cannot authenticate using biometric"
        );
        return;
      }
      setInput(plainPin.split(""));
    } catch (error) {}
  };
  const handleNumberPress = (value: string | number) => {
    const prev = [...input];
    if (value === "backspace") {
      if (input.length > 0) {
        prev.pop();
        setInput(prev);
      }
    } else if (value === "action") {
      handleLocalAuth();
    } else {
      if (input.length < maxInputLength) {
        prev.push(String(value));
        setInput(prev);
      }
    }
  };
  const dots = Array.from({ length: maxInputLength });

  return (
    <Modal visible={visible} onRequestClose={handleClose} animationType="slide">
      <SafeAreaView
        style={[
          styles.safeArea,
          { backgroundColor: theme.colors.backgrounds.secondary },
        ]}
      >
        <ScrollView>
          <View style={styles.wrapper}>
            <IconButton
              onPress={handleClosePress}
              style={styles.close}
              icon={"close"}
              size={30}
            />
            <Title style={styles.title}>Enter your PIN</Title>
            <TouchableOpacity style={styles.localAuth}>
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
            <Text
              style={[
                styles.subtitle,
                {
                  color: theme.colors.defaults.grayFive,
                  width: "50%",
                  marginTop: "5%",
                },
              ]}
            >
              Enter your pin or confirm with{" "}
              {enrolledHardwardware === 1 ? "Fingerprint" : "Face ID"}
            </Text>
            <View style={styles.dots}>
              {dots.map((dot, index) => {
                const active = Boolean(input[index]);
                return (
                  <View
                    style={[
                      styles.dot,
                      {
                        borderColor: theme.colors.primary,
                        backgroundColor: active
                          ? theme.colors.primary
                          : theme.colors.defaults.whiteOne,
                      },
                    ]}
                    key={index}
                  />
                );
              })}
            </View>
            <Text
              onPress={() => {}}
              style={[
                styles.subtitle,
                {
                  color: theme.colors.defaults.grayFive,
                  width: "50%",
                  marginTop: "10%",
                },
              ]}
            >
              Forgot PIN?
            </Text>
            <View style={styles.numbers}>
              {numpadData(enrolledHardwardware as number).map((data, index) => (
                <TouchableOpacity
                  onPress={() => handleNumberPress(data.value)}
                  key={index}
                  style={[
                    styles.number,
                    { backgroundColor: theme.colors.defaults.graySeven },
                  ]}
                >
                  <NumberText>{data.label}</NumberText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default AuthRequest;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  title: {
    textAlign: "center",
    marginTop: "5%",
    fontFamily: "Primary-SemiBold",
    fontSize: 22,
  },
  localAuth: {
    alignSelf: "center",
    marginTop: "10%",
  },
  close: {
    margin: "3%",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Primary-Medium",
    textAlign: "center",
    alignSelf: "center",
  },
  dots: {
    alignSelf: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "10%",
    gap: 10,
  },
  dot: {
    height: 15,
    width: 15,
    borderWidth: 1,
    borderRadius: 360,
  },
  numbers: {
    flex: 1,
    marginTop: "10%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: "5%",
    flexWrap: "wrap",
  },
  textLabel: {
    fontFamily: "Primary-SemiBold",
    fontSize: 28,
  },
  number: {
    // flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: "3%",
    flexBasis: "30%",
    paddingVertical: "4%",
    paddingHorizontal: "1%",
    borderRadius: 10,
  },
});
