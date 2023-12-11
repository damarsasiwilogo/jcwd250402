import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import logger from "redux-logger";
import {
  loginModalSlice,
  tenantRegisterSlice,
  userRegisterSlice,
  verifyRegisterUserSlice,
  propertyDeleteSlice,
} from "./components/hooks/modalSlice";
import authSlice from "./components/slice/authSlices";

const middleware = [logger];

const persistConfig = {
  key: "root",
  timeout: 500,
  storage,
  blacklist: [
    "loginModal",
    "tenantRegister",
    "userRegister",
    "verifyRegisterUser",
    "propertyDelete",
  ],
};

const rootReducer = combineReducers({
  auth: authSlice,
  loginModal: loginModalSlice.reducer,
  tenantRegister: tenantRegisterSlice.reducer,
  userRegister: userRegisterSlice.reducer,
  verifyRegisterUser: verifyRegisterUserSlice.reducer,
  propertyDelete: propertyDeleteSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware,
});

const persistor = persistStore(store);

export { store, persistor };
