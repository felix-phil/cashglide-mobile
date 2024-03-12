import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC } from "react";
import services from "../../../data/services";
import { useAppTheme } from "../../../hooks";

const Service: FC<(typeof services)[0]> = ({ Icon, ...props }) => {
  return (
    <TouchableOpacity onPress={() => {}} activeOpacity={0.6}>
      <View style={styles.service}>
        <View style={[styles.serviceBg, { backgroundColor: props.background }]}>
          {Icon}
        </View>
        <Text style={styles.serviceTitle}>{props.title}</Text>
      </View>
    </TouchableOpacity>
  );
};
const Services = () => {
  const theme = useAppTheme();
  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: theme.colors.backgrounds.primary },
      ]}
    >
      <View style={styles.lists}>
        {services.map((service, idx) => (
          <View style={styles.serviceWrap} key={idx}>
            <Service key={idx} {...service} />
          </View>
        ))}
      </View>
    </View>
  );
};

export default Services;

const styles = StyleSheet.create({
  wrapper: {
    // marginTop: "5%",
    width: "100%",
    borderRadius: 20,
    paddingHorizontal: "5%",
    paddingVertical: "2%",
    // shadowColor: "black",
    // shadowOffset: { width: 0, height: -5 },
    // shadowOpacity: 0.5,
    // shadowRadius: 8,
    // elevation: 8,
    // display: "flex",
    // alignItems: "center",
    // justifyContent: "center",
    // flexDirection: "row",
    // flexWrap: "wrap"
  },
  serviceWrap: {
    flex: 1,
    marginVertical: "5%",
    flexBasis: "33%",
  },
  lists: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  service: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceBg: {
    height: 60,
    width: 60,
    borderRadius: 360,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // flex: "33%"
  },
  svgIcon: {
    width: 25,
    height: 25,
  },
  serviceTitle: {
    fontFamily: "Primary-Medium",
    fontWeight: "500",
  },
});
