
import { ICategoryTypes } from "@/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
interface InititalState {
  categories: ICategoryTypes[];
};
const initialState: InititalState = {
  categories: [{
    _id: "",
    name: '',
    slug: "",
    status: "",
    description: "",
  }]
};

const userSlice = createSlice({
  name: "category",
  initialState,
  reducers: { 
    setCategory: (state, { payload }: PayloadAction<ICategoryTypes[]>) => {
      state.categories = payload;
    },
  
  },
});

const { reducer, actions } = userSlice;
export const { setCategory } = actions;
export default reducer;
// export the action creator for other components to use it in dispatch() function of redux store
