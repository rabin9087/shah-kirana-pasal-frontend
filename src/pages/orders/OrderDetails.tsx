import { updateAOrder } from "@/axios/order/order";
import { IOrder } from "@/axios/order/types";
import React, { useState } from "react";
import { Link } from "react-router-dom";

interface OrderDetailsProps {
    order: IOrder;
    onClose: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onClose }) => {
    const [status, setStatus] = useState(order?.deliverStatus);
    const [paymentStatus, setPaymentStatus] = useState(order?.paymentStatus);

    const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = event.target.value;
        setStatus(newStatus);
        if (order?._id) {
            await updateAOrder(order._id, { deliverStatus: newStatus });
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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
            <div className="bg-white p-6 rounded-lg w-3/5 shadow-lg max-h-[90vh] overflow-auto">
                <h3 className="text-lg font-semibold mb-4">Order Details</h3>

                <div className="flex justify-end ">
                    
                    <Link to={`/orderNumber=/${order?.orderNumber}`} className="text-white text-right p-2 shadow-md bg-primary rounded-md">
                        Start Picking
                    </Link>
                </div>

                {/* Main Table for Order Details */}
                <table className="w-full mb-4">
                    <tbody>
                        <tr>
                            <td className="font-semibold p-2">Order Number:</td>
                            <td className="p-2">{order?.orderNumber}</td>
                        </tr>
                        <tr>
                            <td className="font-semibold p-2">Order Type:</td>
                            <td className="p-2">{order?.orderType}</td>
                        </tr>
                        <tr>
                            <td className="font-semibold p-2">Name:</td>
                            <td className="p-2">{order?.name}</td>
                        </tr>
                        <tr>
                            <td className="font-semibold p-2">Address:</td>
                            <td className="p-2">{order?.address}</td>
                        </tr>
                        <tr>
                            <td className="font-semibold p-2">Phone:</td>
                            <td className="p-2">{order?.phone}</td>
                        </tr>
                        <tr>
                            <td className="font-semibold p-2">Email:</td>
                            <td className="p-2">{order?.email}</td>
                        </tr>

                        <tr>
                            <td className="font-semibold p-2">Payment By:</td>
                            <td className="p-2">{order?.paymentType}</td>
                        </tr>
                        <tr>
                            <td className="font-semibold p-2">Payment Status:</td>
                            <td className="p-2">
                                <select
                                    className="border p-2 rounded-md bg-white text-gray-700"
                                    value={paymentStatus}
                                    onChange={handleChangePaymentStatus}
                                >
                                    <option value="Paid">Paid</option>
                                    <option value="Not Yet Paid">Not Yet Paid</option>
                                    </select>
                                </td>
                        </tr>

                        {order?.deliveryDate?.date !== "NY" && (
                            <tr>
                                <td className="font-semibold p-2">Delivery Date:</td>
                                <td className="p-2">{order?.deliveryDate?.date || "Not Specified"}</td>
                            </tr>
                        )}
                        <tr>
                            <td className="font-semibold p-2">Status:</td>
                            <td className="p-2">
                                <select
                                    className="border p-2 rounded-md bg-white text-gray-700"
                                    value={status}
                                    onChange={handleChange}
                                >
                                    <option value="Not Yet Delivered">Not Yet Delivered</option>
                                    <option value="Out for Delivery">Out for Delivery</option>
                                    <option value="Picking">Picking</option>
                                    <option value="Packed">Packed</option>
                                    <option value="On the way">On the way</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* Items Table */}
                <h3 className="text-lg font-semibold mt-4 mb-2">Items</h3>
                <table className="w-full border rounded-lg">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2">#</th>
                            <th className="p-2">Article</th>
                            <th className="p-2">Thumbnail</th>
                            <th className="p-2">Name</th>
                            <th className="p-2">Ordered</th>
                            <th className="p-2">Supplied</th>
                            <th className="p-2">Amount</th>
                           
                           
                        </tr>
                    </thead>
                    <tbody>
                        {order?.items?.map((item, index) => (
                            <tr key={index} className="border-b">
                                <td className="p-2">{index + 1}</td>
                                <td className="p-2 underline">{item?.productId?.sku}</td>
                                <td className="p-2">
                                    <img
                                        src={item?.productId?.thumbnail as string || item?.productId.images?.[0] as string}
                                        alt={item.productId.name}
                                        className="w-16 h-16 object-cover rounded-md"
                                    />
                                </td>
                                <td className="p-2">{item?.productId?.name}</td>
                                <td className="p-2">{item?.quantity}</td>
                                <td className="p-2">{item.supplied ? item.quantity : 0}</td>
                                <td className="p-2">${item?.price?.toFixed(2)}</td>                               
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Total Amount */}
                <div className="flex justify-end mt-4">
                    <strong>Total Amount: ${order?.amount?.toFixed(2)}</strong>
                </div>

                {/* Close Button */}
                <button
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default OrderDetails;