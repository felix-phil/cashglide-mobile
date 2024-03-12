import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { FC } from "react";
import { APIUser } from "../../../api/types";
import { useAppTheme } from "../../../hooks";
import Animated, { FadeInRight } from "react-native-reanimated";
import { Avatar, Text } from "react-native-paper";
import { PROFILE_IMAGE_DEFAULT_URI } from "../../../constants/strings";

interface IProp {
  users?: APIUser[];
  onPressRecent?: (user: APIUser) => void;
}
const Recents: FC<IProp> = ({ users, onPressRecent }) => {
  const theme = useAppTheme();

  const renderUsers = ({ item, index }: { item: APIUser; index: number }) => {
    return (
      <Animated.View key={item.id} style={{ marginRight: 10 }} entering={FadeInRight.delay(50*index)}>
        <TouchableOpacity
          onPress={() => {
            if (onPressRecent) {
              onPressRecent(item);
            }
          }}
          activeOpacity={0.7}
        >
          <View style={styles.wrapper}>
            <Avatar.Image
              // style={styles.image}
              size={50}
              source={{
                uri: item.profileImageUrl || PROFILE_IMAGE_DEFAULT_URI,
              }}
            />
            <Text style={[styles.name, { color: theme.colors.primary }]}>
              {item.username}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };
  return (
    <React.Fragment>
      <Text style={styles.headerText}>Recent</Text>
      <FlatList
        alwaysBounceHorizontal
        data={users}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={renderUsers}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </React.Fragment>
  );
};

export default Recents;

const styles = StyleSheet.create({
  headerText: {
    marginVertical: 10,
    fontSize: 17,
    fontFamily: "Primary-Medium",
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 14,
    fontFamily: "Primary-Medium",
  },
});
