
import { Button } from '@/components/ui/button';
import Modal from 'react-modal';

type OpenStartPickingModalProps = {
    isOpenPicking: boolean;
    setIsOpenPicking: React.Dispatch<React.SetStateAction<boolean>>;
    handleOnOrdersPick: () => void;
    handleOnExpressOrderPick: () => void
};
const OpenStartPickingModal = ({ isOpenPicking, setIsOpenPicking, handleOnOrdersPick, handleOnExpressOrderPick }: OpenStartPickingModalProps) => {

    const handleOnClose = () => {
        setIsOpenPicking(false);
    }
    return (
        <Modal
            isOpen={isOpenPicking}
            onRequestClose={handleOnClose}
            overlayClassName="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            className="bg-white p-6 rounded-xl shadow-xl w-[350px] md:max-w-md max-h-screen overflow-y-auto"
        >
            <div className="mx-16 max-w-md w-54 space-y-6">
                {/* Deliver Later Card */}
                <div className="bg-blue-100 p-6 rounded-md shadow-lg flex flex-col items-center">
                    <p
                        className="mb-4 cursor-pointer text-lg font-semibold text-blue-800"
                        onClick={handleOnOrdersPick}
                    >
                        Deliver Later
                    </p>
                    <button
                        onClick={handleOnOrdersPick}
                        className="bg-blue-600  hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition"
                    >
                        Pick
                    </button>
                </div>

                {/* Deliver Now Card */}
                <div className="bg-green-100 p-6 rounded-md shadow-lg flex flex-col items-center">
                    <p
                        className="mb-4 cursor-pointer text-lg font-semibold text-green-800"
                        onClick={handleOnExpressOrderPick}
                    >
                        Pick Now
                    </p>
                    <button
                        onClick={handleOnExpressOrderPick}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md transition"
                    >
                        Pick
                    </button>
                </div>
            </div>


            <div className="flex justify-center mx-auto mt-6">
                <Button variant="secondary" onClick={handleOnClose} className="w-[150px] px-6 bg-red-500 text-white ">
                    Close
                </Button>
            </div>
        </Modal>)
}
export default OpenStartPickingModal