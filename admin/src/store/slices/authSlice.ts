import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface AuthState {
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  isAuthenticated: !!Cookies.get("accessKey"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state) => {
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      Cookies.remove("accessKey");
    },
    checkAuth: (state) => {
      state.isAuthenticated = !!Cookies.get("accessKey");
    },
  },
});

export const { login, logout, checkAuth } = authSlice.actions;
export default authSlice.reducer;
