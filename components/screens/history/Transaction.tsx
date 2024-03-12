import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { FC } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import { servicesByType } from "../../../data/services";
import { Text } from "react-native-paper";
import moment from "moment";
import { useAppTheme } from "../../../hooks";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AppStackParamasType } from "../../../routes/app-stack";
import { MainStackParamList } from "../../../routes/main";

interface IProps {
  index: number;
  service: keyof typeof servicesByType;
  name: string;
  date: string;
  amount: number;
  id: string;
  type: "debit" | "credit";
  onPress?: () => void;
}
const Transaction: FC<IProps> = ({onPress, ...props}) => {
  const service = servicesByType[props.service];
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();
  const theme = useAppTheme();
  const typeColor = {
    color:
      props.type === "debit"
        ? theme.colors.defaults.debit
        : theme.colors.defaults.credit,
  };
  if (!onPress) {
    onPress = () => {
      navigation.navigate("TransactionDetail", {
        transactionId: props.id,
      });
    };
  }
  return (
    <Animated.View
      entering={FadeInDown.duration(200).delay(50 * props.index)}
      style={styles.wrapper}
    >
      <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
        <View style={styles.wrapper}>
          <View
            style={[styles.service, { backgroundColor: service?.background }]}
          >
            {service?.Icon}
          </View>
          <View style={styles.titles}>
            <Text
              style={[styles.title, { color: theme.colors.defaults.grayFour }]}
            >
              {service?.title}
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: theme.colors.defaults.grayFour },
              ]}
            >
              {moment(props.date).format("MMM DD, YYYY")}
            </Text>
          </View>
          <Text style={[styles.type]}>
            <Text style={[styles.amount, typeColor]}>
              {props.type === "debit" ? "-" : "+"}
            </Text>
            <Text style={[styles.amount, styles.currency, typeColor]}>N</Text>
            <Text style={[styles.amount, typeColor]}>
              {props.amount.toLocaleString()}
            </Text>
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default Transaction;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  service: {
    width: 60,
    height: 60,
    borderRadius: 360,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  titles: {
    marginLeft: "3%",
    flexDirection: "column",
    gap: 5,
  },
  title: {
    fontFamily: "Primary-Regular",
    fontSize: 14,
    fontWeight: "400",
  },
  subtitle: {
    fontFamily: "Primary-Regular",
    fontSize: 11,
    fontWeight: "400",
  },
  type: {
    marginLeft: "auto",
    display: "flex",
    flexDirection: "row",
    gap: 3,
  },
  currency: {
    textDecorationLine: "line-through",
    textDecorationStyle: "double",
  },
  amount: {
    fontFamily: "Primary-Medium",
    fontWeight: "500",
    fontSize: 12,
  },
});
