import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/app-bottom-tab/Home";
import History from "../screens/app-bottom-tab/History";
import ScanCode from "../screens/app-bottom-tab/ScanCode";
import Cards from "../screens/app-bottom-tab/Cards";
import More from "../screens/app-bottom-tab/More";
import { useAppTheme } from "../hooks";
import { Fontisto, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import CustomeAppBottomTabBar from "../components/layouts/CustomeAppBottomTabBar";

export type AppTabParamType = {
  Home: undefined;
  History: undefined;
  Scan: undefined;
  Cards: undefined;
  More: undefined;
};
const Tab = createBottomTabNavigator<AppTabParamType>();

const AppBottomTab = () => {
  const theme = useAppTheme();
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      backBehavior="history"
      initialRouteName="Home"
      tabBar={(props) => <CustomeAppBottomTabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: (props) => (
            <Fontisto color={props.color} name="home" size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          tabBarIcon: (props) => (
            <MaterialCommunityIcons
              color={props.color}
              name="history"
              size={30}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanCode}
        options={{
          tabBarIcon: (props) => (
            <MaterialCommunityIcons
              color={props.color}
              name="qrcode-scan"
              size={props.size}
            />
          ),
          tabBarLabel: "Scan",
        }}
      />
      <Tab.Screen
        name="Cards"
        component={Cards}
        options={{
          tabBarIcon: (props) => (
            <Ionicons color={props.color} name="card-outline" size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="More"
        component={More}
        options={{
          tabBarIcon: (props) => (
            <Ionicons color={props.color} name="grid-sharp" size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppBottomTab;
