import Layout from "@/components/layout/Layout"
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from "./CheckoutForm";
import { useQuery } from "@tanstack/react-query";
import { createPaymentIntent } from "@/axios/payment/payment";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useEffect } from "react";
import { setClientSecret, setStoredPaymentIntentId } from "@/redux/addToCart.slice";
// import { useState } from "react";

// const STRIPE_SECRET_KEY = import.meta.env.VITE_STRIPE_PROMISE
// ✅ Only run once at module level
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PROMISE as string);
const Payment = () => {
    const dispatch = useAppDispatch();

    const { cart, storedPaymentIntentId, clientSecret } = useAppSelector(s => s.addToCartInfo)
    const { user } = useAppSelector(s => s.userInfo)
    const { language } = useAppSelector(s => s.settings)
    const total = cart.reduce((acc, { orderQuantity, price }) => {
        return acc + orderQuantity * price
    }, 0)
    const paymentData = {
        amount: total.toFixed(2), currency: "aud", customer: user.email, paymentIntentId: storedPaymentIntentId
    }

    const { data, refetch, isLoading } = useQuery({
        queryKey: ['payment', total, storedPaymentIntentId],
        queryFn: () => createPaymentIntent(paymentData),
        enabled: total > 0 && true, // Always enabled, but refetch strategically
        staleTime: Infinity, // Prevent automatic refetch on mount if data is fresh

    });

    useEffect(() => {
        // Trigger refetch whenever total or storedPaymentIntentId changes
        // This ensures a new or updated client_secret is fetched
        if (total > 0 || storedPaymentIntentId) // Only refetch if total is greater than 0 or storedPaymentIntentId exists
        { refetch(); }
    }, [total, storedPaymentIntentId, refetch]); // Depend on total and storedPaymentIntentId


    useEffect(() => {
        if (data?.clientSecret && data?.paymentIntentId) {
            dispatch(setClientSecret(data.clientSecret)); // Store clientSecret
            dispatch(setStoredPaymentIntentId(data.paymentIntentId)); // Store PaymentIntent ID
            // Optionally, save to localStorage here if you want persistence across sessions
            // localStorage.setItem("paymentIntentId", data.paymentIntentId);
        }
    }, [data?.clientSecret, data?.paymentIntentId, dispatch]);

    if (isLoading && !clientSecret) {
        return <Layout title={language === "en" ? "Payment Details" : "भुक्तानी विवरणहरू"}><div>Loading payment...</div></Layout>;
    }

    if (!clientSecret) {
        return <Layout title={language === "en" ? "Payment Details" : "भुक्तानी विवरणहरू"}><div>Error: Could not load payment intent.</div></Layout>;
    }

    return (

        <Layout title={language === "en" ? "Payment Details" : "भुक्तानी विवरणहरू"}>
            <Elements stripe={stripePromise} options={{
                clientSecret: clientSecret, // Use the clientSecret from Redux

                // customerSessionClientSecret: data?.customerSessionClientSecret,
                appearance: { theme: "flat", labels: "above", }
            }} >

                <CheckoutForm />
            </Elements>
        </Layout>
    )
}
export default Payment