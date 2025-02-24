import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { IProductTypes } from '@/types';
import { getAProductBySKU, updateAProductBySKU } from '@/axios/product/product';
import { useNavigate, useParams } from 'react-router';
import { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { toast } from 'react-toastify';

const UpdateProductForm = () => {
    const { sku } = useParams();
    const navigate = useNavigate();
    const { data = {} as IProductTypes } = useQuery<IProductTypes>({
        queryKey: ['product', sku],
        queryFn: () => getAProductBySKU(sku as string),
        enabled: !!sku,
    });

    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: data,
    });

    const mutation = useMutation({
        mutationFn: async (updatedProduct: Partial<IProductTypes>) => {
            console.log(updatedProduct)
            return await updateAProductBySKU(updatedProduct, sku as string);
        },
        onError: () => {
            console.error('Error updating product');
        },
        onSuccess: (message) => {
            if (message.status === "success") {
                toast.success("Product has been Updated Successfully")
                return navigate(`/search/product/sku_value/${sku}`)
            }
            else {
                return toast.error("Failed to Update Product!")

            }
        },
    });

    const onSubmit = (updatedProduct: Partial<IProductTypes>) => {
        mutation.mutate(updatedProduct);
    };

    useEffect(() => {
        if (data._id) {
            // Update form values with fetched data
            (Object.keys(data) as (keyof IProductTypes)[]).forEach((key) => {
                setValue(key, data[key]);
            });
        }
    }, [data, setValue]);


    return (
        <Layout title="Product Form">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
                {/* Product Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input
                        id="name"
                        {...register('name', { required: 'Product name is required' })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
                </div>

                {/* Price and Sale Price */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                        <input
                            id="price"
                            type="number"
                            {...register('price', { required: 'Price is required' })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.price && <p className="mt-2 text-sm text-red-600">{errors.price.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="salesPrice" className="block text-sm font-medium text-gray-700">Sale Price</label>
                        <input
                            id="salesPrice"
                            type="number"
                            {...register('salesPrice')}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.salesPrice && <p className="mt-2 text-sm text-red-600">{errors.salesPrice.message}</p>}
                    </div>
                </div>

                {/* Quantity */}
                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input
                        id="quantity"
                        type="number"
                        {...register('quantity', { required: 'Quantity is required' })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.quantity && <p className="mt-2 text-sm text-red-600">{errors.quantity.message}</p>}
                </div>

                {/* Product Location */}
                <div>
                    <label htmlFor="productLocation" className="block text-sm font-medium text-gray-700">Product Location</label>
                    <input
                        id="productLocation"
                        {...register('productLocation', { required: 'Product location is required' })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.productLocation && <p className="mt-2 text-sm text-red-600">{errors.productLocation.message}</p>}
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        id="description"
                        {...register('description')}
                        rows={4}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <Button type="submit" disabled={mutation.isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md">
                        {mutation?.isPending ? 'Updating...' : 'Update Product'}
                    </Button>
                </div>
            </form>
        </Layout>

    );
};

export default UpdateProductForm;
