import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { FC } from "react";
import { APIUser } from "../../../api/types";
import { useAppSelector, useAppTheme } from "../../../hooks";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Avatar, List } from "react-native-paper";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AppStackParamasType } from "../../../routes/app-stack";
import { hexToRGB } from "../../../services/helpers";
import { PROFILE_IMAGE_DEFAULT_URI } from "../../../constants/strings";

interface IProps {
  results: Array<APIUser>;
}
const UserSearchResult: FC<IProps> = ({ results }) => {
  const auth = useAppSelector((state) => state.auth);
  const theme = useAppTheme();
  const navigation = useNavigation<NavigationProp<AppStackParamasType>>();
  const renderSearchResult = ({
    item,
    index,
  }: {
    item: APIUser;
    index: number;
  }) => {
    return (
      <Animated.View entering={FadeInDown.duration(200).delay(50 * index)}>
        <List.Item
          onPress={() =>
            navigation.navigate("SendToUser", {
              user: item,
            })
          }
          rippleColor={hexToRGB(theme.colors.secondary, 0.1)}
          left={(prop) => (
            <Avatar.Image
              size={50}
              source={{
                uri: item.profileImageUrl || PROFILE_IMAGE_DEFAULT_URI,
              }}
            />
          )}
          style={[styles.listItem]}
          title={item?.fullName}
          titleStyle={styles.listItemTitle}
          description={"@" + item.username}
          descriptionStyle={[
            styles.listItemDescription,
            { color: theme.colors.primary },
          ]}
        />
      </Animated.View>
    );
  };
  return (
    <FlatList
      data={results.filter((user) => user.id !== auth.id)}
      keyExtractor={(_) => _.id}
      renderItem={renderSearchResult}
    />
  );
};

export default UserSearchResult;

const styles = StyleSheet.create({
  listItem: {
    marginVertical: "3%",
    borderRadius: 10,
  },
  listItemTitle: {
    fontFamily: "Primary-Bold",
    fontSize: 14,
  },
  listItemDescription: {
    fontFamily: "Primary-Bold",
    fontSize: 14,
    marginTop: "1%",
  },
});
