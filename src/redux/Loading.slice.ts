import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
};
const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
  },
});

const { actions, reducer } = loadingSlice;
export const { setLoading } = actions;
export default reducer;
