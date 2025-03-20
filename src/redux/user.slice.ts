import { IUser } from "@/types/index";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type TinititalState = {
  user: IUser;
  email_Phone: string | "";
};
export const initialState: TinititalState = {
  user: {
    _id: "",
    role: "",
    email: "",
    fName: "",
    lName: "",
    __v: 0,
    address: "",
    createdAt: "",
    isVerified: false,
    phone: "",
    profile: "",
    cart: [],
    cartHistory: [],
    status: "",
    updatedAt: "",
    verificationCode: "",
  },
  email_Phone: ""
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<IUser>) => {
      state.user = payload;
    },
    logOut: (state) => {
      localStorage.removeItem("cart")
      localStorage.removeItem("refreshJWT");
      sessionStorage.removeItem("accessJWT");
      state.user = initialState.user;
    },
    setEmail_Phone: (state, {payload}: PayloadAction<string>) => {
      state.email_Phone = payload
    },
//     setCart: (state, { payload }: PayloadAction<IAddToCartTypes>) => {
//   const existingProductIndex = state.user.cart.findIndex(
//     (item) => item?.product_id === payload?.product_id
//   );

//   if (existingProductIndex !== -1) {
//     // If the product exists, update the quantity
//     state.user.cart[existingProductIndex].orderQuantity += payload.orderQuantity;
//   } else {
//     // If the product does not exist, add it to the cart
//     state.user.cart.push(payload);
//   }
// },
  },
});

const { reducer, actions } = userSlice;
export const { setUser, logOut, setEmail_Phone } = actions;
export default reducer;
// export the action creator for other components to use it in dispatch() function of redux store
