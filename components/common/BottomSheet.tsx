import {
  StyleSheet,
  View,
  Modal,
  ModalProps,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  PanResponder,
  StyleProp,
  ViewStyle,
  BackHandler,
} from "react-native";
import React, { FC, ReactNode, useEffect } from "react";
import { useAppTheme } from "../../hooks";
import Colors from "../../constants/colors";
import { Text } from "react-native-paper";

interface IProps extends ModalProps {
  title?: ReactNode;
  contentWrapperStyle?: StyleProp<ViewStyle>;
  sheetHeight?: number;
}

const BottomSheet: FC<IProps> = ({ children, sheetHeight, ...props }) => {
  const theme = useAppTheme();
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (props.onDismiss) {
          props.onDismiss();
        }
        return false;
      }
    );
    return () => subscription.remove();
  }, []);

  const SCREEN_HEIGHT = Dimensions.get("screen").height;
  const sheetPositionHeight = new Animated.Value(
    sheetHeight ? sheetHeight : SCREEN_HEIGHT / 2
  );
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (event, gestureState) => true,
    onPanResponderMove: (event, gestureState) => {
      if (gestureState.dy) {
        const newHeight = SCREEN_HEIGHT / 2 - gestureState.dy;
        if (
          newHeight < 0.9 * SCREEN_HEIGHT &&
          newHeight > 0.2 * SCREEN_HEIGHT
        ) {
          sheetPositionHeight.setValue(newHeight);
        }
      }
    },
    onPanResponderRelease: (event, gestureState) => {
      if (gestureState.dy) {
        const newHeight = SCREEN_HEIGHT / 2 - gestureState.dy;
        if (newHeight > 0.75 * SCREEN_HEIGHT) {
          sheetPositionHeight.setValue(0.9 * SCREEN_HEIGHT);
        } else if (newHeight < 0.15 * SCREEN_HEIGHT) {
          //   sheetPositionHeight.setValue(0.2 * SCREEN_HEIGHT);
          if (props.onDismiss) {
            props.onDismiss();
          }
        } else {
          sheetPositionHeight.setValue(newHeight);
        }
      }
    },
  });
  return (
    <Modal
      onDismiss={props.onDismiss}
      style={styles.modalStyle}
      transparent
      visible={props.visible}
      animationType="slide"
      onRequestClose={props.onDismiss}
    >
      <TouchableWithoutFeedback onPress={props.onDismiss}>
        <View style={styles.overlay}></View>
      </TouchableWithoutFeedback>
      <Animated.View
        style={[
          styles.sheet,
          { height: sheetPositionHeight },
          { backgroundColor: theme.colors.backgrounds.primary },
        ]}
      >
        <Animated.View {...panResponder.panHandlers} style={{ width: "100%" }}>
          <View style={styles.sheetHeader}>
            <View style={styles.sheetDraggerIcon}></View>
            <Text adjustsFontSizeToFit style={styles.headerTitle}>
              {props.title}
            </Text>
          </View>
        </Animated.View>
        <View style={[styles.contentStyle, props.contentWrapperStyle]}>
          {children}
        </View>
      </Animated.View>
    </Modal>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  sheet: {
    display: "flex",
    marginTop: "auto",
    // width: Dimensions.get("screen").width,
    width: "100%",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    overflow: "hidden",
    elevation: 10,
    flexDirection: "column",
  },
  contentStyle: {
    width: "100%",
    display: "flex",
    paddingHorizontal: 8,
    paddingTop: 20,
    paddingVertical: "25%",
    flexDirection:"column",
    // alignItems: "center",
    justifyContent: "center",
  },
  modalStyle: {},
  sheetHeader: {
    alignSelf: "center",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    display: "flex",
    flexDirection: "column",
    paddingVertical: 10,
    width: "100%",
  },
  overlay: { height: "100%", backgroundColor: Colors.default.blackOne, opacity: 0.6 },
  sheetDraggerIcon: {
    alignSelf: "center",
    height: 7,
    width: 70,
    backgroundColor: "#ccc",
    borderRadius: 360,
  },
  headerTitle: {
    alignSelf: "center",
    textAlign: "center",
    marginTop: 3,
    marginLeft: 5,
    // ...GlobalStyles.subheaderTitle,
    fontWeight: "700",
  },
});
