import { ProductTypeStock } from "@/axios/cfStock/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
export const productStockInitialState = {
    _id: "",
    name: "",
    sku: "",
    location: "",
    identifier: "",
    locationType: "",
    locationCategory: "",
    price: 0,
    category: "",
    quantity: 0,
    expiryDate: "", // ISO date "",    quantity: number;
}

interface InititalState {
    stocks: ProductTypeStock[],
    stock: ProductTypeStock,
  
};

const initialState: InititalState = {
  stocks: [],
  stock: productStockInitialState
 
};
  
const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: { 
    setStocks: (state, { payload }: PayloadAction<ProductTypeStock[]>) => {
      state.stocks = payload;
    },
    setAStock: (state, { payload }: PayloadAction<ProductTypeStock>) => {
      state.stock = payload;
    },
  },
});

const { reducer, actions } = stockSlice;
export const { setAStock, setStocks } = actions;
export default reducer;