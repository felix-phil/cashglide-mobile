import React, { FC, useState } from "react";
import { APIUser } from "../../../api/types";
import { Alert, Modal, StyleSheet, View } from "react-native";
import { useAppTheme } from "../../../hooks";
import CustomHeader from "../../../components/layouts/CustomHeader";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Formik, FormikErrors, FormikHandlers, FormikHelpers } from "formik";
import TextInput from "../../../components/common/TextInput";
import {
  useCheckUsernameMutation,
  useCurrentUserQuery,
  useUpdateUserProfileMutation,
} from "../../../store/services/authentication";
import {
  capitalize,
  formatImageForUpload,
  getCodeObjectByCountryCode,
  getErrorString,
  splitNumberAndCode,
  validationRegexes,
} from "../../../services/helpers";
import { CountryCode } from "../../../data/country-codes";
import { ActivityIndicator, Avatar, Text } from "react-native-paper";
import SelectInput from "../../../components/common/SelectInput";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamasType } from "../../../routes/app-stack";
import Button from "../../../components/common/Button";
import { PROFILE_IMAGE_DEFAULT_URI } from "../../../constants/strings";
import ImageInput from "../../../components/common/ImageInput";
import { ImagePickerAsset } from "expo-image-picker";

type IProp = NativeStackScreenProps<AppStackParamasType, "EditProfile">;

