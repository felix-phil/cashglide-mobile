import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAuthState } from "../../types";
import { logout, setOnboard, setPinExists } from "./actions";

const initialState: IAuthState = {
  status: "loading",
  onboardingPassed: false,
  registrationCompleted: false,
  pinExists: false,
};

interface AuthencationPayload {
  token: string;
  refreshToken: string;
  registrationCompleted: boolean;
  id: string;
  username?: string;
  tokenExpiry: string;
  refreshTokenExpiry: string;
  primaryIdentifier: string;
}
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authenticate: (state, action: PayloadAction<AuthencationPayload>) => {
      const {
        token,
        refreshToken,
        refreshTokenExpiry,
        id,
        username,
        tokenExpiry,
        primaryIdentifier,
        registrationCompleted
      } = action.payload;
      state.token = token;
      state.id = id;
      state.username = username;
      state.refreshToken = refreshToken;
      state.tokenExpiry = new Date(tokenExpiry).toISOString();
      state.primaryIdentifier = primaryIdentifier;
      state.refreshTokenExpiry = new Date(refreshTokenExpiry).toISOString();
      state.registrationCompleted = registrationCompleted
      state.status = "authenticated";
    },
    logout: (state) => {
      state.status = "unauthenticated";
      state.token = undefined;
      state.refreshToken = undefined;
      state.tokenExpiry = undefined;
      state.refreshTokenExpiry = undefined;
      state.username = undefined;
      state.registrationCompleted = false;
      state.id = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      setOnboard.fulfilled,
      (state, action: PayloadAction<{ onboadPassed: boolean }>) => {
        state.onboardingPassed = action.payload.onboadPassed;
      }
    );
    builder.addCase(
      setPinExists.fulfilled,
      (state, action: PayloadAction<{ pinExists: boolean }>) => {
        state.pinExists = action.payload.pinExists;
      }
    );
    builder.addCase(
      logout.fulfilled,
      (state, action: PayloadAction<{ done: boolean }>) => {
        state.status = "unauthenticated";
        state.token = undefined;
        state.refreshToken = undefined;
        state.tokenExpiry = undefined;
        state.refreshTokenExpiry = undefined;
        state.username = undefined;
        state.registrationCompleted = false;
        state.id = undefined;
        state.pinExists = false;
      }
    );
  },
});
export const { authenticate } = authSlice.actions;
export default authSlice.reducer;
