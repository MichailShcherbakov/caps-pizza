import { createSlice } from "@reduxjs/toolkit";

export interface ConfigState {
  maxOrdersPerProductAllowedNumber: number;
}

export const initialState: ConfigState = {
  maxOrdersPerProductAllowedNumber: 10,
};

export const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {},
});

export default configSlice.reducer;
