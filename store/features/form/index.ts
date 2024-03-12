import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IFormState } from "../../types";

const initialState: IFormState = {};

const formSlice = createSlice({
  name: "form-caches",
  initialState,
  reducers: {
    setFormValues: (
      state,
      action: PayloadAction<{ form: string; values: { [key: string]: any } }>
    ) => {
      const { values, form } = action.payload;
      state[form] = values;
    },
  },
});
export const { setFormValues } = formSlice.actions;
export default formSlice.reducer;
