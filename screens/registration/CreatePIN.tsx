import { Alert, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { FC, useState } from "react";
import PageLayout from "../../components/layouts/PageLayout";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RegistrationStackParamList } from "../../routes/registration";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAppTheme } from "../../hooks";
import Button from "../../components/common/Button";
import { Text, Title } from "react-native-paper";
import CreatePINIcon from "../../assets/svgs/createpin.svg";
import * as LocalAuthentication from "expo-local-authentication";
import OTPInput from "../../components/common/OTPInput";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
import { storePin } from "../../services/storage";
import {
  useComparePINMutation,
  useCurrentUserQuery,
  useUpdateUserProfileMutation,
} from "../../store/services/authentication";
import RequestHandler from "../../components/common/RequestHandler";
import { getErrorString } from "../../services/helpers";
import LoadingPage from "../../components/layouts/LoadingPage";

type IProps = NativeStackScreenProps<RegistrationStackParamList, "CreatePIN">;
const CreatePIN = ({ navigation, route }: IProps) => {
  const theme = useAppTheme();
  const { data: user, ...userQuery } = useCurrentUserQuery({});
  const [updateUser, updateQuery] = useUpdateUserProfileMutation();
  const [comparePIN, compareQuery] = useComparePINMutation();

  const [inputValues, setinputValues] = useState({
    pin: "",
    confirmPin: "",
  });
  const handleNext = async (newUser?: boolean) => {
    await storePin(inputValues.pin);
    const hasLocalAuthHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (hasLocalAuthHardware && isEnrolled) {
      navigation.navigate("EnableLocalAuth", { newUser });
    } else {
      if (newUser) {
        navigation.navigate("RegistrationCompleted");
      } else {
        navigation.getParent()?.navigate("App");
      }
    }
  };
  const handleSubmit = async () => {
    if (user?.pin) {
      if (inputValues.pin.length !== 4) {
        Alert.alert("Error", "Invalid pin");
        return;
      }
      try {
        await comparePIN({
          pin: inputValues.pin,
        }).unwrap();
        await handleNext(false);
      } catch (error) {}
    } else {
      if (inputValues.pin !== inputValues.confirmPin) {
        Alert.alert("Error", "PIN are not equal!");
        return;
      }
      try {
        await updateUser({ pin: inputValues.pin }).unwrap();
        await handleNext(true);
      } catch (error) {
        Alert.alert("Error", "Something went wrong");
      }
    }
  };
  if (!user && userQuery.isLoading) {
    return <LoadingPage />;
  }
  return (
    <PageLayout onBackPressed={navigation.goBack}>
      <KeyboardAwareScrollView contentContainerStyle={styles.wrapper}>
        <View style={styles.gradientImage}>
          <CreatePINIcon />
        </View>
        <View style={styles.container}>
          <Title style={styles.header}>
            {user?.pin ? "Enter PIN" : "Create Pin"}
          </Title>
          <Text
            style={[styles.subtitle, { color: theme.colors.defaults.grayFour }]}
          >
            Enter four digits password
          </Text>
          <View style={styles.input}>
            <Text style={[styles.subtitle, { marginRight: "auto" }]}>
              Enter PIN
            </Text>
            <OTPInput
              maximumCodeLength={4}
              onTextChange={(text) =>
                setinputValues((prev) => ({ ...prev, pin: text }))
              }
              secureTextEntry
              autoFocus
            />
          </View>
          {!user?.pin && (
            <View style={styles.input}>
              <Text style={[styles.subtitle, { marginRight: "auto" }]}>
                Confirm PIN
              </Text>
              <OTPInput
                onTextChange={(text) =>
                  setinputValues((prev) => ({ ...prev, confirmPin: text }))
                }
                secureTextEntry
              />
            </View>
          )}
        </View>
        {!user?.pin && (
          <View style={styles.submitBtn}>
            <Button
              disabled={
                inputValues.pin.length < 4 ||
                inputValues.pin !== inputValues.confirmPin
              }
              onPress={() => handleSubmit()}
            >
              Continue
            </Button>
          </View>
        )}
        {user?.pin && (
          <View style={styles.submitBtn}>
            <Button
              disabled={inputValues.pin.length < 4}
              onPress={() => handleSubmit()}
            >
              Continue
            </Button>
          </View>
        )}
        {/* <View style={styles.fingerSection}>
            <TouchableOpacity>
              <MaterialCommunityIcons name="fingerprint" size={60} />
            </TouchableOpacity>
          </View> */}
      </KeyboardAwareScrollView>
      <RequestHandler
        show={
          updateQuery.isError ||
          updateQuery.isLoading ||
          updateQuery.isSuccess ||
          compareQuery.isError ||
          compareQuery.isLoading ||
          compareQuery.isSuccess
        }
        isLoading={updateQuery.isLoading || compareQuery.isLoading}
        isError={updateQuery.isError || compareQuery.isError}
        isSuccess={updateQuery.isSuccess || compareQuery.isSuccess}
        onDismiss={() => {
          updateQuery.reset();
          compareQuery.reset();
        }}
        isLoadingText={
          updateQuery.isLoading ? "creating PIN" : "validating PIN"
        }
        isErrorText={
          updateQuery.error
            ? getErrorString(updateQuery.error)
            : getErrorString(compareQuery.error)
        }
        isSuccessText="success"
      />
    </PageLayout>
  );
};

export default CreatePIN;

const styles = StyleSheet.create({
  submitBtn: {
    alignSelf: "center",
    marginTop: "20%",
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
  },
  input: {
    // width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    // backgroundColor: "black"
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
  container: {
    borderRadius: 30,
    paddingHorizontal: "10%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
});
