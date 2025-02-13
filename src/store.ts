import { configureStore} from "@reduxjs/toolkit";
import loadingreducer from "./redux/Loading.slice";
import userReducer from "./redux/user.slice";
import sidebarReducer from "./redux/sidebar.slice";
import categoryReducer from "./redux/category.slice";
import productReducer from "./redux/product.slice";
import addToCartReducer from "./redux/addToCart.slice";
import dashboardDataSlice from "./redux/dashboard.slice";
import ordersSlice from "./redux/allOrders.slice";
import storage from 'redux-persist/lib/storage'
import {persistStore,persistReducer} from 'redux-persist'

const persistStorage = {
  key: 'cart',
  storage
}

const persistedReducer = persistReducer(persistStorage, addToCartReducer)
export const store = configureStore({
  reducer: {
    loader: loadingreducer,
    sidebar: sidebarReducer,
    userInfo: userReducer,
    categoryInfo: categoryReducer,
    productInfo: productReducer,
    addToCartInfo: persistedReducer,
    dashboardData: dashboardDataSlice,
    ordersInfo: ordersSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
})
export const persistedStore=persistStore(store)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;