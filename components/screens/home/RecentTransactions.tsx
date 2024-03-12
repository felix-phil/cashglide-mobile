import { FlatList, StyleSheet, View } from "react-native";
import React, { FC } from "react";
import { Text } from "react-native-paper";
import { useAppTheme } from "../../../hooks";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AppTabParamType } from "../../../routes/app-bottom-tab";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { transactions } from "../../../data/tests";
import Transaction from "../history/Transaction";
import { Transaction as TransactionType } from "../../../api/types";

const RecentTransactions: FC<{ transactions?: TransactionType[] }> = ({
  transactions,
}) => {
  const theme = useAppTheme();
  const navigation = useNavigation<NavigationProp<AppTabParamType>>();
  return (
    <View style={styles.wrapper}>
      <View style={styles.head}>
        <Text style={styles.headerTitle}>Recent Transactions</Text>
        <Text
          onPress={() => navigation.navigate("History")}
          style={[styles.headerAction, { color: theme.colors.primary }]}
        >
          See all
        </Text>
      </View>
      <View style={styles.lists}>
        {transactions?.map((transaction, idx) => (
          <Transaction
            key={transaction.id}
            index={idx}
            id={transaction.id}
            service={transaction.service as any}
            type={transaction.type as any}
            amount={transaction.amount}
            date={transaction.updatedAt}
            name={transaction.service}
          />
        ))}
      </View>
    </View>
  );
};

export default RecentTransactions;

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  head: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontFamily: "Primary-Medium",
    fontSize: 17,
    fontWeight: "500",
  },
  headerAction: {
    fontFamily: "Primary-SemiBold",
    fontSize: 14,
    fontWeight: "500",
  },
  lists: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: "5%",
  },
});
