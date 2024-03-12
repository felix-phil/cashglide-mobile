import {
  Alert,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import CustomHeader from "../../../components/layouts/CustomHeader";
import { useAppTheme } from "../../../hooks";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { Avatar, Text, Button as PaperButton } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../../components/common/Button";
import { useCurrentUserQuery } from "../../../store/services/authentication";
import QRCodeSVG from "react-native-qrcode-svg";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamasType } from "../../../routes/app-stack";
import { PROFILE_IMAGE_DEFAULT_URI } from "../../../constants/strings";

type IProps = NativeStackScreenProps<AppStackParamasType, "QRCode">;
const QRCode = ({ navigation, route }: IProps) => {
  const theme = useAppTheme();
  const amount = route.params?.amount
  const { data: user } = useCurrentUserQuery({});
  const [base64QrImage, setBase64QrImage] = useState("");
  let qrCodeRef: any;

  // useEffect(() => {
  //   qrCodeRef?.toDataURL((dataUrl: any) => {
  //     setBase64QrImage(dataUrl);
  //   });
  // }, []);

  const handleShare = async () => {
    qrCodeRef?.toDataURL((dataUrl: any) => {
      setBase64QrImage(dataUrl);
    });
    try {
      if (base64QrImage) {
        const fileUri =
          FileSystem.cacheDirectory + `cashglide-${user?.username}.png`;
        await FileSystem.writeAsStringAsync(fileUri, base64QrImage, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const result = await Sharing.shareAsync(fileUri, {
          dialogTitle: "CashGlide QRCode",
          mimeType: "image/png",
        });
        // console.log(result);
      }
    } catch (error) {
      // console.log(error);
    }
  };
  const handleSave = async () => {
    qrCodeRef?.toDataURL((dataUrl: any) => {
      setBase64QrImage(dataUrl);
    });
    try {
      const initialPermission = await MediaLibrary.getPermissionsAsync();
      if (!initialPermission.granted) {
        await MediaLibrary.requestPermissionsAsync();
      }
      const permission = await MediaLibrary.getPermissionsAsync();
      if (permission.granted) {
        const fileUri =
          FileSystem.cacheDirectory + `cashglide-${user?.username}.png`;
        await FileSystem.writeAsStringAsync(fileUri, base64QrImage, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const asset = await MediaLibrary.createAssetAsync(fileUri);
        if (Platform.OS === "android") {
          ToastAndroid.show("Saved", 3000);
        } else {
          Alert.alert("", "Saved");
        }
      }
    } catch (error) {
      Alert.alert("Message", "Something went wrong");
      // console.log(error);
    }
  };
  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: theme.colors.backgrounds.secondary },
      ]}
    >
      <CustomHeader onPressBack={navigation.goBack} />
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text
          style={[styles.headerText, { color: theme.colors.defaults.whiteOne }]}
        >
          My QR Code
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View
          style={[
            styles.modal,
            { backgroundColor: theme.colors.defaults.whiteOne },
          ]}
        >
          <Avatar.Image
            size={60}
            style={{ ...styles.avatar, borderColor: theme.colors.secondary }}
            source={{
              uri: user?.profileImageUrl || PROFILE_IMAGE_DEFAULT_URI,
            }}
          />
          <View style={styles.names}>
            <Text style={styles.name}>{user?.fullName}</Text>
            <Text style={[styles.username, { color: theme.colors.primary }]}>
              @{user?.username}
            </Text>
          </View>
          <View
            style={[styles.qrcode, { borderColor: theme.colors.secondary }]}
          >
            <QRCodeSVG
              getRef={(ref) => (qrCodeRef = ref)}
              value={`cashglide/${user?.username}${amount && "/"+amount}` || "NA"}
              size={180}
              logo={require("../../../assets/images/icon.png")}
              logoBackgroundColor={theme.colors.backgrounds.primary}
              logoSize={30}
              logoBorderRadius={9}
              logoMargin={5}
            />
          </View>
          <Text style={[styles.helpText]}>Scan to pay</Text>
        </View>
        <View style={styles.actions}>
          <PaperButton
            onPress={handleShare}
            icon={(props) => (
              <Ionicons {...props} size={22} name="share-outline" />
            )}
            mode="text"
            labelStyle={styles.actionText}
          >
            Share
          </PaperButton>
          <PaperButton
            mode="text"
            onPress={handleSave}
            icon={(props) => (
              <Ionicons {...props} size={22} name="download-outline" />
            )}
            labelStyle={styles.actionText}
          >
            Save
          </PaperButton>
        </View>

        <View style={styles.btn}>
          <Button onPress={() => navigation.getParent()?.navigate("Scan")}>
            Scan Code
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default QRCode;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  btn: {
    marginTop: "10%",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: "5%",
  },

  headerText: {
    fontFamily: "Primary-SemiBold",
    fontSize: 25,
    textAlign: "center",
  },
  avatar: {
    borderWidth: 1,
    padding: 3,
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "-10%",
    marginHorizontal: "auto",
    alignSelf: "center",
  },
  modal: {
    maxWidth: "100%",
    width: 310,
    borderRadius: 10,
    marginTop: "15%",
    position: "relative",
    display: "flex",
  },
  content: {
    // flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  names: {
    marginTop: "14%",
    alignSelf: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  name: {
    fontFamily: "Primary-SemiBold",
    fontSize: 17,
    fontWeight: "600",
  },
  username: {
    fontFamily: "Primary-SemiBold",
    fontSize: 12,
    fontWeight: "600",
  },
  qrcode: {
    alignSelf: "center",
    marginVertical: "5%",
    padding: "5%",
    borderWidth: 1,
    borderRadius: 10,
  },
  helpText: {
    fontFamily: "Primary-SemiBold",
    fontSize: 17,
    fontWeight: "600",
    marginBottom: "10%",
    textAlign: "center",
  },
  actions: {
    maxWidth: "100%",
    width: 310,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionText: {
    fontFamily: "Primary-Medium",
    fontWeight: "500",
    fontSize: 17,
  },
});
