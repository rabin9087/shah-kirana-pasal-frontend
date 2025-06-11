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
            overlayClassName="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
            className=" mt-16 p-6 rounded-xl shadow-xl w-[80%] max-w-sm max-h-[90vh] overflow-hidden"
        >
            {/* Scrollable Content */}

            <div className="w-[250px] mx-auto bg-white rounded-xl shadow-md p-5 text-center space-y-4 border border-blue-200">
                <h2 className="text-blue-600 text-2xl sm:text-2xl font-extrabold">
                    <div className="flex justify-center items-baseline gap-2">
                        <BsBasket2Fill size={25} className="text-black" /> Basket #{baketNumber}
                    </div>

                </h2>

                <p className="text-gray-700 text-base sm:text-sm font-medium">
                    Place <span className="text-blue-500 font-bold">{supplied}</span> item(s) into the basket.
                </p>

                <p className="text-gray-600 text-sm sm:text-base">
                    Scan the basket label to continue.
                </p>

                <div className="mt-3 text-sm text-gray-500">
                    <span className="font-semibold">Order Number:</span> {orderNumber}
                </div>
                <div className="flext justify-center mt-3 mx-auto text-sm text-gray-500">
                    <BarCodeGenerator value={orderNumber as string} height={25} displayValue />
                </div>
            </div>
        </Modal>
    )
}
export default OpenBasketLableModal

type OpenNotFoundModalProps = {
    isBasketLabelOpen: boolean;
    closeNotFoundModal: () => void
};
export const NotFoundModal = ({ isBasketLabelOpen, closeNotFoundModal }: OpenNotFoundModalProps) => {
    return (
        <Modal
            isOpen={isBasketLabelOpen}
            onRequestClose={closeNotFoundModal}
            overlayClassName="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            className="bg-white mt-20 p-6 rounded-xl shadow-xl w-[80%] max-w-sm max-h-[90vh] overflow-hidden">
            <div className="fixed inset-0 w-fit my-auto h-full  max-w-md mx-auto bg-black bg-opacity-50 flex items-center justify-center mt-20 z-50">
                <div className="bg-white p-4 mx-16 rounded-md shadow-lg max-w-md w-72  flex flex-col justify-center items-center">
                    <h3>{isBasketLabelOpen ? "Incorrect Lable!" : "Article not found!"}</h3>
                    <div className="flex justify-center items-center mt-2">
                        <Button variant="outline" onClick={closeNotFoundModal} className="mt-2">
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}