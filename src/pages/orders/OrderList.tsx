import { IOrder } from "@/axios/order/types";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useEffect, useState } from "react";
import OrderDetails from "./OrderDetails";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import { getAllOrdersByDateAction } from "@/action/order.action";

const OrdersList = () => {
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    const { orders } = useAppSelector(s => s.ordersInfo)
    const [date, setDate] = useState(new Date());
    const changeDate = async (newDate: Date) => {
        setDate(newDate);
    };

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getAllOrdersByDateAction(date?.toISOString().split("T")[0]))
        return
    }, [dispatch, date])

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Orders</h2>
            <div className="flex justify-center gap-2 mb-4">
                {/* <div className="flex items-center space-x-2 justify-between"> */}
                    {/* Previous Day Button */}
                    <button
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
                    <div className="w-full overflow-x-auto">
                        <table className="w-full border-collapse min-w-[600px]">
                            <thead>
                                <tr className="bg-gray-200 text-sm md:text-base">
                                    <th className="p-2 text-left">Order #</th>
                                    <th className="p-2 text-left">Name</th>
                                    <th className="p-2 text-left">Amount</th>
                                    <th className="p-2 text-left">Status</th>
                                    <th className="p-2 text-left">Payment</th>
                                    <th className="p-2 text-left">Order Date</th>
                                    <th className="p-2 text-left">Articles</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders?.map((order) => (
                                    <tr
                                        key={order?._id}
                                        className="border-b cursor-pointer hover:bg-gray-100"
                                        onClick={() => setSelectedOrder(order)}>
                                        <td className="p-2 text-blue-500 underline">{order?.orderNumber}</td>
                                        <td className="p-2">{order?.name}</td>
                                        <td className="p-2">${order?.amount?.toFixed(2)}</td>
                                        <td className={`p-2 
                                            ${order?.deliveryStatus === "Packed" && "text-green-500"}
                                            ${order?.deliveryStatus === "Picking" && "text-yellow-700"}
                                            
                                            `}>
                                            {order?.deliveryStatus}</td>
                                        <td className="p-2">{order?.paymentStatus}</td>
                                        <td className="p-2">{order?.createdAt?.toLocaleString().split("T")[0]}</td>
                                        <td className="p-2 text-end">{order?.items?.length}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

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
                        <h1 className="text-red-500">No orders for {date.toISOString().split("T")[0]}</h1>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersList;
