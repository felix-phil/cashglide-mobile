import { Alert, Dimensions, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { BarCodeScanner, BarCodeScannerResult } from "expo-barcode-scanner";
import * as ImagePicker from "expo-image-picker";
import { useAppTheme } from "../../hooks";
import { getErrorString, hexToRGB } from "../../services/helpers";
import { Appbar, IconButton, Text } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamasType } from "../../routes/app-stack";
import RequestHandler from "../../components/common/RequestHandler";
import { useSearchUserMutation } from "../../store/services/authentication";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { AppTabParamType } from "../../routes/app-bottom-tab";

type IProps = BottomTabScreenProps<AppTabParamType, "Scan">;
const ScanCode = ({ navigation }: IProps) => {
  const theme = useAppTheme();
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [searchUser, query] = useSearchUserMutation();

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);
  const handleBarCodeScanned = async ({ type, data }: BarCodeScannerResult) => {
    await handleData(data);
  };
  const handleScanFromImage = async () => {
    try {
      const permission = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) {
          Alert.alert("Permission", "Please grant permission to use camera");
          return;
        }
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        allowsMultipleSelection: false,
        quality: 0.5,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
      if (!result.canceled) {
        const data = await BarCodeScanner.scanFromURLAsync(
          result.assets[0].uri
        );
        if (data.length > 0) {
          const code = data[0];
          await handleData(code.data);
        }
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong");
    }
  };
  const handleData = async (data: string) => {
    if (!data?.toLowerCase().startsWith("cashglide")) {
      alert(`Invalid QR Code, code does not contain neccessary data`);
      navigation.goBack();
      return;
    }
    setScanned(true);
    const username = data.split("/")[1];
    const amount: string | undefined = data.split("/")[2];
    
    try {
      const user = await searchUser({
        identifier: username,
        single: false,
      }).unwrap();
      if ("phone" in user) {
        navigation.getParent()?.navigate("SendToUser", {
          user: user,
          amount: amount ? parseFloat(amount) : 0,
        });
      }else if(Array.isArray(user)){
        navigation.getParent()?.navigate("SendToUser", {
          user: user[0],
          amount: amount ? parseFloat(amount) : 0,
        });
      }
    } catch (error) {}
  };
  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: hexToRGB(theme.colors.defaults.blackOne, 1) },
      ]}
    >
      <Appbar.Header style={{ backgroundColor: "transparent", zIndex: 99 }}>
        <Appbar.BackAction
          color={theme.colors.defaults.whiteOne}
          onPress={navigation.goBack}
        />
        <Appbar.Content
          color={theme.colors.defaults.whiteOne}
          title="Scan QR Code"
          titleStyle={styles.header}
        />
      </Appbar.Header>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.barCodeCamera}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
      />
      <View style={styles.actions}>
        <View style={styles.actionItem}>
          <IconButton
            onPress={() => navigation.getParent()?.navigate("QRCode")}
            containerColor={theme.colors.primary}
            size={52}
            icon={"qrcode"}
            iconColor={theme.colors.defaults.whiteOne}
          />
          <Text
            style={[
              styles.actionText,
              { color: theme.colors.defaults.whiteOne },
            ]}
          >
            Receive
          </Text>
        </View>
        <View style={styles.actionItem}>
          <IconButton
            onPress={handleScanFromImage}
            containerColor={theme.colors.primary}
            size={52}
            icon={"image-multiple"}
            iconColor={theme.colors.defaults.whiteOne}
          />
          <Text
            style={[
              styles.actionText,
              { color: theme.colors.defaults.whiteOne },
            ]}
          >
            Photo
          </Text>
        </View>
      </View>
      <RequestHandler
        show={query.isError || query.isLoading || query.isSuccess}
        isLoading={query.isLoading}
        isError={query.isError}
        isSuccess={query.isSuccess}
        onDismiss={() => {
          query.reset();
          setScanned(false);
        }}
        isLoadingText="fetching user info"
        isErrorText={getErrorString(query.error)}
        isSuccessText="user info fetched"
      />
    </View>
  );
};

export default ScanCode;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    // position: "relative",
  },
  header: {
    fontFamily: "Primary-SemiBold",
    fontSize: 20,
  },
  actions: {
    position: "absolute",
    bottom: "20%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  actionItem: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  actionText: {
    fontFamily: "Primary-SemiBold",
    fontSize: 15,
  },
  barCodeCamera: {
    ...StyleSheet.absoluteFillObject,
    marginHorizontal: 0,
    marginLeft: 0,
    marginStart: 0,
    paddingHorizontal: 0,
    paddingLeft: 0,
    paddingStart: 0,
    padding: 0,
    height: "115%",
    // flex: 1
  },
});
