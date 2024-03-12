import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppBottomTab from "./app-bottom-tab";
import TopUpCard from "../screens/app-stack/topup/TopUpCard";
import { APIUser, Bank, Card } from "../api/types";
import SelectUser from "../screens/app-stack/send/SelectUser";
import SelectBank from "../screens/app-stack/send/SelectBank";
import SendToUser from "../screens/app-stack/send/SendToUser";
import SendToBank from "../screens/app-stack/send/SendToBank";
import TopUpOptions from "../screens/app-stack/topup/TopUpOptions";
import QRCode from "../screens/app-stack/topup/TopUpQRCode";
import TopUpBank from "../screens/app-stack/topup/TopUpBank";
import SelectCard from "../screens/app-stack/card/SelectCard";
import NewCard from "../screens/app-stack/card/NewCard";
import CompleteCardWeb from "../screens/app-stack/card/CompleteCardWeb";
import CardCompleteAuthFields from "../screens/app-stack/card/CardCompleteAuthFields";
import TransactionCompleted from "../screens/app-stack/transaction/TransactionCompleted";
import CompleteCardOTP from "../screens/app-stack/card/CompletedCardOTP";
import TransactionFailed from "../screens/app-stack/transaction/TransactionFailed";
import SendReview from "../screens/app-stack/send/SendReview";
import Send from "../screens/app-stack/send/SendOptions";
import CompleteChargeExistingCard from "../screens/app-stack/card/CompleteChargeExistingCard";
import Profile from "../screens/app-stack/settings/Profile";
import EditProfile from "../screens/app-stack/settings/EditProfile";
import SendReviewBank from "../screens/app-stack/send/SendReviewBank";
import TransactionDetail from "../screens/app-stack/transaction/TransactionDetail";

export type AppStackParamasType = {
  AppBottomTab: undefined;
  TopUp: undefined;
  TopUpCard: undefined;
  QRCode: { amount: number } | undefined;
  TopUpBank: undefined;

  Send: undefined;
  SelectUser: undefined;
  SelectBank: undefined;
  SendToUser: {
    user: APIUser;
    amount?: number;
  };
  SendToBank: {
    amount?: number;
    accountName: string;
    accountNumber: string;
    bank: Bank;
  };
  SelectCard: {
    amount?: number;
  };
  NewCard: {
    amount: number;
  };
  CompleteChargeExistingCard: {
    card: Card;
    amount: number;
  };

  CompleteCardWeb: {
    url: string;
  };
  CardCompleteAuthFields: {
    cardDetails: any;
    amount: number;
    authMode: string;
    authFields: string[];
  };
  CompleteCardOTP: {
    cardId: string;
  };
  TransactionCompleted: {
    transactionId?: string;
  };
  TransactionFailed: {
    transactionId?: string;
  };
  SendReview: {
    to: APIUser;
    amount: number;
    narration?: string;
  };
  SendReviewBank: {
    to: {
      accountNumber: string;
      accountName: string;
      bank: Bank;
    };
    amount: number;
    fee: number;
    narration?: string;
  };
  Profile: undefined;
  EditProfile: undefined;
};
const Stack = createNativeStackNavigator<AppStackParamasType>();
const AppStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="AppBottomTab"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        animationDuration: 500,
      }}
    >
      <Stack.Screen name="AppBottomTab" component={AppBottomTab} />
      <Stack.Group>
        <Stack.Screen name="Send" component={Send} />
        <Stack.Screen name="SelectUser" component={SelectUser} />
        <Stack.Screen name="SelectBank" component={SelectBank} />
        <Stack.Screen name="SendToUser" component={SendToUser} />
        <Stack.Screen name="SendToBank" component={SendToBank} />
        <Stack.Screen name="SendReview" component={SendReview} />
        <Stack.Screen name="SendReviewBank" component={SendReviewBank} />
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen name="TopUp" component={TopUpOptions} />
        <Stack.Screen name="TopUpCard" component={TopUpCard} />
        <Stack.Screen name="QRCode" component={QRCode} />
        <Stack.Screen name="TopUpBank" component={TopUpBank} />
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen name="SelectCard" component={SelectCard} />
        <Stack.Screen name="NewCard" component={NewCard} />
        <Stack.Screen name="CompleteCardWeb" component={CompleteCardWeb} />
        <Stack.Screen name="CompleteCardOTP" component={CompleteCardOTP} />
        <Stack.Screen
          name="CompleteChargeExistingCard"
          component={CompleteChargeExistingCard}
        />
        <Stack.Screen
          name="CardCompleteAuthFields"
          component={CardCompleteAuthFields}
        />
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen
          name="TransactionCompleted"
          component={TransactionCompleted}
        />
        <Stack.Screen name="TransactionFailed" component={TransactionFailed} />
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
      </Stack.Group>
    </Stack.Navigator>
  );
};
export default AppStack;
