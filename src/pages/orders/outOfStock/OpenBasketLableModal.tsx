import { BsBasket2Fill } from "react-icons/bs";
import LockBodyScroll from '@/utils/LockBodyScroll';
import Modal from 'react-modal';
import { BarCodeGenerator } from "@/components/QRCodeGenerator";
import { Button } from "@/components/ui/button";
type OpenBasketLableModalProps = {
    isBasketLabelOpen: boolean;
    setIsOpenPicking?: React.Dispatch<React.SetStateAction<boolean>>;
    closeModal: () => void;
    orderNumber: string | number;
    baketNumber?: number;
    supplied?: number;
};
const OpenBasketLableModal = ({ isBasketLabelOpen, closeModal, orderNumber, baketNumber, supplied }: OpenBasketLableModalProps) => {
    LockBodyScroll(isBasketLabelOpen)

    return (
        <Modal
            isOpen={isBasketLabelOpen}
            onRequestClose={closeModal}
            overlayClassName="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
            className="bg-white rounded-2xl shadow-2xl p-6 w-[300px] max-w-md mx-auto"
        >
            <div className="flex flex-col items-center text-center space-y-5">
                <h2 className="text-blue-600 text-3xl font-extrabold flex items-center gap-2">
                    <BsBasket2Fill size={28} className="text-black" />
                    Basket #{baketNumber}
                </h2>

                <p className="text-gray-700 text-lg">
                    Place <span className="text-blue-500 font-bold">{supplied}</span> item(s) into the basket.
                </p>

                <p className="text-gray-600 text-base">
                    Scan the basket label to continue.
                </p>

                <div className="text-sm text-gray-500">
                    <span className="font-semibold">Order Number:</span> {orderNumber}
                </div>

                <div className="mt-3">
                    <BarCodeGenerator value={orderNumber as string} height={30} displayValue />
                </div>
            </div>
        </Modal>
    )
}
export default OpenBasketLableModal

type OpenNotFoundModalProps = {
    isBasketLabelOpen: boolean;
    articleCheck: boolean;
    basketCheck: boolean;
    closeNotFoundModal: () => void
};

export const NotFoundModal = ({ isBasketLabelOpen, articleCheck, basketCheck, closeNotFoundModal }: OpenNotFoundModalProps) => {
    return (
        <Modal
            isOpen={isBasketLabelOpen || articleCheck}
            onRequestClose={closeNotFoundModal}
            overlayClassName="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
            className="bg-white rounded-2xl shadow-2xl p-6 w-[250px] max-w-xs mx-auto"
        >
            <div className="flex flex-col items-center text-center space-y-4">
                <h3 className="text-xl font-semibold text-red-600">
                    {(isBasketLabelOpen && basketCheck) ? "Incorrect basket!" : articleCheck && "Article not found!"}
                </h3>
                <p className="text-sm text-gray-500">
                    {(isBasketLabelOpen && basketCheck) ? "Please try again or double-check the basket." : articleCheck && "Please try again or check the article."}
                </p>
                <Button
                    variant="outline"
                    onClick={closeNotFoundModal}
                    className="w-full max-w-[120px]"
                >
                    Close
                </Button>
            </div>
        </Modal>
    )
}