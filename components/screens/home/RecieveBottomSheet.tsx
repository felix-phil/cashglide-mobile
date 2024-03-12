import { Alert, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  useBottomSheetDynamicSnapPoints,
  useBottomSheetInternal,
  useBottomSheetModalInternal,
} from "@gorhom/bottom-sheet";
import TextInput from "../../common/TextInput";
import { useAppTheme } from "../../../hooks";
import { IconButton, List, Title } from "react-native-paper";
import BankSvg from "../../../assets/svgs/bank.svg";
import LogoSvg from "../../../assets/svgs/logo.svg";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Animated, { SlideInLeft, SlideInRight } from "react-native-reanimated";
import { AppTabParamType } from "../../../routes/app-bottom-tab";
import { useGetWalletQuery } from "../../../store/services/wallet";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import Button from "../../common/Button";
import {
  formatLocaleStringToNumber,
  formatToNumberLocalString,
} from "../../../services/helpers";
import { AppStackParamasType } from "../../../routes/app-stack";

interface IProp {
  handleClose?: () => void;
  snapToIndex?: (index: any) => void;
}

const RecieveBottomSheet = React.forwardRef<BottomSheetModal, IProp>(
  (props, ref) => {
    const [currentPage, setCurrentPage] = useState<
      "initial" | "bank_account" | "in_receive"
    >("initial");
    const [amount, setAmount] = useState(formatToNumberLocalString("0"));
    const navigation = useNavigation<NavigationProp<AppStackParamasType>>();
    const theme = useAppTheme();
    const { data: wallet, ...query } = useGetWalletQuery({});
    const snapPoints = useMemo(() => ["35%", "37%", "40%"], []);

    const handleCopy = async () => {
      try {
        await Clipboard.setStringAsync(wallet?.account?.accountNumber || "");
        Alert.alert("", "Copied");
      } catch (error) {}
    };
    return (
      <BottomSheetModal
        enablePanDownToClose={false}
        keyboardBehavior="interactive"
        snapPoints={snapPoints}
        ref={ref}
        backdropComponent={(backdropProps) => (
          <BottomSheetBackdrop
            {...backdropProps}
            appearsOnIndex={0}
            enableTouchThrough={false}
            pressBehavior={"none"}
          />
        )}
      >
        <SafeAreaView>
          <Animated.View
            key={currentPage}
            entering={SlideInRight.duration(300)}
            exiting={SlideInLeft.duration(300)}
            style={styles.wrapper}
          >
            {currentPage === "initial" ? (
              <View>
                <View style={styles.actions}>
                  <Text
                    style={[
                      styles.subTitle,
                      {
                        color: theme.colors.defaults.grayFive,
                        marginBottom: "1%",
                      },
                    ]}
                  >
                    Select how you want to receive funds.
                  </Text>
                  <IconButton
                    icon={"close"}
                    onPress={props.handleClose}
                    containerColor={theme.colors.defaults.grayOne}
                    iconColor={theme.colors.defaults.blackOne}
                  />
                </View>

                <List.Item
                  style={[
                    styles.listItem,
                    { backgroundColor: theme.colors.backgrounds.secondary },
                  ]}
                  // rippleColor={theme.colors.backgrounds.secondary}
                  onPress={() => {
                    setCurrentPage("in_receive");
                    props.snapToIndex && props.snapToIndex(1);
                  }}
                  title="Cashglide User"
                  titleStyle={[styles.listItemTitle]}
                  description="Receive from a CashGlide user"
                  descriptionEllipsizeMode="tail"
                  descriptionNumberOfLines={2}
                  descriptionStyle={styles.listItemDescription}
                  left={(prop) => (
                    <View style={styles.leftSvg}>
                      <LogoSvg />
                    </View>
                  )}
                  right={(prop) => (
                    <List.Icon
                      {...prop}
                      style={{}}
                      icon={"chevron-right"}
                      color={theme.colors.primary}
                    />
                  )}
                />
                <List.Item
                  style={[
                    styles.listItem,
                    { backgroundColor: theme.colors.backgrounds.secondary },
                  ]}
                  // rippleColor={theme.colors.backgrounds.secondary}
                  onPress={() => {
                    setCurrentPage("bank_account");
                    props.snapToIndex && props.snapToIndex(2);
                  }}
                  title="Bank Account"
                  titleStyle={[styles.listItemTitle]}
                  description="Deposit fund into your cashglide account number"
                  descriptionEllipsizeMode="tail"
                  descriptionNumberOfLines={2}
                  descriptionStyle={styles.listItemDescription}
                  left={(prop) => (
                    <View style={styles.leftSvg}>
                      <BankSvg />
                    </View>
                  )}
                  right={(prop) => (
                    <List.Icon
                      {...prop}
                      style={{}}
                      icon={"chevron-right"}
                      color={theme.colors.primary}
                    />
                  )}
                />
              </View>
            ) : currentPage === "bank_account" ? (
              <View style={styles.bank}>
                <View style={styles.actions}>
                  <IconButton
                    icon={"chevron-left"}
                    onPress={() => {
                      setCurrentPage("initial");
                      props.snapToIndex && props.snapToIndex(0);
                    }}
                    containerColor={theme.colors.primary}
                    iconColor={theme.colors.defaults.whiteOne}
                  />
                  <IconButton
                    icon={"close"}
                    onPress={props.handleClose}
                    containerColor={theme.colors.defaults.grayOne}
                    iconColor={theme.colors.defaults.blackOne}
                  />
                </View>
                <View style={styles.bankDetails}>
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
            ) : currentPage === "in_receive" ? (
              <View style={styles.bank}>
                <View style={styles.actions}>
                  <IconButton
                    icon={"chevron-left"}
                    onPress={() => {
                      setCurrentPage("initial");
                      props.snapToIndex && props.snapToIndex(0);
                    }}
                    containerColor={theme.colors.primary}
                    iconColor={theme.colors.defaults.whiteOne}
                  />
                  <IconButton
                    icon={"close"}
                    onPress={props.handleClose}
                    containerColor={theme.colors.defaults.grayOne}
                    iconColor={theme.colors.defaults.blackOne}
                  />
                </View>
                <View style={styles.contentContainer}>
                  <BottomSheetTextInput
                    value={amount}
                    onChangeText={(text) =>
                      setAmount(formatToNumberLocalString(text))
                    }
                    keyboardType="decimal-pad"
                    style={[
                      styles.textInputBottomSheet,
                      {
                        borderColor: theme.colors.secondary,
                        color: theme.colors.defaults.blackOne,
                      },
                    ]}
                  />
                  <View style={styles.button}>
                    <Button
                      onPress={() => {
                        navigation.navigate("QRCode", {
                          amount: formatLocaleStringToNumber(amount),
                        });
                        props.handleClose && props.handleClose();
                      }}
                    >
                      Receive
                    </Button>
                  </View>
                </View>
              </View>
            ) : null}
          </Animated.View>
        </SafeAreaView>
      </BottomSheetModal>
    );
  }
);

