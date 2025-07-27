
import { IShop } from "@/axios/shop/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InititalState {
  shops: IShop[];
  selectedShop: IShop
};

const shopInitialState = {
   _id: "",
    name: "",
    owner: "",
    description: "",
    location: {
        address: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
    },
    slogan: "",
    logo: "", // Optional: Supports both File (upload) or URL (existing)
}
  

const initialState: InititalState = {
  shops: [],
  selectedShop: shopInitialState
};

const userSlice = createSlice({
  name: "shops",
  initialState,
  reducers: { 
    setShops: (state, { payload }: PayloadAction<IShop[]>) => {
      state.shops = payload;
    },
  setAShop: (state, { payload }: PayloadAction<IShop>) => {
      state.selectedShop = payload;
    },
  },
});

const { reducer, actions } = userSlice;
export const { setShops, setAShop } = actions;
export default reducer;
// export the action creator for other components to use it in dispatch() function of redux store
