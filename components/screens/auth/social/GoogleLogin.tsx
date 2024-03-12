import { IconButton } from "react-native-paper";
import GoogleLogo from "../../../../assets/svgs/google.svg";
import { StyleSheet } from "react-native";
import { useAppTheme } from "../../../../hooks";

const GoogleLogin = () => {
  const theme = useAppTheme();
  return (
    <IconButton
      containerColor={theme.colors.defaults.whiteTwo}
      size={37}
      icon={(props) => <GoogleLogo style={styles.icon} {...props} />}
    />
  );
};

export default GoogleLogin;

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
});
