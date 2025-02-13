import { IOrder } from "@/axios/order/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InititalState {
  orders: IOrder[];
};

// Correct initial state
export const initialState: InititalState= {
  orders: [],
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, { payload }: PayloadAction<IOrder[]>) => {
      state.orders = payload;
    },
  },
});

const { reducer, actions } = ordersSlice;
export const { setOrders } = actions;
export default reducer;
