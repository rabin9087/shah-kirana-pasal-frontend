import { createOrder } from '@/axios/order/order';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
    AddressElement, useElements, useStripe, LinkAuthenticationElement,
    PaymentElement,
} from '@stripe/react-stripe-js';
import { FormEvent, useEffect, useState } from 'react';
import DeliveryDateSelector, { PickupTimeSelector } from './DeliveryDate';
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
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isAddressComplete, setIsAddressComplete] = useState(false);
    const { language } = useAppSelector((state) => state.settings);
    const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
    const [paymentType, setPaymentType] = useState<"cash" | "card">("card");
    const [changeDetails, setChangeDetails] = useState(false);
    const [paymentError, setPaymentError] = useState<string | undefined>(undefined);
    const [pickupTime, setPickupTime] = useState("");


    const [userDetails, setUserDetails] = useState(
        {
            fName: user.fName,
            lName: user.lName,
            email: user.email,
            phone: user.phone,
            address: user.address,
        });

    const [requestDeliveryDate, setRequestDeliveryDate] = useState<string>("");
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
    const [isPending, setIspending] = useState<boolean>(false);
    const [placeOrderStatus, setPlaceOrderStatus] = useState<string>("Place order");

    const { cart } = useAppSelector(state => state.addToCartInfo);

    const orderItems = cart.flatMap(item => {
        if (!item.offerName) {
            return [{
                productId: item._id,
                quantity: item.orderQuantity,
                price: item.price,
                note: item.note ?? "",
            } as any];
        }

        // If it's a combo offer
        return (item.items || []).map(product => ({
            productId: typeof product.productId === "string"
                ? product.productId
                : product?.productId?._id,
            quantity: item.orderQuantity as number,
            price: product.price,
            note: item.note ?? "",
            offerName: item.offerName,
            comboId: item._id
        }));
    });

    const cartAmount = cart.reduce((acc, { orderQuantity, price }) => {
        return acc + (orderQuantity as number) * (price as number)
    }, 0)

    const handelOnAddressChange = (event: any) => {
        const { complete, value } = event;
        // Update isAddressComplete based on the completeness of the address element
        setIsAddressComplete(complete);
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

    const updateCartAndUserCart = async (orderNumber: number, paymentStatus: string) => {
        // Dispatch actions to reset cart and update user's cart history
        dispatch(resetCart());
        await dispatch(updateCartInUserAxios(user.phone, []));
        await dispatch(updateCartHistoryInUserAxios({
            phone: user.phone,
            items: orderItems.map((item) => ({
                productId: item.productId as string,
                orderQuantity: item.quantity as number,
                price: item.price,
                note: item.note,
            })),
            cartAmount,
            orderNumber,
            deliveryStatus: "Order Placed",
            paymentStatus: paymentStatus
        }));
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setPaymentError(undefined); // Clear previous errors

        if (orderItems.length === 0) {
            toast.error("Please add items to cart!");
            return;
        }

        if (!contactInfo.email) {
            toast.error("Email is Required!");
            setIsAddressComplete(false); // Go back to address step if email is missing
            return;
        }

        const { city, country, line1, name, phone, state, postal_code } = contactInfo.shipping;
        if (orderType === "delivery" && (!city || !country || !line1 || !name || !phone ||
            !state || !postal_code || !contactInfo.email)) {
            toast.error("Please fill in all the fields. Shipping Address field is required!");
            setIsAddressComplete(false); // Go back to address step if address is incomplete
            return;
        }

        if (!requestDeliveryDate) {
            toast.error(`Please select a ${orderType === "delivery" ? "delivery" : "pickup"} date`);
            setIsAddressComplete(false); // Go back to address step if date is missing
            return;
        }

        setIspending(true);
        setPlaceOrderStatus("Processing...");

        try {
            let returnUrl = import.meta.env.MODE === 'production'
                ? "https://www.shahkiranapasal.shop/payment/success"
                : "http://localhost:5173/payment/success";

            if (paymentType === "card") {
                if (!stripe || !elements) {
                    // Stripe.js hasn't yet loaded.
                    // Make sure to disable form submission until Stripe.js has loaded.
                    setIspending(false);
                    setPlaceOrderStatus("Place order");
                    return;
                }

                const result = await stripe.confirmPayment({
                    elements,
                    confirmParams: {
                        return_url: returnUrl,
                        // Add shipping details if orderType is delivery
                        ...(orderType === "delivery" && {
                            shipping: {
                                address: {
                                    line1: contactInfo.shipping.line1,
                                    line2: contactInfo.shipping.line2,
                                    city: contactInfo.shipping.city,
                                    postal_code: contactInfo.shipping.postal_code,
                                    state: contactInfo.shipping.state,
                                    country: contactInfo.shipping.country,
                                },
                                name: contactInfo.shipping.name,
                                phone: contactInfo.shipping.phone,
                            },

                        })
                    },
                    redirect: "if_required", // This handles redirects for Afterpay, Zip, etc.
                });
                console.log(result)
                console.log("confirm payment done")
                if (result.error) {
                    let message = "An unexpected error occurred.";
                    const { type, message: stripeMsg, code } = result.error;

                    switch (type) {
                        case 'card_error':
                        case 'validation_error':
                            if (code === 'insufficient_funds') {
                                message = "Your card has insufficient balance.";
                            } else if (code === 'card_declined') {
                                message = "Your card was declined. Please try another payment method.";
                            } else if (code === 'expired_card') {
                                message = "Your card has expired. Please use a different card.";
                            } else if (code === 'incorrect_cvc') {
                                message = "The CVC code is incorrect.";
                            } else {
                                message = stripeMsg ?? "Your card could not be processed.";
                            }
                            break;
                        case 'api_connection_error':
                            message = "Network error. Please check your internet connection.";
                            break;
                        case 'api_error':
                            message = "Something went wrong with Stripe. Please try again later.";
                            break;
                        case 'authentication_error':
                            message = "Authentication failed. Check your Stripe configuration.";
                            break;
                        case 'rate_limit_error':
                            message = "Too many requests. Please wait a moment and try again.";
                            break;
                        default:
                            message = stripeMsg ?? "An error occurred during payment.";
                            break;
                    }

                    setPaymentError(message);
                } else if (result.paymentIntent.status === "succeeded") {
                    // Payment succeeded immediately (e.g., direct card payment)
                    console.log("Payment success")
                    const customer_details = {
                        name: userDetails.fName + " " + userDetails.lName,
                        phone: userDetails.phone,
                        address: userDetails.address,
                        email: userDetails.email,
                        items: orderItems as any,
                        deliveryStatus: "Order placed",
                        deliveryDate: {
                            date: requestDeliveryDate ?? "NA", // This might need to be dynamic based on requestDeliveryDate
                            time: pickupTime ?? "NA" // This might need to be dynamic based on requestDeliveryDate
                        },
                        requestDeliveryDate: requestDeliveryDate,
                        paymentType: result.paymentIntent.payment_method_types[0],
                        amount: parseFloat(cartAmount.toFixed(2)),
                        orderType: orderType,
                        paymentStatus: "Paid",
                    };
                    const orderNumber = await createOrder(customer_details);
                    await updateCartAndUserCart(orderNumber.orderNumber as number, "Paid");
                    setPlaceOrderStatus("Payment Completed");
                    toast.success("Payment successful! Your order has been placed.");
                    if (result.paymentIntent?.receipt_email) {
                        // If the payment intent has a receipt URL, you can redirect the user to it.
                        // This is optional and can be handled differently based on your flow.
                        window.location.href = result.paymentIntent.receipt_email;
                    }
                    navigate("/payment/success");
                } else {
                    // Payment requires further action (e.g., 3D Secure, Afterpay/Zip redirect)
                    // Stripe will handle the redirect, so no explicit navigation here.
                    // The return_url will handle the final status.
                    setPlaceOrderStatus("Redirecting for payment...");
                    // No need to navigate here, Stripe will redirect.
                }
            } else if (paymentType === "cash") {
                const customer_details = {
                    name: userDetails.fName + " " + userDetails.lName,
                    phone: userDetails.phone,
                    address: userDetails.address,
                email: userDetails.email,
                    items: orderItems as any,
                    deliveryStatus: "Order placed",
                    deliveryDate: {
                        date: requestDeliveryDate ?? "NA", // This might need to be dynamic based on requestDeliveryDate
                        time: pickupTime ?? "NA" // This might need to be dynamic based on requestDeliveryDate
                    },
                    requestDeliveryDate: requestDeliveryDate,
                    paymentType: paymentType,
                    amount: parseFloat(cartAmount.toFixed(2)),
                    orderType: orderType,
                    paymentStatus: "Not Yet Paid",
                };
                const orderNumber = await createOrder(customer_details);
                await updateCartAndUserCart(orderNumber.orderNumber as number, "Not Yet Paid");
                setPlaceOrderStatus("Order Placed");
                toast.success("Order placed successfully! Payment due on delivery/pickup.");
                navigate("/payment/success");
            } else {
                setPlaceOrderStatus("Place order");
                toast.error("Invalid payment type selected.");
                return;
            }
            setIspending(true);
            setPlaceOrderStatus("Place order");

        } catch (error: any) {
            console.error("Error confirming payment or placing order:", error);
            setPaymentError(error.message || "An unexpected error occurred during payment.");
            setPlaceOrderStatus("Place order");

            toast.error("An error occurred. Please try again.");
        } finally {
            setIspending(false);
        }
    };

    useEffect(() => {

    }, [cartAmount])

    useEffect(() => {
        if (!user) {
            // Handle case where user is not logged in, e.g., redirect to login
            // For now, it will just use default empty values or whatever user state provides.
        } else {
            // Initialize contactInfo with user details, ensuring shipping address fields are empty initially
            setContactInfo({
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
                },
            });
        }
    }, [user]);

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-4 md:p-8">
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
                                    ? "bg-primary text-white"
                                    : "bg-gray-200 text-gray-700"
                                    }`}
                                onClick={() => setOrderType("pickup")}
                            >
                                {language === "en" ? "Pick up" : "पसलबाट उठाउनुहोस्"}
                            </Button>
                            <Button
                                type="button"
                                className={`px-4 py-2 rounded-lg transition-colors ${orderType === "delivery"
                                    ? "bg-primary text-white"
                                    : "bg-gray-200 text-gray-700"
                                    }`} onClick={() => setOrderType("delivery")}
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
                                                allowedCountries: ["AU"], // Country code must be uppercase 'AU'
                                                blockPoBox: false,
                                                fields: { phone: "always" },
                                                autocomplete: { mode: "automatic" },
                                            }}
                                            onChange={(event) => {
                                                const address = event.value?.address;

                                                // Allowed suburbs list
                                                const allowedSuburbs = ["Sydney", "Parramatta", "Chatswood", "Blacktown"];

                                                if (address?.city && !allowedSuburbs.includes(address.city)) {
                                                    console.warn("Suburb not allowed:", address.city);
                                                    // You can show an error message here instead of silently rejecting
                                                    return;
                                                }

                                                handelOnAddressChange(event);
                                            }}
                                        />
                                    </div>
                                )}
                                <DeliveryDateSelector
                                    orderType={orderType}
                                    requestDeliveryDate={requestDeliveryDate}
                                    setRequestDeliveryDate={setRequestDeliveryDate}
                                />
                                {orderType === "pickup" && requestDeliveryDate && <div>
                                    <PickupTimeSelector pickupTime={pickupTime} setPickupTime={setPickupTime} />
                                    <p>Selected pickup time: {pickupTime}</p>
                                </div>}

                            </section>

                            <div className="flex justify-center">
                                <Button type="button" onClick={() => setIsAddressComplete(true)} className="w-48 mt-6">
                                    {language === "en" ? "Next >" : "अर्को पेज"}
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
                                            ? "bg-primary text-white"
                                            : "bg-gray-200 text-gray-700"
                                            }`}
                                        onClick={() => setPaymentType("card")}
                                    >
                                        {language === "en" ? "Card" : "कार्ड"}
                                    </Button>
                                    <Button
                                        type="button"
                                        className={`px-4 py-2 rounded-lg transition-colors ${paymentType === "cash"
                                            ? "bg-primary text-white"
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
                            {paymentType === "card" && (
                                <div className="space-y-6 py-4">
                                    <div className="bg-white rounded-2xl shadow-md p-4 border">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                            Pay with Card
                                        </h3>
                                        <PaymentElement
                                            className="w-full"
                                            id="payment-element"
                                            options={{
                                                layout: "auto",
                                                // wallets: {
                                                //     applePay: "auto",
                                                //     googlePay: "auto",
                                                // },
                                            }}
                                        />

                                    </div>
                                    {paymentError && (
                                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm">
                                            <strong className="font-bold">Payment Error: </strong>
                                            <span className="block sm:inline">{paymentError}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {/* Submit Button */}
                    {isAddressComplete && (
                        <div className="flex justify-center">
                            <Button
                                type="submit"
                                disabled={!stripe && paymentType === "card" || placeOrderStatus === "Payment Completed"}
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