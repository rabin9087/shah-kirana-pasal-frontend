import { createOrder } from '@/axios/order/order';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/hooks';
import {
    AddressElement, PaymentElement, useElements, useStripe, LinkAuthenticationElement,
} from '@stripe/react-stripe-js';
import { FormEvent, useEffect, useState } from 'react';
import DeliveryDateSelector from './DeliveryDate';


const CheckoutForm = () => {
    const { user } = useAppSelector((state) => state.userInfo);
    console.log(user)
    const stripe = useStripe();
    const elements = useElements();
    const [isAddressComplete, setIsAddressComplete] = useState(false);
    // const [deliveryDate, setDeliveryDate] = useState<{
    //     date: string,
    //     time: string,
    // }>({
    //     date: "",
    //     time: "",
    // });
    const [requestDeliveryDate, setRequestDeliveryDate] = useState<string>("")
    const [contactInfo, setContactInfo] = useState({
        email: user.email,
        shipping: {
            line1: "",
            line2: "",
            city: "",
            postal_code: "",
            state: "",
            country: "",
            name:  user.fName+" " +user.lName,
            phone: user.phone,

        }
    });
    const [isPending, setIspending] = useState<boolean>(false); // State to manage steps
    const [placeOrderStatus, setPlaceOrderStatus] = useState<string>("Place order")

    const { cart } = useAppSelector(state => state.addToCartInfo)
    const orderItems = cart.map(item => ({ productId: item?._id, quantity: item.quantity, price: item.price, note: item.note }));
    const cartAmount = cart.reduce((acc, { orderQuantity, price }) => {
        return acc + (orderQuantity * price)
    }, 0)

    const handelOnAddressChange = (event: any) => {
        const { complete, value } = event;
        if (complete) {
            setContactInfo((prev) => ({
                ...prev,
                shipping: {
                    ...value.address,
                    name: value.name,
                    phone: value.phone
                }
            }));
        }
    };

    const handleEmailChange = (email: string) => {
        setContactInfo((prev) => ({
            ...prev,
            email
        }));
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            console.error("Stripe.js has not loaded.");
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        if (!contactInfo.email) {
            alert("Email is Required")
            setIsAddressComplete(false)
            throw new Error("Email is Required!.");
        }
        
        const { city, country, line1, name, phone, state, postal_code } = contactInfo.shipping
        if (!city || !country || !line1 || !name || !phone || !state || !postal_code || !contactInfo.email) {
            alert("Please fill in all the fields \nShipping Address field is required!")
            setIsAddressComplete(false)
            throw new Error("Shipping Address field is required!");
        }

        if (!requestDeliveryDate) {
            alert("Please select a delivery date")
            setIsAddressComplete(false)
            throw new Error("Delivery date is required.");
        }
        const return_url = import.meta.env.PROD
            ? import.meta.env.VITE_SUCCESS_URL + "/payment/success"
            : "http://localhost:5173/payment/success";

        try {
            setIspending(true)
            const result = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    // return_url: return_url,
                },
                redirect: "if_required",
            });
            console.log(result)
            if (result.error) {
                // Show error to your customer (for example, payment details incomplete)
                console.log(result.error.message);
            }
            else if (result.paymentIntent?.status === "succeeded") {
                // Your customer will be redirected to your `return_url`. For some payment
                // methods like iDEAL, your customer will be redirected to an intermediate
                // site first to authorize the payment, then redirected to the `return_url`.

                setPlaceOrderStatus("Payment Completed")

                const { line1, line2, city, postal_code, state, country, phone, name } = contactInfo.shipping
                const full_address = `${line2 !== "" ? "UNIT " + line2 + " " : ""} ${line1}, ${city}, ${state}, ${postal_code}, ${country}`
                const customer_details = {
                    name: name,
                    phone: phone,
                    address: full_address,
                    email: contactInfo.email,
                    items: orderItems,
                    deliverStatus: "Not Yet Delivered",
                    deliveryDate: {
                        date: "NY",
                        time: "NY"
                    },
                    requestDeliveryDate: requestDeliveryDate,
                    payment: result?.paymentIntent?.status,
                    amount: parseFloat(cartAmount.toFixed(2)),
                }
                await createOrder(customer_details)

                window.location.href = return_url;
            }
        } catch (error) {
            console.error("Error confirming payment:", error);
        }

        setIspending(false)
    };

    useEffect(() => {
        if (!user) {
           console.log("Usere get")
        } else {
            setContactInfo({
                email: user.email,
                shipping: {
                    line1: "", // Set to an empty string or default value
                    line2: "", // Set to an empty string or default value
                    city: "", // Set to an empty string or default value
                    postal_code: "", // Set to an empty string or default value
                    state: "", // Set to an empty string or default value
                    country: "",
                    name: user.fName + " " + user.lName, // Combine first and last name
                    phone: user.phone,
                    // You can also set other shippng info here if required
                },
            });
        }
    }, [user]);
console.log(contactInfo)
    return (
        <form onSubmit={handleSubmit}>
            <div className='mx-4 my-4'>
                {isAddressComplete && <Button type="button"
                    onClick={() => setIsAddressComplete(false)} className='w-fit my-4'>
                    &lt;  {" "}Previous
                </Button>}

                {!isAddressComplete ? (
                    <>
                        <div className='flex flex-col gap-2'>
                            <div className='shadow-md bg-slate-100 rounded-md ps-2 my-2'>
                                <h3 className='p-2 font-bold text-xl' >Contact Info</h3>
                                <LinkAuthenticationElement
                                    onChange={(event) => handleEmailChange(event?.value?.email)} />
                                {/* If collecting shipping */}

                            </div>
                            <div className='shadow-md bg-slate-100 rounded-md ps-2'>
                                <h3 className='p-2 font-bold text-xl'>Shipping Details</h3>
                                <AddressElement
                                    className="p-4"
                                    options={{
                                        mode: "shipping",
                                        fields: {
                                            phone: "always",
                                        },
                                        autocomplete: {
                                            mode: "automatic"
                                        },
                                    }}

                                    onChange={handelOnAddressChange}
                                />
                            </div>

                            <DeliveryDateSelector requestDeliveryDate={requestDeliveryDate} setRequestDeliveryDate={setRequestDeliveryDate} />
                        </div>
                        {/* <label htmlFor='deliveryDate'>Delivery Date: </label>
                                <input id='deliveryDate' type="date" name="deliveryDate" required onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const date = (e.target.value);
                                    setRequestDeliveryDate(date);
                                }} /> <br /> */}
                        {/* <label htmlFor='deliveryTime'>Delivery Time: </label>
                                <input id='deliveryTime' type="time" name="deliveryTime" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const time = e.target.value;
                                    setDeliveryDate((prev) => ({...prev, time}));
                                }} /> */}



                        <div className='flex justify-center text-center m-4'>
                            <Button type="button" onClick={() => setIsAddressComplete(true)} className='w-[200px]'>
                                Next
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />
                    </>

                )}
            </div>

            {isAddressComplete && (
                <>
                    <div className='flex justify-center text-center m-4'>
                        <Button type="submit" disabled={!stripe || placeOrderStatus === "Payment Completed"} className='w-[200px]'>
                            {isPending ? <div className="w-full h-full flex justify-center items-center my-20">
                                <div
                                    className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                    role="status">
                                    <span
                                        className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                                    >Loading...</span>

                                </div>
                                <span className="ms-2">Processing payment...</span>
                            </div> :
                                placeOrderStatus}
                        </Button>
                    </div>

                </>
            )}
        </form>
    );
};

export default CheckoutForm;