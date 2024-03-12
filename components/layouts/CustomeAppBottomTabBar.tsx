import {
  SafeAreaView,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useAppTheme } from "../../hooks";
import { Text,  } from "react-native-paper";

const CustomeAppBottomTabBar = ({
  navigation,
  state,
  descriptors,
}: BottomTabBarProps) => {
  const theme = useAppTheme();
  const currentRoute = state.routeNames[state.index];
  const middleRoute = state.routes.find((route) => route.name === "Scan");
  const middleRouteDescriptor = descriptors[middleRoute?.key || ""];
  const middleIsFocused = currentRoute === "Scan";

  const onPressMiddle = () => {
    const event = navigation.emit({
      type: "tabPress",
      target: middleRoute?.key,
      canPreventDefault: true,
    });

    if (!middleIsFocused && !event.defaultPrevented) {
      // @ts-ignore
      navigation.navigate({ name: middleRoute?.name, merge: true });
    }
  };
  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: theme.colors.backgrounds.primary,
        },
        currentRoute === "Scan" && {
          display: "none",
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // @ts-ignore
            navigation.navigate({ name: route.name, merge: true });
          }
        };
        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };
        if (route.name === "Scan") {
          return <View style={{ flex: 1 }} key={route.name}></View>;
        }
        return (
          <TouchableOpacity
            onLongPress={onLongPress}
            activeOpacity={0.6}
            onPress={onPress}
            style={styles.tab}
            key={route.name}
          >
            <View style={styles.tabInner}>
              {options.tabBarIcon &&
                options.tabBarIcon({
                  focused: isFocused,
                  color: isFocused
                    ? theme.colors.primary
                    : theme.colors.defaults.grayFive,
                  size: 30,
                })}
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isFocused
                      ? theme.colors.primary
                      : theme.colors.defaults.grayFive,
                  },
                ]}
              >
                {route.name}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
      <View
        style={[
          styles.middleTab,
          { backgroundColor: theme.colors.backgrounds.primary },
        ]}
      >
        <TouchableOpacity
          //   onLongPress={onLongPress}
          activeOpacity={0.6}
          onPress={onPressMiddle}
          style={[
            styles.middleTabInner,
            { backgroundColor: theme.colors.primary },
          ]}
        >
          <View style={[styles.tabInner]}>
            {middleRouteDescriptor?.options?.tabBarIcon &&
              middleRouteDescriptor?.options?.tabBarIcon({
                focused: middleIsFocused,
                color: theme.colors.defaults.whiteOne,
                size: 30,
              })}
          </View>
        </TouchableOpacity>

        <Text
          style={[
            styles.tabLabel,
            { marginTop: "10%" },
            {
              color: middleIsFocused
                ? theme.colors.primary
                : theme.colors.defaults.grayFive,
            },
          ]}
        >
          {middleRoute?.name}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default CustomeAppBottomTabBar;

const styles = StyleSheet.create({
  safeArea: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "nowrap",
    paddingHorizontal: "3%",
    paddingVertical: "2%",
    // paddingTop: 10,
    position: "relative",
    justifyContent: "center",
  },
  tab: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    width: "100%",
  },
  tabInner: {
    gap: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: "Primary-Regular",
    lineHeight: 12,
    fontWeight: "500",
  },
  middleTab: {
    position: "absolute",
    top: "-70%",
    padding: 10,
    borderRadius: 360,
    width: 80,
    height: 80,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flex: 1,
  },
  middleTabInner: {
    marginTop: "10%",
    borderRadius: 360,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
