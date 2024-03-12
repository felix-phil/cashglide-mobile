import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useAppSelector } from "../hooks";
import MainStack from "./main";
import AuthStack from "./auth";
import PreAuthStack from "./preauth";

const RootNavigation = () => {
  const auth = useAppSelector((state) => state.auth);
  let Component: JSX.Element;
  if (auth.status === "authenticated") {
    Component = (
      <MainStack
        initialRouteName={
          auth.registrationCompleted && auth.pinExists
            ? "App"
            : "Registration"
        }
      />
    );
  } else if (auth.status === "unauthenticated") {
    Component = (
      <AuthStack
        initialRouteName={auth.onboardingPassed ? "SignIn" : "OnBoarding"}
      />
    );
  } else {
    Component = <PreAuthStack />;
  }
  return <React.Fragment>{Component}</React.Fragment>;
};

export default RootNavigation;

const styles = StyleSheet.create({});
