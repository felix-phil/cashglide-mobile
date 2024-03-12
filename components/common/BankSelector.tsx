import {
  StyleSheet,
  Text,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  FlatList,
  Dimensions,
  Modal,
  ScrollView,
  Image,
} from "react-native";
import React, {
  FC,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useAppTheme } from "../../hooks";

import TextInput from "./TextInput";
import useOpenClose from "../../hooks/use-open-close";
import CustomHeader from "../layouts/CustomHeader";

import { Bank } from "../../api/types";
import { List } from "react-native-paper";
import Animated, {
  Easing,
  FadeInDown,
  FadeOutDown,
} from "react-native-reanimated";
import { getBankLogoByCode } from "../../data/bank-logo";

interface BankSelectorProps {
  options: Bank[];
  error?: boolean;
  helperText?: string;
  label?: ReactNode;
  selectionColor?: string;
  color?: string;
  textColor?: string;
  placeholderTextColor?: string;
  left?: ReactNode;
  wrapperStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  placeHolder?: string;
  textStyle?: StyleProp<TextStyle>;
  title?: string;
  searchable?: boolean;
  initialCode?: Bank["code"];
  disabled?: boolean;
  onChange?: (value: Bank) => void;
}
const alphabet: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const BankSelector: FC<BankSelectorProps> = ({
  options,
  error,
  helperText,
  label,
  color,
  textColor,
  placeholderTextColor,
  left,
  wrapperStyle,
  labelStyle,
  textStyle,
  placeHolder,
  title,
  searchable = true,
  onChange,
  initialCode,
  disabled,
}) => {
  const [filteredOptions, setfilteredOptions] = useState(options);
  const [searchText, setSearchText] = useState("");
  const [selectedOption, setselectedOption] = useState<Bank>();
  const { open, handleOpen, handleClose } = useOpenClose(false);
  const theme = useAppTheme();

  if (error) {
    color = theme.colors.error;
    textColor = theme.colors.error;
    placeholderTextColor = theme.colors.error;
  }
  if (!color) {
    color = theme.colors.defaults.grayTwo;
  }
  if (!textColor) {
    textColor = theme.colors.defaults.blackOne;
  }
  if (!placeholderTextColor) {
    placeholderTextColor = theme.colors.defaults.grayFour;
  }
  const handleChange = (item: Bank) => {
    if (onChange) onChange(item);
    setselectedOption(item);
    handleClose();
  };
  const handleSearch = (searchText: string) => {
    setSearchText(searchText);
    const filtered = options.filter((option) => {
      if (String(option.name).toLowerCase().match(searchText.toLowerCase())) {
        return true;
      }
      if (String(option.code).toLowerCase().match(searchText.toLowerCase())) {
        return true;
      }
    });
    if (filtered.length > 0) {
      setfilteredOptions(filtered);
    } else {
      setfilteredOptions(options);
    }
  };
  useEffect(() => {
    setfilteredOptions(options);
    setselectedOption(undefined);
  }, [JSON.stringify(options)]);

  useEffect(() => {
    if (initialCode) {
      const initialOption = options.find(
        (option) => option.code === initialCode
      );
      if (initialOption) {
        setselectedOption(initialOption);
        if (onChange) onChange(initialOption);
      }
    }
  }, []);
  const flatListRef = useRef<FlatList>(null);
  const renderBanks = ({ item, index }: { item: Bank; index: number }) => {
    return (
      <Animated.View
        entering={FadeInDown.duration(100)
          .delay(index * 25)
          .easing(Easing.ease)}
        exiting={FadeOutDown.duration(100)}
      >
        <List.Item
          titleStyle={styles.listTitle}
          title={item.name}
          left={({ style, ...prop }) => (
            <Image
              {...prop}
              // size={26}

              style={{
                ...style,
                width: 26,
                height: 26,
                backgroundColor: theme.colors.defaults.whiteOne,
                borderRadius: 0,
              }}
              source={{ uri: getBankLogoByCode(item.code) }}
            />
          )}
          onPress={() => handleChange(item)}
          style={styles.list}
        />
      </Animated.View>
    );
  };
  return (
    <>
      <View style={styles.allWrapper}>
        <TouchableOpacity
          // onPress={handleOpen}
          onPress={handleOpen}
          activeOpacity={0.8}
          disabled={disabled}
        >
          <View
            style={[
              styles.wrapper,
              {
                borderColor: color,
                backgroundColor: theme.colors.defaults.whiteTwo,
              },
              disabled && {
                opacity: 0.5,
              },
              wrapperStyle,
            ]}
          >
            {selectedOption && (
              <Image
                source={{ uri: getBankLogoByCode(selectedOption.code) }}
                style={{ width: 24, height: 24, marginLeft: 10 }}
              />
            )}
            <Text
              style={[
                styles.input,
                { color: textColor, opacity: selectedOption?.name ? 1 : 0.7 },
                textStyle,
              ]}
            >
              {selectedOption?.name || placeHolder || "Select Bank"}
            </Text>
            <View style={[styles.right, { marginRight: 17 }]}>
              <Ionicons
                name="chevron-forward"
                size={15}
                color={theme.colors.primary}
              />
            </View>
          </View>
        </TouchableOpacity>
        {helperText && (
          <Text
            style={[
              styles.helperText,
              {
                color: error
                  ? theme.colors.error
                  : theme.colors.defaults.blackOne,
              },
            ]}
          >
            {helperText}
          </Text>
        )}
      </View>
      <Modal
        visible={open}
        animationType="slide"
        style={[
          styles.sheet,
          { backgroundColor: theme.colors.backgrounds.secondary },
        ]}
        onRequestClose={handleClose}
      >
        <CustomHeader
          titleColor={theme.colors.defaults.blackOne}
          iconColor={theme.colors.defaults.blackOne}
          onPressBack={handleClose}
          title="Select Bank"
          backgroundColor="transparent"
        />
        {searchable && (
          <View style={styles.search}>
            <TextInput
              onChangeText={handleSearch}
              left={<AntDesign name="search1" size={25} color={"#9F9797"} />}
              placeholderTextColor={"#9F9797"}
              placeholder="Search Bank Name"
              value={searchText}
              style={{ fontSize: 14 }}
              wrapperStyle={{
                height: 46,
                borderRadius: 10,
                backgroundColor: theme.colors.defaults.whiteOne,
              }}
            />
          </View>
        )}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <FlatList
            style={{ flex: 1, width: "98%" }}
            ref={flatListRef}
            data={filteredOptions}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderBanks}
            contentContainerStyle={styles.flatList}
          />
          {/* <ScrollView style={{ marginVertical: "auto" }}>

            {alphabet.split("").map((letter) => (
              <TouchableOpacity
                key={letter}
                onPress={() => handleAlphabetClick(letter)}
              >
                <Text
                  style={{
                    // padding: 10,
                    fontWeight: selectedAlphabet === letter ? "bold" : "normal",
                  }}
                >
                  {letter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView> */}
        </View>
      </Modal>
    </>
  );
};

