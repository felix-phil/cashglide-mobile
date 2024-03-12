import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Hashing } from "./hashing";

type AuthDetails = {
  token: string;
  tokenExpiry: string;
  id: string;
  refreshToken: string;
  refreshTokenExpiry: string;
};
export const setAuthDetails = async (details: AuthDetails) => {
  try {
    await AsyncStorage.setItem("authInfo", JSON.stringify(details));
  } catch (error) {
    throw error;
  }
};

export const removeAuthDetails = async () => {
  try {
    await AsyncStorage.removeItem("authInfo");
    await SecureStore.deleteItemAsync("transPIN");
    await SecureStore.deleteItemAsync("plainTransPin");
  } catch (error) {
    throw error;
  }
};
export const getAuthDetails = async () => {
  try {
    const authDetails = await AsyncStorage.getItem("authInfo");
    return authDetails !== null
      ? (JSON.parse(authDetails) as AuthDetails)
      : null;
  } catch (error) {
    throw error;
  }
};

export const setOnboardingPassed = async () => {
  try {
    await AsyncStorage.setItem("showOnBoard", "true");
  } catch (error) {
    throw error;
  }
};

export const getOnboardPassed = async () => {
  try {
    const onboardPassed = await AsyncStorage.getItem("showOnBoard");
    return onboardPassed !== null ? true : false;
  } catch (error) {
    throw error;
  }
};
export const storePin = async (pin: string) => {
  try {
    const hashedPin = await Hashing.toHash(pin);
    await SecureStore.setItemAsync("transPIN", hashedPin);
    await SecureStore.setItemAsync("plainTransPin", pin);
  } catch (error) {
    throw new Error(`Unable to set pin: ${(error as any).message}`);
  }
};

export const getPlainPin = async () => {
  try {
    const pin = await SecureStore.getItemAsync("plainTransPin");
    return pin;
  } catch (error) {
    return null;
  }
};

export const checkPinExist = async () => {
  try {
    const pin = await SecureStore.getItemAsync("transPIN");
    if (pin) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};
export const validatePin = async (str: string) => {
  try {
    const pin = await SecureStore.getItemAsync("transPIN");
    if (!pin) {
      return false;
    }
    const isEqual = await Hashing.compare(pin, str);
    return isEqual;
  } catch (error) {
    return false;
  }
};
// export const storeUserEmailAndPassword = async ({
//   email,
//   password,
// }: {
//   email: string;
//   password: string;
// }) => {
//   try {
//     await SecureStore.setItemAsync(
//       "loginDetails",
//       JSON.stringify({ email, password })
//     );
//   } catch (error) {
//     throw error;
//   }
// };

// export const removeEmailAndPassword = async () => {
//   try {
//     await SecureStore.deleteItemAsync("loginDetails");
//   } catch (error) {
//     throw error;
//   }
// };

// export const getUserEmailAndPassword = async () => {
//   try {
//     const result = await SecureStore.getItemAsync("loginDetails");
//     return result !== null
//       ? (JSON.parse(result) as { email: string; password: string })
//       : null;
//   } catch (error) {
//     return null;
//   }
// };

export const storeUserPushTokenToDevice = async (pushToken: string) => {
  try {
    await AsyncStorage.setItem("pushToken", pushToken);
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const checkUserHasSyncTokenWithServer = async () => {
  try {
    const token = await AsyncStorage.getItem("pushToken");
    return token;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const clearUserPushToken = async () => {
  try {
    await AsyncStorage.removeItem("pushToken");
    return null;
  } catch (error) {
    console.log(error);
  }
};

export const enableLocalAuth = async () => {
  try {
    await AsyncStorage.setItem("localAuth", "true");
  } catch (error) {
    console.log(error);
  }
};
export const getLocalAuthStatus = async () => {
  try {
    const localAuth = await AsyncStorage.getItem("localAuth");
    return localAuth ? true : false;
  } catch (error) {
    return false;
  }
};
export const getContactSync = async () => {
  try {
    const synced = await AsyncStorage.getItem("contactSync");
    return synced;
  } catch (error) {
    return false;
  }
};
export const markContactSync = async () => {
  try {
    const nextSevenDays = new Date(
      new Date().setHours(new Date().getHours() + 24 * 8)
    );
    await AsyncStorage.setItem("contactSync", nextSevenDays.toISOString());
  } catch (error) {}
};
