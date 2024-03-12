import { StyleSheet, View } from "react-native";
import React from "react";
import PageLayout from "../../components/layouts/PageLayout";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RegistrationStackParamList } from "../../routes/registration";
import SuccessCelebrate from "../../assets/svgs/successcelebrate.svg";
import { Text } from "react-native-paper";
import { useAppTheme } from "../../hooks";
import Button from "../../components/common/Button";
import Animated, { FadeIn } from "react-native-reanimated";

type IProp = NativeStackScreenProps<
  RegistrationStackParamList,
  "RegistrationCompleted"
>;
const RegistrationCompleted = ({ navigation }: IProp) => {
  const theme = useAppTheme();

  return (
    <PageLayout onBackPressed={navigation.goBack}>
      <View style={styles.wrapper}>
        <Animated.View entering={FadeIn.duration(500)}>
          <SuccessCelebrate />
        </Animated.View>

        <Text style={[styles.congratText, { color: theme.colors.primary }]}>
          Congratulations!
        </Text>
        <Text
          style={[
            styles.congratInfo,
            { color: theme.colors.defaults.grayFour },
          ]}
        >
          You have successfully created your cashglide account
        </Text>

        <View style={styles.btn}>
          <Button onPress={() => navigation.getParent()?.navigate("App")}>
            Continue
          </Button>
        </View>
      </View>
    </PageLayout>
  );
};

export default RegistrationCompleted;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: "7%",
  },
  congratText: {
    marginTop: "15%",
    fontFamily: "Primary-SemiBold",
    fontSize: 26,
  },
  congratInfo: {
    marginTop: "5%",
    fontFamily: "Primary-Regular",
    fontSize: 18,
    textAlign: "center",
  },
  btn: {
    marginTop: "20%",
  },
});
