type EsewaPaymentProps = {
    amount: number;
    orderId?: string;
};

export const EsewaPaymentButton = ({ amount, orderId }: EsewaPaymentProps) => {
    const esewaMerchantCode = import.meta.env.VITE_ESEWA_MERCHANT_CODE;
    const successUrl = "http://localhost:5173/success";
    const failureUrl = "http://localhost:5173/esewa/failure";

    const handleEsewaPayment = () => {
        return
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://rc-epay.esewa.com.np/api/epay/main"; // Use live URL for production

        const params: Record<string, string | number> = {
            amt: amount,
            psc: 0,
            pdc: 0,
            txAmt: 0,
            tAmt: amount,
            pid: orderId || "",
            scd: esewaMerchantCode,
            su: successUrl,
            fu: failureUrl,
        };

        Object.entries(params).forEach(([key, value]) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = String(value);
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        form.remove();
    };

    return (
        <button
            type="button"
            onClick={handleEsewaPayment}
            className="bg-green-500 text-white px-4 py-2 rounded"
        >
            Pay with eSewa
        </button>
    );
};
