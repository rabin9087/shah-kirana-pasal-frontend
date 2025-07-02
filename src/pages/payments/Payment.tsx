import Layout from "@/components/layout/Layout"
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from "./CheckoutForm";
import { useQuery } from "@tanstack/react-query";
import { createPaymentIntent } from "@/axios/payment/payment";
import { useAppSelector } from "@/hooks";
// import { useState } from "react";

const STRIPE_SECRET_KEY = import.meta.env.VITE_STRIPE_PROMISE
const Payment = () => {
    const { cart } = useAppSelector(s => s.addToCartInfo)
    const { user } = useAppSelector(s => s.userInfo)
    const { language } = useAppSelector(s => s.settings)
    const total = cart.reduce((acc, { orderQuantity, price }) => {
        return acc + orderQuantity * price
    }, 0)
    // const [paymentMethod, setPaymentMethod] = useState("")

    const paymentData = {
        amount: total.toFixed(2), currency: "aud", customer: user.email
    }

    const { data } = useQuery({
        queryKey: ['payment'],
        queryFn: () => createPaymentIntent(paymentData)
    });

    const stripePromise = loadStripe(STRIPE_SECRET_KEY);

    if (!data?.clientSecret) {
        return null
    }
    return (

        <Layout title={language === "en" ? "Payment Details" : "भुक्तानी विवरणहरू"}>
            <Elements stripe={stripePromise} options={{
                clientSecret: data?.clientSecret,
                // customerSessionClientSecret: data?.customerSessionClientSecret,
                appearance: { theme: "stripe" }
            }} >
                <CheckoutForm />
            </Elements>
        </Layout>
    )
}
export default Payment