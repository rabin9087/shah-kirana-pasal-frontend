import { IUser } from "@/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
type TinititalState = {
  user: IUser;
  email_Phone: string;
};
const initialState: TinititalState = {
  user: {
    _id: "",
    role: "USER",
    email: "",
    fName: "",
    lName: "",
    __v: 0,
    address: "",
    createdAt: "",
    isVerified: false,
    phone: "",
    profile: "",
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
      state.user = initialState.user;
    },
    setEmail_Phone: (state, {payload}: PayloadAction<string>) => {
      state.email_Phone = payload
    }
  },
});

const { reducer, actions } = userSlice;
export const { setUser, logOut, setEmail_Phone } = actions;
export default reducer;
// export the action creator for other components to use it in dispatch() function of redux store
