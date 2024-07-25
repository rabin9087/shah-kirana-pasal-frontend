import { configureStore } from "@reduxjs/toolkit";
import loadingreducer from "./redux/Loading.slice";
import userReducer from "./redux/user.slice";
import sidebarReducer from "./redux/sidebar.slice";
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