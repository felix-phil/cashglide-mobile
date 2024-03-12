import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
  StyleProp,
  ViewStyle,
} from "react-native";
import React, { FC, ReactNode } from "react";
import { useAppTheme } from "../../hooks";
import { LinearGradient } from "expo-linear-gradient";
import { hexToRGB } from "../../services/helpers";
import { IconButton, Title } from "react-native-paper";

interface IProps {
  children: ReactNode;
  gradientBackground?: boolean;
  safeAreaStyle?: StyleProp<ViewStyle>;
  headerTitle?: ReactNode;
  onBackPressed?: () => void;
  backIconName?: string;
}
const PageLayout: FC<IProps> = ({
  children,
  safeAreaStyle,
  gradientBackground = false,
  headerTitle,
  onBackPressed,
  backIconName,
}) => {
  const theme = useAppTheme();
  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: theme.colors.backgrounds.secondary },
        safeAreaStyle,
      ]}
    >
      <StatusBar
        backgroundColor={
          gradientBackground
            ? theme.colors.primary
            : theme.colors.defaults.whiteOne
        }
        // barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
        barStyle={gradientBackground ? "light-content" : "dark-content"}
      />

      {gradientBackground && (
        <LinearGradient
          locations={[0.2, 0.8]}
          colors={[theme.colors.primary, theme.colors.defaults.primaryLight]}
          style={styles.linearBg}
        />
      )}
      <View style={styles.header}>
        <IconButton
          accessibilityLabel="Go Back"
          onPress={onBackPressed}
          style={{ opacity: onBackPressed ? 1 : 0.5 }}
          iconColor={
            gradientBackground
              ? theme.colors.defaults.whiteOne
              : theme.colors.defaults.blackOne
          }
          size={26}
          icon={
            backIconName
              ? backIconName
              : Platform.OS === "ios"
              ? "chevron-left"
              : "arrow-left"
          }
        />
        {headerTitle && (
          <Title adjustsFontSizeToFit style={styles.textHeader}>
            {headerTitle}
          </Title>
        )}
      </View>
      <View style={styles.children}>{children}</View>
    </SafeAreaView>
  );
};

export default PageLayout;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    position: "relative",
  },
  linearBg: {
    height: "50%",
    ...StyleSheet.absoluteFillObject,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    columnGap: 5,
    marginTop: "5%",
  },
  textHeader: {
    alignSelf: "center",
    fontFamily: "Primary-Bold",
    fontWeight: "700",
    fontSize: 25,
    fontStyle: "normal",
  },
  children: {
    flex: 1,
    paddingHorizontal: "5%",
  },
});
