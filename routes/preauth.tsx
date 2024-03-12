import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnBoarding from "../screens/auth/OnBoarding";
import Initial from "../screens/preauth/Initial";
import Resume from "../screens/preauth/Resume";
import TransactionDetail from "../screens/app-stack/transaction/TransactionDetail";

export type PreAuthStackParamList = {
  Initial: undefined;
  Resume: undefined;
  // for push notifications
  TransactionDetail: {
    transactionId: string;
  }
};
const Stack = createNativeStackNavigator<PreAuthStackParamList>();
const PreAuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={"Initial"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="Initial"
        component={Initial}
        options={{
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="Resume"
        component={Resume}
        options={{
          animation: "fade",
        }}
      />
      <Stack.Screen name="TransactionDetail" component={TransactionDetail} />

    </Stack.Navigator>
  );
};

export default PreAuthStack;
