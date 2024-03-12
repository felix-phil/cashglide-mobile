import React, { FC } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegistrationStack, { RegistrationStackParamList } from "./registration";
import { useAppSelector } from "../hooks";
import AppStack from "./app-stack";
import TransactionDetail from "../screens/app-stack/transaction/TransactionDetail";

export type MainStackParamList = {
  Registration: {
    initialRouteName?: keyof RegistrationStackParamList;
  };
  App: undefined;
  TransactionDetail: {
    transactionId: string;
  }
};
const Stack = createNativeStackNavigator<MainStackParamList>();
interface IProps {
  initialRouteName?: keyof MainStackParamList;
}
const MainStack: FC<IProps> = ({ initialRouteName = "App" }) => {
  const auth = useAppSelector((state) => state.auth);
  // console.log(auth)
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="Registration"
        initialParams={{
          initialRouteName: auth.registrationCompleted
            ? "CreatePIN"
            : "Personal",
        }}
        component={RegistrationStack}
      />
      <Stack.Screen name="App" component={AppStack} />
      <Stack.Screen name="TransactionDetail" component={TransactionDetail} />
    </Stack.Navigator>
  );
};

export default MainStack;
