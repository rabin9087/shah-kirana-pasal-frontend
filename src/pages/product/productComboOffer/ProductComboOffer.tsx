import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AiFillPlusCircle } from 'react-icons/ai';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { IProductComboOffer } from '@/axios/productComboOffer/types';
import { comboOfferSchema } from './productComboOfferValidation';
import { createProductComboOffer } from '@/axios/productComboOffer/productComboOffer';
import { useAppSelector } from '@/hooks';

const ProductComboOffer = () => {
    const [selectedProducts, setSelectedProducts] = useState<IProductComboOffer['items']>([]);
    const [productInput, setProductInput] = useState<{ productId: string; price: string }>({
        productId: '',
        price: '',
    });

    const { products } = useAppSelector((s) => s.productInfo);
    const [tempProduct, setTempProduct] = useState(products);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<IProductComboOffer>({
        resolver: zodResolver(comboOfferSchema),
        defaultValues: {
            offerName: '',
            thumbnail: '',
            items: [],
            totalAmount: 0,
            discountAmount: 0,
            price: 0,
            description: '',
            status: 'ACTIVE',
        },
    });

    const watchedDiscountAmount = watch('discountAmount');

    const mutation = useMutation({
        mutationFn: createProductComboOffer,
        onSuccess: () => {
            toast.success('Combo Offer Created Successfully');
            reset();
            setSelectedProducts([]);
            setProductInput({ productId: '', price: '' });
        },
        onError: (error: any) => toast.error(error?.message || 'Failed to create combo offer'),
    });

    useEffect(() => {
        const totalAmount = selectedProducts.reduce((sum, item) => sum + parseFloat(item.price), 0);
        const discountAmount = watchedDiscountAmount || totalAmount * 0.1;
        const price = totalAmount - discountAmount;

        setValue('totalAmount', Number(totalAmount.toFixed(2)));
        setValue('price', Number(price.toFixed(2)));
        setValue('items', selectedProducts);
    }, [selectedProducts, watchedDiscountAmount, setValue]);

    const handleAddProduct = () => {
        if (!productInput.productId || !productInput.price) {
            toast.warning('Select a product and enter price');
            return;
        }

        if (selectedProducts.find(p => p.productId === productInput.productId)) {
            toast.warning('Product already added');
            return;
        }

        const priceNum = parseFloat(productInput.price);
        if (isNaN(priceNum) || priceNum <= 0) {
            toast.warning('Please enter a valid price');
            return;
        }

        setSelectedProducts([...selectedProducts, { ...productInput }]);
        setProductInput({ productId: '', price: '' });
        setTempProduct(products);
    };

    const onSubmit = (data: IProductComboOffer) => {
        if (selectedProducts.length < 2) {
            toast.warning('Please add at least two products');
            return;
        }

        const startDate = data.offerStartDate ? new Date(data.offerStartDate) : null;
        const endDate = data.offerEndDate ? new Date(data.offerEndDate) : null;

        if (startDate && endDate && startDate >= endDate) {
            toast.warning('End date must be after start date');
            return;
        }

        const payload: IProductComboOffer = {
            ...data,
            items: selectedProducts,
            totalAmount: Number(data.totalAmount.toFixed(2)),
            discountAmount: Number(data.discountAmount.toFixed(2)),
            price: Number(data.price.toFixed(2)),
        };

        mutation.mutate(payload);
    };

    const handleOnSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value.toLowerCase();
        setTempProduct(products.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            (product.alternateName?.toLowerCase().includes(searchTerm))
        ));
    };

    const handleRemoveProduct = (index: number) => {
        const updated = [...selectedProducts];
        updated.splice(index, 1);
        setSelectedProducts(updated);
    };

    const getProductById = (productId: string) => {
        return products.find(p => p._id === productId);
    };

    return (
        <div className='mt-2'>
            <form className="max-w-3xl mx-auto border rounded p-6 space-y-6 shadow" onSubmit={handleSubmit(onSubmit)}>
                <h3 className='text-bold text-center underline'>Create Combo Offer</h3>

                {/* Status */}
                <div className="flex flex-col space-y-4">
                    <Label>Status</Label>
                    <Select
                        onValueChange={(val) => setValue('status', val as 'ACTIVE' | 'INACTIVE')}
                        defaultValue="ACTIVE"
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                            <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
                </div>

                {/* Offer Name */}
                <div>
                    <Label htmlFor="offerName">Offer Name</Label>
                    <Input {...register('offerName')} placeholder="Enter Offer Name" />
                    {errors.offerName && <p className="text-red-500 text-sm">{errors.offerName.message}</p>}
                </div>

                {/* Add Products */}
                <div className="border rounded p-4 bg-gray-100">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <AiFillPlusCircle /> Add Products
                    </h3>
                    <Input type="text" placeholder="Search products..." onChange={handleOnSearch} className="mb-3" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Product</Label>
                            <Select
                                onValueChange={(val) => {
                                    const selected = getProductById(val);
                                    if (selected) {
                                        setProductInput({
                                            productId: selected._id,
                                            price: selected.price.toString(),
                                        });
                                    }
                                }}
                                value={productInput.productId}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Product" />
                                </SelectTrigger>
                                <SelectContent>
                                    {tempProduct.map(prod => (
                                        <SelectItem key={prod._id} value={prod._id}>
                                            <div className="flex items-center gap-2">
                                                <img src={prod.thumbnail} alt={prod.name} className="w-6 h-6 rounded" />
                                                {prod.name} (${prod.price})
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Price</Label>
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Enter price"
                                value={productInput.price}
                                onChange={(e) => setProductInput({ ...productInput, price: e.target.value })}
                            />
                        </div>
                    </div>

                    <Button type="button" onClick={handleAddProduct} className="mt-4 w-full">
                        Add Product
                    </Button>

                    {selectedProducts.length > 0 && (
                        <ul className="mt-4 space-y-2">
                            {selectedProducts.map((p, idx) => {
                                const prod = getProductById(p.productId as string);
                                return (
                                    <li key={idx} className="flex justify-between items-center bg-white p-2 rounded shadow">
                                        <div className="flex items-center gap-2">
                                            {prod && (
                                                <img src={prod.thumbnail} alt={prod.name} className="w-6 h-6 object-cover rounded" />
                                            )}
                                            <span className='font-thin'>{idx + 1}.</span>
                                            {prod?.name || p.productId as string} - ${p.price}
                                        </div>
                                        <button type="button" onClick={() => handleRemoveProduct(idx)} className="text-red-600 hover:text-red-800">
                                            ✕
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                    {errors.items && <p className="text-red-500 text-sm mt-2">{errors.items.message}</p>}
                </div>

                {/* Thumbnail */}
                <div>
                    <Label htmlFor="thumbnail">Thumbnail URL</Label>
                    <Input {...register('thumbnail')} placeholder="Enter Thumbnail URL" />
                    {errors.thumbnail && <p className="text-red-500 text-sm">{errors.thumbnail.message}</p>}
                </div>

                {/* Amounts */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Total Amount</Label>
                        <Input type="number" readOnly {...register('totalAmount', { valueAsNumber: true })} className="bg-gray-50" />
                    </div>
                    <div>
                        <Label>Discount Amount</Label>
                        <Input type="number" step="0.01" min="0" {...register('discountAmount', { valueAsNumber: true })} />
                    </div>
                </div>

                <div>
                    <Label>Offer Price</Label>
                    <Input type="number" step="0.01" {...register('price', { valueAsNumber: true })} className="bg-gray-50" />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Offer Start Date</Label>
                        <Input type="date" {...register('offerStartDate')} />
                    </div>
                    <div>
                        <Label>Offer End Date</Label>
                        <Input type="date" {...register('offerEndDate')} />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <Label>Description</Label>
                    <textarea {...register('description')} className="w-full border rounded p-2" rows={3} placeholder="Enter offer description..." />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                </div>

                <Button type="submit" disabled={mutation.isPending || selectedProducts.length < 2} className="w-full">
                    {mutation.isPending ? 'Creating Offer...' : 'Create Offer'}
                </Button>
            </form>
        </div>
    );
};

export default ProductComboOffer;
