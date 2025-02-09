import { IAddToCartTypes } from "@/pages/addToCart";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InititalState {
  cart: IAddToCartTypes[];
};

export const initialState: InititalState = {
  cart:[]
};

const userSlice = createSlice({
  name: "cart",
  initialState,
  reducers: { 
    setAddToCart: (state, { payload }: PayloadAction<IAddToCartTypes>) => {
      const index = state.cart.findIndex((cartItem) => cartItem._id === payload._id) 
      const filter = state.cart.findIndex((cart) => cart._id === payload._id && payload.orderQuantity === 0)

       if (payload.orderQuantity === 0) {
            state.cart.splice(filter, 1)
          }
       else if (index > -1) {
         const orderQuantityPayload = payload?.orderQuantity !== undefined ? payload?.orderQuantity : 0
         state.cart.filter(cartItem => cartItem._id)[index].orderQuantity = orderQuantityPayload
          if (payload.note !== undefined) {
            state.cart[index].note = payload.note;
        }
       } 
    
       else {
          state.cart.push(payload)
       }
    },
  
    resetCart: (state) => {
      state.cart=[]
    }
  },
});

const { reducer, actions } = userSlice;
export const { setAddToCart, resetCart } = actions;
export default reducer;
// export the action creator for other components to use it in dispatch() function of redux store