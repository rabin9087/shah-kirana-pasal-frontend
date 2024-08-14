import { IAddToCartTypes } from "@/pages/addToCart";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InititalState {
  cart: IAddToCartTypes[];
};

const initialState: InititalState = {
  cart: [],
};

const userSlice = createSlice({
  name: "cart",
  initialState,
  reducers: { 
    setAddToCart: (state, { payload }: PayloadAction<IAddToCartTypes>) => {
      const index = state.cart.findIndex((cartItem) => cartItem._id === payload._id) 
      // {console.log(payload.orderQuantity)}
      const filter = state.cart.findIndex((cart) => cart._id === payload._id && payload.orderQuantity === 0)
      console.log(filter)
      console.log(payload.orderQuantity)
       if (payload.orderQuantity === 0) {
            state.cart.splice(filter, 1)
          }
       else if(index > -1) {
              state.cart.filter(cartItem => cartItem._id)[index].orderQuantity = payload.orderQuantity
          } 
      else {
              state.cart.push(payload)
          }
    },
  
  },
});

const { reducer, actions } = userSlice;
export const { setAddToCart,  } = actions;
export default reducer;
// export the action creator for other components to use it in dispatch() function of redux store