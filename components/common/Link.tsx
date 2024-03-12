import { Alert, Linking, StyleSheet } from "react-native";
import React, { FC, ReactNode } from "react";
import { Text, TextProps } from "react-native-paper";

interface IProps extends TextProps<any> {
  href: string;
  children: ReactNode;
}
const Link: FC<IProps> = ({ href, children, ...rest }) => {
  const handlePress = async () => {
    try {
      await Linking.openURL(href);
    } catch (error) {
      Alert.alert("Error", "Unable to open link", [
        {
          text: "OK",
          style: "cancel",
        },
      ]);
    }
  };
  return (
    <Text adjustsFontSizeToFit {...rest} onPress={handlePress}>
      {children}
    </Text>
  );
};

export default Link;

const styles = StyleSheet.create({});
