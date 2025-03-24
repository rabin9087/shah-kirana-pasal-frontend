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

    const [newLocation, setNewLocation] = useState('');
    const [newQuantity, setNewQuantity] = useState('');

    const handleOnClose = () => {
        setProductLocation('');
        setIsOpen(false);
        setNewLocation('');
        setNewQuantity('');
    };

    const handleUpdate = async (productId: string, field: 'productLocation' | 'quantity', value: string) => {
        if (!value.trim()) return;
        const payload = field === 'productLocation'
            ? { productLocation: value }
            : { quantity: value };
        await updateAProduct(payload, productId);
        await refetch(); // refresh product info after update
        handleOnClose();
    };

    useEffect(() => {
        if (!isOpen) {
            setProductLocation('');
            setNewLocation('');
            setNewQuantity('');
        }
    }, [isOpen, setProductLocation]);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleOnClose}
            overlayClassName="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md max-h-screen overflow-y-auto"
        >
            {isLoading && <p>Loading product details...</p>}
            {isError && <p className="text-red-500">Error fetching product data.</p>}
            {data && (
                <div className="flex flex-col gap-4">
                    <div className="flex gap-4 items-start">
                        <img src={data.thumbnail} height={60} width={60} alt={data.name} className="rounded shadow" />
                        <div>
                            <p className="font-semibold text-lg">{data.name}</p>
                            <p className="text-gray-600 text-sm">
                                Current Location: {formatLocation(data.productLocation ?? '')}
                            </p>
                            <p className="text-gray-600 text-sm">Current Quantity: {data.quantity}</p>
                        </div>
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdate(data._id, 'productLocation', newLocation);
                        }}
                        className="flex gap-2 mt-4"
                    >
                        <Input
                            placeholder="Enter new location (e.g., 5.6.7)"
                            value={newLocation}
                            onChange={(e) => setNewLocation(e.target.value)}
                        />
                        <Button type="submit">Update Location</Button>
                    </form>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdate(data._id, 'quantity', newQuantity);
                        }}
                        className="flex gap-2 mt-3"
                    >
                        <Input
                            type="number"
                            placeholder="Enter new quantity"
                            value={newQuantity}
                            onChange={(e) => setNewQuantity(e.target.value)}
                        />
                        <Button type="submit">Update Quantity</Button>
                    </form>
                </div>
            )}

            <div className="mt-6">
                <Button variant="secondary" onClick={handleOnClose} className="w-full">
                    Close
                </Button>
            </div>
        </Modal>
    );
};

export default UpdateProductLocation;
