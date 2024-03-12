import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { FC, ReactNode, useEffect, useState } from "react";
import color from "../../constants/colors";
import { useAppTheme } from "../../hooks";
import {
  Button,
  Text,
  ActivityIndicator,
  IconButton,
} from "react-native-paper";
import { hexToRGB } from "../../services/helpers";
import SucceesIndicator from "../../assets/svgs/success.svg";
import FailureIndicator from "../../assets/svgs/failure.svg";

interface IProps {
  show?: boolean;
  isLoading?: boolean;
  isLoadingText?: string;

  retryText?: ReactNode;
  retryPress?: () => void;
  isError?: boolean;
  isErrorText?: string;
  onDismiss?: () => void;
  isSuccess?: boolean;
  isSuccessText?: string;
}
const RequestHandler: FC<IProps> = ({
  show,
  isLoading = false,
  isLoadingText = "Loading...",
  retryText = "Retry",
  retryPress,
  isError = false,
  isErrorText = "Something went wrong",
  isSuccess = false,
  isSuccessText = "Done",
  onDismiss = () => {},
}) => {
  const theme = useAppTheme();

  useEffect(() => {
    if (isSuccess) {
      setTimeout(onDismiss, 200);
    }
    return () => onDismiss();
  }, [isSuccess]);

  return (
    <Modal visible={show} animationType="fade" transparent style={styles.modal}>
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={styles.overlay}></View>
      </TouchableWithoutFeedback>
      <View style={styles.content}>
        {isLoading && !isError && !isSuccess && (
          <View
            style={[
              styles.centerModal,
              { backgroundColor: theme.colors.backgrounds.primary },
            ]}
          >
            <ActivityIndicator
              animating={true}
              size={60}
              color={theme.colors.secondary}
            />
            <Text style={styles.indicatorText}>{isLoadingText}</Text>
          </View>
        )}
        {isError && !isLoading && !isSuccess && (
          <View
            style={[
              styles.centerModal,
              { backgroundColor: theme.colors.backgrounds.primary },
            ]}
          >
            <FailureIndicator />
            <Text style={styles.indicatorText}>{isErrorText}</Text>
          </View>
        )}
        {isSuccess && !isLoading && !isError && (
          <View
            style={[
              styles.centerModal,
              { backgroundColor: theme.colors.backgrounds.primary },
            ]}
          >
            <SucceesIndicator />
            <Text style={styles.indicatorText}>{isSuccessText}</Text>
          </View>
        )}
        <IconButton
          containerColor={theme.colors.defaults.grayFour}
          accessibilityLabel="Cancel"
          icon={"close"}
          style={{ marginTop: 20 }}
          iconColor={theme.colors.defaults.whiteOne}
          onPress={onDismiss}
        />
      </View>
    </Modal>
  );
};

export default RequestHandler;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: color.default.blackOne,
    opacity: 0.4,
  },
  modal: {},
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: "5%",
  },
  text: {
    fontFamily: "Primary-Bold",
    textAlign: "center",
  },
  textView: {
    marginHorizontal: "10%",
    padding: 10,
    borderRadius: 10,
  },
  centerModal: {
    minHeight: 190,
    borderRadius: 30,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    position: "relative",
    shadowRadius: 3,
    shadowOpacity: 0.3,
    shadowOffset: { height: 4, width: -2 },
    elevation: 5,
    gap: 20,
    width: "100%",
  },
  indicatorText: {
    fontFamily: "Primary-Regular",
    fontSize: 15,
    fontWeight: "500",
    textTransform: "lowercase",
    marginHorizontal: "5%",
    textAlign: "center",
  },
});
{
  /* <Button
  onPress={onDismiss}
  style={{ marginTop: 10 }}
  labelStyle={{ fontFamily: "Font-ExtraBold" }}
  textColor={theme.colors.primary}
  buttonColor={hexToRGB(theme.colors.defaults.primaryLighter, 0.4)}
  mode="contained"
>
  Cancel
</Button>; */
}
