import { configureStore } from "@reduxjs/toolkit";
import loadingreducer from "./redux/Loading.slice";
import userReducer from "./redux/user.slice";
import sidebarReducer from "./redux/sidebar.slice";
import categoryReducer from "./redux/category.slice";
import productReducer from "./redux/product.slice";
export const store = configureStore({
  reducer: {
    loader: loadingreducer,
    sidebar: sidebarReducer,
    userInfo: userReducer,
    categoryInfo: categoryReducer,
    productInfo: productReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;