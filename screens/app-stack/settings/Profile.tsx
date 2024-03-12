import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamasType } from "../../../routes/app-stack";
import { useAppTheme } from "../../../hooks";
import CustomHeader from "../../../components/layouts/CustomHeader";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Avatar } from "react-native-paper";
import { useCurrentUserQuery } from "../../../store/services/authentication";
import { PROFILE_IMAGE_DEFAULT_URI } from "../../../constants/strings";
import TextInput from "../../../components/common/TextInput";
import moment from "moment";
import LoadingPage from "../../../components/layouts/LoadingPage";

type IProp = NativeStackScreenProps<AppStackParamasType, "Profile">;
const Profile = ({ navigation, route }: IProp) => {
  const theme = useAppTheme();
  const { data: user, ...userQuery } = useCurrentUserQuery({});
  if (userQuery.isLoading) {
    return <LoadingPage />;
  }
  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: theme.colors.backgrounds.secondary },
      ]}
    >
      <CustomHeader
        backgroundColor="transparent"
        iconColor={theme.colors.defaults.blackOne}
        titleColor={theme.colors.defaults.blackOne}
        title="Personal Profile"
        onPressBack={navigation.goBack}
      />
      <Text
        onPress={()=>navigation.navigate("EditProfile")}
        style={[styles.editText, { color: theme.colors.primary }]}
      >
        Edit
      </Text>
      <KeyboardAwareScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <View
          style={[
            styles.avatar,
            { borderColor: theme.colors.defaults.whiteOne },
          ]}
        >
          <Avatar.Image
            size={60}
            source={{ uri: user?.profileImageUrl || PROFILE_IMAGE_DEFAULT_URI }}
          />
        </View>

        <TextInput
          style={styles.textInput}
          wrapperStyle={styles.input}
          label="Username"
          editable={false}
          value={user?.username}
        />
        <TextInput
          style={styles.textInput}
          wrapperStyle={styles.input}
          label="First Name"
          editable={false}
          value={user?.firstName}
        />
        <TextInput
          style={styles.textInput}
          wrapperStyle={styles.input}
          label="Last Name"
          editable={false}
          value={user?.lastName}
        />
        <TextInput
          style={styles.textInput}
          wrapperStyle={styles.input}
          label="Other Name"
          editable={false}
          value={user?.otherName}
        />
        <TextInput
          style={styles.textInput}
          wrapperStyle={styles.input}
          label="Date of Birth"
          editable={false}
          value={user?.dob}
        />
        <TextInput
          style={styles.textInput}
          wrapperStyle={styles.input}
          label="Email Address"
          editable={false}
          value={user?.email}
        />
        <TextInput
          style={styles.textInput}
          wrapperStyle={styles.input}
          label="Phone Number"
          editable={false}
          value={user?.phone}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 19,
  },
  contentContainer: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    gap: 6,
  },
  editText: {
    fontFamily: "Primary-SemiBold",
    marginLeft: "auto",
    marginRight: 20,
    fontSize: 15,
  },
  avatar: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 6,
    borderRadius: 360,
  },
  input: {
    backgroundColor: "#fff",
    height: 43,
    borderRadius: 10,
  },
  textInput: {
    paddingHorizontal: 15,
    fontSize: 15,
  },
});
