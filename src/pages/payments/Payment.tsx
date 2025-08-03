import Layout from "@/components/layout/Layout";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useQuery } from "@tanstack/react-query";
import { createPaymentIntent } from "@/axios/payment/payment";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useEffect } from "react";
import { setClientSecret, setStoredPaymentIntentId } from "@/redux/addToCart.slice";
import { LoadingDataWithText } from "@/components/ui/Loading";

// Stripe public key load
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PROMISE as string);

const Payment = () => {
    const dispatch = useAppDispatch();

    const { cart, storedPaymentIntentId, clientSecret } = useAppSelector((s) => s.addToCartInfo);
    const { user } = useAppSelector((s) => s.userInfo);
    const { language } = useAppSelector((s) => s.settings);

    const total = cart.reduce((acc, { orderQuantity, price }) => {
        return acc + (orderQuantity as number) * (price as number)
    }, 0)

    const paymentData = {
        amount: total.toFixed(2),
        currency: "aud",
        customer: user.email,
        paymentIntentId: storedPaymentIntentId,
    };

    const {
        data,
        refetch,
        isLoading,
    } = useQuery({
        queryKey: ["payment", total, storedPaymentIntentId],
        queryFn: () => createPaymentIntent(paymentData),
        enabled: total > 0,
        staleTime: Infinity,
    });

    useEffect(() => {
        if (total > 0 || storedPaymentIntentId) {
            refetch();
        }
    }, [total, storedPaymentIntentId, refetch]);

    useEffect(() => {
        if (data?.clientSecret && data?.paymentIntentId) {
            dispatch(setClientSecret(data.clientSecret));
            dispatch(setStoredPaymentIntentId(data.paymentIntentId));
        }
    }, [data?.clientSecret, data?.paymentIntentId, dispatch]);

    if (isLoading && !clientSecret) {
        return <LoadingDataWithText text="Payment method loading ..." />;
    }

    if (!clientSecret) {
        return (
            <Layout title={language === "en" ? "Payment Details" : "भुक्तानी विवरणहरू"}>
                <div className="text-red-600 text-center">Error: Could not load payment intent.</div>
            </Layout>
        );
    }

    return (
        <Layout title={language === "en" ? "Payment Details" : "भुक्तानी विवरणहरू"}>
            <Elements
                stripe={stripePromise}
                options={{
                    clientSecret,
                    appearance: { theme: "flat", labels: "above" },
                }}
            >
                <CheckoutForm />
            </Elements>
        </Layout>
    );
};

export default Payment;
