import { Button } from '@/components/ui/button';
import { AddressElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { FormEvent, useState } from 'react';

const CheckoutForm = () => {

    const stripe = useStripe();
    const elements = useElements();
    const [isAddressComplete, setIsAddressComplete] = useState<boolean>(false); // State to manage steps
    const [isPending, setIspending] = useState<boolean>(false); // State to manage steps

    const handleSubmit = async (event: FormEvent) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }
        setIspending(true)

        const result = await stripe.confirmPayment({
            //`Elements` instance that was used to create the Payment Element

            elements,
            confirmParams: {
                return_url: "http://localhost:5173/payment/success",
            },
        });

        if (result.error) {
            // Show error to your customer (for example, payment details incomplete)
            console.log(result.error.message);
        } else {
            // Your customer will be redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer will be redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
            console.log("success payment")
            // dispatch(setAddToCart())
        }
        setIspending(false)
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='mx-4 my-4'>
                {isAddressComplete && <Button type="button" onClick={() => setIsAddressComplete(false)} className='w-fit my-4'>
                    &lt;  {" "}Previous
                </Button>}
                {!isAddressComplete ? (
                    <>
                        <AddressElement options={{ mode: "shipping", }} />
                        <div className='flex justify-center text-center m-4'>
                            <Button type="button" onClick={() => setIsAddressComplete(true)} className='w-[200px]'>
                                Next
                            </Button>
                        </div>
                    </>
                ) : (
                    <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />
                )}
            </div>

            {isAddressComplete && (
                <>
                    <div className='flex justify-center text-center m-4'>

                        <Button type="submit" disabled={!stripe} className='w-[200px]'>
                            {isPending ? <div className="w-full h-full flex justify-center items-center my-20">
                                <div
                                    className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                    role="status">
                                    <span
                                        className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                                    >Loading...</span>

                                </div>
                                <span className="ms-2">Loading...</span>
                            </div> :
                                "Submit"}
                        </Button>
                    </div>
                    {/* <div className='flex justify-center text-center m-4'>
                       
                    </div> */}
                </>
            )}
        </form>
    );
};

export default CheckoutForm;