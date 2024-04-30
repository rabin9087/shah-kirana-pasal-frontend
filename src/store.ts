import { configureStore } from "@reduxjs/toolkit";
import loadingreducer from "../src/redux/Loading.slice";
import userReducer from "../src/redux/user.slice";
import sidebarReducer from "../src/redux/sidebar.slice";
export const store = configureStore({
  reducer: {
    loader: loadingreducer,
    sidebar: sidebarReducer,
    userInfor: userReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;