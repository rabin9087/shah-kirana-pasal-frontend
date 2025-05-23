import Layout from '@/components/layout/Layout'
import React, { ChangeEvent, ReactNode, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputField, updateProductSchema, UpdateProductSchema } from './formValidation';
import { useAppDispatch, useAppSelector } from '@/hooks';
import CustomModal from '@/components/CustomModal';
import { IProductTypes } from '@/types/index';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AiFillPicture } from "react-icons/ai";
import { Input } from '@/components/ui/input';
import { useParams } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAProduct, updateProduct } from '@/axios/product/product';
import { Link } from 'react-router-dom';
import { setAProduct } from '@/redux/product.slice';
import Error from '@/components/ui/Error';
import { RxCross1 } from "react-icons/rx";
import ProductNotFound from './components/ProductNotFound';
import { IStoredAt } from '@/axios/product/types';

const UpdateProduct = () => {
    const [image, setImage] = useState<string | null>("");
    const [imagesToDelete, setImagesToDelete] = useState<Array<string>>([]);
    const [images, setImages] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<string[]>([]);
    const [thumbnail, setThumbnail] = useState<string>("");
    const [notFound, setNotFound] = useState(false)
    // const [isModalOpen, setIsModalOpen] = useState(false);
    const params = useParams()
    const dispatch = useAppDispatch()
    const { product } = useAppSelector(state => state.productInfo)
    const { categories } = useAppSelector(state => state.categoryInfo)

    const { data = {} as IProductTypes, error } = useQuery<IProductTypes>({
        queryKey: [params?.qrCodeNumber],
        queryFn: () => getAProduct(params)
    });

    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<UpdateProductSchema>({
        resolver: zodResolver(updateProductSchema),
    });

    const convert2base64 = (image: Blob) => {
        const reader = new FileReader();
        setNotFound(false)
        // isModalOpen(false)
        reader.onloadend = () => {
            const base64String = reader.result as string
            setImage(base64String);
            setThumbnail(base64String)
            // Check if the image already exists in the array
            const imageExists = images.some((item) => item === base64String);
            if (!imageExists) {
                setNewImages([...newImages, base64String]);
            } else {
                setImages([...images]);
            }
        };
        return reader.readAsDataURL(image);
    };

    const handleOnImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            return convert2base64(file);
        }
    };

    const handleImageClick = (url: string) => {
        const clickedImage = images.find(image => image === url);
        if (clickedImage) {
            setImage(url);
            setThumbnail(url); // Replace the thumbnail array with the clicked image object
        }
    };

    const handleDeleteImage = (url: string) => {
        setImages((prevImages) => prevImages.filter((item) => item !== url));
        const isBase64Image = url.startsWith("data:image");

        // If it's a base64 image, return early (i.e., do nothing)
        if (isBase64Image) {
            return;
        }

        const imageExists = imagesToDelete.some((item) => item === url);
        if (!imageExists) {
            setImagesToDelete((prevImagesToDelete) => [...prevImagesToDelete, url])
        } else {
            setImagesToDelete(imagesToDelete)
        }
    };


    const handelOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setValue(name as keyof UpdateProductSchema, value);

        // setUpdateForm((prevForm) => ({ ...prevForm, [name as keyof ProductSchema]: value }))
    }

    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (data: FormData) => {
            return await updateProduct(data, params?.qrCodeNumber as string);
        },
        onError: () => {
            console.log("error");
        },
        onSuccess: (response) => {
            if (response.message === "Product Not Found!") {
                // setIsModalOpen(true);
            } else {
                console.log("success");
                reset();  // Reset form values
                setImage(null);
                setImages([]);
                setNewImages([]);
                setThumbnail("");
                setImagesToDelete([]);
            }
        },
        onSettled: async (_, error) => {
            if (error) {
                console.log(error);
            } else {
                await queryClient.invalidateQueries({ queryKey: [params?.qrCodeNumber] });
            }
        }
    });

    const onSubmit = async (data: UpdateProductSchema) => {
        const formData = new FormData();
        formData.append("_id", product._id as string);

        // Check and append only modified fields
        Object.keys(data).forEach((key) => {
            const typedKey = key as keyof UpdateProductSchema;
            if (data[typedKey] && data[typedKey] !== product[typedKey]) {
                formData.append(key, data[typedKey] as string);
            }
        });

        if (newImages.length > 0) {
            newImages.forEach((image) => formData.append("newImages[]", image));
        }

        if (imagesToDelete.length > 0) {
            imagesToDelete.forEach((image) => formData.append("imagesToDelete[]", image));
        }

        mutation.mutate(formData);
    };

    useEffect(() => {
        if (data._id) {
            if (data.thumbnail) {
                setThumbnail(data.thumbnail as string)
            }
            if (data.images) {
                setImages(data.images as string[]);
            }
            dispatch(setAProduct(data))
        }
    }, [dispatch, data._id])

    useEffect(() => {
        if (image !== "") {
            setThumbnail(image as string)

            const imageExists = images.some((item) => item === image);

            if (!imageExists) {
                setImages([...images, image as string]);
            } else {
                setImages([...images]);
            }
        }
        setValue('thumbnail', thumbnail);
        if (image) {
            setValue('images', images);
        }

    }, [image, setValue]);

    // if (isLoading || isFetching) return <Loading />;

    if (!data || notFound) return <Layout title='Update Product Details'><Link to={"/scan-product"} className='ms-4'>
        <Button>&lt; Back</Button>
    </Link><ProductNotFound open={true} onClose={() => { }} /> </Layout>

    if (error) return <Error />

    const input: InputField[] = [
        {
            label: "Product Name",
            name: "name",
            value: data?.name,
            placeholder: "Enter Product Name",
        },
        {
            label: "Alternate Name (optional)",
            name: "alternateName",
            value: data?.alternateName,
            placeholder: "Enter Product Alternative Name",
        },
        {
            label: "SKU",
            name: "sku",
            generate: "sku",
            value: data?.sku,
            placeholder: "Enter Product SKU Value or Generate",
        },
        {
            label: "Barcode ",
            name: "qrCodeNumber",
            type: "text",
            value: data?.qrCodeNumber,
            generate: "barcode",
            classname: "col-span-full",
            placeholder: "Enter Product QR Code Value or Generate",
        },
        {
            label: "Price",
            name: "price",
            type: "string",
            value: data?.price,
            placeholder: "Enter Product Price",
        },
        {
            label: "Quantity",
            name: "quantity",
            type: "string",
            value: data?.quantity,
            placeholder: "Enter Product Quantity",
        },
        {
            label: "Product Location",
            name: "productLocation",
            type: "text",
            value: data?.productLocation,
            placeholder: "A02 - B20 - S6",
        },
        {
            label: "Stored Location",
            name: "storedAt",
            type: "text",
            inputeType: "select",
            select: 'select',
            value: data?.storedAt,
            placeholder: "",
        },
        {
            label: "Product Weight (optional)",
            name: "productWeight",
            type: "text",
            value: data?.productWeight,
            placeholder: "Enter Product Weight",
        },
        {
            label: "Sales Price (optional)",
            name: "salesPrice",
            type: "string",
            value: data?.salesPrice,
            placeholder: "Enter Product Sales Price",
        },
        {
            label: "Sales Start Date (optional)",
            name: "salesStartDate",
            type: "date",
            value: data?.salesStartDate,
            placeholder: "Enter Product Sale Start Date",
        },
        {
            label: "Sales End Date (optional)",
            name: "salesEndDate",
            type: "date",
            value: data?.salesEndDate,
            placeholder: "Enter Product Sale End Date",
        },
    ];

    return (
        <>
            <Layout title='Update Product Details'>
                <Link to={"/dashboard"} className='ms-4 bg-primary text-white p-2 px-2 rounded-md'>
                    &lt; Dashboard
                </Link>

                <div className='flex justify-center w-full '>
                    <form className='m-2 flex flex-col gap-2 w-full  md:max-w-[780px] border-2 p-4 rounded-md shadow-sm' onSubmit={handleSubmit(onSubmit)}>
                        <div className='flex gap-2 items-center'>
                            <Label
                                htmlFor="image"
                                className="block text-md font-medium leading-6 text-accent-foreground"
                            >
                                Select Image:
                            </Label>
                            <div className='flex justify-center  gap-2 flex-row '>
                                <CustomModal setImage={setImage} />
                                <Input type='file' className='hidden' {...register('images')}
                                    id='file'
                                    onChange={handleOnImageChange}
                                    multiple
                                />

                                <Button type='button' size={'icon'} variant={'default'}>
                                    <Label htmlFor='file'>
                                        <AiFillPicture size={20} />
                                    </Label>
                                </Button>

                            </div>
                        </div>

                        <div className=''>
                            {thumbnail !== null && <div className='mt-2 mx-auto md:w-[300px] text-center w-[250px]  mb-4'>
                                <span>Thumbnail</span>
                                <img
                                    src={data.thumbnail as string}

                                    {...register('thumbnail')}
                                    className='md:order-2 mt-2 p-2 border-2 rounded-md object-cover'
                                    alt='Product Image'
                                />
                            </div>}

                            <hr />
                            {images.length &&
                                <> <div className='flex justify-center p-2 shadow-md'>Images</div>
                                    <div className='flex w-full flex-row  justify-center gap-4 items-center flex-wrap py-4 border-2'>
                                        {images?.map((url, index) => (
                                            <div key={index} className='relative w-[100px] h-[130px] md:w-[140px] md:h-[180px]'>
                                                <img
                                                    src={url as string}
                                                    alt={url as string}
                                                    {...register("images")}
                                                    className='w-full h-full object-cover cursor-pointer hover:bg-slate-200 transition-colors duration-300'
                                                    onClick={() => handleImageClick(url as string)}
                                                />
                                                <Button
                                                    type='button'
                                                    size='icon'
                                                    variant={"outline"}
                                                    className='top-[-0.4rem] absolute right-[-0.5rem] '
                                                    onClick={() => handleDeleteImage(url as string)}
                                                >
                                                    <RxCross1 className='w-fit border-none rounded-full border-2' size={20} />
                                                </Button>
                                            </div>

                                        ))}
                                    </div>
                                </>}
                        </div>

                        {errors.images && <span className="text-red-600">{`${errors.images?.message}` as ReactNode}</span>}
                        <div className="space-y-2 mt-2">
                            <div className="block">
                                <Label
                                    htmlFor="category"
                                    className="block text-md font-medium leading-6 text-gray-900"
                                >
                                    Product Category
                                </Label>

                                <div className='flex max-w-screen-md justify-center md:justify-start gap-3 me-2'>
                                    <select
                                        id="category"
                                        className="w-full md:w-[310px] border-2 rounded-md"
                                        value={product.parentCategoryID ?? ""}
                                        {...register('parentCategoryID')}
                                        onChange={handelOnChange}
                                    >
                                        <option value={""}>--Select a category--</option>
                                        {categories.map(({ _id, name }, index) => (
                                            <option
                                                className="py-1"
                                                key={index}
                                                defaultValue={_id}
                                                value={_id}// Ensure you're setting the value as the _id
                                            >
                                                {name}
                                            </option>
                                        ))}
                                    </select>

                                    <CustomModal create={"createCategory"} setImage={setImage} />
                                </div>

                            </div>
                            <div className="border-gray-900/10">

                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                    {input.map(({ label, name, placeholder, type, generate, value, classname, inputeType }) => (
                                        <div className={`sm:col-span-3 ${classname}`} key={name}>
                                            <div className='flex justify-between place-items-baseline'>
                                                <Label htmlFor={name} className="block text-md font-medium leading-6 text-gray-900">
                                                    {label}
                                                </Label>
                                            </div>

                                            <div className={`mt-2 flex`}>
                                                {!inputeType && <Input
                                                    id={name}
                                                    type={type}
                                                    disabled={generate === 'sku' || generate === "barcode"}
                                                    defaultValue={value}
                                                    placeholder={placeholder}
                                                    {...register(name)}
                                                    onChange={handelOnChange}
                                                />}
                                                {
                                                    inputeType &&
                                                    <select
                                                        className="w-full p-2 border-2 rounded-md text-center"
                                                        id="storedAt"
                                                        defaultValue={product.storedAt}
                                                        {...register('storedAt')}
                                                        onChange={handelOnChange}
                                                    >
                                                        <option value="">--Select a Stored At--</option>
                                                        {Object.values(IStoredAt).map((value) => (
                                                            <option key={value} value={value}>
                                                                --{value}--
                                                            </option>
                                                        ))}
                                                    </select>
                                                }
                                            </div>
                                            {errors.name && <span className="text-red-600">{`${errors.name.message}`}</span>}
                                        </div>
                                    ))}

                                    <div className="col-span-full">
                                        <Label htmlFor="description" className="block text-md font-medium leading-6 text-gray-900">
                                            Description
                                        </Label>
                                        <div className="mt-2">
                                            <textarea
                                                id="description"
                                                {...register('description')}
                                                rows={5}
                                                defaultValue={product.description}
                                                onChange={handelOnChange}
                                                className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                placeholder='Enter Product description'
                                            />
                                            {errors.description && <span className="text-red-600">{`${errors?.description?.message}`}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-2 flex items-center justify-end gap-2">
                            <Button
                                type="submit"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? "Updating..." : 'Update'}
                            </Button >
                            <Button
                                type="reset"
                                variant={"outline"}
                            >
                                Cancel
                            </Button >
                        </div>

                    </form>
                </div>
            </Layout>
        </>
    )
}
export default UpdateProduct