import React, { FC } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnBoarding from "../screens/auth/OnBoarding";
import SignIn from "../screens/auth/SignIn";
import OTPVerification from "../screens/auth/OTPVerification";
import TransactionDetail from "../screens/app-stack/transaction/TransactionDetail";

export type AuthStackParamList = {
  OnBoarding: undefined;
  SignIn: undefined;
  OTPVerification: {
    primaryIdentifier: string;
    reason: "authentication" | "verification"
  };
};
const Stack = createNativeStackNavigator<AuthStackParamList>();
const AuthStack: FC<{ initialRouteName?: keyof AuthStackParamList }> = ({
  initialRouteName = "SignIn",
}) => {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="OnBoarding" component={OnBoarding} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="OTPVerification" component={OTPVerification} />
    </Stack.Navigator>
  );
};

export default AuthStack;
