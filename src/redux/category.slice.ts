
import { ICategoryTypes } from "@/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InititalState {
  categories: ICategoryTypes[];
  selectedCategory: ICategoryTypes
};

const categoryInitialState = {
    _id: "",
    name: '',
    slug: "",
    status: "",
    description: "",
  }

const initialState: InititalState = {
  categories: [],
  selectedCategory: categoryInitialState
};

const userSlice = createSlice({
  name: "category",
  initialState,
  reducers: { 
    setCategory: (state, { payload }: PayloadAction<ICategoryTypes[]>) => {
      state.categories = payload;
    },
  setACategory: (state, { payload }: PayloadAction<ICategoryTypes>) => {
      state.selectedCategory = payload;
    },
  },
});

const { reducer, actions } = userSlice;
export const { setCategory, setACategory } = actions;
export default reducer;
// export the action creator for other components to use it in dispatch() function of redux store
