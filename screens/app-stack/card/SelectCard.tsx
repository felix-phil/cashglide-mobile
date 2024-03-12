import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamasType } from "../../../routes/app-stack";
import CustomHeader from "../../../components/layouts/CustomHeader";
import { useGetCardsQuery } from "../../../store/services/card";
import { useAppTheme } from "../../../hooks";
import { Card as CardType } from "../../../api/types";
import Animated, { FadeInDown } from "react-native-reanimated";
import Card from "../../../components/screens/card/Card";
import { FAB } from "react-native-paper";

type IProps = NativeStackScreenProps<AppStackParamasType, "SelectCard">;
const SelectCard = ({ navigation, route }: IProps) => {
  const amount = route.params.amount;
  const theme = useAppTheme();
  const { data: cards, ...cardQuery } = useGetCardsQuery({});
  if (cardQuery.isLoading || cardQuery.isFetching) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={theme.colors.secondary} size={"large"} />
      </View>
    );
  }
  const renderCard = ({ item, index }: { item: CardType; index: number }) => {
    return (
      <Animated.View entering={FadeInDown.duration(300).delay(50 * index)}>
        <Card
          cardName={item.cardFullName}
          cardExpiry={`${item.cardExpiryMonth}/${item.cardExpiryYear}`}
          cardNumber={item.cardNumber}
          onPress={
            amount
              ? () =>
                  navigation.navigate("CompleteChargeExistingCard", {
                    card: item,
                    amount: amount,
                  })
              : undefined
          }
        />
      </Animated.View>
    );
  };
  return (
    <View style={styles.wrapper}>
      <CustomHeader title="Cards" onPressBack={navigation.goBack} />
      {amount && <View style={styles.subheader}>
        <Text style={[styles.subheaderText, {color: theme.colors.defaults.grayFive}]}>Select or add a card to continue</Text>
      </View>}
      <FlatList
        onRefresh={cardQuery.refetch}
        refreshing={cardQuery.isFetching}
        style={styles.list}
        contentContainerStyle={styles.content}
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
      />

      {amount && (
        <FAB
          icon={"plus"}
          onPress={() => navigation.navigate("NewCard", { amount: amount })}
          color={theme.colors.defaults.whiteOne}
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        />
      )}
    </View>
  );
};

export default SelectCard;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    marginTop: "5%",
  },
  content: {
    gap: 15,
    alignItems: "center",
  },
  fab: {
    bottom: "15%",
    alignSelf: "center",
    borderRadius: 360,
  },
  subheader: {
    alignSelf: "center",
    marginTop: "10%"
  },
  subheaderText: {
    fontFamily: "Primary-SemiBold",
    fontSize: 16
  }
});
