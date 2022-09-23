import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  accessToken: string | null;
}

export const initialState: AuthState = {
  accessToken: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<{ token: string | null }>) {
      state.accessToken = action.payload.token;
    },
  },
});

export const { setAccessToken } = authSlice.actions;

export default authSlice.reducer;
