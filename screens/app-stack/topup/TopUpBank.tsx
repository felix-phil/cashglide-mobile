import { Alert, StyleSheet, View, Share } from "react-native";
import React from "react";
import { useAppTheme } from "../../../hooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamasType } from "../../../routes/app-stack";
import CustomHeader from "../../../components/layouts/CustomHeader";
import TextInput from "../../../components/common/TextInput";
import { useGetWalletQuery } from "../../../store/services/wallet";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import Button from "../../../components/common/Button";

type IProps = NativeStackScreenProps<AppStackParamasType, "TopUpBank">;
const TopUpBank = ({ navigation }: IProps) => {
  const theme = useAppTheme();
  const { data: wallet, ...query } = useGetWalletQuery({});
  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(wallet?.account?.accountNumber || "");
      Alert.alert("", "Copied");
    } catch (error) {}
  };
  const handleShare = async () => {
    try {
      const details = `
        Bank: ${wallet?.account?.accountBank}
        Account Number: ${wallet?.account?.accountNumber}
        Account Name: ${wallet?.account?.accountName}
      `;
      await Share.share({ message: details, title: "Account Details" });
    } catch (error) {}
  };
  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: theme.colors.backgrounds.secondary },
      ]}
    >
      <CustomHeader onPressBack={navigation.goBack} title="Bank Transfer" />
      <View style={[styles.curve, { backgroundColor: theme.colors.primary }]}>
        <View
          style={[
            styles.topCont,
            { backgroundColor: theme.colors.backgrounds.primary },
          ]}
        >
          <View style={styles.input}>
            <TextInput
              value={wallet?.account?.accountBank}
              editable={false}
              wrapperStyle={{ paddingHorizontal: "5%" }}
              label="Bank"
              style={styles.textInput}
              labelStyle={styles.inputLabel}
            />
          </View>
          <View style={styles.input}>
            <TextInput
              value={wallet?.account?.accountNumber}
              editable={false}
              wrapperStyle={{ paddingLeft: "5%" }}
              label="Account Number"
              style={styles.textInput}
              labelStyle={styles.inputLabel}
              right={
                <Ionicons
                  onPress={handleCopy}
                  color={theme.colors.primary}
                  size={15}
                  name="copy-outline"
                />
              }
            />
          </View>
          <View style={styles.input}>
            <TextInput
              value={wallet?.account?.accountName}
              editable={false}
              wrapperStyle={{ paddingHorizontal: "5%" }}
              label="Account Name"
              style={styles.textInput}
              labelStyle={styles.inputLabel}
            />
          </View>
        </View>
      </View>
      <View style={styles.shareButton}>
        <Button onPress={handleShare}>Share</Button>
      </View>
    </View>
  );
};

export default TopUpBank;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    // paddingHorizontal: "5%",
  },

  curve: {
    height: 80,
    width: "100%",
    position: "relative",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowRadius: 3,
    shadowOpacity: 0.3,
    shadowOffset: { height: 4, width: -2 },
    elevation: 5,
  },
  topCont: {
    width: "90%",
    zIndex: 2,
    position: "absolute",
    borderRadius: 30,
    display: "flex",
    flexDirection: "column",
    paddingVertical: "10%",
    paddingHorizontal: "5%",
    gap: 12,
  },

  input: {},
  inputLabel: {
    fontFamily: "Primary-SemiBold",
    fontSize: 14,
    marginBottom: "1%",
  },
  textInput: {
    fontSize: 14,
  },
  shareButton: {
    alignSelf: "center",
    marginTop: "auto",
    marginBottom: "30%",
  },
});
