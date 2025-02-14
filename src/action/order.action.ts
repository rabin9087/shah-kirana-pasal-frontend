import { getAOrder, getAOrdersByDate, getOrders } from "@/axios/order/order";
import { initialState, setAOrder, setOrders } from "@/redux/allOrders.slice";
import { AppDispatch } from "@/store";

export const getAllOrdersAction = () => async (dispatch: AppDispatch) => {
    try { 
        const res = await getOrders();
        if (res.status === "success") {
            dispatch(setOrders(res.orders))
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
        if (res.status === "success") {
            dispatch(setOrders(res.orders))
            return true
        } 
        dispatch(setOrders(initialState.orders))
        return false
    } catch (error) {
        
    }
};

export const getAOrderAction = (orderNumber: string) => async (dispatch: AppDispatch) => {
    try { 
        const res = await getAOrder(orderNumber);
        if (res.status === "success") {
            dispatch(setAOrder(res.order))
            return true
        } 
        return false
    } catch (error) {
       
    }
};