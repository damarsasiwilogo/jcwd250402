import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    isLoggedIn: JSON.parse(window.localStorage.getItem("isLoggedIn")) || false,
    isTenant: JSON.parse(window.localStorage.getItem("isTenant")) || false,
    userId: window.localStorage.getItem("userId") || null,
  },
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.userId = action.payload.id;
      window.localStorage.setItem("token", action.payload.token);
      window.localStorage.setItem("userId", action.payload.id);
      window.localStorage.setItem("isLoggedIn", JSON.stringify(true));
    },
    logout(state) {
      state.isLoggedIn = false;
      state.isTenant = false;
      state.token = null;
      state.userId = null;
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("isLoggedIn");
      window.localStorage.removeItem("isTenant");
      window.localStorage.removeItem("userId");
    },
    tenantLogin(state, action) {
      state.isTenant = true;
      state.token = action.payload.token;
      state.userId = action.payload.id;
      state.isLoggedIn = true;
      window.localStorage.setItem("isTenant", JSON.stringify(true));
      window.localStorage.setItem("token", action.payload.token);
      window.localStorage.setItem("userId", action.payload.id);
      window.localStorage.setItem("isLoggedIn", JSON.stringify(true));
    },
    isTenantLogout(state) {
      state.isTenant = false;
      window.localStorage.removeItem("isTenant");
    },
  },
});

export const { login, logout, tenantLogin, isTenantLogout } = authSlice.actions;
export default authSlice.reducer;
