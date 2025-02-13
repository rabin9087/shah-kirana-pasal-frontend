import { getAOrdersByDate, getOrders } from "@/axios/order/order";
import { initialState, setOrders } from "@/redux/allOrders.slice";
import { AppDispatch } from "@/store";

export const getAllOrdersAction = () => async (dispatch: AppDispatch) => {
    try { 
        const res = await getOrders();
        if (res.status === "success") {
            dispatch(setOrders(res.orders))
            console.log(res.orders)
            return true
        }
        return false
    } catch (error) {
        console.log(error)
    }
};

export const getAllOrdersByDateAction = (date: string) => async (dispatch: AppDispatch) => {
    try { 
        const res = await getAOrdersByDate(date);
        console.log(res)
        if (res.status === "success") {
            dispatch(setOrders(res.orders))
            return true
        } 
        dispatch(setOrders(initialState.orders))
        return false
    } catch (error) {
        console.log(error)
    }
};