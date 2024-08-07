
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
  
export type IProductStatus = {
  status: boolean,
  openNotFoundModal: boolean
}

const productStatus = <IProductStatus>{status: false, openNotFoundModal: false}
interface InititalState {
    products: IProductTypes[];
  product: IProductTypes,
  productFoundStatus: IProductStatus,
};

const initialState: InititalState = {
    products: [productInitialState],
    product: productInitialState,
    productFoundStatus: productStatus,
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
  setAProductFoundStatus: (state, { payload }: PayloadAction<IProductStatus>) => {
      state.productFoundStatus = payload
    },
  },
});

const { reducer, actions } = userSlice;
export const { setProducts, setAProduct, setAProductFoundStatus } = actions;
export default reducer;
// export the action creator for other components to use it in dispatch() function of redux store
