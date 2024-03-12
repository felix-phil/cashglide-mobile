import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomHeader from "../../components/layouts/CustomHeader";
import { useAppTheme } from "../../hooks";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { AppTabParamType } from "../../routes/app-bottom-tab";
import { Appbar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { transactions } from "../../data/tests";
import Transaction from "../../components/screens/history/Transaction";
import { StatusBar } from "expo-status-bar";
import { useGetWalletQuery } from "../../store/services/wallet";

type IProps = BottomTabScreenProps<AppTabParamType, "History">;
const History = ({ navigation }: IProps) => {
  const theme = useAppTheme();
  const { data: wallet } = useGetWalletQuery({});
  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: theme.colors.backgrounds.secondary },
      ]}
    >
      <CustomHeader
        onPressBack={navigation.goBack}
        title={"History"}
        right={
          <Appbar.Action
            onPress={() => {}}
            iconColor={theme.colors.defaults.whiteOne}
            size={28}
            icon={(props) => <Ionicons name="search" {...props} />}
          />
        }
      />
      <View style={styles.lists}>
        <FlatList
          data={wallet?.recentTransaction}
          keyExtractor={(item, idx) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View style={styles.listItem}>
              <Transaction
                key={item.id}
                index={index}
                id={item.id}
                service={item.service as any}
                type={item.type as any}
                amount={item.amount}
                date={item.updatedAt}
                name={item.service}
              />
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default History;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  lists: {
    flex: 1,
    paddingHorizontal: "5%",
  },
  listItem: {
    marginVertical: "2%",
  },
});
