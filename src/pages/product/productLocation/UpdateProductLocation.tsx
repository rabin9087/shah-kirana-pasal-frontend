import Modal from 'react-modal';
import { Button } from '@/components/ui/button';
import { IProductTypes } from '@/types/index';
import { useQuery } from '@tanstack/react-query';
import { getAProduct, updateAProduct } from '@/axios/product/product';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { formatLocation } from '../components/showProduct/ShowProductDetails';

type IUpdateProductLocation = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    setProductLocation: (productLocation: string) => void;
    productLocation: string;
};

const UpdateProductLocation = ({
    isOpen,
    setIsOpen,
    productLocation,
    setProductLocation,
}: IUpdateProductLocation) => {
    const { data, isLoading, isError, refetch } = useQuery<IProductTypes>({
        queryKey: ['product', productLocation],
        queryFn: async () => getAProduct({ qrCodeNumber: productLocation }),
        enabled: !!productLocation,
    });

    const [updateFields, setUpdateFields] = useState({
        productLocation: '',
        quantity: '',
        price: '',
        costPrice: '',
        expireDate: '',
    });

    const [updatingValue, setUpdatingValue] = useState(false)

    const handleOnClose = () => {
        setProductLocation('');
        setUpdateFields({
            productLocation: '',
            quantity: '',
            price: '',
            costPrice: '',
            expireDate: '',
        });
        setIsOpen(false);
    };

    const handleUpdate = async (
        productId: string,
        field: keyof typeof updateFields,
        value: string | number
    ) => {
        if (value === '' || value === null || value === undefined) return;

        const payload: Partial<IProductTypes> = {
            [field]:
                field === 'quantity' || field === 'price' || field === 'costPrice'
                    ? field === 'quantity'
                        ? (data?.quantity ?? 0) + Number(value)
                        : Number(value)
                    : value,
        };

        try {
            setUpdatingValue(true)
            await updateAProduct(payload, productId);
            setUpdatingValue(false)
            await refetch();
            handleOnClose();
        } catch (error) {
            console.error('Update failed', error);
        }
    };

    const quantityValue = updateFields.quantity;

    useEffect(() => {
        if (updateFields.quantity !== '') {
            console.log('Quantity input changed:', updateFields.quantity);
            // You can perform any action here with the quantity value
        }
    }, [updateFields.quantity]);

    useEffect(() => {
        if (!isOpen) {
            setProductLocation('');
            setUpdateFields({
                productLocation: '',
                quantity: '',
                price: '',
                costPrice: '',
                expireDate: '',
            });
        }
    }, [isOpen, setProductLocation]);

    const fieldsConfig = [
        { name: 'productLocation', placeholder: 'Enter new location (e.g. 5.6.7)', type: 'text' },
        { name: 'quantity', placeholder: 'Add new SOH (e.g. 50)', type: 'number' },
        { name: 'price', placeholder: 'Enter new price', type: 'number' },
        { name: 'costPrice', placeholder: 'Enter new cost price', type: 'number' },
        { name: 'expireDate', placeholder: 'Enter new expire date (e.g. 12/06/2027)', type: 'text' },
    ] as const;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleOnClose}
            overlayClassName="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md max-h-screen overflow-y-auto"
        >

            {data && (
                <div className="flex flex-col gap-4">
                    <div className="flex gap-4 items-start">
                        <img
                            src={data.thumbnail}
                            height={60}
                            width={60}
                            alt={data.name}
                            className="rounded shadow"
                        />
                        <div>
                            <p className="font-semibold text-lg">{data.name}</p>
                            <p className="text-gray-600 text-sm">
                                Current Location: {formatLocation(data.productLocation ?? '')}
                            </p>
                            <p className="text-gray-600 text-sm">Current SOH: {data.quantity}</p>
                            <p className="text-gray-600 text-sm">Current Cost Price: {data.costPrice}</p>
                            <p className="text-gray-600 text-sm">Current Expire Date: {data.expireDate}</p>
                            <p className="text-gray-600 text-sm">Total SOH: {((data?.quantity) + (!quantityValue ? 0 : parseInt(quantityValue)))}</p>
                        </div>
                    </div>

                    {fieldsConfig.map((field) => (
                        <form
                            key={field.name}
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleUpdate(data._id, field.name, updateFields[field.name]);
                            }}
                            className="flex gap-2 mt-3"
                        >
                            <Input
                                type={field.type}
                                placeholder={field.placeholder}
                                value={updateFields[field.name]}
                                onChange={(e) =>
                                    setUpdateFields((prev) => ({
                                        ...prev,
                                        [field.name]: e.target.value,
                                    }))
                                }
                            />
                            <Button type="submit" disabled={updatingValue}>Update</Button>
                        </form>
                    ))}
                </div>
            )}
            {isLoading && <p>Loading product details...</p>}
            {isError && <div className="bg-gray-300 p-4 mx-16 rounded-md shadow-lg max-w-md w-72  flex flex-col justify-center items-center">
                <h3>Article not found!</h3>
            </div>}
            <div className="mt-6">
                <Button variant="secondary" onClick={handleOnClose} className="w-full">
                    Close
                </Button>
            </div>
        </Modal>
    );
};

export default UpdateProductLocation;