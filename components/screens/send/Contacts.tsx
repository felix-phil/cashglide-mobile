import { FlatList, StyleSheet, View } from "react-native";
import React, { useCallback, useEffect } from "react";
import { Avatar, List, Text } from "react-native-paper";
import * as Contacts from "expo-contacts";
import { useLazySyncContactsQuery } from "../../../store/services/features";
import { getContactSync, markContactSync } from "../../../services/storage";
import { APIUser } from "../../../api/types";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useAppSelector, useAppTheme } from "../../../hooks";
import { TouchableOpacity } from "react-native-gesture-handler";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AppStackParamasType } from "../../../routes/app-stack";

const MutualContacts = () => {
  const auth = useAppSelector((state) => state.auth);
  const theme = useAppTheme();
  const [syncContacts, query] = useLazySyncContactsQuery();
  const navigation = useNavigation<NavigationProp<AppStackParamasType>>();

  const syncPhoneNumbers = useCallback(async (forceSync?: boolean) => {
    let sync = false;
    const lastSynced = await getContactSync();
    sync =
      forceSync ||
      !lastSynced ||
      new Date().getTime() > new Date(lastSynced).getTime();
    try {
      if (!sync) {
        await syncContacts({}).unwrap();
      } else {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === "granted") {
          const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.PhoneNumbers],
          });
          const phoneNumbers: any[] = [];
          data.forEach((pb) => {
            if (pb.phoneNumbers) {
              const numbers = pb.phoneNumbers.map((n) => n.number);
              phoneNumbers.push(...numbers);
            }
          });
          await syncContacts({
            contacts: phoneNumbers.filter((pn) => phoneNumbers.length >= 8),
            sync: true,
          }).unwrap();
          await markContactSync();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    syncPhoneNumbers(false);
  }, [syncPhoneNumbers]);
  const renderContact = ({ item, index }: { item: APIUser; index: number }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("SendToUser", { user: item })}
        activeOpacity={0.4}
      >
        <Animated.View
          entering={FadeInDown.duration(200).delay(50 * index)}
          style={[
            styles.listItem,
            { borderBottomColor: theme.colors.defaults.graySix },
          ]}
        >
          <Avatar.Image
            style={styles.listItemAvatar}
            source={{
              uri:
                item.profileImageUrl ||
                "https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png",
            }}
          />
          <View style={styles.listItemDescriptions}>
            <Text style={styles.listItemName}>{item?.firstName}</Text>
            <Text
              style={[
                styles.listItemPhone,
                { color: theme.colors.defaults.grayFive },
              ]}
            >
              {item?.phone}
            </Text>
            <Text
              style={[styles.listItemUsername, { color: theme.colors.primary }]}
            >
              @{item?.username}
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };
  const filteredData = query.data?.filter((data) => data.id !== auth.id);
  return Array.isArray(filteredData) && filteredData?.length > 0 ? (
    <FlatList
      ListHeaderComponent={
        <Text style={[styles.headerTitle]}>
          {query.isLoading ? "Loading" : "Contacts"}
        </Text>
      }
      data={filteredData}
      keyExtractor={(_, idx) => idx.toString()}
      renderItem={renderContact}
    />
  ) : (
    <></>
  );
};

export default MutualContacts;

const styles = StyleSheet.create({
  headerTitle: {
    fontFamily: "Primary-Medium",
    fontSize: 15,
  },
  listItem: {
    display: "flex",
    flexDirection: "row",
    borderBottomWidth: 1,
    marginVertical: "2%",
    paddingTop: "1%",
    paddingBottom: "3%",
  },
  listItemAvatar: {
    borderRadius: 360,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  listItemDescriptions: {
    marginLeft: "3%",
  },
  listItemName: {
    fontFamily: "Primary-Bold",
    fontSize: 12,
  },
  listItemPhone: {
    fontFamily: "Primary-Medium",
    fontSize: 12,
  },
  listItemUsername: {
    fontFamily: "Primary-Medium",
    fontSize: 12,
  },
});
