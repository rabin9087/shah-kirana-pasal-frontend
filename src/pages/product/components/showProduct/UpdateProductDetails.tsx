import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { IProductTypes } from '@/types';
import { getAProductBySKU, updateAProductBySKU, updateAProductThumbnail } from '@/axios/product/product';
import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { toast } from 'react-toastify';
import { RiImageEditFill } from 'react-icons/ri';
import { useAppSelector } from '@/hooks';
import { IStoredAt } from '@/axios/product/types';

const UpdateProductForm = () => {
    const { sku } = useParams();
    const navigate = useNavigate();
    const { categories } = useAppSelector(s => s.categoryInfo)
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false)
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setSelectedImage(URL.createObjectURL(file)); // Preview the selected image
        }
    };

    const handleSaveImage = async () => {
        setLoading(true)
        if (imageFile) {
            const formData = new FormData();
            formData.append("thumbnail", imageFile); // Must match the key in the backend
            // Required to identify the user

            try {
                const res = await updateAProductThumbnail(data._id, formData); // API call to update profile
                if (res.status === "success") {
                    toast.success("Product Image has been Updated Successfully")

                } else {
                    toast.error(res.message)
                }
            } catch (error) {
                toast.error
            }
        }
        setLoading(false)
    }

    useEffect(() => {
        if (data._id) {
            // Update form values with fetched data
            (Object.keys(data) as (keyof IProductTypes)[]).forEach((key) => {
                setValue(key, data[key]);
            });
        }
    }, [data, setValue]);


    return (
        <Layout title="Update Product Form">
            <Button
                className='ms-4'
                onClick={() => navigate(-1)}>
                {"< BACK"}
            </Button>
            <div className="relative flex justify-center mb-6">
                <img

                    src={selectedImage || data.thumbnail || "/default-profile.png"} // Default profile image fallback
                    alt="Profile"
                    className="w-44 h-44 rounded-sm object-fill border-4 border-gray-300"
                />
                {/* Edit Icon */}
                <label
                    htmlFor="profileImage"
                    className="absolute bottom-0 right-16 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600"
                >
                    <RiImageEditFill />
                </label>
                <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    multiple
                />
            </div>
            <div className='w-full flex justify-center'>
                <Button className='text-center' onClick={handleSaveImage}>{loading ? "Updating..." : "Update Image"}</Button>

            </div>
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

                <div>
                    <label htmlFor="alternateName" className="block text-sm font-medium text-gray-700">Alternative Name</label>
                    <input
                        id="alternateName"
                        {...register('alternateName')}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.alternateName && <p className="mt-2 text-sm text-red-600">{errors.alternateName.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="parentCategoryID" className="block text-sm font-medium text-gray-700">
                            Category Types
                        </label>
                        <select
                            id="parentCategoryID"
                            {...register('parentCategoryID')}
                            defaultValue={data?.parentCategoryID || ""}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="">--Select a Category--</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.parentCategoryID && (
                            <p className="mt-2 text-sm text-red-600">{errors.parentCategoryID.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="storedAt" className="block text-sm font-medium text-gray-700">
                            Stored Types
                        </label>
                        <select
                            className="w-full p-2 border-2 rounded-md text-start"
                            id="storedAt"
                            {...register('storedAt')}
                        >
                            <option value="">--Select a Stored At--</option>
                            {Object.values(IStoredAt).map((value) => (
                                <option key={value} value={value}>
                                    --{value}--
                                </option>
                            ))}
                        </select>


                        {errors.storedAt && (
                            <p className="mt-2 text-sm text-red-600">{errors.storedAt.message}</p>
                        )}
                    </div>
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
