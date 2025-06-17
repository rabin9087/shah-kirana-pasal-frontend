
import { createZipPaymentIntent } from '@/axios/payment/payment';
const ZipCheckout = () => {

    const zipData = {
        amount: 10000, // Amount in cents
        currency: 'AUD',
        orderReference: 'ORDER12345',
        redirectUrl: 'http://localhost:3000/success/payment',
    }

    const handleCheckout = async () => {
        const checkoutUrl = await createZipPaymentIntent(zipData)
        // try {
        //     const response = await axios.post('http://localhost:5000/create-checkout', {
        //         amount: 10000, // Amount in cents
        //         currency: 'AUD',
        //         orderReference: 'ORDER12345',
        //         redirectUrl: 'http://localhost:3000/success/payment',
        //     });

        //     // const { checkoutUrl } = response.data;

        //     // Open Zip checkout in a new window
        //     window.open(data, '_blank');
        // } catch (error) {
        //     console.error('Error initiating Zip checkout:', error);
        // }

        window.open(checkoutUrl, '_blank');
    };

    return (
        <button
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
            type='button'
            onClick={handleCheckout}>
            Pay with Zip
        </button>
    );
};

export default ZipCheckout;
