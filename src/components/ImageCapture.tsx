
import { useAppDispatch } from "@/hooks";
import React, { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router";
import Webcam from "react-webcam";
import { useZxing } from "react-zxing";
import { Button } from "./ui/button";
import { PiCameraRotate } from "react-icons/pi";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema } from "@/pages/category/categoryFormValidation";
import { createCategoryAction } from "@/action/category.action";
import { ICategoryTypes } from "@/types";
import { setAProductFoundStatus } from "@/redux/product.slice";

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

    // create a capture function
    const capture = useCallback(() => {
        const imageSrc = webcamRef?.current?.getScreenshot();
        console.log(typeof (imageSrc))
        if (imageSrc) {
            setImage?.(imageSrc);
            closeModal();
        }
    }, [webcamRef, setImage, closeModal]);

    const toggleFacingMode = () => {
        setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
    };

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
                <Button className="bg-green-500 hover:bg-green-400"
                    onClick={capture}>Capture photo</Button>
                <Button
                    onClick={toggleFacingMode}

                >
                    {<PiCameraRotate size={20} />}
                </Button>
                <Button className="bg-red-500 hover:bg-red-400"
                    onClick={closeModal}>Close camera</Button>
            </div>
        </div>
    )
}

interface ScanBarcodeComponentProps {
    setBarcode?: (barcode: string) => void;
    scanCode?: (barcode: string) => void;
    closeModal: () => void;
    location?: string;
}

export const ScanBarcodeComponent = ({ location, scanCode, setBarcode, closeModal }: ScanBarcodeComponentProps) => {

    const navigate = useNavigate()
    const { ref } = useZxing({
        onDecodeResult(result) {
            if (result.getText() !== "") {
                if (scanCode) {
                    scanCode(result.getText())
                    return closeModal()
                    // return navigate(`/product/update/${result.getText()}`)
                }
                if (setBarcode) {
                    setBarcode(result.getText())
                    closeModal()
                    return navigate(`/product/create/`)
                }
                if (location) {
                    // scanCode(result.getText())
                    // return closeModal()
                }
            }
        },
    });

    return (
        <div>
            <video ref={ref} />
            <div className="flex justify-end items-center">
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

    const { register, handleSubmit } = useForm<ICategoryTypes>({
        resolver: zodResolver(categorySchema),
    });

    const dispatch = useAppDispatch()
    const onSubmit = async (data: ICategoryTypes) => {

        await dispatch(createCategoryAction(data))
        closeModal()
    };

    return <form className="w-full m-2 md:w-[500px] p-2 rounded-md" onSubmit={handleSubmit(onSubmit)}>
        <div className=''>
            <div className="flex justify-center mb-2">
                <h2 className="align-middle underline">Create New Category</h2>
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
                <Label htmlFor="description">Description</Label>
                <textarea
                    id="description"
                    {...register('description')}
                    rows={5}
                    required
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder='Enter Category description'
                />
            </div>
        </div>
        <div className="mt-2 w-full flex justify-end gap-4 ">
            <Button type='button' className=" px-2" size={'icon'} variant={'default'} onClick={handleSubmit(onSubmit)}>
                Save
            </Button>
            <Button type='button' className="px-4" size={'icon'} variant={'outline'}
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
        console.log('first')
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


