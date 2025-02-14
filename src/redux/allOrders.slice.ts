import { IOrder } from "@/axios/order/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InititalState {
  orders: IOrder[];
  order: IOrder | null;
};

// Correct initial state
export const initialState: InititalState= {
  orders: [],
  order: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, { payload }: PayloadAction<IOrder[]>) => {
      state.orders = payload;
    },
    setAOrder: (state, { payload }: PayloadAction<IOrder>) => {
      state.order = payload;
    },
  },
});

const { reducer, actions } = ordersSlice;
export const { setOrders, setAOrder } = actions;
export default reducer;
