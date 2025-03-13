import { configureStore } from "@reduxjs/toolkit";
import loadingReducer from "./redux/Loading.slice";
import userReducer from "./redux/user.slice";
import sidebarReducer from "./redux/sidebar.slice";
import categoryReducer from "./redux/category.slice";
import productReducer from "./redux/product.slice";
import addToCartReducer from "./redux/addToCart.slice";
import dashboardDataSlice from "./redux/dashboard.slice";
import ordersSlice from "./redux/allOrders.slice";
import settingsReducer from "./redux/setting.slice";

import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";

// Define persist configurations
const cartPersistConfig = {
  key: "cart",
  storage,
};

const settingsPersistConfig = {
  key: "settings",
  storage,
};

// Wrap reducers with persistReducer
const persistedCartReducer = persistReducer(cartPersistConfig, addToCartReducer);
const persistedSettingsReducer = persistReducer(settingsPersistConfig, settingsReducer);

// Combine all reducers
const rootReducer = combineReducers({
  loader: loadingReducer,
  sidebar: sidebarReducer,
  userInfo: userReducer,
  categoryInfo: categoryReducer,
  productInfo: productReducer,
  addToCartInfo: persistedCartReducer,
  dashboardData: dashboardDataSlice,
  ordersInfo: ordersSlice,
  settings: persistedSettingsReducer, // Persist settings slice
});

// Create the Redux store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

// Persist the store
export const persistedStore = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
