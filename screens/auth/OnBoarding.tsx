import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import React, { FC, useEffect, useRef, useState } from "react";
import ViewPager from "react-native-pager-view";

import { useAppTheme } from "../../hooks";
import Page from "../../components/screens/onboard/Page";
import { onboardData } from "../../data/onboard";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../routes/auth";
import { setOnboardingPassed } from "../../services/storage";

type Props = NativeStackScreenProps<AuthStackParamList, "OnBoarding">;
const OnBoarding = ({ navigation }: Props) => {
  const theme = useAppTheme();
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<ViewPager>(null);

  useEffect(() => {
    if (currentPage > 1) {
      try {
        setOnboardingPassed();
      } catch (error) {
        console.log(error);
      }
    }
  }, [currentPage]);
  const onNextClick = (page: number) => {
    pagerRef.current?.setPage(page);
    setCurrentPage(page);
  };
  const onSkippedPressed = () => {
    if (currentPage > 1) {
      navigation.navigate("SignIn");
    } else {
      pagerRef.current?.setPage(2);
      setCurrentPage(2);
    }
  };
  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: theme.colors.backgrounds.primary },
      ]}
    >
      {/* <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ flex: 1, backgroundColor: "#000000" }}
      > */}
      <ViewPager
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
        ref={pagerRef}
        style={{ flex: 1, width: "100%" }}
      >
        {onboardData.map(({ ImageComponent, ...data }, index) => (
          <View key={index} style={styles.page}>
            <Page
              currentPage={currentPage}
              numberOfPages={onboardData.length}
              onNextPressed={() => onNextClick(index + 1)}
              onSkipPressed={onSkippedPressed}
              image={<ImageComponent />}
              beforeText={data.beforeText}
              description={data.description}
              hideMainText={data.hideMainText}
            />
          </View>
        ))}
      </ViewPager>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

export default OnBoarding;

const styles = StyleSheet.create({
  safeArea: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
    marginBottom: "auto",
    flex: 1,
  },
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});
