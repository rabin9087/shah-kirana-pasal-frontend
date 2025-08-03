// redux/addToCart.slice.ts
import { IProductComboOffer } from "@/axios/productComboOffer/types";
import { IAddToCartTypes } from "@/pages/addToCart";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InititalState {
  cart: (IAddToCartTypes | IProductComboOffer)[];
  clientSecret: string | null;
  storedPaymentIntentId: string | null;
}

export const initialState: InititalState = {
  cart: [],
  clientSecret: null,
  storedPaymentIntentId: null,
};

const addToCartSlice = createSlice({
  name: "addToCartInfo",
  initialState,
  reducers: {
    setAddToCart: (state, { payload }: PayloadAction<IAddToCartTypes | IProductComboOffer>) => {
      const index = state.cart.findIndex((cartItem) => cartItem._id === payload._id);

      if (payload.orderQuantity === 0) {
        if (index > -1) {
          state.cart.splice(index, 1);
        }
      } else if (index > -1) {
        const item = state.cart[index] as IAddToCartTypes | IProductComboOffer;
        item.orderQuantity = payload.orderQuantity ?? 0;
        if (payload.note !== undefined) item.note = payload.note;
      } else {
        state.cart.push(payload);
      }
    },

    resetCart: (state) => {
      state.cart = [];
      state.clientSecret = null;
      state.storedPaymentIntentId = null;
    },

    setClientSecret: (state, action: PayloadAction<string>) => {
      state.clientSecret = action.payload;
    },

    setStoredPaymentIntentId: (state, action: PayloadAction<string>) => {
      state.storedPaymentIntentId = action.payload;
    },
  },
});

export const { setAddToCart, resetCart, setClientSecret, setStoredPaymentIntentId } = addToCartSlice.actions;
export default addToCartSlice.reducer;
