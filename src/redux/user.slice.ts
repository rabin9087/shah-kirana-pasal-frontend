import { IUser } from "@/types/index";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

// Reusable default user object
const defaultUser: IUser = {
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
} as const;

export type ICustomer = {
  _id: string,
    email: string,
  phone: string,
  fName: string,
  lName: string, 
}

type TInitialState = {
  user: IUser;
  email_Phone: string;
  customer: ICustomer;
};

export const initialState: TInitialState = {
  user: { ...defaultUser },
  email_Phone: "",
  customer: {
  _id: "",
    email: "",
  phone: "",
  fName: "",
  lName: "", },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<IUser>) => {
      state.user = payload;
    },
    logOut: (state) => {
      localStorage.removeItem("cart");
      localStorage.removeItem("refreshJWT");
      sessionStorage.removeItem("accessJWT");
      state.user = { ...defaultUser };
    },
    setEmail_Phone: (state, { payload }: PayloadAction<string>) => {
      state.email_Phone = payload;
    },
    setRestUser: (state) => { 
      state.user = initialState.user;
      state.email_Phone = initialState.email_Phone;
      state.customer = initialState.customer
    },
    setCustomer: (state, { payload }: PayloadAction<ICustomer>) => { 
      state.customer = payload;
    },
    resetCustomer:  (state) => { 
      state.customer = initialState.customer
    },
  },
});

export const { setUser, logOut, setEmail_Phone, setCustomer, resetCustomer, setRestUser } = userSlice.actions;
export default userSlice.reducer;
