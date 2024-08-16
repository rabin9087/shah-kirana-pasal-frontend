import { IAddToCartTypes } from "@/pages/addToCart";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const getCart = () => {
      const cart = localStorage.getItem("cart");
      const value = (JSON.parse(cart as string))
      return value
    };
const cart = getCart()

interface InititalState {
  cart: IAddToCartTypes[];
};

const initialState: InititalState = {
  cart: cart || [],
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
       else if(index > -1) {
              state.cart.filter(cartItem => cartItem._id)[index].orderQuantity = payload.orderQuantity
          } 
      else {
              state.cart.push(payload)
       }
    localStorage.setItem("cart", JSON.stringify(state.cart))
    },
  
  },
});

const { reducer, actions } = userSlice;
export const { setAddToCart,  } = actions;
export default reducer;
// export the action creator for other components to use it in dispatch() function of redux store