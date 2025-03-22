import { useState } from 'react';
import Modal from 'react-modal';
import { Button } from '@/components/ui/button'; // Adjust path as needed
import { toast } from 'react-toastify';
// If you're using toast notifications, otherwise you can use window.alert

const qrOptions = [
    { label: 'Esewa', image: '/public/assets/esewa.jpg' },
    // { label: 'FonePay', image: '/public/assets/banktransfer.jpg' },
    { label: 'Bank Transfer', image: '/public/assets/banktransfer.jpg' },
];

interface QRCodeModalProps {
    isOpenQRCode: boolean;
    setIsOpenQRCode: (value: boolean) => void;
    onPaymentConfirm: (method: string) => void; // Callback to return selected payment method
}

const QRCodeModal = ({ isOpenQRCode, setIsOpenQRCode, onPaymentConfirm }: QRCodeModalProps) => {
    const [selectedOption, setSelectedOption] = useState(qrOptions[0]);

    const handleMarkPaid = () => {
        if (confirm(`Confirm that customer has paid via ${selectedOption.label}?`)) {
            onPaymentConfirm(selectedOption.label);
            toast.success(`Payment marked as paid via ${selectedOption.label}`);
            setIsOpenQRCode(false);
        }
    };

    return (
        <Modal
            isOpen={isOpenQRCode}
            onRequestClose={() => setIsOpenQRCode(false)}
            overlayClassName="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md max-h-screen overflow-y-auto"
        >
            <div className="flex justify-center gap-2 mb-4">
                {qrOptions.map((option) => (
                    <Button
                        key={option.label}
                        onClick={() => setSelectedOption(option)}
                        variant={selectedOption.label === option.label ? 'default' : 'outline'}
                    >
                        {option.label}
                    </Button>
                ))}
            </div>

            <div className="flex justify-center items-center">
                <img
                    src={selectedOption.image}
                    alt={`${selectedOption.label} QR`}
                    className="max-w-full max-h-[300px] object-contain rounded-md border"
                />
            </div>

            <div className="mt-6 flex flex-col gap-3">
                <Button onClick={handleMarkPaid} className="w-full">
                    Mark as Paid (via {selectedOption.label})
                </Button>
                <Button variant="secondary" onClick={() => setIsOpenQRCode(false)} className="w-full">
                    Close
                </Button>
            </div>
        </Modal>
    );
};

export default QRCodeModal;
