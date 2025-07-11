import { IOrder } from "@/axios/order/types";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useEffect, useState } from "react";
import OrderDetails from "./OrderDetails";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, subDays } from "date-fns";

import { initialState, setOrders } from "@/redux/allOrders.slice";

interface IOrderList {
    data: IOrder[];
    date: Date;
    setDate: (date: Date) => void;
}

const OrdersList = ({ data, date, setDate }: IOrderList) => {

    const dispatch = useAppDispatch()
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    const { orders } = useAppSelector(s => s.ordersInfo)

    const changeDate = async (newDate: Date) => {
        setDate(newDate);
    };

    const totalAmount = data.reduce((acc, { amount }) => {
        return acc + amount
    }, 0)

    // const itemsToPick = data.filter(({ deliveryStatus }) => (deliveryStatus !== "packed"))
    // console.log(itemsToPick)

    useEffect(() => {
        if (data?.length && JSON.stringify(data) !== JSON.stringify(orders)) {
            dispatch(setOrders(data as IOrder[]));
        } else if (data.length < 1) {
            dispatch(setOrders(initialState.orders));
        }
    }, [dispatch, data, orders]);
    return (
        <div className="container mx-auto p-4">
            {/* <h2 className="text-2xl font-semibold mb-4">Orders</h2>  */}
            <div className="flex justify-center gap-2 mb-4">

                <button
                    type="button"
                    className="p-2 border rounded-md hover:bg-gray-200"
                    onClick={() => changeDate(subDays(date, 1))}
                >
                    <ChevronLeft size={16} />
                </button>

                {/* Date Input */}
                <div className="relative">
                    <input
                        type="date"
                        className="border rounded-md px-3 py-2"
                        value={format(date, "yyyy-MM-dd")}
                        onChange={(e) => changeDate(new Date(e.target.value))}
                    />
                    {/* <CalendarIcon className="absolute right-2 top-3 text-gray-500" size={16} /> */}
                </div>

                {/* Next Day Button */}
                <button
                    type="button"
                    className="p-2 border rounded-md hover:bg-gray-200"
                    onClick={() => changeDate(addDays(date, 1))}
                >
                    <ChevronRight size={16} />
                </button>
                {/* </div> */}
            </div>
            {orders?.length ? (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    {/* Responsive Table Wrapper */}
                    {<div className="w-full overflow-x-auto">
                        <table className="w-full border-collapse min-w-[600px]">
                            <thead>
                                <tr className="bg-gray-200 text-sm md:text-base">
                                    <th className="p-2 text-left whitespace-nowrap">Order #</th>
                                    <th className="p-2 text-left whitespace-nowrap">Name</th>
                                    <th className="p-2 text-left whitespace-nowrap">Amount</th>
                                    <th className="p-2 text-left whitespace-nowrap">Status</th>
                                    <th className="p-2 text-left whitespace-nowrap">Payment</th>
                                    <th className="p-2 text-left whitespace-nowrap">Ordered Date</th>
                                    <th className="p-2 text-left whitespace-nowrap">Pickup Date</th>
                                    {/* <th className="p-2 text-left whitespace-nowrap">Supplied_All</th> */}
                                    <th className="p-2 text-left whitespace-nowrap">Articles</th>
                                    <th className="p-2 text-left whitespace-nowrap">Picker</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders?.map((order) => (
                                    <tr
                                        key={order?._id}
                                        className="border-b cursor-pointer hover:bg-gray-100"
                                        onClick={() => setSelectedOrder(order)}>
                                        <td className="p-2 text-blue-500 underline whitespace-nowrap">{order?.orderNumber}</td>
                                        <td className="p-2 whitespace-nowrap overflow-hidden text-ellipsis">{order?.name}</td>
                                        <td className="p-2 whitespace-nowrap">${order?.amount?.toFixed(2)}</td>
                                        <td className={`p-2 whitespace-nowrap 
                                                ${order?.deliveryStatus === "Order placed" && "text-primary"}
                                                ${order?.deliveryStatus === "Packed" && "text-green-300"}
                                                 ${order?.deliveryStatus === "Completed" && "text-green-600"}
                                                ${order?.deliveryStatus === "Picking" && "text-yellow-500"}
                                                ${order?.deliveryStatus === "Cancelled" && "text-red-500"}
                                                ${order?.deliveryStatus === "Collected" && "text-green-400"}
                                            `}>
                                            {order?.deliveryStatus}
                                        </td>
                                        <td className={`p-2 whitespace-nowrap ${order?.paymentStatus === "Paid" ? "text-green-500" : "text-red-500"}`}>{order?.paymentStatus}</td>
                                        <td className="p-2 whitespace-nowrap">{order?.createdAt?.toLocaleString().split("T")[0]}</td>
                                        <td className="p-2 whitespace-nowrap">{order?.requestDeliveryDate}</td>
                                        {/* <td className="p-2 whitespace-nowrap text-center">{order?.items?.reduce((acc, { supplied }) => {
                                            return acc + (supplied as number)
                                        }, 0) === order?.items?.reduce((acc, { quantity }) => {
                                            return acc + (quantity as number)
                                        }, 0) ? "✅ Yes" : "❌ NO"}
                                        </td> */}
                                        <td className="p-2 whitespace-nowrap text-center">
                                            {order?.items?.reduce((acc, { supplied }) => {
                                                return acc + (supplied as number)
                                            }, 0)}/{order?.items?.reduce((acc, { quantity }) => {
                                                return acc + (quantity as number)
                                            }, 0)}</td>
                                        <td className="p-2 whitespace-nowrap text-center"> {order?.picker?.name}</td>
                                    </tr>

                                ))}
                            </tbody>
                        </table>

                    </div>}

                    {/* Mobile Accordion View for Order Details */}
                    {selectedOrder && (
                        <details open className="p-4 border-t">
                            <summary className="cursor-pointer text-blue-500 font-semibold">
                                View Order Details
                            </summary>
                            <OrderDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} />
                        </details>
                    )}

                </div>
            ) : (
                <div className="flex justify-center">
                    <div className="border p-4 m-4 rounded-md shadow-md">
                        <h3 className="text-red-500">No orders for {date.toISOString().split("T")[0]}</h3>
                    </div>
                </div>
            )}

            {totalAmount > 0 && <div className="text-center w-fit mx-auto gap-4 p-4 rounded-md bg-primary mt-2 text-white">
                <strong>Total Sale: </strong>
                <strong>{totalAmount.toFixed(2)}</strong>
            </div>}
        </div>
    );
};

export default OrdersList;