import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import useOpenClose from "../../../hooks/use-open-close";
import BottomSheet from "../../common/BottomSheet";
import countryCodes, { CountryCode } from "../../../data/country-codes";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppTheme } from "../../../hooks";

interface CountryOptionProps extends TouchableOpacityProps {
  flag: string;
  name: string;
  code: string;
  active?: boolean;
}
const CountryOption: FC<CountryOptionProps> = ({
  active,
  name,
  flag,
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
          <Text style={[styles.flag]}>{flag}</Text>
          <Text style={[styles.countryCode, { textTransform: "capitalize" }]}>
            {name}
          </Text>
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

interface CountryCodeSelectorProps {
  disabled?: boolean;
  hideFlags?: boolean;
  hideCode?: boolean;
  onChange?: (code: CountryCode) => void;
  initialCountryCode: string;
}
const CountryCodeSelector: FC<CountryCodeSelectorProps> = ({
  initialCountryCode,
  onChange,
  disabled = false,
  hideFlags = false,
  hideCode = false,
}) => {
  const { open, handleClose, handleOpen } = useOpenClose(false);
  const [selectedOption, setSelectedOption] = useState<CountryCode | null>(
    null
  );
  useEffect(() => {
    const defaultCountryCode = countryCodes.find(
      (code) => code.code === initialCountryCode
    );
    if (defaultCountryCode) {
      setSelectedOption(defaultCountryCode);
      if (onChange) onChange(defaultCountryCode);
    }
  }, []);

  const handleChange = (selected: CountryCode) => {
    setSelectedOption(selected);
    if (onChange) {
      onChange(selected);
    }
    handleClose();
  };
  return (
    <View style={styles.wrapper}>
      <TouchableWithoutFeedback disabled={disabled} onPress={handleOpen}>
        <View style={styles.code}>
          {!hideFlags && (
            <Text style={styles.flag}>{selectedOption?.image}</Text>
          )}
          {!hideCode && (
            <Text style={styles.countryCode}>{selectedOption?.code}</Text>
          )}
        </View>
      </TouchableWithoutFeedback>
      <BottomSheet
        contentWrapperStyle={styles.bottomSheet}
        visible={open}
        title="Country"
        sheetHeight={Dimensions.get("window").height/2}
        onDismiss={handleClose}
      >
        <FlatList
          contentContainerStyle={styles.optionWrapper}
          data={countryCodes}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <CountryOption
              onPress={handleChange.bind(this, item)}
              name={item.name}
              code={item.code}
              active={item.code === selectedOption?.code}
              flag={item.image}
              disabled={item.code !== "+234"}
            />
          )}
        />
      </BottomSheet>
    </View>
  );
};

export default CountryCodeSelector;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  code: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  flag: {
    fontSize: 25,
  },
  countryCode: {
    fontSize: 14,
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
  },
  option: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    paddingHorizontal: "3%",
    paddingVertical: 10,
    borderRadius: 10,
  },
  optionLeft: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  bottomSheet: {
    paddingHorizontal: "10%",
  },
  optionWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
});
