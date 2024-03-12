import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CustomHeader from "../../../components/layouts/CustomHeader";
import { useAppTheme } from "../../../hooks";
import { MainStackParamList } from "../../../routes/main";
import { PreAuthStackParamList } from "../../../routes/preauth";

type IProps = NativeStackScreenProps<MainStackParamList & PreAuthStackParamList, "TransactionDetail">;
const TransactionDetail = ({ navigation, route }: IProps) => {
  const id = route.params.transactionId;
  const theme = useAppTheme();
  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: theme.colors.backgrounds.secondary },
      ]}
    >
      <CustomHeader
        onPressBack={navigation.goBack}
        titleColor={theme.colors.defaults.blackOne}
        iconColor={theme.colors.defaults.blackOne}
        backgroundColor={"transparent"}
        title="Transaction Details"
      />
      <Text>{id}</Text>
    </View>
  );
};

export default TransactionDetail;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
