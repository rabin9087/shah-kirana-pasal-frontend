import React, { useState } from "react";
import { useZxing } from "react-zxing";

import Modal from 'react-modal';
import { Button } from "@/components/ui/button";
import { BiScan } from "react-icons/bi";
import { MdFlashlightOff, MdFlashlightOn } from "react-icons/md";
import { isMobile } from "react-device-detect";

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

interface IScan {
    setBarcode?: (barcode: string) => void;
}

const ScanOrderProduct = ({setBarcode }: IScan) => {

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
            onClick={openModal}>
                <BiScan size={20} /> 
            </Button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <ScanProduct closeModal={closeModal} setBarcode={setBarcode} />
            </Modal>
        </>
  )
}
export default ScanOrderProduct


interface IScanCode {
    setBarcode?: (barcode: string) => void;
    closeModal: () => void;
}
export const ScanProduct = ({ closeModal, setBarcode }: IScanCode) => {

    const [isFlashOn, setIsFlashOn] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const { ref } = useZxing({
        onDecodeResult(result) {
            if (result.getText() !== "") {
                if (setBarcode) {
                    setBarcode(result.getText())
                    return closeModal()
                    // return navigate(`/product/create/`)
                }
            }
        },
    }) 
    const toggleFlashlight = async () => {
        if (!isMobile) {
            alert("Flashlight is only supported on mobile devices.");
            return;
        }

        try {
            // Get the current media stream or request a new one
            let currentStream = stream;
            if (!currentStream) {
                currentStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" },
                });
                setStream(currentStream);
            }

            // Get the video track and apply the torch constraint
            const videoTrack = currentStream.getVideoTracks()[0];
            const capabilities = videoTrack.getCapabilities() as MediaTrackCapabilities & {
                torch?: boolean;
            };

            if (capabilities?.torch) {
                const newFlashState = !isFlashOn;
                await videoTrack.applyConstraints({
                    advanced: [{ torch: newFlashState }] as unknown as MediaTrackConstraintSet[],
                });
                setIsFlashOn(newFlashState);
            } else {
                alert("Torch is not supported on this device.");
            }
        } catch (error) {
            console.error("Error toggling flashlight:", error);
            alert("Unable to access the flashlight.");
        }
    };

    // Stop the media stream when the component unmounts
    React.useEffect(() => {
        return () => {
            stream?.getTracks().forEach((track) => track.stop());
        };
    }, [stream]);

    return (
        <div>
            <video ref={ref} />
            <div className="flex justify-end items-center gap-2">
                <Button className="bg-yellow-500 hover:bg-yellow-400 mt-2" onClick={toggleFlashlight}>
                    {isFlashOn ? <MdFlashlightOff size={20} /> : <MdFlashlightOn size={20} />}
                </Button>
                <Button className="mt-2 bg-red-500"
                    onClick={closeModal}>Close camera</Button>
            </div>

        </div>
    );
}