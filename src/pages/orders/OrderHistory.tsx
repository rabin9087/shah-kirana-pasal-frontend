import { useState } from "react";
import { useAppSelector } from "@/hooks";
import { IOrder } from "@/axios/order/types";
import { QRCodeGenerator } from "@/components/QRCodeGenerator";

interface IOrderNumber {
    setOrderNumber: (orderNumber: string) => void;
    data: IOrder;
}

const OrderHistory = ({ setOrderNumber, data }: IOrderNumber) => {
    const { user } = useAppSelector((s) => s.userInfo);
    const { language } = useAppSelector((s) => s.settings);
    const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

    const toggleOrderDetails = (index: number) => {
        setExpandedOrder((prev) => (prev === index ? null : index));
    };

    return (
        <div className="w-full mx-auto p-6">
            <h1 className="w-full text-3xl font-bold text-blue-700 text-center">{language === "en" ? "Order History" : "पुरानो अर्डरहरू"}</h1>
            {user?.cartHistory?.length > 0 ? (
                <div className="mt-6 space-y-6">
                    {user?.cartHistory?.slice(1).map((order: any, index: number) => (
                        <div key={index} className="bg-white shadow-md rounded-lg py-2 px-1" onClick={() => setOrderNumber(order?.orderNumber as string)}>
                            <button
                                className="flex justify-between items-center w-full text-left text-xl font-semibold text-gray-800 hover:text-blue-600"
                                onClick={() => toggleOrderDetails(index)}
                            >
                                Order #{index + 1}
                                <span className="text-gray-500">
                                    {expandedOrder === index ? "▲" : "▼"}
                                </span>
                            </button>

                            {expandedOrder === index && (
                                <div className="mt-4 transition-all duration-300">
                                    <div className="md:flex justify-between">
                                        <div>
                                            <p className="text-center text-xl underline"><strong > {order?.orderNumber} </strong></p>
                                            <p className="text-gray-700">
                                                <p className="text-gray-700"><strong>{language === "en" ? "Amount" : "रकम"}:</strong> {language === "en" ? "Rs. " : "रु."} {order?.amount?.toFixed(2)}</p>
                                            </p>
                                            <div>
                                                <p className="text-gray-700"><strong>{language === "en" ? "Purchased At" : "किनेको दिन"}:</strong> {new Date(order.purchasedAt).toLocaleString()}</p>
                                                <p className="text-gray-700"><strong>{language === "en" ? "Order status" : "अर्डर स्थिति"}: </strong>
                                                    {language === "en" ? data.deliveryStatus :
                                                        (data.deliveryStatus === "Order placed" && "अर्डर भयो") ||
                                                        (data.deliveryStatus === "Packed" && "प्याक गरिएको छ") ||
                                                        (data.deliveryStatus === "Collected" && "सङ्कलन भयो") ||
                                                        (data.deliveryStatus === "Picking" && "अर्डर प्याक हुडाइछ") ||
                                                        (data.deliveryStatus === "Cancelled" && "रद्द गरियो")}</p>                                                <p className="text-gray-700"><strong>{language === "en" ? "Payment status" : "भुक्तानी स्थिति"}:</strong>
                                                    {language === "en" ? data.paymentStatus : data.paymentStatus === "Paid" ? " भुक्तानी गरिएको छ" : " भुक्तानी गरिएको छैन"}</p>
                                            </div>
                                        </div>
                                        {order?.orderNumber && <div className="flex flex-col justify-center items-center mt-4 md:mt-0">
                                            <QRCodeGenerator value={(order?.orderNumber)?.toString()} />
                                            <p className="text-center text-xl"><strong > {order?.orderNumber} </strong></p>
                                        </div>}
                                    </div>

                                    <h3 className="text-lg font-semibold text-gray-800 mt-4">Items Ordered:</h3>
                                    <ul className="mt-2 space-y-4">
                                        {order?.items?.map((item: any) => (
                                            <li key={item._id} className="flex items-center space-x-4 p-4 border rounded-lg">
                                                <img
                                                    src={item?.productId?.thumbnail}
                                                    alt={item?.productId?.name}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                />
                                                <div>
                                                    <p className="font-semibold text-gray-900">{item?.productId?.name}</p>
                                                    <p className="text-gray-700">Quantity: {item?.orderQuantity}</p>
                                                    <p className="text-gray-700">Price: ${item?.price}</p>
                                                    {item?.note && <p className="text-sm text-gray-500">Note: {item?.note}</p>}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-[80vh]">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
                        alt="No Orders"
                        className="w-48 h-48 opacity-80"
                    />
                    <h2 className="text-2xl font-semibold text-gray-700 mt-4">
                        You haven’t made any purchases yet!
                    </h2>
                    <p className="text-gray-600 mt-2 text-center max-w-sm">
                        Browse our products and place your first order today.
                    </p>
                    <a
                        href="/"
                        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
                    >
                        Start Shopping
                    </a>
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
