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
    const [productInput, setProductInput] = useState<{ productId: string; price: string }>({
        productId: '',
        price: '',
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

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


    // Updated mutation to handle FormData
    const mutation = useMutation({
        mutationFn: (formData: FormData) => createProductComboOffer(formData),
        onSuccess: () => {
            toast.success('Combo Offer Created Successfully');
            reset();
            setSelectedProducts([]);
            setProductInput({ productId: '', price: '' });
            setSelectedFile(null);
            setImagePreview('');
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
        setProductInput({ productId: '', price: '' });
        setTempProduct(products);
    };

    // Handle file selection and preview
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setSelectedFile(null);
            setImagePreview('');
        }
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

        // Create FormData object
        const formData = new FormData();

        // Append basic fields
        formData.append('offerName', data.offerName);
        formData.append('description', data.description || '');
        formData.append('status', data.status);
        formData.append('totalAmount', data.totalAmount.toFixed(2));
        formData.append('discountAmount', data.discountAmount.toFixed(2));
        formData.append('price', data.price.toFixed(2));

        // Append dates if they exist (convert to ISO string)
        if (data.offerStartDate) {
            formData.append('offerStartDate', new Date(data.offerStartDate).toISOString());
        }
        if (data.offerEndDate) {
            formData.append('offerEndDate', new Date(data.offerEndDate).toISOString());
        }

        // Append selected products as JSON string
        formData.append('items', JSON.stringify(selectedProducts));

        // Handle thumbnail - either file upload or URL
        if (selectedFile) {
            // Use uploaded file
            formData.append('thumbnail', selectedFile);
        } else if (data.thumbnail && data.thumbnail.trim()) {
            // Use URL
            formData.append('thumbnail', data.thumbnail.trim());
        }

        mutation.mutate(formData);
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

                {/* Thumbnail Section */}
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                        <Input
                            {...register('thumbnail')}
                            placeholder="Enter Thumbnail URL"
                            onChange={(e) => {
                                // Clear file selection when URL is entered
                                if (e.target.value.trim()) {
                                    setSelectedFile(null);
                                    setImagePreview('');
                                }
                            }}
                        />
                        {errors.thumbnail && <p className="text-red-500 text-sm">{errors.thumbnail.message}</p>}

                        {/* URL Preview */}
                        {watch('thumbnail') && !selectedFile && (
                            <div className="mt-3">
                                {/* <Label className="text-sm text-gray-600">URL Preview:</Label> */}
                                <div className="mt-2 border rounded p-2 inline-block">
                                    <img
                                        src={watch('thumbnail')}
                                        alt="Thumbnail URL preview"
                                        className="w-32 h-32 object-cover rounded"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-muted-foreground">OR</span>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="thumbnailFile">Upload Thumbnail Image</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                handleFileChange(e);
                                // Clear URL when file is selected
                                if (e.target.files?.[0]) {
                                    setValue('thumbnail', '');
                                }
                            }}
                            className="mb-2"
                        />

                        {/* File Preview */}
                        {imagePreview && selectedFile && (
                            <div className="mt-3">
                                <Label className="text-sm text-gray-600">File Preview:</Label>
                                <div className="mt-2 border rounded p-2 inline-block">
                                    <img
                                        src={imagePreview}
                                        alt="Thumbnail file preview"
                                        className="w-32 h-32 object-cover rounded"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{selectedFile.name}</p>
                                </div>
                            </div>
                        )}
                    </div>
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
                                    <SelectValue placeholder="Select a Product" />
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

                    <Button type="button" onClick={handleAddProduct} disabled={!productInput.productId} className="mt-4 w-full">
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