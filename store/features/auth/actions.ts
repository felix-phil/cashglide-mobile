import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getOnboardPassed,
  checkPinExist,
  removeAuthDetails,
} from "../../../services/storage";

export const setOnboard = createAsyncThunk(
  "auth/onboard",
  async (_: undefined, thunkApi) => {
    try {
      const onboadPassed = await getOnboardPassed();
      // console.log(typeof onboadPassed)
      return { onboadPassed };
    } catch (err) {
      const error = new Error("Unable to get storage");
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const setPinExists = createAsyncThunk(
  "auth/pinExists",
  async (_: undefined, thunkApi) => {
    try {
      const pinExists = await checkPinExist();
      // console.log(typeof onboadPassed)
      return { pinExists };
    } catch (err) {
      const error = new Error("Unable to get storage");
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_: undefined, thunkApi) => {
    try {
      await removeAuthDetails();
      return { done: true };
    } catch (err) {
      const error = new Error("Unable to get storage");
      return thunkApi.rejectWithValue(error.message);
    }
  }
);
