import React, { FC } from "react";
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import Personal from "../screens/registration/Personal";
import Contact from "../screens/registration/Contact";
import OTPVerification from "../screens/auth/OTPVerification";
import CreatePIN from "../screens/registration/CreatePIN";
import { MainStackParamList } from "./main";
import EnableLocalAuth from "../screens/registration/EnbleLocalAuth";
import AddBVN from "../screens/registration/AddBVN";
import RegistrationCompleted from "../screens/registration/RegistrationCompleted";

export type RegistrationStackParamList = {
  Personal: undefined;
  Contact: undefined;
  OTPVerification: {
    primaryIdentifier: string;
    reason: "authentication" | "verification";
  };
  CreatePIN: undefined;
  EnableLocalAuth: {
    newUser?: boolean;
  };
  AddBVN: undefined;
  RegistrationCompleted: undefined;
};
const Stack = createNativeStackNavigator<RegistrationStackParamList>();
type IProps = NativeStackScreenProps<MainStackParamList, "Registration">;
const RegistrationStack: FC<IProps> = ({ route }) => {
  return (
    <Stack.Navigator
      initialRouteName={route.params.initialRouteName}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Personal" component={Personal} />
      <Stack.Screen name="Contact" component={Contact} />
      <Stack.Screen name="OTPVerification" component={OTPVerification} />
      <Stack.Screen name="CreatePIN" component={CreatePIN} />
      <Stack.Screen name="EnableLocalAuth" component={EnableLocalAuth} />
      <Stack.Screen name="AddBVN" component={AddBVN} />
      <Stack.Screen
        name="RegistrationCompleted"
        component={RegistrationCompleted}
      />
    </Stack.Navigator>
  );
};

export default RegistrationStack;
