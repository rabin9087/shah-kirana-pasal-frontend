
import { Button } from '@/components/ui/button';
import Modal from 'react-modal';

type OpenStartPickingModalProps = {
    isOpenPicking: boolean;
    setIsOpenPicking: React.Dispatch<React.SetStateAction<boolean>>;
    handleOnOrdersPick: () => void;
    handleOnExpressOrderPick: () => void
    handleOnOutodStock: () => void
};
const OpenStartPickingModal = ({ isOpenPicking, setIsOpenPicking, handleOnOrdersPick, handleOnExpressOrderPick, handleOnOutodStock }: OpenStartPickingModalProps) => {

    const handleOnClose = () => {
        setIsOpenPicking(false);
    }
    return (
        <Modal
            isOpen={isOpenPicking}
            onRequestClose={handleOnClose}
            overlayClassName="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md max-h-[90vh] overflow-hidden"
        >
            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[70vh] space-y-6">
                {/* Deliver Later Card */}
                <div className="bg-blue-100 p-4 rounded-md shadow-lg flex justify-between items-center">
                    <p
                        className="text-lg font-semibold text-blue-800 cursor-pointer"
                        onClick={handleOnOrdersPick}
                    >
                        Deliver Later
                    </p>
                    <button
                        onClick={handleOnOrdersPick}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition"
                    >
                        Pick
                    </button>
                </div>

                {/* Deliver Now Card */}
                <div className="bg-green-100 p-4 rounded-md shadow-lg flex justify-between items-center">
                    <p
                        className="text-lg font-semibold text-green-800 cursor-pointer"
                        onClick={handleOnExpressOrderPick}
                    >
                        Pick Now
                    </p>
                    <button
                        onClick={handleOnExpressOrderPick}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition"
                    >
                        Pick
                    </button>
                </div>

                {/* Out of Stock Card */}
                <div className="bg-red-100 p-4 rounded-md shadow-lg flex justify-between items-center">
                    <p
                        className="text-lg font-semibold text-red-800 cursor-pointer"
                        onClick={handleOnOutodStock}
                    >
                        Out of Stock
                    </p>
                    <button
                        onClick={handleOnOutodStock}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition"
                    >
                        Pick
                    </button>
                </div>
            </div>

            {/* Footer Button */}
            <div className="flex justify-center mt-6">
                <Button
                    variant="secondary"
                    onClick={handleOnClose}
                    className="w-[150px] px-6 bg-red-600 hover:bg-red-700 text-white"
                >
                    Close
                </Button>
            </div>
        </Modal>
)
}
export default OpenStartPickingModal