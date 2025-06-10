import { IOrder } from "@/axios/order/types";
import { useQuery } from "@tanstack/react-query";
import { getAOrder, updateAOrder } from "@/axios/order/order";
import { useEffect, useState } from "react";
import { initialState } from "@/redux/allOrders.slice";

export const OrderUpdate = ({ barcode, setBarcode }: { barcode: string, setBarcode: (barcode: string) => void }) => {

    const { data = initialState.order } = useQuery<IOrder>({
        queryKey: ['order', barcode],
        queryFn: () => getAOrder(barcode as string),
    });

    const [paymentStatus, setPaymentStatus] = useState(data?.paymentStatus);
    const [paymentMethod, setPaymentMethod] = useState(data?.paymentType);
    const [status, setStatus] = useState("Order Placed");

    // Update state when new order data is fetched
    useEffect(() => {
        if (data?._id) {
            setStatus(data.deliveryStatus);
            setPaymentMethod(data.paymentType);
            setPaymentStatus(data.paymentStatus);
        }
    }, [data]);

    // Debounced API update function
    useEffect(() => {
        if (!data?._id) return;

        const updateOrder = async () => {
            await updateAOrder(data?._id as string, {
                deliveryStatus: status,
                paymentStatus,
                paymentType: paymentMethod
            });
        };

        const timer = setTimeout(updateOrder, 500); // Debounce API call by 500ms
        return () => clearTimeout(timer);
    }, [status, paymentStatus, paymentMethod, data?._id]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
            {data?._id ? <div className="bg-white p-4 sm:p-6 rounded-lg w-full sm:w-3/5 shadow-lg max-h-[90vh] overflow-auto">
                <h3 className="text-lg sm:text-xl font-semibold mb-4">Order Details</h3>

                <div className="flex justify-between items-center mb-4">
                    <div >
                        <strong className="font-semibold p-1 whitespace-nowrap">Picker:</strong>
                        <span className="p-1 whitespace-nowrap" >{data?.picker?.name}</span>
                    </div>
                    <div
                        className={`text-white text-right p-2 shadow-md rounded-md 
                            ${status === "Collected" && "bg-green-700"}
                            ${status === "Order placed" && "bg-primary"}
                            ${status === "Picking" && "bg-primary"}
                            ${status === "Packed" && "bg-green-500"}
                            ${status === "Completed" && "bg-green-700"}
                            ${status === "Cancelled" && "bg-red-500"}
                            `}
                    >
                        {status}
                    </div>
                </div>

                {/* Main Table for Order Details */}
                <table className="w-full mb-4">
                    <tbody>
                        <tr>
                            <td className="font-semibold p-1 whitespace-nowrap">Order Number:</td>
                            <td className="p-1">{data?.orderNumber}</td>
                        </tr>
                        <tr>
                            <td className="font-semibold p-1">Order Type:</td>
                            <td className="p-1">{data?.orderType}</td>
                        </tr>
                        <tr>
                            <td className="font-semibold p-1">Name:</td>
                            <td className="p-1">{data?.name}</td>
                        </tr>
                        {data?.address !== "" && <tr>
                            <td className="font-semibold p-1">Address:</td>
                            <td className="p-1">{data?.address}</td>
                        </tr>}
                        <tr>
                            <td className="font-semibold p-1">Phone:</td>
                            <td className="p-1">{data?.phone}</td>
                        </tr>
                        <tr>
                            <td className="font-semibold p-1">Email:</td>
                            <td className="p-1">{data?.email}</td>
                        </tr>
                        <tr>
                            <td className="font-semibold p-1">Payment Status:</td>
                            <td className={`p-1 ${data?.paymentStatus === "Paid" ? "text-green-500" : "text-red-500"}`}>{data?.paymentStatus}</td>
                        </tr>
                        <tr>
                            <td className="font-semibold p-1 whitespace-nowrap">Payment By:</td>
                            <select
                                className="border p-1 rounded-md bg-white text-gray-700 w-full"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <option value="Cash">Cash</option>
                                <option value="Card">Card</option>
                            </select>
                        </tr>
                        <tr>
                            <td className="font-semibold whitespace-nowrap p-1">Change Payment Status:</td>
                            <td className="p-1">
                                <select
                                    className="border p-1 rounded-md bg-white text-gray-700 w-full"
                                    value={paymentStatus}
                                    onChange={(e) => setPaymentStatus(e.target.value)}
                                >
                                    <option value="Paid">Paid</option>
                                    <option value="Not Yet Paid">Not Yet Paid</option>
                                </select>
                            </td>
                        </tr>

                        {data?.deliveryDate?.date !== "NY" && (
                            <tr>
                                <td className="font-semibold p-1 whitespace-nowrap">Delivery Date:</td>
                                <td className="p-1">{data?.deliveryDate?.date || "Not Specified"}</td>
                            </tr>
                        )}
                        <tr>
                            <td className="font-semibold p-1 whitespace-nowrap">Status:</td>
                            <td className="p-1">
                                <select
                                    className="border p-1 rounded-md bg-white text-gray-700 w-full whitespace-nowrap"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    {data?.orderType === "pickup" ? <>
                                        <option value="Order placed">Order placed</option>
                                        <option value="Picking">Picking</option>
                                        <option value="Packed">Packed</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Collected">Collected</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </> : <>
                                        <option value="Order placed">Order placed</option>
                                        <option value="Picking">Picking</option>
                                        <option value="Packed">Packed</option>
                                        <option value="Out for Delivery">Out for Delivery</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </>}

                                </select>
                            </td>
                        </tr>

                        <tr >
                            <td className="font-semibold p-1 whitespace-nowrap">Created Date:</td>
                            <td className="p-1 whitespace-nowrap" >{data?.createdAt?.toLocaleString().split("T")[0]}</td>
                        </tr>
                        <tr>
                            <td className="font-semibold p-1 whitespace-nowrap">Delivery Date:</td>
                            <td className="p-1 whitespace-nowrap">{data?.requestDeliveryDate}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Items Table */}
                <h3 className="text-lg sm:text-xl font-semibold mt-4 mb-2">Items</h3>
                <div className="overflow-auto">
                    <table className="w-full min-w-[600px] border rounded-lg">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-1 ms-1 text-xs sm:text-sm">#</th>
                                <th className="p-1 text-xs sm:text-sm">Article</th>
                                <th className="p-1 text-xs sm:text-sm">Thumbnail</th>
                                <th className="p-1 text-xs sm:text-sm">Name</th>
                                <th className="p-1 text-xs sm:text-sm">Price</th>
                                <th className="p-1 text-xs sm:text-sm">Ordered</th>
                                <th className="p-1 text-xs sm:text-sm">Supplied</th>
                                <th className="p-1 text-xs sm:text-sm me-2">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.items?.map((item, index) => (
                                <tr key={index} className="border-b">
                                    <td className="p-1 ps-2">{index + 1}.</td>
                                    <td className="p-1 underline">{item?.productId?.sku}</td>
                                    <td className="p-1">
                                        <img
                                            src={item?.productId?.thumbnail as string || item?.productId?.images?.[0] as string}
                                            alt={item?.productId?.name}
                                            className="w-16 h-16 object-cover rounded-md"
                                        />
                                    </td>
                                    <td className="p-1">{item?.productId?.name}</td>
                                    <td className="p-1">${item?.price?.toFixed(2)}</td>
                                    <td className="p-1 text-center">{item?.quantity}</td>
                                    <td className="p-1 text-center">{item?.supplied ? item?.supplied : 0}</td>
                                    <td className="p-1 me-2">${(item?.price * item?.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                {/* Total Amount */}
                <div className="flex justify-end mt-4">
                    <strong>Total Amount: ${data?.amount?.toFixed(2)}</strong>
                </div>

                {/* Close Button */}
                <div className="flex justify-end">
                    <button
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full sm:w-auto"
                        onClick={() => setBarcode("")}
                        type="button"
                    >
                        Close
                    </button>
                </div>

            </div> :
                <div className="flex flex-col justify-center items-center bg-white p-8 rounded-lg shadow-lg max-h-[90vh] overflow-auto">
                    <h3 className="text-red-500 text-center">Order not found!</h3>

                    <button
                        className="text-center mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full sm:w-auto"
                        onClick={() => setBarcode("")}
                        type="button"
                    >
                        Close
                    </button>

                </div>}
        </div>
    );
};
