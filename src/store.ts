import { configureStore, combineReducers } from "@reduxjs/toolkit";
import loadingReducer from "./redux/Loading.slice";
import userReducer from "./redux/user.slice";
import sidebarReducer from "./redux/sidebar.slice";
import categoryReducer from "./redux/category.slice";
import productReducer from "./redux/product.slice";
import addToCartReducer from "./redux/addToCart.slice";
import dashboardDataSlice from "./redux/dashboard.slice";
import ordersSlice from "./redux/allOrders.slice";
import settingsReducer from "./redux/setting.slice";
import storeCartReducer from "./redux/storeCart.slice";
import shopsReducer from "./redux/shop.slice";
import stockReducer from "./redux/stock.slice";

import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";

// Persist configurations
const cartPersistConfig = {
  key: "cart",
  storage,
};

const settingsPersistConfig = {
  key: "settings",
  storage,
};

const storeCartPersistConfig = {
  key: "storeCart",
  storage,
};

const shopsPersistConfig = {
  key: "shops",
  storage,
};

// Wrap reducers with persist
const persistedCartReducer = persistReducer(cartPersistConfig, addToCartReducer);
const persistedSettingsReducer = persistReducer(settingsPersistConfig, settingsReducer);
const persistedStoreCartReducer = persistReducer(storeCartPersistConfig, storeCartReducer);
const persistedShopsReducer = persistReducer(shopsPersistConfig, shopsReducer);

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
  storeCart: persistedStoreCartReducer, // persisted storeCart
  settings: persistedSettingsReducer,
  shopsInfo: persistedShopsReducer,
  stockInfo: stockReducer,
});

// Create the store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

// Persistor
export const persistedStore = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