export default BankSelector;

const styles = StyleSheet.create({
  allWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
    width: "100%",
  },
  wrapper: {
    height: 35,
    borderWidth: 1,
    borderRadius: 5,
    // paddingHorizontal: ,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  input: {
    fontFamily: "Primary-Bold",
    fontWeight: "400",
    fontSize: 14,
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontFamily: "Primary-Medium",
    fontWeight: "600",
    alignSelf: "flex-start",
  },
  helperText: {
    fontSize: 10,
    fontFamily: "Primary-Regular",
    fontWeight: "400",
    alignSelf: "flex-start",
    marginLeft: 4,
  },
  left: {
    maxWidth: "20%",
    marginRight: 5,
  },
  right: {
    maxWidth: "20%",
    marginLeft: 5,
  },
  option: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    paddingHorizontal: "3%",
    paddingVertical: 15,
    borderRadius: 10,
  },
  optionLeft: {
    // display: "flex",
    // flexDirection: "row",
    // alignItems: "center",
    // gap: 5,
  },
  optionText: {
    fontSize: 14,
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
  },
  headerTitle: {
    alignSelf: "center",
    textAlign: "center",
    marginTop: 3,
    marginLeft: 5,
    fontWeight: "700",
  },
  sheet: {
    paddingHorizontal: 22,
    width: "100%",
    alignSelf: "center",
  },
  search: {
    marginBottom: "5%",
    paddingHorizontal: "5%",
  },
  list: {
    borderBottomWidth: 1,
    borderBottomColor: "#E4E1E1",
    paddingVertical: 14,
  },
  listTitle: {
    fontSize: 14,
    fontFamily: "Primary-Medium",
  },
  flatList: {
    paddingHorizontal: 15,
  },
});