type EditProfileForm = {
  username: string;
  firstName: string;
  lastName: string;
  otherName: string;
  email: string;
  phone: string;
  code?: CountryCode;
  dob: string;
  gender?: "male" | "female";
  country: string;
  state: string;
  address: string;
};
const EditProfile: FC<IProp> = ({ navigation }) => {
  const theme = useAppTheme();
  const [checkUsername, checkUsernameQuery] = useCheckUsernameMutation();
  const { data: user, ...userQuery } = useCurrentUserQuery({});
  const [updateUser, query] = useUpdateUserProfileMutation();
  const [profileImage, setProfileImage] = useState<ImagePickerAsset>();
  const initialValues: EditProfileForm = {
    username: user?.username || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    otherName: user?.otherName || "",
    dob: user?.dob || "",
    email: user?.email || "",
    phone: user?.phone || "",
    code: getCodeObjectByCountryCode(
      splitNumberAndCode(user?.phone || "").code
    ),
    gender: user?.gender,
    country: user?.country || "",
    state: user?.state || "",
    address: user?.address || "",
  };
  const validate = (values: EditProfileForm) => {
    const errors: FormikErrors<EditProfileForm> = {};

    if (!values.username) {
      errors.username = "Required";
    }
    if (!validationRegexes.username.test(values.username)) {
      errors.username = "Invalid username";
    }
    if (!values.firstName) {
      errors.firstName = "Required";
    }
    if (!values.lastName) {
      errors.lastName = "Required";
    }
    if (!values.gender) {
      errors.gender = "Required";
    }
    if (!values.email) {
      errors.email = "Required";
    } else if (!validationRegexes.email.test(values.email)) {
      errors.email = "Invalid email";
    }
    if (!values.phone) {
      errors.phone = "Required";
    }
    if (!values.dob) {
      errors.dob = "Required";
    }
    if (isNaN(new Date(values.dob).getTime())) {
      errors.dob = "Invalid date";
    }
    if (!values.country) {
      errors.country = "Required";
    }
    if (!values.state) {
      errors.state = "Required";
    }
    if (!values.phone) {
      errors.phone = "Required";
    }
    if (!values.address) {
      errors.address = "Required";
    }

    if (!values.code) {
      errors.phone = "Select country code";
    }
    if (values.code && !values.code.regex.test(values.phone)) {
      errors.phone = "Invalid phone number";
    }
    return errors;
  };
  const validateUsername = async (
    username: string,
    setFieldError: (field: string, error: string) => void
  ) => {
    if (!validationRegexes.username.test(username)) {
      return;
    }
    try {
      if (username !== user?.username) {
        await checkUsername({ username }).unwrap();
      }
    } catch (error) {
      setFieldError("username", getErrorString(error));
    }
  };
  const onSubmitHandler = async (
    values: EditProfileForm,
    options: FormikHelpers<EditProfileForm>
  ) => {
    const changedValues = Object.entries(values).reduce(
      (acc: any, [key, value]) => {
        const hasChanged =
          initialValues[key as keyof EditProfileForm] !== value;

        if (hasChanged) {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );
     
    const formData = new FormData();
    Object.keys(changedValues).forEach((key) => {
      formData.append(key, changedValues[key]);
    });
    if(profileImage){
      formData.append("profileImage", formatImageForUpload(profileImage) as unknown as Blob)
    }
    try {
      await updateUser(formData).unwrap();
      options.resetForm();
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", getErrorString(error));
    }
  };
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
        title="Edit you profile"
        onPressBack={navigation.goBack}
      />

      <KeyboardAwareScrollView style={styles.content}>
        <Formik
          enableReinitialize
          validate={validate}
          initialValues={initialValues}
          onSubmit={onSubmitHandler}
        >
          {({
            values,
            errors,
            setFieldValue,
            handleBlur,
            handleChange,
            setFieldError,
            dirty,
            isValid,
            initialValues,
            handleSubmit,
          }) => (
            <View style={styles.form}>
              <ImageInput
                onChange={(image) => setProfileImage(image)}
                renderComponent={
                  <View
                    style={[
                      styles.avatar,
                      { borderColor: theme.colors.defaults.whiteOne },
                    ]}
                  >
                    {profileImage ? (
                      <Avatar.Image
                        size={60}
                        source={{
                          uri: profileImage.uri,
                        }}
                      />
                    ) : (
                      <Avatar.Image
                        size={60}
                        source={{
                          uri:
                            user?.profileImageUrl || PROFILE_IMAGE_DEFAULT_URI,
                        }}
                      />
                    )}
                  </View>
                }
              />
              <TextInput
                style={styles.textInput}
                wrapperStyle={styles.input}
                helperText={errors.username}
                error={!!errors.username}
                label="Username"
                value={values.username}
                onChangeText={(text) => {
                  setFieldValue("username", text);
                  validateUsername(text, setFieldError);
                }}
                left={<Text>@</Text>}
                right={
                  checkUsernameQuery.isLoading && (
                    <ActivityIndicator
                      size={12}
                      color={theme.colors.secondary}
                    />
                  )
                }
                placeholder="cashtag"
                onBlur={handleBlur("username")}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.textInput}
                wrapperStyle={styles.input}
                helperText={errors.firstName}
                error={!!errors.firstName}
                label="First Name"
                value={values.firstName}
                editable={false}
                onChangeText={handleChange("firstName")}
                placeholder="John"
                onBlur={handleBlur("firstName")}
                autoCapitalize="words"
              />
              <TextInput
                style={styles.textInput}
                wrapperStyle={styles.input}
                helperText={errors.lastName}
                error={!!errors.lastName}
                label="Last Name"
                value={values.lastName}
                editable={false}
                onChangeText={handleChange("lastName")}
                placeholder="Doe"
                onBlur={handleBlur("lastName")}
                autoCapitalize="words"
              />
              <TextInput
                style={styles.textInput}
                wrapperStyle={styles.input}
                helperText={errors.otherName}
                error={!!errors.otherName}
                label="Other Name"
                value={values.otherName}
                onChangeText={handleChange("otherName")}
                placeholder="(Optional)"
                onBlur={handleBlur("otherName")}
                autoCapitalize="words"
              />
              <SelectInput
                disabled
                title="Select gender"
                error={!!errors.gender}
                helperText={errors.gender}
                label="Gender"
                initialValue={initialValues.gender}
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                ]}
                initialSnapPoint={"25%"}
                onChange={(item) => setFieldValue("gender", item.value)}
              />
              <TextInput
                style={styles.textInput}
                wrapperStyle={styles.input}
                helperText={errors.dob}
                error={!!errors.dob}
                label="Date of Birth"
                editable={false}
                value={values.dob}
                onChangeText={handleChange("dob")}
                placeholder="MM-DD-YYYY"
                onBlur={handleBlur("dob")}
                autoCapitalize="words"
              />
              <TextInput
                style={[styles.textInput]}
                wrapperStyle={[styles.input]}
                helperText={errors.country}
                error={!!errors.country}
                label="Country"
                editable={false}
                value={capitalize(values.country || "")}
                onChangeText={handleChange("country")}
                // placeholder="Nigeria"
                onBlur={handleBlur("country")}
              />
              <TextInput
                style={[styles.textInput]}
                wrapperStyle={[styles.input]}
                helperText={errors.state}
                error={!!errors.state}
                label="State"
                editable={false}
                value={capitalize(values.state || "")}
                onChangeText={handleChange("state")}
                onBlur={handleBlur("state")}
              />
              <TextInput
                style={[styles.textInput]}
                wrapperStyle={[styles.input]}
                helperText={errors.address}
                error={!!errors.address}
                label="Address"
                editable={false}
                value={values.address}
                onChangeText={handleChange("address")}
                onBlur={handleBlur("address")}
              />
              <TextInput
                style={[styles.textInput]}
                wrapperStyle={[styles.input]}
                helperText={errors.email}
                error={!!errors.email}
                label="Email"
                editable={false}
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
              />
              <TextInput
                style={[styles.textInput]}
                wrapperStyle={[styles.input]}
                helperText={errors.phone}
                error={!!errors.phone}
                label="Phone"
                editable={false}
                value={values.phone}
                onChangeText={handleChange("phone")}
                onBlur={handleBlur("phone")}
              />
              <View style={styles.submitBtn}>
                <Button
                  onPress={() => handleSubmit()}
                  disabled={(!dirty && !profileImage) || !isValid || query.isLoading}
                  loading={query.isLoading}
                >
                  Save
                </Button>
              </View>
            </View>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 19,
  },
  input: {
    height: 35,
    borderRadius: 10,
  },
  textInput: {
    paddingHorizontal: 7,
    fontSize: 15,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  submitBtn: {
    alignSelf: "center",
    marginVertical: "20%",
  },
  avatar: {
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 360,
  },
});
export default EditProfile;
