import { IProductTypes } from '@/types/index';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IStoreCartItem extends IProductTypes {
  orderQuantity: number;
}

interface StoreCartState {
  items: IStoreCartItem[];
  totalAmount: number;
}

const initialState: StoreCartState = {
  items: [],
  totalAmount: 0,
};

const storeCartSlice = createSlice({
  name: 'storeCart',
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<IProductTypes>) => {
      const existing = state.items.find(item => item._id === action.payload._id);
      if (existing) {
        existing.orderQuantity += 1;
      } else {
        state.items.push({ ...action.payload, orderQuantity: 1 });
      }
      state.totalAmount = state.items.reduce((acc, item) => acc + (item.salesPrice ? item.salesPrice : item.price) * item.orderQuantity, 0);
    },
   increaseQuantity: (state, action: PayloadAction<string>) => {
  const product = state.items.find(item => item._id === action.payload);
  if (product) {
    product.orderQuantity += 1;
  }
  state.totalAmount = state.items.reduce((acc, item) => acc + (item.salesPrice ? item.salesPrice : item.price) * item.orderQuantity, 0);
},
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const product = state.items.find(item => item._id === action.payload);
      if (product && product.orderQuantity > 1) {
        product.orderQuantity -= 1;
      }
      state.totalAmount = state.items.reduce((acc, item) => acc + (item.salesPrice ? item.salesPrice : item.price) * item.orderQuantity, 0);
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item._id !== action.payload);
      state.totalAmount = state.items.reduce((acc, item) => acc + (item.salesPrice ? item.salesPrice : item.price) * item.orderQuantity, 0);
    },
    clearStoreCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
    }
  },
});

export const { addProduct, increaseQuantity, decreaseQuantity, removeProduct, clearStoreCart } = storeCartSlice.actions;
export default storeCartSlice.reducer;
