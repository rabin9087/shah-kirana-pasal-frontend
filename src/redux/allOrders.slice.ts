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

    updateSuppliedQuantity: (state, { payload }: PayloadAction<{ _id: string; supplied: number }>) => {
      if (state.order && state.order?.items.filter((item) => (item._id === payload._id))) {
    state.order = {
      ...state.order,
      items: state.order.items.map(item =>
        item?._id === payload._id ? { ...item, supplied: payload.supplied } : item
      ),
    };
  }
},
  },
});

const { reducer, actions } = ordersSlice;
export const { setOrders, setAOrder, updateSuppliedQuantity } = actions;
export default reducer;
