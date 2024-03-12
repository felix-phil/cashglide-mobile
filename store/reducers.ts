import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/auth";
import formReducer from "./features/form";
import { authenticationApi } from "./services/authentication";
import { walletApi } from "./services/wallet";
import { featuresApi } from "./services/features";
import { cardApi } from "./services/card";
import { transactionApi } from "./services/transaction";

const rootReducer = combineReducers({
  auth: authReducer,
  form: formReducer,
  [authenticationApi.reducerPath]: authenticationApi.reducer,
  [walletApi.reducerPath]: walletApi.reducer,
  [featuresApi.reducerPath]: featuresApi.reducer,
  [cardApi.reducerPath]: cardApi.reducer,
  [transactionApi.reducerPath]: transactionApi.reducer
});
export default rootReducer;
