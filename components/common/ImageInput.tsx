import {
  Alert,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { List, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { FC, ReactNode, useMemo, useRef, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import useOpenClose from "../../hooks/use-open-close";
import BottomSheet from "./BottomSheet";
import { useAppTheme } from "../../hooks";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
// import GlobalStyles from "../../constants/GlobalStyles";

interface IProps extends TouchableOpacityProps {
  color?: string;
  textColor?: string;
  error?: boolean;
  disabled?: boolean;
  renderComponent?: ReactNode;
  onChange?: (imageSelected: ImagePicker.ImageInfo) => void;
}
const ImageInput: FC<IProps> = ({
  color,
  textColor,
  disabled,
  renderComponent,
  error = false,
  onChange,
  ...restProps
}) => {
  const [imageSelected, setImageSelected] =
    useState<ImagePicker.ImagePickerAsset>();

  const theme = useAppTheme();

  const handleCameraImagePick = async () => {
    try {
      const permission = await ImagePicker.getCameraPermissionsAsync();
      if (!permission.granted) {
        const perm = await ImagePicker.requestCameraPermissionsAsync();
        if (!perm.granted) {
          Alert.alert("Permission", "Please grant permission to use camera");
          return;
        }
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        allowsMultipleSelection: false,
        quality: 0.2,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        // aspect: [16, 9]
        // presentationStyle: ImagePicker.UIImagePickerPresentationStyle.POPOVER,
        // cameraType: ImagePicker.CameraType.front,
        // preferredAssetRepresentationMode:
        //   ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Automatic,
        
      });
      if (!result.canceled) {
        setImageSelected(result.assets[0]);
        // console.log(result)
        if (onChange) {
          onChange(result.assets[0]);
        }
        bottomSheetRef?.current?.close();
      }
    } catch (error) {
      Alert.alert("Error", "An error occured launching camera");
    }
    bottomSheetRef?.current?.close();
  };
  const handlePickImage = async () => {
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
        allowsEditing: true,
        allowsMultipleSelection: false,
        quality: 0.2,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
      if (!result.canceled) {
        setImageSelected(result.assets[0]);
        // console.log(result)
        if (onChange) {
          onChange(result.assets[0]);
        }
        bottomSheetRef?.current?.close();
      }
    } catch (error) {
      Alert.alert("Error", "An error occured launching media library");
    }
  };
  if (error) {
    color = theme.colors.error;
    textColor = theme.colors.error;
  }
  if (!color) {
    color = theme.colors.defaults.grayTwo;
  }

  if (!textColor) {
    textColor = theme.colors.defaults.blackOne;
  }

  const snapPoints = useMemo(() => ["25%", "50%"], []);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  return (
    <React.Fragment>
      <TouchableOpacity
        accessibilityLabel="Select Image"
        {...restProps}
        onPress={bottomSheetRef.current?.present}
      >
        {renderComponent ? (
          renderComponent
        ) : (
          <View
            style={[
              styles.inputWrapper,
              { borderColor: color },
              disabled && { opacity: 0.5 },
            ]}
          >
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={[styles.input, { color: textColor }]}
            >
              {" "}
              {imageSelected
                ? imageSelected.fileName || imageSelected.uri
                : "Select Image"}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Bottom Sheet */}
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        stackBehavior="replace"
        style={styles.sheet}
        onDismiss={bottomSheetRef.current?.close}
        enablePanDownToClose
        enableDismissOnClose
        animateOnMount
      >
        <List.Item
          onPress={handleCameraImagePick}
          title="Launch camera"
          titleStyle={{ color: theme.colors.primary }}
          left={(prop) => <List.Icon {...prop} icon={"camera"} />}
          right={(prop) => <List.Icon {...prop} icon={"chevron-right"} />}
        />
        <List.Item
          onPress={handlePickImage}
          title="Select from gallery"
          titleStyle={{ color: theme.colors.primary }}
          left={(prop) => (
            <List.Icon {...prop} icon={"folder-multiple-image"} />
          )}
          right={(prop) => <List.Icon {...prop} icon={"chevron-right"} />}
        />
      </BottomSheetModal>
    </React.Fragment>
  );
};

export default ImageInput;

const styles = StyleSheet.create({
  textBtn: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  inputWrapper: {
    height: 35,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
    width: "100%",
  },
  sheet: {
    // paddingHorizontal: "5%",
    width: "100%",
    alignSelf: "center",
  },
  input: {
    // ...GlobalStyles.input,

    fontFamily: "Roboto-Light",
    fontWeight: "300",
    fontSize: 12,
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontFamily: "Primary-Medium",
    fontWeight: "600",
    alignSelf: "flex-start",
  },
});
