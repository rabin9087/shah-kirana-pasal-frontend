import { Link } from "react-router-dom";


interface ProductNotFoundProps {
    open: boolean;
    onClose: () => void;
}

export const ProductNotFound: React.FC<ProductNotFoundProps> = ({ open, onClose }) => {
    return (
        <Modal
            isOpen={open}
            onRequestClose={onClose}
            overlayClassName="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md max-h-screen overflow-y-auto"
            ariaHideApp={false} // if needed to prevent errors in dev mode
        >
            <div className="flex flex-col items-center justify-center min-h-20 bg-gray-100 p-4">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800">Product Not Found</h1>
                    <p className="mt-4 text-gray-600">
                        Sorry, the product you're looking for does not exist or has been removed.
                    </p>
                    <div className="mt-6">
                        <Link to="/">
                            <button className="px-6 py-2 rounded-md bg-primary text-white hover:bg-primary-dark transition duration-200">
                                Back to Home
                            </button>
                        </Link>
                    </div>
                </div>
                <Button onClick={onClose} className="mt-4">
                    Close
                </Button>
            </div>
        </Modal>
    );
};

export default ProductNotFound;

// Assuming you're using ShadCN UI
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@radix-ui/react-dialog";

export const ProductNotFoundModel = (isModalOpen: any, setIsModalOpen: any) => {
    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>

                <DialogTitle>Product Not Found</DialogTitle>
                <DialogClose asChild>
                    <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
                        ✕
                    </button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}

import Modal from 'react-modal';
import { Button } from "@/components/ui/button";

export const ProductNotFoundModal = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void}) => { 
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
            overlayClassName="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md max-h-screen overflow-y-auto"
        >
            <ProductNotFoundModel />
            <Button onClick={() => setIsOpen(false)}>Close</Button>
        </Modal>
    )
}