import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AppleLogin from "./AppleLogin";
import GoogleLogin from "./GoogleLogin";

const SocialLogins = () => {
  return (
    <View style={styles.wrapper}>
      <GoogleLogin />
      <AppleLogin />
    </View>
  );
};

export default SocialLogins;

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flexDirection: "row",
    // gap: 0
  },
});
