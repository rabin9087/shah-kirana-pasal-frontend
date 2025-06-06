import { createOrder } from '@/axios/order/order';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
    AddressElement, useElements, useStripe, LinkAuthenticationElement,
    PaymentElement,
} from '@stripe/react-stripe-js';
import { FormEvent, useEffect, useState } from 'react';
import DeliveryDateSelector from './DeliveryDate';
import { resetCart } from '@/redux/addToCart.slice';
import { updateCartHistoryInUserAxios, updateCartInUserAxios } from '@/action/user.action';
import { useNavigate } from 'react-router';
import { FaRegEdit } from "react-icons/fa";
import LocationComponent from '../home/GeoLocation';
import { UserDetailsModel } from './UserDetailsModel';
import { PaymentButton } from './KhaltiWebPaymentMethod';
import { toast } from 'react-toastify';
// import { EsewaPaymentButton } from './PaymentWithESewa';

const CheckoutForm = () => {
    const { user } = useAppSelector((state) => state.userInfo);
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [isAddressComplete, setIsAddressComplete] = useState(false);
    const { language } = useAppSelector((state) => state.settings)
    const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
    const [paymentType, setPaymentType] = useState<"cash" | "card">("cash");
    const [changeDetails, setChangeDetails] = useState(false);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

    const [userDetails, setUserDetails] = useState(
        {
            fName: user.fName,
            lName: user.lName,
            email: user.email,
            phone: user.phone,
            address: user.address !== "" ? user.address + ", (" + location?.lat.toString() + ", " + location?.lng.toString() + ")" : location?.lat.toString() + ", " + location?.lng.toString(),
        })

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
    const orderItems = cart.map(item => ({ productId: item?._id, quantity: item.orderQuantity, price: item.price, note: item.note === undefined ? "" : item.note }));
    const items = cart.map(item => ({ productId: item?._id, orderQuantity: item.orderQuantity, price: item.price, note: item.note === undefined ? "" : item.note }));

    const cartAmount = cart.reduce((acc, { orderQuantity, price, salesPrice }) => {
        return acc + (orderQuantity * (salesPrice > 0 ? salesPrice : price));
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

    const updateCartAndUserCart = (orderNumber: number) => {
        dispatch(resetCart())
        dispatch(updateCartInUserAxios(user.phone, []));
        dispatch(updateCartHistoryInUserAxios({ phone: user.phone, items, cartAmount, orderNumber, deliveryStatus: "Order Placed", paymentStatus: paymentType === "card" ? "Paid" : "Not Yet Paid" }));
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (paymentType === "card" && !stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        if (!contactInfo.email) {
            alert("Email is Required")
            setIsAddressComplete(false)
            throw new Error("Email is Required!.");
        }

        if (orderItems.length === 0) {
            toast.error("Please add items to cart!");
            return
        }

        const { city, country, line1, name, phone, state, postal_code } = contactInfo.shipping
        if (orderType === "delivery" && (!city || !country || !line1 || !name || !phone ||
            !state || !postal_code || !contactInfo.email)) {
            alert("Please fill in all the fields \nShipping Address field is required!")
            setIsAddressComplete(false)
            throw new Error("Shipping Address field is required!");
        }

        if (!requestDeliveryDate) {
            orderType === "delivery" && alert("Please select a delivery date")
            orderType === "pickup" && alert("Please select a pickup date")
            setIsAddressComplete(false)
            throw new Error("Delivery date is required.");
        }

        try {
            setIspending(true)
            if (paymentType === "card") {
                const result = await stripe?.confirmPayment({
                    elements,
                    confirmParams: {
                        return_url: "https://www.shahkiranapasal.shop/payment/success",
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

                    // const { line1, line2, city, postal_code, state, country} = contactInfo.shipping
                    // if (!line1 || !line2 || !city || !state || ! country || !postal_code) {

                    // }
                    // const full_address = `${line2 !== "" ? "UNIT " + line2 + " " : ""} ${line1}, ${city}, ${state}, ${postal_code}, ${country}`

                    const customer_details = {
                        name: userDetails.fName + " " + userDetails.lName,
                        phone: userDetails.phone,
                        address: userDetails.address,
                        email: userDetails.email,
                        items: orderItems as any,
                        deliveryStatus: "Order placed",
                        deliveryDate: {
                            date: "NY",
                            time: "NY"
                        },
                        requestDeliveryDate: requestDeliveryDate,
                        paymentType: "card",
                        amount: parseFloat(cartAmount.toFixed(2)),
                        orderType: orderType,
                        paymentStatus: "Paid",
                    }
                    const orderNumber = await createOrder(customer_details)
                    updateCartAndUserCart(orderNumber.orderNumber as number)
                    setPlaceOrderStatus("Payment Completed")
                    return navigate("/payment/success")

                }
            }
            else if (paymentType === "cash") {
                const customer_details = {
                    name: userDetails.fName + " " + userDetails.lName,
                    phone: userDetails.phone,
                    address: userDetails.address,
                    email: userDetails.email,
                    items: orderItems as any,
                    deliveryStatus: "Order placed",
                    deliveryDate: {
                        date: "NY",
                        time: "NY"
                    },
                    requestDeliveryDate: requestDeliveryDate,
                    paymentType: paymentType,
                    amount: parseFloat(cartAmount.toFixed(2)),
                    orderType: orderType,
                    paymentStatus: "Not Yet Paid",

                }
                const orderNumber = await createOrder(customer_details)
                updateCartAndUserCart(orderNumber.orderNumber as number)
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
        if (location?.lat && location?.lng) {
            setUserDetails((prev) => ({ ...prev, address: user.address !== "" ? user.address + ", (" + location?.lat.toString() + ", " + location?.lng.toString() + ")" : location?.lat.toString() + ", " + location?.lng.toString(), }));
        }
    }, [location?.lat, location?.lng]);

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
    return (
        <div className="h-screen w-full flex items-center justify-center bg-gray-100">
            <div className="w-full md:max-w-full max-w-md h-[95vh] overflow-y-auto bg-white rounded-lg shadow-lg p-4 md:p-8">
                <form onSubmit={handleSubmit} className="w-full space-y-6">
                    <div className='mx-4 my-4'>
                        {isAddressComplete && <Button
                            type="button"
                            onClick={() => setIsAddressComplete(false)} className='w-fit my-4'>
                            &lt;  {" "}{language === "en" ? "Previous" : "अघिल्लो"}
                        </Button>}
                        <div className='flex flex-col gap-2'>
                            <div className='shadow-md bg-slate-100 rounded-md ps-2 my-2'>
                                <h3 className='p-2 font-bold text-xl' >{language === "en" ? "Order Type" : "अर्डर प्रकार"}</h3>
                                <div className="flex items-center space-x-4">
                                    <Button
                                        type='button'
                                        className={`px-4 py-2 rounded-lg transition-colors ${orderType === "pickup"
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200 text-gray-700"
                                            }`}
                                        onClick={() => setOrderType("pickup")}
                                    >
                                        {language === "en" ? "Pick up" : "`पसलबाट उठाउनुहोस्`"}
                                    </Button>

                                    <Button
                                        type='button'
                                        className={`px-4 py-2 rounded-lg transition-colors ${orderType === "delivery"
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200 text-gray-700"
                                            }`}
                                        disabled
                                        onClick={() => setOrderType("delivery")}
                                    >
                                        {language === "en" ? "Delivery" : "डिलीवरी"}
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
                                        {orderType === "pickup" &&

                                            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                                                <div className='flex justify-between'>
                                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                                        {language === "en" ? "User's Details" : "प्रयोगकर्ताको विवरण"}</h2>
                                                    <Button type='button' onClick={() => setChangeDetails(true)}><FaRegEdit size={20} /></Button>
                                                </div>

                                                <div className="space-y-2">
                                                    <p><span className="font-medium" >{language === "en" ? "First Name" : "पहिलो नाम"}:</span> {userDetails.fName || "N/A"}</p>
                                                    <p><span className="font-medium">{language === "en" ? "Last Name" : "अन्तिम नाम"}:</span> {userDetails.lName || "N/A"}</p>
                                                    <p><span className="font-medium">{language === "en" ? "Phone" : "फोन"}:</span> {userDetails.phone || "N/A"}</p>
                                                    <p><span className="font-medium">{language === "en" ? "Email" : "इमेल"}:</span> {userDetails.email || "N/A"}</p>
                                                    <p><span className="font-medium">{language === "en" ? "Address" : "ठेगाना"}:</span> {userDetails.address || "N/A"}</p>
                                                </div>
                                            </div>}
                                    </div>
                                    <UserDetailsModel
                                        isOpen={changeDetails}
                                        onClose={() => setChangeDetails(false)}
                                        setUserDetails={setUserDetails}
                                        userDetails={userDetails}
                                    />

                                    <LocationComponent setLocation={setLocation} />

                                    {orderType === "delivery" && <div className='shadow-md bg-slate-100 rounded-md ps-2'>
                                        <h3 className='p-2 font-bold text-xl'>Shipping Details</h3>

                                        <AddressElement
                                            className="p-4"
                                            options={{
                                                mode: "shipping",
                                                allowedCountries: [], // Ensure Nepal is allowed
                                                blockPoBox: false,
                                                fields: {
                                                    phone: "always",
                                                    // Set to "auto" to avoid validation issues
                                                },
                                                autocomplete: {
                                                    mode: "automatic"
                                                },
                                            }}

                                            onChange={handelOnAddressChange}
                                        />
                                    </div>}

                                    <DeliveryDateSelector orderType={orderType} requestDeliveryDate={requestDeliveryDate} setRequestDeliveryDate={setRequestDeliveryDate} />
                                </div>

                                <div className='flex justify-center text-center m-4'>
                                    <Button type="button" onClick={() => setIsAddressComplete(true)} className='w-[200px]'>
                                        {language === "en" ? "Next" : "अर्को पेज"}
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='flex flex-col gap-2'>
                                    <div className='shadow-md bg-slate-100 rounded-md ps-2 my-2'>
                                        <h3 className='p-2 font-bold text-xl' >{language === "en" ? "Payment Type" : "भुक्तान प्रकार"}</h3>
                                        <div className="flex items-center space-x-4">
                                            <Button type='button'
                                                className={`px-4 py-2 rounded-lg transition-colors ${paymentType === "cash"
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-200 text-gray-700"
                                                    }`}
                                                onClick={() => setPaymentType("cash")}
                                            >
                                                {language === "en" ? "Cash" : "कैश"}
                                            </Button>

                                            <Button
                                                type='button'
                                                className={`px-4 py-2 rounded-lg transition-colors ${paymentType === "card"
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-200 text-gray-700"
                                                    }`}
                                                onClick={() => setPaymentType("card")}

                                            >
                                                {language === "en" ? "Card" : " कार्ड"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className='shadow-md bg-slate-100 rounded-md ps-2 my-2'>
                                    <h3 className='p-2 font-bold text-xl text-center' > {language === "en" ? "Amount to be paid $" : "तिर्नुपर्ने रकम: रु."} {cartAmount?.toFixed(2)}</h3></div>
                                {paymentType === "card" && <div>
                                    <PaymentButton amount={cartAmount} />
                                    {/* <EsewaPaymentButton amount={cartAmount} /> */}
                                </div>}

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
                                        language === "en" ? placeOrderStatus : "अर्डर गर्नुहोस"}
                                </Button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CheckoutForm;