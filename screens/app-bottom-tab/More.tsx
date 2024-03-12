import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomHeader from "../../components/layouts/CustomHeader";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { AppTabParamType } from "../../routes/app-bottom-tab";
import { useCurrentUserQuery } from "../../store/services/authentication";
import { Avatar, List } from "react-native-paper";
import { useAppDispatch, useAppTheme } from "../../hooks";
import { PROFILE_IMAGE_DEFAULT_URI } from "../../constants/strings";
import Animated, {
  FadeIn,
  FadeInDown,
  SlideInLeft,
} from "react-native-reanimated";
import { useIsFocused } from "@react-navigation/native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import Button from "../../components/common/Button";
import { logout } from "../../store/features/auth/actions";

type IProp = BottomTabScreenProps<AppTabParamType, "More">;
const More = ({ navigation }: IProp) => {
  const theme = useAppTheme();
  const isFocused = useIsFocused();
  const dispatch = useAppDispatch();
  const { data: currentUser, ...userQuery } = useCurrentUserQuery({});
  const initiateLogout = () => {
    Alert.alert("", "Logout?", [
      {
        text: "Cancel",
        isPreferred: true,
        style: "cancel",
      },
      {
        text: "Continue",
        style: "destructive",
        onPress: () => dispatch(logout()),
      },
    ]);
  };
  return (
    <View
      key={String(isFocused)}
      style={[
        styles.wrapper,
        { backgroundColor: theme.colors.backgrounds.secondary },
      ]}
    >
      <CustomHeader onPressBack={navigation.goBack} title="More" />
      <Animated.View entering={FadeIn.duration(500)}>
        <List.Item
          left={(prop) => (
            <Avatar.Image
              size={60}
              source={{
                uri: currentUser?.profileImageUrl || PROFILE_IMAGE_DEFAULT_URI,
              }}
            />
          )}
          onPress={() => navigation.getParent()?.navigate("Profile")}
          right={(prop) => (
            <List.Icon
              {...prop}
              color={theme.colors.defaults.whiteOne}
              icon={"chevron-right"}
            />
          )}
          title={currentUser?.fullName}
          titleNumberOfLines={1}
          titleEllipsizeMode="tail"
          description="Profile Details"
          titleStyle={[
            styles.bottomHeaderTitle,
            { color: theme.colors.defaults.whiteOne },
          ]}
          descriptionStyle={[
            styles.bottomHeaderDescription,
            { color: theme.colors.defaults.whiteOne },
          ]}
          style={[
            styles.bottomHeader,
            { backgroundColor: theme.colors.primary },
          ]}
        />
      </Animated.View>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contents}
      >
        <List.Item
          left={(prop) => (
            <List.Icon color="#0F0" style={styles.listIcon} icon={"cog"} />
          )}
          onPress={() => {}}
          right={(prop) => (
            <List.Icon
              {...prop}
              color={theme.colors.primary}
              icon={"chevron-right"}
            />
          )}
          title={"Settings"}
          titleNumberOfLines={1}
          titleEllipsizeMode="tail"
          titleStyle={[styles.title, { color: theme.colors.defaults.blackOne }]}
          style={[
            styles.bottomHeader,
            { backgroundColor: theme.colors.defaults.whiteOne },
          ]}
        />
        <List.Item
          left={(prop) => (
            <List.Icon
              color="#F00"
              style={styles.listIcon}
              icon={(prop) => <Ionicons {...prop} name="shield-checkmark" />}
            />
          )}
          onPress={() => {}}
          right={(prop) => (
            <List.Icon
              {...prop}
              color={theme.colors.primary}
              icon={"chevron-right"}
            />
          )}
          title={"Security"}
          titleNumberOfLines={1}
          titleEllipsizeMode="tail"
          titleStyle={[styles.title, { color: theme.colors.defaults.blackOne }]}
          style={[
            styles.bottomHeader,
            { backgroundColor: theme.colors.defaults.whiteOne },
          ]}
        />
        <List.Item
          left={(prop) => (
            <List.Icon
              color="#000"
              style={styles.listIcon}
              icon={(prop) => <MaterialIcons {...prop} name="request-quote" />}
            />
          )}
          onPress={() => {}}
          right={(prop) => (
            <List.Icon
              {...prop}
              color={theme.colors.primary}
              icon={"chevron-right"}
            />
          )}
          title={"Account Statement"}
          titleNumberOfLines={1}
          titleEllipsizeMode="tail"
          titleStyle={[styles.title, { color: theme.colors.defaults.blackOne }]}
          style={[
            styles.bottomHeader,
            { backgroundColor: theme.colors.defaults.whiteOne },
          ]}
        />
        <List.Item
          left={(prop) => (
            <List.Icon
              color={theme.colors.primary}
              style={styles.listIcon}
              icon={"note-check"}
            />
          )}
          onPress={() => {}}
          right={(prop) => (
            <List.Icon
              {...prop}
              color={theme.colors.primary}
              icon={"chevron-right"}
            />
          )}
          title={"Terms of Service"}
          titleNumberOfLines={1}
          titleEllipsizeMode="tail"
          titleStyle={[styles.title, { color: theme.colors.defaults.blackOne }]}
          style={[
            styles.bottomHeader,
            { backgroundColor: theme.colors.defaults.whiteOne },
          ]}
        />
        <List.Item
          left={(prop) => (
            <List.Icon
              color={"#ff0000"}
              style={styles.listIcon}
              icon={"information"}
            />
          )}
          onPress={() => {}}
          right={(prop) => (
            <List.Icon
              {...prop}
              color={theme.colors.primary}
              icon={"chevron-right"}
            />
          )}
          title={"About"}
          titleNumberOfLines={1}
          titleEllipsizeMode="tail"
          titleStyle={[styles.title, { color: theme.colors.defaults.blackOne }]}
          style={[
            styles.bottomHeader,
            { backgroundColor: theme.colors.defaults.whiteOne },
          ]}
        />
        <List.Item
          left={(prop) => (
            <List.Icon
              color={"#0F0"}
              style={styles.listIcon}
              icon={(prop) => <Ionicons {...prop} name="chatbubble-sharp" />}
            />
          )}
          onPress={() => {}}
          right={(prop) => (
            <List.Icon
              {...prop}
              color={theme.colors.primary}
              icon={"chevron-right"}
            />
          )}
          title={"Feedback"}
          titleNumberOfLines={1}
          titleEllipsizeMode="tail"
          titleStyle={[styles.title, { color: theme.colors.defaults.blackOne }]}
          style={[
            styles.bottomHeader,
            { backgroundColor: theme.colors.defaults.whiteOne },
          ]}
        />
        <List.Item
          left={(prop) => (
            <List.Icon
              color={"#000"}
              style={styles.listIcon}
              icon={"help-circle-outline"}
            />
          )}
          onPress={() => {}}
          right={(prop) => (
            <List.Icon
              {...prop}
              color={theme.colors.primary}
              icon={"chevron-right"}
            />
          )}
          title={"Help and Support"}
          titleNumberOfLines={1}
          titleEllipsizeMode="tail"
          titleStyle={[styles.title, { color: theme.colors.defaults.blackOne }]}
          style={[
            styles.bottomHeader,
            { backgroundColor: theme.colors.defaults.whiteOne },
          ]}
        />

        <View style={styles.btn}>
          <Button onPress={initiateLogout} backgroundColor={theme.colors.error}>
            Sign Out
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default More;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  bottomHeader: {
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    paddingHorizontal: 15,
  },
  bottomHeaderTitle: {
    fontFamily: "Primary-SemiBold",
    fontSize: 20,
  },
  bottomHeaderDescription: {
    fontSize: 12,
    fontFamily: "Primary-SemiBold",
  },
  content: {
    marginTop: 10,
    paddingHorizontal: 19,
    gap: 10,
  },
  contents: {
    gap: 15,
  },
  listIcon: {
    width: 21,
    height: 21,
  },
  title: {
    fontFamily: "Primary-Medium",
    fontSize: 17,
  },
  btn: {
    alignSelf: "center",
    marginTop: "5%",
  },
});
