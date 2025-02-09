import Layout from "@/components/layout/Layout";
import { useAppSelector } from "@/hooks";
import OrderHistory from "./OrderHistory";

export const OrderPlaced: React.FC = () => {
    const { user } = useAppSelector((s) => s.userInfo);
    const {cartHistory} = user

    // Get the most recent order (cartHistory[0])
    const latestOrder = cartHistory?.[0];

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
                    <h1 className="text-3xl font-bold text-blue-700">Order Placed Successfully!</h1>
                    <p className="mt-4 text-gray-600">
                        Your order has been placed. We’ll send you an email confirmation shortly.
                    </p>

                    {latestOrder ? (
                        <div className="mt-6 w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                            <p className="text-gray-700"><strong>Amount:</strong> ${latestOrder?.amount?.toFixed(2)}</p>
                            <p className="text-gray-700"><strong>Purchased At:</strong> {new Date(latestOrder.purchasedAt).toLocaleString()}</p>

                            <h3 className="text-lg font-semibold text-gray-800 mt-4">Items Ordered:</h3>
                            <ul className="mt-2 space-y-4">
                                {latestOrder.items.map((item: any) => (
                                    <li key={item._id} className="flex items-center space-x-4 p-4 border rounded-lg">
                                        <img
                                            src={item.productId?.thumbnail}
                                            alt={item.productId?.name}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-900">{item.productId?.name}</p>
                                            <p className="text-gray-700">Quantity: {item.orderQuantity}</p>
                                            <p className="text-gray-700">Price: ${item.price}</p>
                                            {item.note && <p className="text-sm text-gray-500">Note: {item.note}</p>}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="text-gray-600 mt-6">No recent order found.</p>
                    )}
                    <div>
                        {/* <h3 className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600">Your Order History </h3> */}
                        <OrderHistory />
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
