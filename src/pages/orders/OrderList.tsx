import { IOrder } from "@/axios/order/types";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useEffect, useState } from "react";
import OrderDetails from "./OrderDetails";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import { getAllOrdersByDateAction } from "@/action/order.action";


// interface OrdersListProps {
//     orders: IOrder[];
// }

const OrdersList = () => {
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    const { orders } = useAppSelector(s => s.ordersInfo)
    const [date, setDate] = useState(new Date());
    const changeDate = async (newDate: Date) => {
        setDate(newDate);
    };

    const dispatch = useAppDispatch()

    useEffect(() => {
        // dispatch(getAllOrdersAction())
        dispatch(getAllOrdersByDateAction(date?.toISOString().split("T")[0]))
        
        return
    }, [dispatch, date])

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Orders</h2>
            <div className="flex justify-center mb-4">
                <div className="flex items-center space-x-2">
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
                        <CalendarIcon className="absolute right-2 top-3 text-gray-500" size={16} />
                    </div>

                    {/* Next Day Button */}
                    <button
                        className="p-2 border rounded-md hover:bg-gray-200"
                        onClick={() => changeDate(addDays(date, 1))}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>

            </div>
           {orders?.length ? <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 text-left">Order Number</th>
                            <th className="p-2 text-left">Name</th>
                            <th className="p-2 text-left">Amount</th>
                            <th className="p-2 text-left">Status</th>
                            <th className="p-2 text-left">Payment</th>
                            <th className="p-2 text-left">Order Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders?.map((order) => (
                            <tr
                                key={order?._id}
                                className="border-b cursor-pointer hover:bg-gray-100"
                                onClick={() => setSelectedOrder(order)}
                            >
                                <td className="p-2 text-blue-500 underline"> {order?.orderNumber}</td>
                                <td className="p-2">{order?.name}</td>
                                <td className="p-2">${order?.amount?.toFixed(2)}</td>
                                <td className="p-2">{order?.deliverStatus}</td>
                                <td className="p-2">{order?.payment}</td>
                                <td className="p-2">{(order?.createdAt?.toLocaleString().split("T")[0])}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> : 
                <div className="flex justify-center">
                    <div className="border p-4 m-4 rounded-md shadow-md">
                        <h1 className="text-red-500">No orders for {date.toISOString().split("T")[0]}</h1>
                   </div>
                    
                </div>
            }

           

            {/* Order Details Modal */}
            {selectedOrder && (
                <OrderDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} />
            )}
        </div>
    );
};

export default OrdersList;



export const DeliveryDatePicker = () => {
    const [date, setDate] = useState(new Date());

    const changeDate = async (newDate: Date) => {
        setDate(newDate);
        // const [day, month, year] = date?.split("/").map(Number);
        // return setDate(new Date(year, month - 1, day).toISOString().split("T")[0]);
    };


    return (
        <div className="flex items-center space-x-2">
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
                <CalendarIcon className="absolute right-2 top-3 text-gray-500" size={16} />
            </div>

            {/* Next Day Button */}
            <button
                className="p-2 border rounded-md hover:bg-gray-200"
                onClick={() => changeDate(addDays(date, 1))}
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
};


