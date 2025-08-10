import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AiFillPlusCircle } from 'react-icons/ai';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { IProductComboOffer } from '@/axios/productComboOffer/types';
import { comboOfferSchema } from './productComboOfferValidation';
import { createProductComboOffer } from '@/axios/productComboOffer/productComboOffer';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { IProductTypes } from '@/types/index';
import { getAllProducts } from '@/axios/product/product';
import { setProducts } from '@/redux/product.slice';

const ProductComboOffer = () => {
    const [selectedProducts, setSelectedProducts] = useState<IProductComboOffer['items']>([]);
    const [productInput, setProductInput] = useState<{ productId: string; price: string, qty: string }>({
        productId: '',
        price: '',
        qty: '1',
    });
    const [searchTerm, setSearchTerm] = useState('');

    const dispatch = useAppDispatch();
    const { products } = useAppSelector((s) => s.productInfo);
    const [tempProduct, setTempProduct] = useState(products);

    const { data = [] } = useQuery<IProductTypes[]>({
        queryKey: ['products'],
        queryFn: () => getAllProducts(),
        enabled: !products.length,
    });

    useEffect(() => {
        if (data.length) {
            dispatch(setProducts(data));
        }
    }, [data?.length])

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
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

    // Updated mutation to handle FormData
    const mutation = useMutation({
        mutationFn: (formData: IProductComboOffer) => createProductComboOffer(formData),
        onSuccess: () => {
            toast.success('Combo Offer Created Successfully');
            reset();
            setSelectedProducts([]);
            setProductInput({ productId: '', price: '', qty: '1' });
            setSearchTerm('');
            setTempProduct(products);
            // Clear file input
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        },
        onError: (error: any) => toast.error(error?.message || 'Failed to create combo offer'),
    });

    useEffect(() => {
        const totalAmount = selectedProducts.reduce((sum, item) => sum + parseFloat(item.price), 0);
        const discountAmount = totalAmount * 0.1;
        const price = totalAmount - discountAmount;

        setValue('totalAmount', Number(totalAmount.toFixed(2)));
        setValue('price', Number(price.toFixed(2)));
        setValue('items', selectedProducts);
        setValue('discountAmount', discountAmount)
    }, [selectedProducts, setValue]);

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
        setProductInput({ productId: '', price: '', qty: '1' });
        setSearchTerm('');
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

        const payload: any = {
            offerName: data.offerName,
            description: data.description || '',
            status: data.status,
            totalAmount: data.totalAmount.toFixed(2),
            discountAmount: data.discountAmount.toFixed(2),
            price: data.price.toFixed(2),
            items: selectedProducts,
        };

        if (data.offerStartDate) {
            payload.offerStartDate = new Date(data.offerStartDate).toISOString();
        }
        if (data.offerEndDate) {
            payload.offerEndDate = new Date(data.offerEndDate).toISOString();
        }

        // Handle thumbnail
        if (data.thumbnail) {
            payload.thumbnail = data.thumbnail.trim();
        }
        mutation.mutate(payload);
    };

    const handleOnSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim() === '') {
            setTempProduct(products);
        } else {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(value.toLowerCase()) ||
                (product.alternateName?.toLowerCase().includes(value.toLowerCase()))
            );
            setTempProduct(filtered);
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
        setTempProduct(products);
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
            <form className="max-w-4xl mx-auto border rounded-lg p-8 space-y-8 shadow-lg bg-white" onSubmit={handleSubmit(onSubmit)}>
                <div className="text-center border-b pb-4">
                    <h3 className='text-2xl font-bold text-gray-800'>Create Combo Offer</h3>
                    <p className="text-gray-600 mt-2">Bundle products together for special pricing</p>
                </div>

                {/* Status & Offer Name Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Status</Label>
                        <Select
                            onValueChange={(val) => setValue('status', val as 'ACTIVE' | 'INACTIVE')}
                            defaultValue="ACTIVE"
                        >
                            <SelectTrigger className="border-gray-300 focus:border-blue-500">
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ACTIVE">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        ACTIVE
                                    </div>
                                </SelectItem>
                                <SelectItem value="INACTIVE">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        INACTIVE
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="offerName" className="text-sm font-semibold text-gray-700">Offer Name</Label>
                        <Input
                            {...register('offerName')}
                            placeholder="Enter Offer Name"
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.offerName && <p className="text-red-500 text-sm">{errors.offerName.message}</p>}
                    </div>
                </div>

                {/* Thumbnail Section */}
                <div className="space-y-2">
                    <Label htmlFor="thumbnailUrl" className="text-sm font-semibold text-gray-700">Thumbnail URL</Label>
                    <Input
                        {...register('thumbnail')}
                        placeholder="Enter Thumbnail URL"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.thumbnail && <p className="text-red-500 text-sm">{errors.thumbnail.message}</p>}
                </div>

                {/* Add Products Section */}
                <div className="border rounded-lg p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-800">
                        <AiFillPlusCircle className="text-blue-600" size={24} /> Add Products to Bundle
                    </h3>

                    {/* Enhanced Search */}
                    <div className="relative mb-6">
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder="🔍 Search products by name..."
                                value={searchTerm}
                                onChange={handleOnSearch}
                                className="pr-10 pl-4 py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors duration-200"
                                    title="Clear search"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        {searchTerm && (
                            <p className="text-sm text-gray-600 mt-2">
                                Found {tempProduct.length} product{tempProduct.length !== 1 ? 's' : ''}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1 space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">Select Product</Label>
                            <Select
                                onValueChange={(val) => {
                                    const selected = getProductById(val);
                                    if (selected) {
                                        setProductInput({
                                            productId: selected._id,
                                            price: selected.price.toString(),
                                            qty: '1',
                                        });
                                    }
                                }}
                                value={productInput.productId}
                            >
                                <SelectTrigger className="border-gray-300 focus:border-blue-500">
                                    <SelectValue placeholder="Select a Product" />
                                </SelectTrigger>
                                <SelectContent className="max-h-60">
                                    {tempProduct.length > 0 ? (
                                        tempProduct.map(prod => (
                                            <SelectItem key={prod._id} value={prod._id}>
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={prod.thumbnail}
                                                        alt={prod.name}
                                                        className="w-8 h-8 rounded-md object-cover border"
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{prod.name}</span>
                                                        <span className="text-sm text-green-600 font-semibold">${prod.price}</span>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="no-results" disabled>
                                            <span className="text-gray-500">No products found</span>
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-gray-700">Price ($)</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="Enter price"
                                    value={productInput.price}
                                    onChange={(e) => setProductInput({ ...productInput, price: e.target.value })}
                                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-gray-700">Quantity</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    step="1"
                                    placeholder="Enter quantity"
                                    value={productInput.qty}
                                    onChange={(e) => setProductInput({ ...productInput, qty: e.target.value })}
                                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        type="button"
                        onClick={handleAddProduct}
                        disabled={!productInput.productId}
                        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 disabled:bg-gray-400"
                    >
                        <AiFillPlusCircle className="mr-2" size={18} />
                        Add Product to Bundle
                    </Button>

                    {/* Selected Products */}
                    {selectedProducts.length > 0 && (
                        <div className="mt-6">
                            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                                    {selectedProducts.length}
                                </span>
                                Selected Products
                            </h4>
                            <div className="space-y-3 max-h-60 overflow-y-auto">
                                {selectedProducts.map((p, idx) => {
                                    const prod = getProductById(p.productId as string);
                                    return (
                                        <div key={idx} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                            <div className="flex items-center gap-3">
                                                <span className='bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium text-gray-600'>
                                                    {idx + 1}
                                                </span>
                                                {prod && (
                                                    <img
                                                        src={prod.thumbnail}
                                                        alt={prod.name}
                                                        className="w-10 h-10 object-cover rounded-md border"
                                                    />
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-800">
                                                        {prod?.name || p.productId as string}
                                                    </span>
                                                    <span className="text-sm text-gray-600">
                                                        ${p.price} × {p.qty} = ${(parseFloat(p.price) * parseInt(p.qty)).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveProduct(idx)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-2 transition-colors duration-200"
                                                title="Remove product"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    {errors.items && <p className="text-red-500 text-sm mt-2">{errors.items.message}</p>}
                </div>

                {/* Pricing Section */}
                <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-800 mb-4">Pricing Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">Total Amount</Label>
                            <Input
                                type="number"
                                readOnly
                                {...register('totalAmount', { valueAsNumber: true })}
                                className="bg-gray-100 border-gray-300 font-semibold text-gray-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">Discount Amount</Label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                {...register('discountAmount', { valueAsNumber: true })}
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">Final Price</Label>
                            <Input
                                type="number"
                                step="0.01"
                                {...register('price', { valueAsNumber: true })}
                                className="bg-green-50 border-green-300 font-bold text-green-700"
                            />
                        </div>
                    </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Offer Start Date</Label>
                        <Input
                            type="date"
                            {...register('offerStartDate')}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Offer End Date</Label>
                        <Input
                            type="date"
                            {...register('offerEndDate')}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Description</Label>
                    <textarea
                        {...register('description')}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-blue-500 resize-none"
                        rows={4}
                        placeholder="Enter offer description..."
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                </div>

                <div className="border-t pt-6">
                    <Button
                        type="submit"
                        disabled={mutation.isPending || selectedProducts.length < 2}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-lg transition-all duration-200 disabled:from-gray-400 disabled:to-gray-400"
                    >
                        {mutation.isPending ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                Creating Offer...
                            </div>
                        ) : (
                            'Create Combo Offer'
                        )}
                    </Button>
                    {selectedProducts.length < 2 && (
                        <p className="text-sm text-gray-500 text-center mt-2">
                            Add at least 2 products to create a combo offer
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ProductComboOffer;