export default RecieveBottomSheet;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: "5%",
    width: "100%",
  },
  initial: {},
  bank: {
    width: "100%",
  },
  inreceive: {
    width: "100%",
  },
  topCont: {
    width: "90%",
    zIndex: 2,
    position: "absolute",
    borderRadius: 30,
    display: "flex",
    flexDirection: "column",
    paddingVertical: "10%",
    paddingHorizontal: "4%",
  },
  topBox: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    borderWidth: 1,
    paddingHorizontal: "2%",
    paddingVertical: "3%",
    borderRadius: 10,
  },
  title: {
    fontFamily: "Primary-Medium",
    fontSize: 22,
  },
  subTitle: {
    fontFamily: "Primary-Medium",
    fontSize: 13,
  },
  listItemTitle: {
    fontFamily: "Primary-Medium",
    fontSize: 17,
  },
  listItemDescription: {
    fontFamily: "Primary-Medium",
    fontSize: 11,
    marginTop: "2%",
  },
  listItem: {
    marginBottom: "5%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    alignContent: "center",
    overflow: "hidden",
  },

  leftSvg: {
    marginLeft: "5%",
    height: 30,
    width: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  bankDetails: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  inputLabel: {
    fontFamily: "Primary-SemiBold",
    fontSize: 14,
    marginBottom: "1%",
  },
  textInput: {
    fontSize: 14,
  },
  input: {},
  actions: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "5%",
  },
  textInputBottomSheet: {
    alignSelf: "stretch",
    paddingHorizontal: "5%",
    paddingVertical: "2%",
    height: 56,
    borderRadius: 10,
    color: "white",
    fontSize: 18,
    fontFamily: "Primary-Bold",
    textAlign: "left",
    borderWidth: 2,
  },
  contentContainer: {
    // flex: 1,
    alignItems: "center",
  },
  button: {
    marginVertical: "15%",
  },
});
