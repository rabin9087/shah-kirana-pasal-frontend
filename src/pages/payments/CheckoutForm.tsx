import { createOrder } from '@/axios/order/order';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
    AddressElement, PaymentElement, useElements, useStripe, LinkAuthenticationElement,
} from '@stripe/react-stripe-js';
import { FormEvent, useEffect, useState } from 'react';
import DeliveryDateSelector from './DeliveryDate';
import { resetCart } from '@/redux/addToCart.slice';
import { updateCartHistoryInUserAxios, updateCartInUserAxios } from '@/action/user.action';
import { useNavigate } from 'react-router';

const CheckoutForm = () => {
    const { user } = useAppSelector((state) => state.userInfo);
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [isAddressComplete, setIsAddressComplete] = useState(false);
    const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
    const [paymentType, setPaymentType] = useState<"cash" | "card">("card");
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
            name: user.fName + " " + user.lName,
            phone: user.phone,

        }
    });
    const [isPending, setIspending] = useState<boolean>(false); // State to manage steps
    const [placeOrderStatus, setPlaceOrderStatus] = useState<string>("Place order")

    const { cart } = useAppSelector(state => state.addToCartInfo)
    const orderItems = cart.map(item => ({ productId: item?._id, quantity: item.quantity, price: item.price, note: item.note === undefined ? "" : item.note }));
    const items = cart.map(item => ({ productId: item?._id, orderQuantity: item.quantity, price: item.price, note: item.note }));

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

    const updateCartAndUserCart = () => {
        dispatch(resetCart())
        dispatch(updateCartInUserAxios(user.phone, []));
        dispatch(updateCartHistoryInUserAxios(user.phone, items, cartAmount));
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (paymentType==="card" && !stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        if (!contactInfo.email) {
            alert("Email is Required")
            setIsAddressComplete(false)
            throw new Error("Email is Required!.");
        }
        
        const { city, country, line1, name, phone, state, postal_code } = contactInfo.shipping
        if (orderType === "delivery" && (!city || !country || !line1 || !name || !phone ||
            !state || !postal_code || !contactInfo.email)) {
            alert("Please fill in all the fields \nShipping Address field is required!")
            setIsAddressComplete(false)
            throw new Error("Shipping Address field is required!");
        }

        if (!requestDeliveryDate) {
            orderType === "delivery" &&  alert("Please select a delivery date")
            orderType === "pickup" &&  alert("Please select a pickup date")
            setIsAddressComplete(false)
            throw new Error("Delivery date is required.");
        }
        // const return_url = import.meta.env.PROD
        //     ? import.meta.env.VITE_SUCCESS_URL + "/payment/success"
        //     : "http://localhost:5173/payment/success";

        try {
            setIspending(true)
           if(paymentType=== "card"){ const result = await stripe?.confirmPayment({
                elements,
                confirmParams: {
                    // return_url: return_url,
                },
                redirect: "if_required",
            });
            
            if (result?.error) {
                // Show error to your customer (for example, payment details incomplete)
                console.log(result.error.message);
            }
            else if (result?.paymentIntent?.status === "succeeded") {
                // Your customer will be redirected to your `return_url`. For some payment
                // methods like iDEAL, your customer will be redirected to an intermediate
                // site first to authorize the payment, then redirected to the `return_url`.

                const { line1, line2, city, postal_code, state, country, phone, name } = contactInfo.shipping
                const full_address = `${line2 !== "" ? "UNIT " + line2 + " " : ""} ${line1}, ${city}, ${state}, ${postal_code}, ${country}`
                const customer_details = {
                    name: name,
                    phone: phone,
                    address: full_address,
                    email: contactInfo.email,
                    items: orderItems as any,
                    deliverStatus: "Not Yet Delivered",
                    deliveryDate: {
                        date: "NY",
                        time: "NY"
                    },
                    requestDeliveryDate: requestDeliveryDate,
                    payment: result?.paymentIntent?.status,
                    amount: parseFloat(cartAmount.toFixed(2)),
                    orderType: orderType
                }
                await createOrder(customer_details)
                updateCartAndUserCart()
                setPlaceOrderStatus("Payment Completed")
                return navigate("/payment/success")
                
               }
           }
           else if(paymentType=== "cash"){
               const customer_details = {
                   name: user.fName + " " + user.lName,
                   phone: user.phone,
                   address: user.address,
                   email: user.email,
                   items: orderItems as any,
                   deliverStatus: "Not Yet Delivered",
                   deliveryDate: {
                       date: "NY",
                       time: "NY"
                   },
                   requestDeliveryDate: requestDeliveryDate,
                   payment: paymentType,
                   amount: parseFloat(cartAmount.toFixed(2)),
                   orderType: orderType

               }
            await   createOrder(customer_details)
                    updateCartAndUserCart()
                    setPlaceOrderStatus("Payment Completed")
                return navigate("/payment/success")
            } else {
                return
            }
            
        } catch (error) {
            console.error("Error confirming payment:", error);
        }

       return setIspending(false)
    };

    useEffect(() => {
        if (!user) {
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
                {isAddressComplete && <Button
                    type="button"
                    onClick={() => setIsAddressComplete(false)} className='w-fit my-4'>
                    &lt;  {" "}Previous
                </Button>}
                <div className='flex flex-col gap-2'>
                    <div className='shadow-md bg-slate-100 rounded-md ps-2 my-2'>
                        <h3 className='p-2 font-bold text-xl' >Order Type</h3>
                        <div className="flex items-center space-x-4">
                            <Button
                                type='button'
                                className={`px-4 py-2 rounded-lg transition-colors ${orderType === "pickup"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-700"
                                    }`}
                                onClick={() => setOrderType("pickup")}
                            >
                                Pick Up
                            </Button>

                            <Button
                                type='button'
                                className={`px-4 py-2 rounded-lg transition-colors ${orderType === "delivery"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-700"
                                    }`}
                                onClick={() => setOrderType("delivery")}
                            >
                                Delivery
                            </Button>
                        </div>
                    </div>
                </div>
                {!isAddressComplete ? (
                    <>
                        <div className='flex flex-col gap-2'>
                            <div className='shadow-md bg-slate-100 rounded-md ps-2 my-2'>
                                <h3 className='p-2 font-bold text-xl' >Contact Info</h3>
                                <LinkAuthenticationElement
                                    onChange={(event) => handleEmailChange(event?.value?.email)} />
                                {/* If collecting shipping */}
                                {orderType === "pickup" && <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">User Details</h2>
                                    <div className="space-y-2">
                                        <p><span className="font-medium">First Name:</span> {user.fName || "N/A"}</p>
                                        <p><span className="font-medium">Last Name:</span> {user.lName || "N/A"}</p>
                                        <p><span className="font-medium">Phone:</span> {user.phone || "N/A"}</p>
                                        <p><span className="font-medium">Email:</span> {user.email || "N/A"}</p>
                                        <p><span className="font-medium">Address:</span> {user.address || "N/A"}</p>
                                    </div>
                                </div>}
                            </div>
                            
                           {orderType === "delivery" && <div className='shadow-md bg-slate-100 rounded-md ps-2'>
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
                            </div>}

                            {  <DeliveryDateSelector orderType={orderType} requestDeliveryDate={requestDeliveryDate} setRequestDeliveryDate={setRequestDeliveryDate} />}                        </div>
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
                            <div className='flex flex-col gap-2'>
                                <div className='shadow-md bg-slate-100 rounded-md ps-2 my-2'>
                                    <h3 className='p-2 font-bold text-xl' >Payment Type</h3>
                                    <div className="flex items-center space-x-4">
                                        <Button type='button'
                                            className={`px-4 py-2 rounded-lg transition-colors ${paymentType === "cash"
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-200 text-gray-700"
                                                }`}
                                            onClick={() => setPaymentType("cash")}
                                        >
                                            Cash
                                        </Button>

                                        <Button
                                            type='button'
                                            className={`px-4 py-2 rounded-lg transition-colors ${paymentType === "card"
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-200 text-gray-700"
                                                }`}
                                            onClick={() => setPaymentType("card")}
                                        >
                                            Card
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className='shadow-md bg-slate-100 rounded-md ps-2 my-2'>
                                <h3 className='p-2 font-bold text-xl text-center' >Amount to be paid: {cartAmount}</h3></div>
                            {paymentType === "card" && <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />}
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