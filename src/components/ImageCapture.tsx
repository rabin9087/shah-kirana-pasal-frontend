
import { useAppDispatch } from "@/hooks";
import React, { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
// import { useZxing } from "react-zxing";
import { Button } from "./ui/button";
import { PiCameraRotate } from "react-icons/pi";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema } from "@/pages/category/categoryFormValidation";
import { ICategoryTypes } from "@/types/index";
import { setAProductFoundStatus } from "@/redux/product.slice";
import { useMutation } from "@tanstack/react-query";
import { createCategory } from "@/axios/category/category";
import { MdFlashlightOn, MdFlashlightOff } from "react-icons/md";
import { isMobile } from "react-device-detect";
import BarcodeScannerComponent from "react-qr-barcode-scanner"
const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
};

interface WebcamComponentProps {
    setImage?: (image: string | null) => void;
    closeModal: () => void;
}

export const WebcamComponent: React.FC<WebcamComponentProps> = ({ setImage, closeModal }) => {
    const webcamRef = useRef<Webcam>(null);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
    const [isFlashOn, setIsFlashOn] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    // create a capture function
    const capture = useCallback(() => {
        const imageSrc = webcamRef?.current?.getScreenshot();
        if (imageSrc) {
            setImage?.(imageSrc);
            closeModal();
        }
    }, [webcamRef, setImage, closeModal]);

    const toggleFacingMode = () => {
        setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
    };

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
            <Webcam audio={false}
                height={600}
                width={600}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                mirrored={facingMode === 'user' ? true : false}
                videoConstraints={{ ...videoConstraints, facingMode }} />
            <div className="flex justify-center items-center gap-2 p-2">
                <Button className="bg-green-500 hover:bg-green-400" onClick={capture}>
                    Capture photo
                </Button>
                <Button onClick={toggleFacingMode}>
                    <PiCameraRotate size={20} />
                </Button>
                <Button className="bg-yellow-500 hover:bg-yellow-400" onClick={toggleFlashlight}>
                    {isFlashOn ? <MdFlashlightOff size={20} /> : <MdFlashlightOn size={20} />}
                </Button>
                <Button className="bg-red-500 hover:bg-red-400" onClick={closeModal}>
                    Close camera
                </Button>
            </div>
        </div>
    )
}

