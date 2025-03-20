
import { IStoredAt } from "@/axios/product/types";
import { IProductTypes, Status } from "@/types";
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
  selectedProducts: IProductTypes[];
  product: IProductTypes,
  productFoundStatus: IProductStatus,
};

const initialState: InititalState = {
  products: [],
  selectedProducts: [],
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
    addProducts: (state, action) => {
    const existingIds = new Set(state.products.map((product) => product._id));
    const newProducts = action.payload.filter(
      (product: IProductTypes) => !existingIds.has(product._id)
    );
    state.products = [...state.products, ...newProducts];
  },
  setAProduct: (state, { payload }: PayloadAction<IProductTypes>) => {
      state.product = payload;
    },
  setAProductFoundStatus: (state, { payload }: PayloadAction<IProductStatus>) => {
      state.productFoundStatus = payload
    },
  setSelectedProducts: (state, { payload }: PayloadAction<IProductTypes[]>) => {
      state.selectedProducts = payload;
    },
  },
});

const { reducer, actions } = userSlice;
export const { setProducts, setAProduct, setAProductFoundStatus, setSelectedProducts, addProducts } = actions;
export default reducer;
// export the action creator for other components to use it in dispatch() function of redux store
