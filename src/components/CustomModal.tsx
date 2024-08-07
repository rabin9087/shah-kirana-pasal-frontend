import React from 'react';
import Modal from 'react-modal';
import { CreateCategoryForm, NotFoundModel, ScanBarcodeComponent, WebcamComponent } from './ImageCapture';
import { MdOutlineCameraAlt } from "react-icons/md";
import { Button } from './ui/button';
import { BiScan } from "react-icons/bi";
import { IoCreateOutline } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setAProductFoundStatus } from '@/redux/product.slice';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

interface Images {
    setImage?: (image: string | null) => void;
    setBarcode?: (barcode: string) => void;
    scanCode?: (barcode: string) => void;
    scan?: boolean;
    create?: string;
    openNotFound?: boolean
}

const CustomModal = ({ scanCode, setImage, scan, setBarcode, create }: Images) => {

    const [modalIsOpen, setIsOpen] = React.useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }


    return (
        <>
            <Button size={'default'}
                type='button'
                onClick={openModal}>{create === "createCategory" ? < IoCreateOutline size={25} /> : scan ? <BiScan size={20} /> : <MdOutlineCameraAlt size={20} />}</Button>

            {create === "createCategory" ?
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    <CreateCategoryForm closeModal={closeModal} />
                </Modal>

                :
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    {scan && modalIsOpen ? <ScanBarcodeComponent scanCode={scanCode} closeModal={closeModal} setBarcode={setBarcode} /> : <WebcamComponent setImage={setImage} closeModal={closeModal} />}
                </Modal>}

        </>
    )
}

export const OpenNotFoundModal = () => {

    const [modalIsOpen, setIsOpen] = React.useState(false);
    const dispatch = useAppDispatch()


    // function openModal() {
    //     setIsOpen(true);
    // }

    function closeModal() {
        setIsOpen(false);
        dispatch(setAProductFoundStatus({ status: false, openNotFoundModal: false }))
    }

    const { productFoundStatus } = useAppSelector(state => state.productInfo)


    return <>

        {/* <Button size={'default'}
            type='button'
            onClick={openModal}>{<BiScan size={20} />}</Button> */}

        <Modal
            isOpen={productFoundStatus.openNotFoundModal || modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
        >
            <NotFoundModel closeModal={closeModal} />
        </Modal>
    </>

}
export default CustomModal