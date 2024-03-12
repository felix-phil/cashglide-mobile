import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { FC } from "react";
import { Appbar, Avatar, Badge, Text } from "react-native-paper";
import { useAppTheme } from "../../../hooks";
import { useCurrentUserQuery } from "../../../store/services/authentication";
import { APIUser } from "../../../api/types";
import { PROFILE_IMAGE_DEFAULT_URI } from "../../../constants/strings";
import { greetByTime } from "../../../services/helpers";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AppTabParamType } from "../../../routes/app-bottom-tab";

const Header: FC<{ user?: APIUser }> = ({ user }) => {
  const theme = useAppTheme();
  const navigation = useNavigation<NavigationProp<AppTabParamType, "Home">>();
  return (
    <Appbar.Header style={{ backgroundColor: "transparent" }}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.getParent()?.navigate("Profile")}
      >
        <View style={styles.left}>
          <Avatar.Image
            size={30}
            style={{ ...styles.avatar, borderColor: theme.colors.secondary }}
            source={{
              uri: user?.profileImageUrl || PROFILE_IMAGE_DEFAULT_URI,
            }}
          />
          <View style={styles.leftInner}>
            <Text style={[styles.name, { color: theme.colors.primary }]}>
              {user?.firstName}
            </Text>
            <Text
              style={[
                styles.greeting,
                { color: theme.colors.defaults.blackOne },
              ]}
            >
              {greetByTime()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <Appbar.Action
        size={30}
        style={{ marginLeft: "auto" }}
        iconColor={theme.colors.primary}
        icon={"bell-outline"}
      />
    </Appbar.Header>
  );
};

export default Header;

const styles = StyleSheet.create({
  left: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    borderWidth: 1,
    padding: 3,
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  leftInner: {
    display: "flex",
    flexDirection: "column",
    // gap: 2
  },
  name: {
    fontFamily: "Primary-SemiBold",
    fontWeight: "600",
    fontSize: 12,
  },
  greeting: {
    fontFamily: "Primary-Regular",
    fontWeight: "400",
    fontSize: 10,
  },
});
