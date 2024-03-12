import { ScrollView, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import PageLayout from "../../components/layouts/PageLayout";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import BottomSheet from "@gorhom/bottom-sheet";
import { RegistrationStackParamList } from "../../routes/registration";
import { IconButton, Text } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import TextInput from "../../components/common/TextInput";
import { useAppTheme } from "../../hooks";
import Button from "../../components/common/Button";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useOpenClose from "../../hooks/use-open-close";
import RequestHandler from "../../components/common/RequestHandler";
import { useAddBVNMutation } from "../../store/services/authentication";
import { getErrorString } from "../../services/helpers";
import colors from "../../constants/colors";

type IProps = NativeStackScreenProps<RegistrationStackParamList, "AddBVN">;
const AddBVN = ({ navigation }: IProps) => {
  const theme = useAppTheme();
  const [bvn, setBvn] = useState("");
  const { open, handleClose, handleOpen } = useOpenClose(false);
  const [addBVN, query] = useAddBVNMutation();

  const handleSubmit = async () => {
    try {
      await addBVN({ bvn }).unwrap();
      navigation.navigate("CreatePIN");
    } catch (error) {}
  };
  const error = !bvn || bvn.length < 11 || bvn.length > 11;
  return (
    <React.Fragment>
      <PageLayout
        headerTitle="Enter your BVN"
        onBackPressed={navigation.goBack}
      >
        <KeyboardAwareScrollView contentContainerStyle={styles.wrapper}>
          <Text style={styles.title}>
            Your BVN is used to verify your identity securely. Your data is
            encrypted and protected
          </Text>
          <View style={styles.form}>
            <TextInput
              label="Bank Verification Number (BVN)"
              labelStyle={{
                color: theme.colors.defaults.blackOne,
                marginBottom: "2%",
              }}
              onChangeText={(text) => setBvn(text)}
              placeholder="1234 5678 900"
              wrapperStyle={{ height: 45 }}
              error={error}
              value={bvn}
              keyboardType="number-pad"
              helperText={error ? "Valid BVN is required" : ""}
            />
          </View>
          <View style={styles.submitBtn}>
            <Button onPress={(e) => handleSubmit()} disabled={error}>
              Next
            </Button>
          </View>
          <View style={styles.info}>
            <MaterialCommunityIcons
              size={13}
              name="information"
              color={theme.colors.primary}
            />
            <Text
              onPress={handleOpen}
              style={[styles.infoText, { color: theme.colors.primary }]}
            >
              Why we need your BVN?
            </Text>
          </View>
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
      {open && (
        <BottomSheet
          enablePanDownToClose
          snapPoints={["70%", "80%"]}
          onClose={handleClose}
        >
          <IconButton
            onPress={handleClose}
            icon={"close-circle-outline"}
            iconColor={theme.colors.primary}
            size={32}
            style={{ marginLeft: "auto", marginRight: "10%" }}
          />
          <ScrollView style={{ marginTop: "5%", paddingHorizontal: "5%" }}>
            <Text style={[styles.helpTitle, { color: theme.colors.primary }]}>
              Why we need your BVN?
            </Text>
            <Text
              style={[
                styles.helpText,
                { color: theme.colors.defaults.grayFive },
              ]}
            >
              BVN is a regulatory requirement in many countries’ banking
              systems. It’s used to uniquely identify individuals and prevent
              fraud. Requesting for BVN ensures that users meet these regulatory
              compliance standards.
            </Text>
            <Text
              style={{
                fontFamily: "Primary-Medium",
                fontSize: 15,
                marginTop: "3%",
              }}
            >
              We only have access to your;
            </Text>
            <View style={{ marginRight: "3%" }}>
              <Text style={styles.itemText}>Name</Text>
              <Text style={styles.itemText}>Phone number</Text>
              <Text style={styles.itemText}>Email address</Text>
              <Text style={styles.itemText}>Date of birth</Text>
            </View>
            <Text
              style={[
                styles.helpText,
                { color: theme.colors.defaults.grayFive },
              ]}
            >
              Confirming your bvn won’t grant us access to perform transaction
              in your account. It is important to keep your BVN secure and not
              share it with unauthorized individual to maintain the security of
              your financial information.
            </Text>
          </ScrollView>
        </BottomSheet>
      )}
    </React.Fragment>
  );
};

export default AddBVN;

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  title: {
    marginTop: "5%",
    marginRight: "5%",
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
  submitBtn: {
    marginTop: "20%",
    alignSelf: "center",
  },
  info: {
    marginTop: "10%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  infoText: {
    fontFamily: "Primary-Medium",
    fontSize: 14,
  },
  helpTitle: {
    fontFamily: "Primary-Medium",
    fontSize: 17,
  },
  itemText: {
    fontFamily: "Primary-Medium",
    fontSize: 14,
    marginVertical: "1%",
    color: colors.default.grayFive,
    // marginTop: "3%",
  },
  helpText: {
    fontFamily: "Primary-Medium",
    fontSize: 14,
    marginTop: "3%",
  },
});
