import Layout from "@/components/layout/Layout"
import { useAppDispatch, useAppSelector } from "@/hooks"
import { resetCart } from "@/redux/addToCart.slice"
import { useEffect } from "react"
import { useNavigate } from "react-router"


const SuccessfullPayment: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch()
    const { language } = useAppSelector((state) => state.settings)
    useEffect(() => {
        dispatch(resetCart())
    }, [])

    const handleViewOrder = () => {
        navigate("/order-placed"); // Navigate to the order placed page
    };

    return (
        <Layout title=""><div className="flex flex-col items-center justify-center h-screen bg-green-100">
            <h1 className="text-3xl font-bold text-green-700">
                {language === "en" ? "Order has been successfully placed" :
                    "अर्डर सफलतापूर्वक राखिएको छ"}</h1>
            <p className="mt-4 text-gray-600">
                {language === "en" ? "Thank you for ordering with us." : "हामीसँग अर्डर गर्नुभएकोमा धन्यवाद।"}
            </p>
            <button
                className="mt-6 px-6 py-3 bg-primary text-white rounded hover:bg-blue-600"
                onClick={handleViewOrder}
            >
                {language === "en" ? "View Order Details" : "अर्डर विवरणहरू हेर्नुहोस्"}
            </button>
        </div></Layout>
    )
}



export default SuccessfullPayment