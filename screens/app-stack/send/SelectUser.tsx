import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import CustomHeader from "../../../components/layouts/CustomHeader";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamasType } from "../../../routes/app-stack";
import { useAppTheme } from "../../../hooks";
import TextInput from "../../../components/common/TextInput";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSearchUserMutation } from "../../../store/services/authentication";
import { APIUser } from "../../../api/types";

import UserSearchResult from "../../../components/screens/send/UserSearchResult";
import Recents from "../../../components/screens/send/Recents";
import Contacts from "../../../components/screens/send/Contacts";
import { useRecentInTransferUsersQuery } from "../../../store/services/features";
import LoadingPage from "../../../components/layouts/LoadingPage";

type IProp = NativeStackScreenProps<AppStackParamasType, "SelectUser">;
const SelectUser = ({ navigation }: IProp) => {
  const theme = useAppTheme();
  const [searchString, setSearchString] = useState("");
  const { data: recentUsers, ...recentQuery } = useRecentInTransferUsersQuery(
    {}
  );
  // const [searchedUser, setsearchedUser] = useState<APIUser[]>([]);
  const [searchUsers, query] = useSearchUserMutation();

  const searchUserCallback = useCallback(async () => {
    let sentString = searchString;
    if (sentString.startsWith("0")) {
      sentString = sentString.slice(1);
    }
    await searchUsers({ identifier: sentString, single: false }).unwrap();
  }, [searchString]);
  useEffect(() => {
    if (searchString.length > 4) {
      searchUserCallback();
    }
  }, [searchUserCallback, searchString]);
  if (recentQuery.isLoading) {
    return <LoadingPage />;
  }
  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: theme.colors.backgrounds.secondary },
      ]}
    >
      <CustomHeader
        backgroundColor="transparent"
        iconColor={theme.colors.defaults.blackOne}
        titleColor={theme.colors.defaults.blackOne}
        title="Send"
        onPressBack={navigation.goBack}
      />
      <View style={styles.content}>
        <TextInput
          left={
            <Ionicons
              size={24}
              color={theme.colors.defaults.grayFive}
              name="search"
            />
          }
          value={searchString}
          onChangeText={setSearchString}
          numberOfLines={1}
          scrollEnabled={false}
          keyboardType="default"
          autoCapitalize="none"
          autoCorrect={false}
          style={{ fontSize: 13 }}
          right={
            query.isLoading ? (
              <ActivityIndicator
                size={"small"}
                color={theme.colors.secondary}
              />
            ) : (
              <MaterialCommunityIcons
                onPress={() => navigation.getParent()?.navigate("Scan")}
                size={24}
                color={theme.colors.defaults.grayFive}
                name="line-scan"
              />
            )
          }
          wrapperStyle={{ height: 50 }}
          placeholder="Search cashglide username or mobile number"
        />
        {Array.isArray(query.data) && query.data?.length > 0 && (
          <View style={styles.section}>
            <UserSearchResult results={query.data} />
          </View>
        )}
        {recentUsers && (
          <View style={[styles.section]}>
            <Recents
              onPressRecent={(user) =>
                navigation.navigate("SendToUser", {
                  user,
                })
              }
              users={recentUsers}
            />
          </View>
        )}
        <View style={styles.section}>
          <Contacts />
        </View>
      </View>
    </View>
  );
};

export default SelectUser;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  content: {
    paddingHorizontal: "5%",
    flex: 1,
  },
  section: {
    marginTop: "3%",
    width: "100%",
  },
});
