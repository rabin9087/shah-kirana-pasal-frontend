
import { IProductTypes, IStoredAt, Status } from "@/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const productInitialState = {
    _id: "",
    status: {} as Status,
    name: "",
    alternateName: "",
    parentCategoryID: "",
    sku: "",
    description: "",
    image: "",
    slug:"",
    brand: "",
    price: 0,
    quantity: 0,
    productWeight: "",
    storedAt: {} as IStoredAt,
    aggrateRating: 0,
    thumbnail: "",
    qrCodeNumber: "",
    salesPrice: 0,
    salesStartDate: undefined,
    salesEndDate: undefined,
    productReviews: [],
    productLocation: ""
  }
interface InititalState {
    products: IProductTypes[];
    product: IProductTypes
};
const initialState: InititalState = {
    products: [productInitialState],
    product: productInitialState
};

const userSlice = createSlice({
  name: "product",
  initialState,
  reducers: { 
    setProducts: (state, { payload }: PayloadAction<IProductTypes[]>) => {
      state.products = payload;
    },
  setAProduct: (state, { payload }: PayloadAction<IProductTypes>) => {
      state.product = payload;
    },
  },
});

const { reducer, actions } = userSlice;
export const { setProducts, setAProduct } = actions;
export default reducer;
// export the action creator for other components to use it in dispatch() function of redux store
