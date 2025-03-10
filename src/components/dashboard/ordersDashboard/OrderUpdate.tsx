import { IOrder } from "@/axios/order/types";
import { useQuery } from "@tanstack/react-query";
import { getAOrder, updateAOrder } from "@/axios/order/order";
import { useState } from "react";
import { useAppSelector } from "@/hooks";
import { initialState } from "@/redux/allOrders.slice";

export const OrderUpdate = ({ barcode, setBarcode }: { barcode: string, setBarcode: (barcode: string) => void }) => {
    const { order } = useAppSelector((s) => s.ordersInfo);
    const [paymentStatus, setPaymentStatus] = useState(order?.paymentStatus);

    const { data = initialState.order } = useQuery<IOrder>({
        queryKey: ['order', barcode],
        queryFn: () => getAOrder(barcode as string)
    })
    const [status, setStatus] = useState(data?.deliveryStatus);
    const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = event.target.value;
        setStatus(newStatus);
        if (order?._id) {
            await updateAOrder(order._id, { deliveryStatus: newStatus });
            // await updateAOrder(order._id, { deliveryStatus: status, picker: { userId: user._id, name: user.fName + " " + user.lName } });
        }
        return;
    };
    const handleChangePaymentStatus = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = event.target.value;
        setPaymentStatus(newStatus);
        if (order?._id) {
            await updateAOrder(order._id, { paymentStatus: newStatus });
        }
        return;
    };

    // useEffect(() => {
    //     if (data?._id && JSON.stringify(data) !== JSON.stringify(order)) {
    //         dispatch(setAOrder(data as IOrder));
    //     } else if (data?._id === "") {
    //         dispatch(setAOrder(initialState.order as IOrder));
    //     }
    // }, [dispatch, data]);


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
            <div className="bg-white p-4 sm:p-6 rounded-lg w-full sm:w-3/5 shadow-lg max-h-[90vh] overflow-auto">
                <h3 className="text-lg sm:text-xl font-semibold mb-4">Order Details</h3>

                <div className="flex justify-end mb-4">
                    <div
                        className={`text-white text-right p-2 shadow-md rounded-md 
                            ${status === "Collected" && "bg-green-500"}
                            ${status === "Order placed" && "bg-primary"}
                            ${status === "Picking" && "bg-primary"}
                            ${status === "Packed" && "bg-green-500"}
                            ${status === "Cancelled" && "bg-red-500"}
                            `}


                    >
                        {status === "Order placed" && "Start Picking"}
                        {status === "Picking" && "Continue Picking"}
                        {(status === "Packed") && "Packed"}
                        {status === "Collected" && "Collected"}
                        {status === "Cancelled" && "Cancelled"}
                    </div>
                </div>

                {/* Main Table for Order Details */}
                <table className="w-full mb-4">
                    <tbody>
                        <tr>
                            <td className="font-semibold p-1">Order Number:</td>
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
                            <td className="font-semibold p-1">Payment By:</td>
                            <td className="p-1">{data?.paymentType}</td>
                        </tr>
                        <tr>
                            <td className="font-semibold p-1">Payment Status:</td>
                            <td className="p-1">
                                <select
                                    className="border p-1 rounded-md bg-white text-gray-700 w-full"
                                    value={paymentStatus}
                                    onChange={handleChangePaymentStatus}
                                >
                                    <option value="Paid">Paid</option>
                                    <option value="Not Yet Paid">Not Yet Paid</option>
                                </select>
                            </td>
                        </tr>

                        {data?.deliveryDate?.date !== "NY" && (
                            <tr>
                                <td className="font-semibold p-1">Delivery Date:</td>
                                <td className="p-1">{data?.deliveryDate?.date || "Not Specified"}</td>
                            </tr>
                        )}
                        <tr>
                            <td className="font-semibold p-1">Status:</td>
                            <td className="p-1">
                                <select
                                    className="border p-1 rounded-md bg-white text-gray-700 w-full"
                                    value={status}
                                    onChange={handleChange}
                                >
                                    {data?.orderType === "pickup" ? <>
                                        <option value="Order placed">Order placed</option>

                                        <option value="Picking">Picking</option>
                                        <option value="Packed">Packed</option>
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
                            <td className="font-semibold p-1">Created Date:</td>
                            <td className="p-1">{data?.createdAt?.toLocaleString().split("T")[0]}</td>
                        </tr>
                        <tr>
                            <td className="font-semibold p-1">Delivery Date:</td>
                            <td className="p-1">{data?.requestDeliveryDate}</td>
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
                                    <td className="p-1 ps-2">{index + 1}</td>
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
                                    <td className="p-1">{item?.quantity}</td>
                                    <td className="p-1">{item?.supplied ? item?.supplied : 0}</td>
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
                <button
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full sm:w-auto"
                    onClick={() => setBarcode("")}
                >
                    Close
                </button>
            </div>
        </div>
    );
};
