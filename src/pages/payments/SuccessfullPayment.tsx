import Layout from "@/components/layout/Layout"
import { useAppDispatch } from "@/hooks"
import { resetCart } from "@/redux/addToCart.slice"
import { useEffect } from "react"
import { useNavigate } from "react-router"


const SuccessfullPayment: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(resetCart())
    }, [])

    const handleViewOrder = () => {
        navigate("/order-placed"); // Navigate to the order placed page
    };

    return (
        <Layout title=""><div className="flex flex-col items-center justify-center h-screen bg-green-100">
            <h1 className="text-3xl font-bold text-green-700">Payment Successful!</h1>
            <p className="mt-4 text-gray-600">
                Thank you for your payment. Your transaction was successful.
            </p>
            <button
                className="mt-6 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleViewOrder}
            >
                View Order Details
            </button>
        </div></Layout>
    )
}

export const OrderPlaced: React.FC = () => {
    return (
        <Layout title="">
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-3xl font-bold text-blue-700">Order Placed Successfully!</h1>
            <p className="mt-4 text-gray-600">
                Your order has been placed. We’ll send you an email confirmation shortly.
            </p>
            <button
                className="mt-6 px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => {
                    window.location.href = "/";
                }}
            >
                Go to Homepage
            </button>
        </div>
        </Layout>
    );
};

export default SuccessfullPayment