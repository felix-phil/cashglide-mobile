import { Alert, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import PageLayout from "../../components/layouts/PageLayout";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RegistrationStackParamList } from "../../routes/registration";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Avatar, Text } from "react-native-paper";
import { Formik, FormikErrors, FormikHelpers } from "formik";
import TextInput from "../../components/common/TextInput";
import { useAppDispatch, useAppSelector, useAppTheme } from "../../hooks";
import CountryCodeSelector from "../../components/screens/auth/CountryCodeSelector";
import { CountryCode } from "../../data/country-codes";
import {
  formatImageForUpload,
  formatStringToMMDDYYY,
  getCodeObjectByCountryCode,
  getErrorString,
  splitNumberAndCode,
  validationRegexes,
} from "../../services/helpers";
import Button from "../../components/common/Button";
import {
  useCheckUsernameMutation,
  useCurrentUserQuery,
  useRequestIdentifierVerifyMutation,
  useUpdateUserProfileMutation,
} from "../../store/services/authentication";
import LoadingPage from "../../components/layouts/LoadingPage";
import ErrorPage from "../../components/layouts/ErrorPage";
import { setFormValues } from "../../store/features/form";
import SelectInput from "../../components/common/SelectInput";
import { ImagePickerAsset } from "expo-image-picker";
import ImageInput from "../../components/common/ImageInput";
import { PROFILE_IMAGE_DEFAULT_URI } from "../../constants/strings";

