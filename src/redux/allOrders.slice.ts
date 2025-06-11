import { IOrder } from "@/axios/order/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InititalState {
  orders: IOrder[];
  outOfStockOrders: IOrder[];
  order: IOrder | null;
  pickMultipleOrders:  IOrder[];
};

// Correct initial state
export const initialState: InititalState= {
  orders: [],
  order: null,
  outOfStockOrders: [],
  pickMultipleOrders: []
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
    setOutOfStockOrders: (state, { payload }: PayloadAction<IOrder[]>) => {
      state.outOfStockOrders = payload;
    },

    setPickMultipleOrders: (state, { payload }: PayloadAction<IOrder[]>) => {
      state.pickMultipleOrders = payload;
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

   updateOutOfStockSuppliedQuantity: (
  state,
  { payload }: PayloadAction<{ _id: string; supplied: number }>
) => {
  state.outOfStockOrders = state.outOfStockOrders.map(order => {
    const updatedItems = order.items.map(item =>
      item._id === payload._id
        ? { ...item, supplied: payload.supplied }
        : item
    );

    // Check if any item was updated (to avoid unnecessary reassignments)
    const hasUpdated = order.items.some(item => item._id === payload._id);

    return hasUpdated ? { ...order, items: updatedItems } : order;
  });
    },
   
    updatePickMultipleOrdersSuppliedQuantity: (
  state,
  { payload }: PayloadAction<{ _id: string; supplied: number }>
) => {
  state.pickMultipleOrders = state.pickMultipleOrders.map(order => {
    const updatedItems = order.items.map(item =>
      item._id === payload._id
        ? { ...item, supplied: payload.supplied }
        : item
    );

    // Check if any item was updated (to avoid unnecessary reassignments)
    const hasUpdated = order.items.some(item => item._id === payload._id);

    return hasUpdated ? { ...order, items: updatedItems } : order;
  });
},

  },
});

const { reducer, actions } = ordersSlice;
export const { setOrders, setAOrder, setOutOfStockOrders, updateSuppliedQuantity, updateOutOfStockSuppliedQuantity, setPickMultipleOrders, updatePickMultipleOrdersSuppliedQuantity } = actions;
export default reducer;
