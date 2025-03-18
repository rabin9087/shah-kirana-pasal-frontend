import Layout from "@/components/layout/Layout";
import { useAppSelector } from "@/hooks";
import OrderHistory from "./OrderHistory";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAOrder } from "@/axios/order/order";
import { IOrder } from "@/axios/order/types";
import { QRCodeGenerator } from "@/components/QRCodeGenerator";

export const OrderPlaced: React.FC = () => {
    const { user } = useAppSelector((s) => s.userInfo);
    const { language } = useAppSelector((s) => s.settings);
    const { cartHistory } = user

    const [orderNumber, setOrderNumber] = useState<number | string | null>(null);

    // Get the most recent order (cartHistory[0])
    const latestOrder = cartHistory?.[0];


    useEffect(() => {
        if (cartHistory?.length && latestOrder?.orderNumber) {
            setOrderNumber(latestOrder?.orderNumber);
        }
    }, [cartHistory]); // Removed `orderNumber` from dependencies to avoid infinite loop

    const { data = {} as IOrder } = useQuery<IOrder>({
        queryKey: [orderNumber],
        queryFn: () => getAOrder(orderNumber as string),
        enabled: !!orderNumber, // This prevents the API call when orderNumber is null
    });

    return (
        <Layout title={cartHistory.length > 0 ? "" : "Order Placed"}>
            {cartHistory.length < 0 ?
                <div className="flex flex-col items-center justify-center h-[80vh]">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
                        alt="No Orders"
                        className="w-48 h-48 opacity-80"
                    />
                    <h2 className="text-2xl font-semibold text-gray-700 mt-4">You haven’t made any purchases yet!</h2>
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
                :
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
                    <h1 className="text-3xl font-bold text-blue-700">
                        {language === "en" ? "Your last orders!" : "तपाईंको अन्तिम अर्डरहरू"}</h1>
                    <p className="mt-4 text-gray-600">
                        {language === "en" ? "We’ll send you an email of orders confirmation shortly." : "हामी तपाईंलाई चाँडै नै अर्डर पुष्टिकरणको इमेल पठाउनेछौं।"}
                    </p>

                    {latestOrder ? (
                        <div className="mt-6 w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
                            <p className="text-center text-xl"><strong >{language === "en" ? "Order Number" : "अर्डर नम्बर"}: {latestOrder?.orderNumber} </strong>
                                {/* <QRCodeGenerator value="8767" / */}
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                    {language === "en" ? "Order Summary" : "अर्डर विवरण"}</h2>
                            </p>
                            <div className="md:flex justify-between">
                                <div>
                                    <p className="text-gray-700"><strong>{language === "en" ? "Amount" : "रकम"}: </strong> {language === "en" ? "Rs. " : "रु."} {latestOrder?.amount?.toFixed(2)}</p>
                                    <p className="text-gray-700"><strong>{language === "en" ? "Purchased At" : "किनेको दिन"}:</strong> {new Date(latestOrder.purchasedAt).toLocaleString()}</p>
                                    <p className="text-gray-700"><strong>{language === "en" ? "Order status" : "अर्डर स्थिति"}: </strong>
                                        {language === "en" ? latestOrder.deliveryStatus :
                                            (data.deliveryStatus === "Order placed" && "अर्डर भयो") ||
                                            (data.deliveryStatus === "Packed" && "प्याक गरिएको छ") ||
                                            (data.deliveryStatus === "Collected" && "सङ्कलन भयो") ||
                                            (data.deliveryStatus === "Picking" && "अर्डर प्याक हुडाइछ") ||
                                            (data.deliveryStatus === "Cancelled" && "रद्द गरियो")}</p>
                                    <p className="text-gray-700"><strong>{language === "en" ? "Payment status" : "भुक्तानी स्थिति"}:
                                    </strong> {language === "en" ? latestOrder.paymentStatus : latestOrder.paymentStatus === "Paid" ? "भुक्तानी गरिएको छ" : "भुक्तान गरिएको छैन"}</p>
                                </div>
                                <div className="flex justify-center items-center mt-4 md:mt-0">
                                    <QRCodeGenerator value={(latestOrder?.orderNumber).toString()} />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mt-4">{language === "en" ? "Items Ordered" : "अर्डर गरिएका वस्तुहरू"}:</h3>
                            <ul className="mt-2 space-y-4">
                                {latestOrder.items.map((item: any) => (
                                    <li key={item._id} className="flex items-center space-x-4 p-4 border rounded-lg">
                                        <img
                                            src={item.productId?.thumbnail}
                                            alt={item.productId?.name}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-900">{language === "en" ? item.productId.name : item.productId.alternateName ? item.productId.alternateName : item.productId.name}</p>
                                            <p className="text-gray-700">{language === "en" ? "Quantity" : "मात्रा"}: {item?.orderQuantity}</p>
                                            <p className="text-gray-700">{language === "en" ? "Price Rs. " : "मूल्य रु."}: {item?.productId?.salesPrice ? item?.productId?.salesPrice : item?.price}
                                                <p className="line-through">{item?.productId?.salesPrice && "Rs." + item?.price} </p>
                                            </p>

                                            {item.note && <p className="text-sm text-gray-500">Note: {item.note}</p>}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="text-gray-600 mt-6">No recent order found.</p>
                    )}
                    <div className="w-full md:max-w-3xl bg-white shadow-md rounded-lg">
                        {/* <h3 className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600">Your Order History </h3> */}
                        <OrderHistory setOrderNumber={setOrderNumber} data={data} />
                    </div>
                    <button
                        className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        onClick={() => (window.location.href = "/")}
                    >
                        Start new Shopping
                    </button>
                </div>
            }


        </Layout>
    );
};
