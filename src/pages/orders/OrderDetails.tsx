import { updateAOrder } from "@/axios/order/order";
import { IOrder } from "@/axios/order/types";
import React, { useState } from "react";

interface OrderDetailsProps {
    order: IOrder;
    onClose: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onClose }) => {

    const [status, setStatus] = useState(order?.deliverStatus);

    const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = event.target.value;
        setStatus(newStatus);
        if(order?._id)
        { await updateAOrder(order._id, { deliverStatus: newStatus });}
        return
    };

    return (
        
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-3/5 shadow-lg max-h-[90vh] overflow-auto">
                <h3 className="text-lg font-semibold mb-2">Order Details</h3>
                <p><strong>Order Number:</strong> {order?.orderNumber}</p>
                <p><strong>Name:</strong> {order?.name}</p>
                <p><strong>Address:</strong> {order?.address}</p>
                <p><strong>Phone:</strong> {order?.phone}</p>
                <p><strong>Email:</strong> {order?.email}</p>
                <p><strong>Delivery Date:</strong> {order?.deliveryDate?.date || "Not Specified"}</p>
                <p><strong>Delivery Date:</strong>
                    <select
                        className="border p-2 rounded-md bg-white text-gray-700"
                        value={status}
                        onChange={handleChange}
                    >
                        <option value="Not Yet Delivered">Not Yet Delivered</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                        </select>
                    </p>

                <h3 className="text-lg font-semibold mt-4">Items</h3>
                <ul className="border rounded-lg p-2 bg-white">
                    {order?.items?.map((item, index) => (
                        <li key={index} className="border-b p-3 flex gap-4">
                            {/* Product Thumbnail */}
                            <img
                                src={item?.productId?.thumbnail as string || item?.productId.images?.[0]  as string} 
                                alt={item.productId.name}
                                className="w-16 h-16 object-cover rounded-md"
                            />

                            {/* Product Details */}
                            <div>
                                <p><strong>Name:</strong> {item?.productId?.name}</p>
                                <p><strong>SKU:</strong> {item?.productId?.sku}</p>
                                <p><strong>Slug:</strong> {item?.productId?.slug}</p>
                                <p><strong>Quantity:</strong> {item?.quantity}</p>
                                <p><strong>Price:</strong> ${item?.price?.toFixed(2)}</p>
                                <p><strong>Sales Price:</strong> ${item?.productId?.salesPrice?.toFixed(2)}</p>
                                {item?.note && (
                                    <p className="text-sm text-gray-600">
                                        <strong>Note:</strong> {item?.note}
                                    </p>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>

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
