import { getOrders } from "@/axios/order/order";
import { setOrders } from "@/redux/allOrders.slice";
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


// export const getAOrderAction = (orderNumber: string) => async (dispatch: AppDispatch) => {
//     try { 
//         const res = await getAOrder(orderNumber);
//         if (res.status === "success") {
//             dispatch(setAOrder(res.order))
//             return true
//         } 
//         return false
//     } catch (error) {
       
//     }
// };