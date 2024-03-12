import { Image, SafeAreaView, StyleSheet, View } from "react-native";
import React, { useCallback, useEffect } from "react";
import { ActivityIndicator, Text } from "react-native-paper";
import { useAppTheme } from "../../hooks";
import { useAppDispatch } from "../../hooks";
import { setOnboard, setPinExists } from "../../store/features/auth/actions";
import { checkPinExist, getAuthDetails } from "../../services/storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PreAuthStackParamList } from "../../routes/preauth";
import { logout } from "../../store/features/auth/actions";

type IProps = NativeStackScreenProps<PreAuthStackParamList, "Initial">;
const Initial = ({ navigation }: IProps) => {
  const theme = useAppTheme();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setOnboard());
    dispatch(setPinExists());
  }, []);
  const determinAuthState = useCallback(async () => {
    const authDetails = await getAuthDetails();
    const pinIsSet = await checkPinExist();
    if (
      authDetails &&
      pinIsSet &&
      new Date(authDetails.refreshTokenExpiry).getTime() > new Date().getTime()
    ) {
      navigation.navigate("Resume");
    } else {
      dispatch(logout());
    }
  }, []);
  useEffect(() => {
    determinAuthState();
  }, [determinAuthState]);

  return (
    <SafeAreaView style={styles.wrapper}>
      <Image
        resizeMode="contain"
        style={styles.image}
        source={require("../../assets/images/icon.png")}
      />
      <View style={styles.bottom}>
        <ActivityIndicator color={theme.colors.secondary} size={60} />
        <Text style={styles.text}>Secure your finances with ease</Text>
      </View>
    </SafeAreaView>
  );
};

export default Initial;

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    marginTop: "auto",
    width: 100,
    height: 100,
  },
  bottom: {
    marginTop: "auto",
    gap: 15,
  },
  text: {
    fontFamily: "Primary-Medium",
    fontWeight: "400",
    fontSize: 12,
  },
});
