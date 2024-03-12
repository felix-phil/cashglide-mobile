import Constants from "expo-constants";
const API_HOST = Constants.expoConfig?.extra?.API_URL;

const getEndpoint = (
  endpoint: string = "",
  service = "authentication",
  version = "v1"
) => {
  return API_HOST + "/api" + `/${version}` + `/${service}` + endpoint;
};
export default getEndpoint;

export const apiEndpoints = {
  authentication: {
    INITIALIZE: "/init",
    AUTHENTICATE: "/authenticate",
    REQUEST_VERIFY: "/request-verify",
    VERIFY: "/verify",
    CURRENT_USER: "/me",
    CHECK_USERNAME: "/check-username",
    SECOND_STAGE: "/second-stage",
    REFRESH_TOKEN: "/refresh-token",
    COMPARE_PIN: "/compare-pin",
    ADDBVN: "/add-bvn",
    SEARCH: (identifier: string, single: boolean = true) =>
      "/search-user?identifier=" + identifier + (single ? "&single=true" : ""),
  },
  wallet: {
    WALLET_DETAIL: "/",
    IN_TRANSFER: "/in-transfer",
    BANK_TRANSFER: "/bank-transfer",
  },
  features: {
    SYNC_CONTACTS: "/sync-contacts",
    RECENT_IN_TRANSFER_USERS: "/recent-in-transfer-users",
    BANKS_LIST: "/banks-list",
    VERIFY_ACCOUNT: "/verify-account",
    TRANSFER_FEE: "/transfer-fee",
  },
  card: {
    ALL_CARDS: "/",
    ADD_CARD: "/add-card",
    COMPLETE_OTP: "complete-add-card-otp",
    TOPUP_WITH_CARD: "/topup",
  },
  transactions: {
    ALL_TRANSACTIONS: "/",
    SINGLE_TRANSACTION: (id: string) => "/" + id,
  },
};
