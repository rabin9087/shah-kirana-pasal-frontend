import { useCallback } from "react";
import KhaltiCheckout, { KhaltiConfig, KhaltiEventHandler, KhaltiOnSuccessPayload } from "khalti-checkout-web";

// Use the environment variable for the Khalti public key
const KHALTI_PUBLIC_KEY = import.meta.env.VITE_KHALTI_PUBLIC_KEY;

const useKhaltiPayment = (amount: number) => {
  const payWithKhalti = useCallback(() => {
    const eventHandler: KhaltiEventHandler = {
      onSuccess: (payload: KhaltiOnSuccessPayload) => {
        console.log("Payment success payload:", payload);
        // You can now send payload.token and payload.amount to your backend to verify
      },
      onError: (error: any) => {
        console.error("Khalti Payment Error:", error);
      },
      onClose: () => {
        console.log("Khalti widget closed.");
      },
    };

    const config: KhaltiConfig = {
      publicKey: KHALTI_PUBLIC_KEY,
      productIdentity: "ORDER_ID_123", // Use a unique order ID
      productName: "Test Product", // Dynamic product name can also be passed
      productUrl: "http://yourwebsite.com/product",
      eventHandler,
      paymentPreference: ["KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS", "SCT"],
    };

    const checkout = new KhaltiCheckout(config);
    checkout.show({ amount: amount * 100 }); // amount in paisa (multiply by 100)
  }, [amount]);

  return { payWithKhalti };
};

type IPayment = {
  amount: number;
};

export const PaymentButton = ({ amount }: IPayment) => {
  const { payWithKhalti } = useKhaltiPayment(amount);

  return (
    <button
      type="button"
      onClick={payWithKhalti}
      className="bg-purple-500 text-white px-4 py-2 rounded"
    >
      Pay with Khalti
    </button>
  );
};
