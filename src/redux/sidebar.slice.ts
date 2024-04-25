import { createSlice } from "@reduxjs/toolkit";

const sidebarReducer = createSlice({
  name: "sidebar",
  initialState: {
    open: false,
  },
  reducers: {
    toggleSideBar(state) {
      state.open = !state.open;
    },
  },
});
const { actions, reducer } = sidebarReducer;
export const { toggleSideBar } = actions;
export default reducer;
