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
import { UserDetailsModel } from './UserDetailsModel';
import { toast } from 'react-toastify';
// import ZipCheckout from './paymentTypes/ZipPayPaymentMethod';
// import { EsewaPaymentButton } from './paymentTypes/PaymentWithESewa';
// import ZipPayButton from './paymentTypes/ZipPayPaymentMethod';
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
    const [paymentType, setPaymentType] = useState<"cash" | "card">("card");
    const [changeDetails, setChangeDetails] = useState(false);
    // const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

    const [userDetails, setUserDetails] = useState(
        {
            fName: user.fName,
            lName: user.lName,
            email: user.email,
            phone: user.phone,
            address: user.address,
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
                // if (result?.paymentIntent?.payment_method === "zip") {
                //     setZipPayment(true)
                // }
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
                    dispatch(resetCart())

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
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-4 md:p-8 overflow-y-auto max-h-[95vh]">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {isAddressComplete && (
                        <Button
                            type="button"
                            onClick={() => setIsAddressComplete(false)}
                            className="mb-4"
                        >
                            &lt; {language === "en" ? "Previous" : "अघिल्लो"}
                        </Button>
                    )}

                    {/* Order Type */}
                    <section className="bg-slate-100 rounded-lg p-4 shadow">
                        <h2 className="text-xl font-bold mb-4">
                            {language === "en" ? "Order Type" : "अर्डर प्रकार"}
                        </h2>
                        <div className="flex gap-4">
                            <Button
                                type="button"
                                className={`px-4 py-2 rounded-lg transition-colors ${orderType === "pickup"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-700"
                                    }`}
                                onClick={() => setOrderType("pickup")}
                            >
                                {language === "en" ? "Pick up" : "पसलबाट उठाउनुहोस्"}
                            </Button>
                            <Button
                                type="button"
                                className="px-4 py-2 rounded-lg bg-gray-300 text-gray-500 cursor-not-allowed"
                                disabled
                            >
                                {language === "en" ? "Delivery" : "डिलीवरी"}
                            </Button>
                        </div>
                    </section>

                    {!isAddressComplete ? (
                        <>
                            {/* Contact Info */}
                            <section className="bg-slate-100 rounded-lg p-4 shadow space-y-4">
                                <h2 className="text-xl font-bold">
                                    {language === "en" ? "Contact Info" : "सम्पर्क जानकारी"}
                                </h2>
                                <LinkAuthenticationElement
                                    onChange={(event) => handleEmailChange(event?.value?.email)}
                                />
                                {orderType === "pickup" && (
                                    <div className="bg-white rounded-lg shadow p-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-semibold">
                                                {language === "en"
                                                    ? "User's Details"
                                                    : "प्रयोगकर्ताको विवरण"}
                                            </h3>
                                            <Button
                                                type="button"
                                                onClick={() => setChangeDetails(true)}
                                                variant="ghost"
                                            >
                                                <FaRegEdit size={20} />
                                            </Button>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <p>
                                                <strong>{language === "en" ? "First Name" : "पहिलो नाम"}:</strong>{" "}
                                                {userDetails.fName || "N/A"}
                                            </p>
                                            <p>
                                                <strong>{language === "en" ? "Last Name" : "अन्तिम नाम"}:</strong>{" "}
                                                {userDetails.lName || "N/A"}
                                            </p>
                                            <p>
                                                <strong>{language === "en" ? "Phone" : "फोन"}:</strong>{" "}
                                                {userDetails.phone || "N/A"}
                                            </p>
                                            <p>
                                                <strong>{language === "en" ? "Email" : "इमेल"}:</strong>{" "}
                                                {userDetails.email || "N/A"}
                                            </p>
                                            <p>
                                                <strong>{language === "en" ? "Address" : "ठेगाना"}:</strong>{" "}
                                                {userDetails.address || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {orderType === "delivery" && (
                                    <div>
                                        <h3 className="text-lg font-bold mb-2">
                                            {language === "en" ? "Shipping Details" : "शिपिंग विवरण"}
                                        </h3>
                                        <AddressElement
                                            className="p-2"
                                            options={{
                                                mode: "shipping",
                                                allowedCountries: [],
                                                blockPoBox: false,
                                                fields: { phone: "always" },
                                                autocomplete: { mode: "automatic" },
                                            }}
                                            onChange={handelOnAddressChange}
                                        />
                                    </div>
                                )}
                                <DeliveryDateSelector
                                    orderType={orderType}
                                    requestDeliveryDate={requestDeliveryDate}
                                    setRequestDeliveryDate={setRequestDeliveryDate}
                                />
                            </section>

                            <div className="flex justify-center">
                                <Button type="button" onClick={() => setIsAddressComplete(true)} className="w-48 mt-6">
                                    {language === "en" ? "Next" : "अर्को पेज"}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Payment Type */}
                            <section className="bg-slate-100 rounded-lg p-4 shadow space-y-4">
                                <h2 className="text-xl font-bold">
                                    {language === "en" ? "Payment Type" : "भुक्तान प्रकार"}
                                </h2>
                                <div className="flex gap-4">
                                    <Button
                                        type="button"
                                        className={`px-4 py-2 rounded-lg transition-colors ${paymentType === "card"
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200 text-gray-700"
                                            }`}
                                        onClick={() => setPaymentType("card")}
                                    >
                                        {language === "en" ? "Card" : "कार्ड"}
                                    </Button>
                                    <Button
                                        type="button"
                                        className={`px-4 py-2 rounded-lg transition-colors ${paymentType === "cash"
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200 text-gray-700"
                                            }`}
                                        onClick={() => setPaymentType("cash")}
                                    >
                                        {language === "en" ? "Cash" : "कैश"}
                                    </Button>
                                </div>
                            </section>

                            {/* Payment Amount */}
                            <div className="bg-slate-100 rounded-lg p-4 text-center font-semibold shadow">
                                {language === "en"
                                    ? `Amount to be paid $${cartAmount?.toFixed(2)}`
                                    : `तिर्नुपर्ने रकम: रु. ${cartAmount?.toFixed(2)}`}
                            </div>

                                {/* Card Payment Options */}
                                
                                {/* {paymentType === "card" && <div className='flex gap-2 py-4'>
                                    <PaymentButton amount={cartAmount} />
                                    <EsewaPaymentButton amount={cartAmount} />
                                    <button
                                        className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
                                    >
                                        Pay with Zip
                                    </button>

                                </div>} */}
                            {paymentType === "card" && (
                                <div className="space-y-6 py-4">
                                    <div className="bg-white rounded-2xl shadow-md p-4 border">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                            Pay with Card / Apple Pay / Google Pay
                                        </h3>
                                        <PaymentElement
                                            className="w-full"
                                            id="payment-element"
                                            options={{
                                                layout: "tabs",
                                                wallets: {
                                                    applePay: "auto",
                                                    googlePay: "auto",
                                                },
                                            }}
                                        />
                                    </div>
                                    {/* <ZipCheckout /> */}
                                </div>
                            )}
                        </>
                    )}

                    {/* Submit Button */}
                    {isAddressComplete && (
                        <div className="flex justify-center">
                            <Button
                                type="submit"
                                disabled={!stripe || placeOrderStatus === "Payment Completed"}
                                className="w-48 mt-4"
                            >
                                {isPending ? (
                                    <div className="flex items-center">
                                        <span className="loader mr-2 animate-spin h-5 w-5 border-2 border-white border-r-transparent rounded-full"></span>
                                        <span>Processing...</span>
                                    </div>
                                ) : (
                                    language === "en" ? placeOrderStatus : "अर्डर गर्नुहोस"
                                )}
                            </Button>
                        </div>
                    )}

                    {/* Modal for User Details */}
                    <UserDetailsModel
                        isOpen={changeDetails}
                        onClose={() => setChangeDetails(false)}
                        setUserDetails={setUserDetails}
                        userDetails={userDetails}
                    />
                </form>
            </div>
        </div>

    );
};

export default CheckoutForm;