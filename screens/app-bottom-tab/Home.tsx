import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useRef } from "react";
import Header from "../../components/screens/home/Header";
import { useAppTheme } from "../../hooks";
import { useCurrentUserQuery } from "../../store/services/authentication";
import Wallet from "../../components/screens/home/Wallet";
import Services from "../../components/screens/home/Services";
import RecentTransactions from "../../components/screens/home/RecentTransactions";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useGetWalletQuery } from "../../store/services/wallet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import RecieveBottomSheet from "../../components/screens/home/RecieveBottomSheet";

const Home = () => {
  const theme = useAppTheme();
  const { data: user } = useCurrentUserQuery({});
  const { data: wallet, ...walletQuery } = useGetWalletQuery({});
  const receiveBottomSheetRef = useRef<BottomSheetModal>(null);

  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: theme.colors.backgrounds.secondary },
      ]}
    >
      <Header user={user} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contents}
        refreshControl={
          <RefreshControl
            refreshing={walletQuery.isLoading}
            onRefresh={walletQuery.refetch}
          />
        }
      >
        <Animated.View
          entering={FadeInDown.duration(500).delay(50)}
          style={styles.section}
        >
          <Wallet
            wallet={wallet?.wallet}
            isLoading={walletQuery.isLoading}
            handleOpenReceive={() => receiveBottomSheetRef.current?.present()}
          />
        </Animated.View>
        <Animated.View
          entering={FadeInDown.duration(500).delay(100)}
          style={styles.section}
        >
          <Services />
        </Animated.View>
        <Animated.View
          entering={FadeInDown.duration(500).delay(150)}
          style={styles.section}
        >
          <RecentTransactions transactions={wallet?.recentTransaction} />
        </Animated.View>
      </ScrollView>
      <RecieveBottomSheet ref={receiveBottomSheetRef} snapToIndex={receiveBottomSheetRef.current?.snapToIndex} handleClose={receiveBottomSheetRef.current?.close} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: "5%",
  },
  contents: {
    marginBottom: "10%",
  },
  section: {
    marginTop: "5%",
  },
});
