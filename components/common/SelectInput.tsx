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
} from "react-native";
import React, { FC, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { useAppTheme } from "../../hooks";
import AuthTextInput from "./AuthTextInput";

interface Option {
  value: any;
  label: ReactNode;
  extraData?: any;
}

interface OptionComponentProps extends TouchableOpacityProps {
  label: ReactNode;
  active?: boolean;
}

const OptionComponent: FC<OptionComponentProps> = ({
  active,
  label,
  ...otherProps
}) => {
  const theme = useAppTheme();
  return (
    <TouchableOpacity {...otherProps}>
      <View
        style={[
          styles.option,
          {
            borderColor: active
              ? theme.colors.secondary
              : theme.colors.defaults.grayTwo,
            opacity: otherProps.disabled ? 0.5 : 1,
          },
        ]}
      >
        <View style={styles.optionLeft}>
          <Text style={[styles.optionText]}>{label}</Text>
        </View>
        <MaterialCommunityIcons
          name="check-circle"
          size={20}
          color={
            active ? theme.colors.secondary : theme.colors.defaults.grayTwo
          }
        />
      </View>
    </TouchableOpacity>
  );
};

interface SelectInputProps {
  options: Option[];
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
  initialValue?: Option["value"];
  disabled?: boolean;
  onChange?: (value: Option) => void;
  initialSnapPoint?: number | string;
}
const SelectInput: FC<SelectInputProps> = ({
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
  searchable = false,
  onChange,
  initialValue,
  disabled,
  initialSnapPoint = "50%",
}) => {
  const [filteredOptions, setfilteredOptions] = useState(options);
  const [searchText, setSearchText] = useState("");
  const [selectedOption, setselectedOption] = useState<Option>();
  const theme = useAppTheme();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
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
  const handleChange = (item: Option) => {
    if (onChange) onChange(item);
    setselectedOption(item);
    bottomSheetRef.current?.close();
  };
  const handleSearch = (searchText: string) => {
    setSearchText(searchText);
    const filtered = options.filter((option) => {
      if (String(option.value).toLowerCase().match(searchText.toLowerCase())) {
        return true;
      }
      if (String(option.label).toLowerCase().match(searchText.toLowerCase())) {
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
    if (initialValue) {
      const initialOption = options.find(
        (option) => option.value === initialValue
      );
      if (initialOption) {
        setselectedOption(initialOption);
        if (onChange) onChange(initialOption);
      }
    }
  }, []);
  const snapPoints = useMemo(() => [initialSnapPoint, "50%", "75%", "90%"], [initialSnapPoint]);
  return (
    <>
      <View style={styles.allWrapper}>
        {label && (
          <Text
            style={[
              styles.label,
              {
                color: theme.colors.primary,
              },
              labelStyle,
            ]}
          >
            {label}
          </Text>
        )}
        <TouchableOpacity
          // onPress={handleOpen}
          onPress={bottomSheetRef?.current?.present}
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
              wrapperStyle,
            ]}
          >
            {left && <View style={styles.left}>{left}</View>}
            <Text
              style={[
                styles.input,
                { color: textColor, opacity: selectedOption?.value ? 1 : 0.7 },
                textStyle,
              ]}
            >
              {selectedOption?.label || placeHolder || "Select an option"}
            </Text>
            <View style={styles.right}>
              <Ionicons
                name="caret-down"
                size={15}
                color={theme.colors.defaults.grayFour}
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
        <Text adjustsFontSizeToFit style={styles.headerTitle}>
          {title}
        </Text>
        {searchable && (
          <View style={styles.search}>
            <AuthTextInput
              onChangeText={handleSearch}
              left={<Ionicons name="search" size={25} />}
              placeholderTextColor={theme.colors.defaults.blackOne}
              placeholder="Search"
              value={searchText}
            />
          </View>
        )}
        <FlatList
          data={filteredOptions}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <OptionComponent
              label={item.label}
              onPress={() => handleChange(item)}
              active={JSON.stringify(selectedOption) === JSON.stringify(item)}
              style={{ paddingVertical: 4 }}
            />
          )}
        />
      </BottomSheetModal>
    </>
  );
};

export default SelectInput;

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
    paddingHorizontal: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  input: {
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
    // ...GlobalStyles.subheaderTitle,
    fontWeight: "700",
  },
  sheet: {
    paddingHorizontal: "5%",
    width: "100%",
    alignSelf: "center",
  },
  search: {
    marginBottom: "10%",
  },
});
