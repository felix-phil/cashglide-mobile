import { IconButton } from "react-native-paper";
import AppleLogo from "../../../../assets/svgs/apple.svg";
import { StyleSheet } from "react-native";
import { useAppTheme } from "../../../../hooks";

const AppleLogin = () => {
  const theme = useAppTheme();
  return (
    <IconButton
      containerColor={theme.colors.defaults.whiteTwo}
      size={37}
      icon={() => <AppleLogo style={styles.icon} />}
    />
  );
};

export default AppleLogin;

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
});