type IProps = NativeStackScreenProps<RegistrationStackParamList, "Personal">;
interface PersonalInfoForm {
  username: string;
  firstName: string;
  lastName: string;
  otherName?: string;
  email: string;
  phone: string;
  code?: CountryCode;
  dob: string;
  gender: "male" | "female";
}
const Personal = ({ navigation }: IProps) => {
  const theme = useAppTheme();
  const prevFormValues = useAppSelector((state) => state.form.registration);
  const { data: user, ...userQuery } = useCurrentUserQuery(null);
  const [profileImage, setProfileImage] = useState<ImagePickerAsset>();
  const emailVerifed = user?.emailVerified;
  const phoneVerifed = user?.phoneVerified;
  const dispatch = useAppDispatch();

  const [checkUsername, checkUsernameQuery] = useCheckUsernameMutation();
  const [requestVerify, requestVerifyQuery] =
    useRequestIdentifierVerifyMutation();
  const [updateUser, query] = useUpdateUserProfileMutation();

  const initialValues: PersonalInfoForm = {
    firstName: user?.firstName || prevFormValues?.firstName || "",
    lastName: user?.lastName || prevFormValues?.lastName || "",
    username: user?.username || prevFormValues?.username || "",
    otherName: user?.otherName || prevFormValues?.otherName || "",
    gender: user?.gender || prevFormValues?.gender || "",
    dob: user?.dob || prevFormValues?.dob || "",
    email: user?.email || "",
    phone: user?.phone ? splitNumberAndCode(user.phone).number : "",
    code: prevFormValues?.countryCode
      ? getCodeObjectByCountryCode(prevFormValues?.countryCode)
      : undefined,
  };

  const validate = (values: PersonalInfoForm) => {
    const errors: FormikErrors<PersonalInfoForm> = {};

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
    if (!values.code) {
      errors.phone = "Select country code";
    }
    if (values.code && !values.code.regex.test(values.phone)) {
      errors.phone = "Invalid phone number";
    }
    return errors;
  };

  const onSubmitHandler = async (
    values: PersonalInfoForm,
    helpers: FormikHelpers<PersonalInfoForm>
  ) => {
    try {
      const body: {
        firstName: string;
        lastName: string;
        dob: string;
        otherName?: string;
        username?: string;
        gender: string;
      } = {
        firstName: values.firstName,
        otherName: values.otherName || "",
        lastName: values.lastName,
        dob: values.dob,
        gender: values.gender
      };
      if (!user?.username) {
        body.username = values.username;
      }
      const formData = new FormData();
      Object.keys(body).forEach((key) => {
        formData.append(key, body[key as keyof typeof body] as any);
      });
      if (profileImage) {
        formData.append(
          "profileImage",
          formatImageForUpload(profileImage) as unknown as Blob
        );
      }
      await updateUser(formData).unwrap();
      navigation.navigate("Contact");
    } catch (error) {
      Alert.alert("Error", getErrorString(error));
    }
  };
  const handleGotoVerify = async (identifier: string) => {
    try {
      await requestVerify({ identifier }).unwrap();
      navigation.navigate("OTPVerification", {
        primaryIdentifier: identifier,
        reason: "verification",
      });
    } catch (error) {
      Alert.alert("Error", getErrorString(error));
    }
  };
  const storeValuuesBeforeExit = (values: PersonalInfoForm) => {
    const body = {
      username: values.username,
      firstName: values.firstName,
      lastName: values.lastName,
      otherName: values.otherName,
      countryCode: values.code?.code,
      gender: values.gender,
      dob: values.dob,
    };
    dispatch(setFormValues({ form: "registration", values: body }));
  };
  if (!user && userQuery.isLoading) {
    return <LoadingPage />;
  }
  if (userQuery.isError && !user) {
    return (
      <ErrorPage
        errorText={getErrorString(userQuery.error)}
        retry={userQuery.refetch}
      />
    );
  }
  const validateUsername = async (
    username: string,
    setFieldError: (field: string, error: string) => void
  ) => {
    if (!validationRegexes.username.test(username)) {
      return;
    }
    try {
      await checkUsername({ username }).unwrap();
    } catch (error) {
      setFieldError("username", getErrorString(error));
    }
  };
  return (
    <PageLayout headerTitle="Complete your profile">
      <KeyboardAwareScrollView contentContainerStyle={styles.wrapper} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Personal Information</Text>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmitHandler}
          validate={validate}
          enableReinitialize
        >
          {({
            handleChange,
            handleBlur,
            setFieldValue,
            handleSubmit,
            setFieldError,
            errors,
            values,
            isValid,
          }) => (
            <>
              <View style={styles.form}>
                <View style={styles.avatarInput}>
                  <Text style={[styles.label, { color: theme.colors.primary }]}>
                    Picture
                  </Text>
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
                                user?.profileImageUrl ||
                                PROFILE_IMAGE_DEFAULT_URI,
                            }}
                          />
                        )}
                      </View>
                    }
                  />
                </View>
                <TextInput
                  label="Username"
                  helperText={errors.username}
                  error={!!errors.username}
                  editable={user?.username ? false : true}
                  value={values.username}
                  onChangeText={(text) => {
                    setFieldValue("username", text);
                    validateUsername(text, setFieldError);
                  }}
                  left={<Text>@</Text>}
                  placeholder="cashtag"
                  onBlur={handleBlur("username")}
                  autoCapitalize="none"
                />
                <TextInput
                  label="First Name"
                  helperText={errors.firstName}
                  error={!!errors.firstName}
                  value={values.firstName}
                  onChangeText={handleChange("firstName")}
                  onBlur={handleBlur("firstName")}
                  placeholder="Enter your first name"
                />
                <TextInput
                  label="Last Name"
                  helperText={errors.lastName}
                  error={!!errors.lastName}
                  value={values.lastName}
                  onChangeText={handleChange("lastName")}
                  onBlur={handleBlur("lastName")}
                  placeholder="Enter your last name"
                />
                <TextInput
                  label="Other Name (Optional)"
                  helperText={errors.otherName}
                  error={!!errors.otherName}
                  value={values.otherName}
                  onChangeText={handleChange("otherName")}
                  onBlur={handleBlur("otherName")}
                  placeholder="Enter your other name"
                />
                <SelectInput
                  title="Select gender"
                  error={!!errors.gender}
                  helperText={errors.gender}
                  initialValue={initialValues.gender}
                  initialSnapPoint={"25%"}
                  label="Gender"
                  options={[
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                  ]}
                  onChange={(item) => setFieldValue("gender", item.value)}
                />
                <TextInput
                  label="Date of Birth"
                  helperText={errors.dob}
                  error={!!errors.dob}
                  value={values.dob}
                  onChangeText={(text) =>
                    setFieldValue("dob", formatStringToMMDDYYY(text))
                  }
                  onBlur={handleBlur("dob")}
                  placeholder="mm-dd-yyyy"
                />
                <View style={styles.input}>
                  <View style={{ flex: 1 }}>
                    <TextInput
                      editable={!emailVerifed}
                      label="Email Address"
                      helperText={errors.email}
                      error={!!errors.email}
                      value={values.email}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      placeholder="Enter your email address"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View
                    style={{
                      alignSelf: !!errors.email ? "center" : "flex-end",
                    }}
                  >
                    <Button
                      style={styles.paperbtn}
                      labelStyle={{ fontSize: 12 }}
                      loading={requestVerifyQuery.isLoading}
                      disabled={!!errors.email || emailVerifed}
                      mode="contained"
                      onPress={() => {
                        storeValuuesBeforeExit(values);
                        handleGotoVerify(values.email);
                      }}
                    >
                      {emailVerifed ? "Verified" : "Verify"}
                    </Button>
                  </View>
                </View>
                <View style={styles.input}>
                  <View style={{ flex: 1 }}>
                    <TextInput
                      left={
                        <CountryCodeSelector
                          hideCode
                          disabled={values.code && phoneVerifed}
                          onChange={(code) => setFieldValue("code", code)}
                          initialCountryCode={
                            user?.phone
                              ? splitNumberAndCode(user.phone).code
                              : "+234"
                          }
                        />
                      }
                      editable={!phoneVerifed}
                      label="Phone Number"
                      helperText={errors.phone}
                      error={!!errors.phone}
                      value={values.phone}
                      onChangeText={handleChange("phone")}
                      onBlur={handleBlur("phone")}
                      placeholder="Enter your phone number"
                      keyboardType="number-pad"
                    />
                  </View>

                  <View
                    style={{
                      alignSelf: !!errors.phone ? "center" : "flex-end",
                    }}
                  >
                    <Button
                      style={styles.paperbtn}
                      labelStyle={{ fontSize: 12 }}
                      mode="contained"
                      disabled={!!errors.phone || phoneVerifed}
                      onPress={() => {
                        storeValuuesBeforeExit(values);
                        handleGotoVerify(values.code?.code + values.phone);
                      }}
                    >
                      {phoneVerifed ? "Verified" : "Verify"}
                    </Button>
                  </View>
                </View>
              </View>
              <View style={styles.submitBtn}>
                <Button
                  loading={query.isLoading}
                  onPress={(e) => handleSubmit()}
                  disabled={
                    !isValid ||
                    !phoneVerifed ||
                    !emailVerifed ||
                    query.isLoading
                  }
                >
                  Next
                </Button>
              </View>
            </>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </PageLayout>
  );
};

export default Personal;

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  title: {
    fontFamily: "Primary-Medium",
    fontWeight: "500",
    fontSize: 12,
  },
  form: {
    width: "90%",
    marginTop: "10%",
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },
  input: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  paperbtn: {
    width: 74,
    maxWidth: "100%",
    height: 29,
  },
  submitBtn: {
    marginVertical: "20%",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 360,
  },
  avatarInput: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },
  label: {
    fontSize: 12,
    fontFamily: "Primary-Medium",
    fontWeight: "600",
    alignSelf: "flex-start",
  },
});
