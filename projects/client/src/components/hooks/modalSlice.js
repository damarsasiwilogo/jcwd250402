import { createSlice } from "@reduxjs/toolkit";

const loginModalSlice = createSlice({
  name: "loginModal",
  initialState: { isOpen: false },
  reducers: {
    openLoginModal(state) {
      state.isOpen = true;
    },
    closeLoginModal(state) {
      state.isOpen = false;
    },
  },
});

const tenantRegisterSlice = createSlice({
  name: "tenantRegister",
  initialState: { isOpen: false },
  reducers: {
    openTenantRegister(state) {
      state.isOpen = true;
    },
    closeTenantRegister(state) {
      state.isOpen = false;
    },
  },
});

const userRegisterSlice = createSlice({
  name: "userRegister",
  initialState: { isOpen: false },
  reducers: {
    openUserRegister(state) {
      state.isOpen = true;
    },
    closeUserRegister(state) {
      state.isOpen = false;
    },
  },
});

const verifyRegisterUserSlice = createSlice({
  name: "verifyRegisterUser",
  initialState: { isOpen: false },
  reducers: {
    openVerifyRegisterUser(state) {
      state.isOpen = true;
    },
    closeVerifyRegisterUser(state) {
      state.isOpen = false;
    },
  },
});

const propertyDeleteSlice = createSlice({
  name: "propertyDelete",
  initialState: {
    isOpen: false,
    propertyId: null,
  },
  reducers: {
    openPropertyDelete(state) {
      state.isOpen = true;
    },
    closePropertyDelete(state) {
      state.isOpen = false;
      state.propertyId = null;
    },
    setPropertyId(state, action) {
      state.propertyId = action.payload;
    },
  },
});

export {
  propertyDeleteSlice,
  loginModalSlice,
  tenantRegisterSlice,
  userRegisterSlice,
  verifyRegisterUserSlice,
};
