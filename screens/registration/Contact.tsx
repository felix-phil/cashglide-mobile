import { StyleSheet, View } from "react-native";
import React from "react";
import PageLayout from "../../components/layouts/PageLayout";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RegistrationStackParamList } from "../../routes/registration";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Text, Button as PaperButton } from "react-native-paper";
import { Formik, FormikErrors, FormikHelpers } from "formik";
import TextInput from "../../components/common/TextInput";
import { useAppTheme } from "../../hooks";
import Button from "../../components/common/Button";
import SelectInput from "../../components/common/SelectInput";
import countries from "../../data/countries.json";
import Checkbox from "../../components/common/Checkbox";
import Link from "../../components/common/Link";
import RequestHandler from "../../components/common/RequestHandler";
import {
  useCurrentUserQuery,
  useUpdateUserProfileMutation,
} from "../../store/services/authentication";
import { getErrorString } from "../../services/helpers";

type IProps = NativeStackScreenProps<RegistrationStackParamList, "Contact">;
interface ContactInfoForm {
  country: number;
  state: string;
  city: string;
  address: string;
  agreement: boolean;
}
const Personal = ({ navigation }: IProps) => {
  const theme = useAppTheme();
  const { data: user, ...userQuery } = useCurrentUserQuery(null);
  const [updateUser, query] = useUpdateUserProfileMutation();

  const initialValues: ContactInfoForm = {
    state: user?.state || "",
    country: 1,
    city: user?.city || "",
    address: user?.address || "",
    agreement: false,
  };

  const validate = (values: ContactInfoForm) => {
    const errors: FormikErrors<ContactInfoForm> = {};
    if (!values.country) {
      errors.country = "Required";
    }
    if (!values.state) {
      errors.state = "Required";
    }
    if (!values.city) {
      errors.city = "Required";
    }
    if (!values.address) {
      errors.address = "Required";
    }
    if (!values.agreement) {
      errors.agreement = "Required";
    }

    return errors;
  };

  const onSubmitHandler = async (
    values: ContactInfoForm,
    helpers: FormikHelpers<ContactInfoForm>
  ) => {
    try {
      const countryName = (
        countries[values.country].name || "Nigeria"
      ).toLowerCase();
      const body = {
        country: countryName,
        state: values.state?.toLowerCase(),
        city: values.city?.toLowerCase(),
        address: values.address?.toLowerCase(),
      };
      await updateUser(body).unwrap();
      if (!user?.bvn) {
        navigation.navigate("AddBVN");
      } else {
        navigation.navigate("CreatePIN");
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };
  return (
    <PageLayout
      headerTitle="Complete your profile"
      onBackPressed={navigation.goBack}
    >
      <KeyboardAwareScrollView contentContainerStyle={styles.wrapper}>
        <Text style={styles.title}>Address and Contact Information</Text>
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
            errors,
            values,
            isValid,
          }) => (
            <>
              <View style={styles.form}>
                <SelectInput
                  searchable
                  title="Select country"
                  error={!!errors.country}
                  helperText={errors.country}
                  label="Country"
                  initialValue={162}
                  options={countries.map((country, index) => ({
                    label: country.name,
                    value: index,
                  }))}
                  initialSnapPoint={"75%"}
                  onChange={(item) => setFieldValue("country", item.value)}
                />
                <SelectInput
                  searchable
                  title="Select state"
                  placeHolder="Select state"
                  error={!!errors.state}
                  helperText={errors.state}
                  label="State"
                  options={countries[values.country].states.map((state) => ({
                    label: state.name,
                    value: state.name,
                  }))}
                  initialSnapPoint={"75%"}
                  onChange={(item) => setFieldValue("state", item.value)}
                />
                <TextInput
                  label="City"
                  helperText={errors.city}
                  error={!!errors.city}
                  value={values.city}
                  onChangeText={handleChange("city")}
                  onBlur={handleBlur("city")}
                  placeholder="Enter your city"
                />
                <TextInput
                  label="Address"
                  helperText={errors.address}
                  error={!!errors.address}
                  value={values.address}
                  onChangeText={handleChange("address")}
                  onBlur={handleBlur("address")}
                  placeholder="Enter your address"
                />
                <Checkbox
                  status={values.agreement ? "checked" : "unchecked"}
                  onPress={() => setFieldValue("agreement", !values.agreement)}
                  label={
                    <Text
                      style={[
                        styles.agreeText,
                        {
                          color: errors.agreement
                            ? theme.colors.error
                            : theme.colors.defaults.grayFour,
                        },
                      ]}
                    >
                      I have agree to CashGlide’s{" "}
                      <Link
                        style={[styles.agreeText, styles.link]}
                        href="http://google.com"
                      >
                        Terms of Services
                      </Link>{" "}
                      and{" "}
                      <Link
                        style={[styles.agreeText, styles.link]}
                        href="https://google.com"
                      >
                        Privacy Policy
                      </Link>
                    </Text>
                  }
                />
              </View>
              <View style={styles.submitBtn}>
                <Button onPress={(e) => handleSubmit()} disabled={!isValid}>
                  Next
                </Button>
              </View>
            </>
          )}
        </Formik>
      </KeyboardAwareScrollView>
      <RequestHandler
        show={query.isError || query.isLoading || query.isSuccess}
        isLoading={query.isLoading}
        isError={query.isError}
        isSuccess={query.isSuccess}
        onDismiss={query.reset}
        isLoadingText="completing registration"
        isErrorText={getErrorString(query.error)}
        isSuccessText="registeration successful"
      />
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
    marginTop: "20%",
    alignSelf: "center",
  },
  agreeText: {
    fontSize: 10,
    fontFamily: "Roboto-Medium",
    fontWeight: "400",
  },
  link: {
    textDecorationLine: "underline",
  },
});
