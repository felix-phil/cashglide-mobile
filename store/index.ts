import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";
import { authenticationApi } from "./services/authentication";
import { walletApi } from "./services/wallet";
import { featuresApi } from "./services/features";
import { cardApi } from "./services/card";
import { transactionApi } from "./services/transaction";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: true,
      serializableCheck: true,
    }).concat([
      authenticationApi.middleware,
      walletApi.middleware,
      featuresApi.middleware,
      cardApi.middleware,
      transactionApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