interface ScanBarcodeComponentProps {
    setBarcode?: (barcode: string) => void;
    scanCode?: (barcode: string) => void;
    setProductLocation?: (productLocation: string) => void;
    closeModal: () => void;
    location?: string;
}
export const ScanBarcodeComponent = ({ scanCode, setBarcode, closeModal, setProductLocation }: ScanBarcodeComponentProps) => {
    // const navigate = useNavigate()
    const [isFlashOn, setIsFlashOn] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const handleScan = (data: any) => {
        if (data) {
            console.log(data)
            if (setProductLocation) {
                setProductLocation(data);
            }
            if (setBarcode) {
                setBarcode(data);
            }
            if (scanCode) {
                scanCode(data)
            }
            closeModal()
            return
        }
    };

    const handleError = (err: any) => {
        console.error(err);
    };

    // const { ref } = useZxing({
    //     onDecodeResult(result) {
    //         if (result.getText() !== "") {
    //             if (scanCode) {
    //                 scanCode(result.getText())
    //                 closeModal()
    //                 return
    //                 // return navigate(`/product/update/${result.getText()}`)
    //             }
    //             if (setBarcode) {
    //                 setBarcode(result.getText())
    //                 return closeModal()
    //                 // return navigate(`/product/create/`)
    //             }
    //             if (setProductLocation) {
    //                 setProductLocation(result.getText())
    //                 return closeModal()
    //             }
    //         }
    //     },
    //     constraints: {
    //         video: { facingMode: "environment" }
    //     }
    // });

    const toggleFlashlight = async () => {
        if (!isMobile) {
            alert("Flashlight is only supported on mobile devices.");
            return;
        }

        try {
            if (!stream) {
                const newStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" }
                });
                setStream(newStream);
            }

            const videoTrack = stream?.getVideoTracks()[0];
            if (videoTrack) {
                const capabilities = videoTrack.getCapabilities() as MediaTrackCapabilities & { torch?: boolean };

                if (capabilities?.torch) {
                    const newFlashState = !isFlashOn;
                    await videoTrack.applyConstraints({
                        advanced: [{ torch: newFlashState }]
                    } as unknown as MediaTrackConstraints);
                    setIsFlashOn(newFlashState);
                } else {
                    alert("Torch is not supported on this device.");
                }
            }
        } catch (error) {
            console.error("Error toggling flashlight:", error);
            alert("Unable to access the flashlight.");
        }
    };

    // Stop the media stream when the component unmounts
    React.useEffect(() => {
        const enableAutoFocus = async () => {
            try {
                if (!stream) {
                    const newStream = await navigator.mediaDevices.getUserMedia({
                        video: { facingMode: "environment" }
                    });
                    setStream(newStream);
                }

                const videoTrack = stream?.getVideoTracks()[0];
                if (videoTrack) {
                    const capabilities = videoTrack.getCapabilities() as MediaTrackCapabilities & { focusDistance?: number };

                    if (capabilities?.focusDistance) {
                        await videoTrack.applyConstraints({
                            advanced: [{ focusMode: "continuous" }]
                        } as unknown as MediaTrackConstraints);
                    }
                }
            } catch (error) {
                console.error("Error enabling autofocus:", error);
            }
        };

        enableAutoFocus();

        return () => {
            stream?.getTracks().forEach(track => track.stop());
        };
    }, [stream]);

    return (
        <div>
            {/* <video ref={ref as React.LegacyRef<HTMLVideoElement>} /> */}
            <BarcodeScannerComponent
                width={500}
                height={500}
                onUpdate={(err: any, result: any) => {
                    if (result) {
                        handleScan(result.getText()); // Extract the text from the result
                    } else if (err) {
                        handleError(err);
                    }
                }}
            />
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

interface CreateCategoryComponentProps {
    closeModal: () => void;
}

export const CreateCategoryForm = ({ closeModal }: CreateCategoryComponentProps) => {

    const [isPending, setIsPending] = useState(false);
    const { register, handleSubmit } = useForm<ICategoryTypes>({
        resolver: zodResolver(categorySchema),
    });

    const mutation = useMutation({
        mutationFn: (data: ICategoryTypes) => createCategory(data),
    })

    const onSubmit = (data: ICategoryTypes) => {
        setIsPending(true);
        mutation.mutate(data)
        if (mutation.isSuccess) {

            return closeModal()
        }
        setIsPending(false)
    };

    return <form className="w-full md:w-[700px] p-2 rounded-md" onSubmit={handleSubmit(onSubmit)}>
        <div className=''>
            <div className="flex justify-center mb-2">
                <h3 className="align-middle underline">Create New Category</h3>
            </div>

            <div>
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    {...register('name')}
                    required
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder='Enter Category Name'
                />
            </div>

            <div>
                <Label htmlFor="alternativeName">Alternative Name</Label>
                <Input
                    id="alternativeName"
                    {...register('alternativeName')}
                    required
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder='Enter Category Alternative Name'
                />
            </div>

            <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                    id="description"
                    {...register('description')}
                    rows={5}
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder='Enter Category description'
                />
            </div>
        </div>
        <div className="mt-2 w-full flex justify-center gap-4 ">
            <Button type='button'
                className="px-2 w-1/2" size={'icon'} variant={'default'}
                onClick={handleSubmit(onSubmit)}
                disabled={mutation.isPending}>
                {isPending ? "...Creating" : "Create"}
            </Button>
            <Button type='button' className="px-2 w-1/2" size={'icon'} variant={'outline'}
                onClick={closeModal}
            >
                Cancel
            </Button>
        </div>

    </form>
}

interface OpenNotFoundModelProps {
    closeModal: () => void;
    // setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


export const NotFoundModel = ({ closeModal }: OpenNotFoundModelProps) => {
    const dispatch = useAppDispatch()

    const closeNotFoundModal = () => {
        dispatch(setAProductFoundStatus({ status: false, openNotFoundModal: false }))
        return closeModal()
    }

    return <div>
        <h2>Artical Not Found</h2>
        <hr />
        <Button className="bg-red-500 m-2"
            onClick={closeNotFoundModal}>Close</Button>
    </div>
}


