import Layout from "@/components/layout/Layout"
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from "./CheckoutForm";
import { useQuery } from "@tanstack/react-query";
import { createPaymentIntent } from "@/axios/payment/payment";
import { useAppSelector } from "@/hooks";


// const STRIPE_SECRET_KEY = "pk_test_51OdhKNL18eO1NJXbPtrqRKGrNBF5OCX8LEd5OyfqN0k8uuhyMlQBNoJIHcZaYO22hzaoUHsMLCMJ1W3gWuID3kya003qmxM2KE"
const STRIPE_SECRET_KEY =  import.meta.env.VITE_STRIPE_PROMISE
const Payment = () => {
    const { cart } = useAppSelector(s => s.addToCartInfo)
    const total = cart.reduce((acc, { orderQuantity, price }) => {
        return acc + orderQuantity * price
    }, 0)

    const paymentData = {
        amount: total.toFixed(2), currency: "aud"
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

        <Layout title="Payment Details">
            <Elements stripe={stripePromise} options={{ clientSecret: data?.clientSecret }} >
                <CheckoutForm />
            </Elements>
        </Layout>
    )
}
export default Payment