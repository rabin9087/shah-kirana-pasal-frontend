import Layout from '@/components/layout/Layout'
import { generateRandomCode, generateRandomBarcode } from '../../../src/utils/generateRandom'
import { ChangeEvent, ReactNode, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageType, InputField, productSchema, ProductSchema } from './formValidation';
import { useAppDispatch, useAppSelector } from '@/hooks';
import CustomModal from '@/components/CustomModal';
import { Button } from '@/components/ui/button';
import { AiFillPicture } from "react-icons/ai";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createProduct } from '@/axios/product/product';
import { getAllCategories } from '@/axios/category/category';
import { ICategoryTypes } from '@/types/index';
import { setCategory } from '@/redux/category.slice';
import { RxCross1 } from "react-icons/rx";
import { base64ToFile } from '@/utils/convertToBase64';
import { toast } from 'react-toastify';
import { IStoredAt } from '@/axios/product/types';
import ProductComboOffer from './productComboOffer/ProductComboOffer';

const CreateProduct = () => {
  const [sku, setSku] = useState<string>('');
  const [barcode, setBarcode] = useState<string>('');
  const [isBarcode, setIsBarcode] = useState<boolean>(false);
  const [image, setImage] = useState<null | string>("");
  const [images, setImages] = useState<ImageType[]>([]);
  const [thumbnail, setThumbnail] = useState<ImageType[]>([]);
  // const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { categories } = useAppSelector(state => state.categoryInfo)
  const [createComboProduct, setCreateComboProduct] = useState<boolean>(false);

  const { data = [] } = useQuery<ICategoryTypes[]>({
    queryKey: ['categories'],
    queryFn: () => getAllCategories(),
    enabled: categories.length === 0
  });

  useEffect(() => {
    if (data.length !== categories.length) {
      dispatch(setCategory(data))
    }
  }, [dispatch, data.length, categories.length])

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      createProduct(data),
    onError: (error) => {
      toast.success(error.message)
    },
    onSuccess: (message) => {
      toast.success(message)
    }
  })

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
  });


  const handleOnGenerateSKU = () => {
    const code = generateRandomCode();
    setSku(code);
    // setValue("sku", code)
  };

  const handleOnGenerateBarcode = () => {
    const code = generateRandomBarcode();
    setIsBarcode(true);
    setBarcode(code);
  };

  const convert2base64 = (image: Blob) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setValue("images", reader.result)
      const newImage = { url: reader.result as string, alt: reader.result?.slice(5, 10) + ":" + (images.length + 1).toString() as string };
      // Check if the image already exists in the array
      const imageExists = images.some((item) => item.url === newImage.url);

      if (!imageExists) {
        setImages([...images, newImage]);
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
    const clickedImage = images.find(image => image.url === url);
    if (clickedImage) {
      setImage(url);
      setThumbnail([clickedImage]); // Replace the thumbnail array with the clicked image object
    }
  };

  const handleDeleteImage = (url: string) => {
    setImages((prevImages) => prevImages.filter((item) => item.url !== url));
  };

  const onSubmit = async (data: ProductSchema) => {
    const formData = new FormData();

    // Append non-file fields
    Object.keys(data).forEach((key) => {
      if (key !== 'images' && key !== 'thumbnail') {
        formData.append(key, data[key as keyof ProductSchema] as any);
      }
    });

    // Convert images from base64 to File and append to FormData
    if (images && images.length > 0) {
      images.forEach((image, index) => {
        const file = base64ToFile(image.url, `image${index}.jpg`);
        formData.append('images', file);
      });
    }

    // Convert thumbnail from base64 to File and append to FormData
    if (thumbnail && thumbnail.length > 0) {
      const file = base64ToFile(thumbnail[0].url, 'thumbnail.jpg');
      formData.append('thumbnail', file);
    }

    mutation.mutate(formData, {
      onSuccess: (message) => {
        if (message === "success") {
          reset(); // Reset the form only if mutation is successful
          setImages([]);
          setThumbnail([]);
          setImage(null);
          setSku('');
          setBarcode('');
          setIsBarcode(false);
        }
        return
      }
    });
  };

  useEffect(() => {
    let buffer = "";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        setBarcode(buffer);
        buffer = "";
        // setInputBuffer("");
      } else {
        buffer += e.key;
        // setInputBuffer(buffer);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);


  useEffect(() => {
    setValue('images', images);
    if (image) {
      setThumbnail([{ url: image, alt: image.slice(5, 10) + ":" + (images.length + 1).toString() }])
      const imageExists = images.some((item) => item.url === image);

      if (!imageExists) {
        // Add new image if it does not exist
        setImages((prevImages) => {
          return [...prevImages, { url: image, alt: image.slice(5, 10) + ":" + (images.length + 1).toString() }];
        });
      }
    }
  }, [images, image, setValue]);

  const input: InputField[] = [
    {
      label: "Product Name",
      name: "name",
      required: true,
      placeholder: "Enter Product Name",
    },
    {
      label: "Alternate Name (optional)",
      name: "alternateName",
      placeholder: "Enter Product Alternative Name",
    },
    {
      label: "SKU",
      name: "sku",
      generate: "sku",
      value: sku,
      func: handleOnGenerateSKU,
      required: true,
      placeholder: "Enter Product SKU Value or Generate",
    },
    {
      label: "Barcode ",
      name: "qrCodeNumber",
      type: "text",
      value: barcode,
      func: handleOnGenerateBarcode,
      generate: "barcode",
      barcodeValue: isBarcode,
      classname: "col-span-full",
      required: true,
      placeholder: "Enter Product QR Code Value or Generate",
    },
    {
      label: "Price",
      name: "price",
      type: "string",
      required: true,
      placeholder: "Enter Product Price",
    },
    {
      label: "Cost Price (optional)",
      name: "costPrice",
      type: "string",
      required: true,
      placeholder: "Enter Product Cost Price",
    },
    {
      label: "Retailer Price (optional)",
      name: "retailerPrice",
      type: "string",
      placeholder: "Enter Product Retailer Price",
    },
    {
      label: "Quantity",
      name: "quantity",
      type: "string",
      required: true,
      placeholder: "Enter Product Quantity",
    },
    {
      label: "Stored Location",
      name: "storedAt",
      type: "text",
      required: true,
      inputeType: "select",
      placeholder: "",
    },
    {
      label: "Product Location",
      name: "productLocation",
      type: "text",
      value: "",
      required: true,
      placeholder: "12.8.3.5",
    },

    {
      label: "Product Weight (optional)",
      name: "productWeight",
      type: "text",
      placeholder: "Enter Product Weight",
    },
    {
      label: "Sales Price (optional)",
      name: "salesPrice",
      type: "string",
      placeholder: "Enter Product Sales Price",
    },
    {
      label: "Sales Start Date (optional)",
      name: "salesStartDate",
      type: "date",
      placeholder: "Enter Product Sale Start Date",
    },
    {
      label: "Sales End Date (optional)",
      name: "salesEndDate",
      type: "date",
      placeholder: "Enter Product Sale End Date",
    },
  ];


  return (
    <Layout title='Enter Product Details'>

      <div className="flex flex-col items-center justify-center w-full py-6 bg-muted/40 rounded-xl shadow-md">
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            variant={createComboProduct ? 'secondary' : 'default'}
            className={createComboProduct ? 'bg-muted text-foreground' : 'bg-primary text-white'}
            onClick={() => setCreateComboProduct(false)}
          >
            Create Product
          </Button>

          <Button
            variant={createComboProduct ? 'default' : 'secondary'}
            className={createComboProduct ? 'bg-primary text-white' : 'bg-muted text-foreground'}
            onClick={() => setCreateComboProduct(true)}
          >
            Create Combo Product
          </Button>

        </div>
      </div>


      {!createComboProduct ? <div className='flex justify-center w-full'>

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
                accept="image/*"
              />

              <Button type='button' size={'icon'} variant={'default'}>
                <Label htmlFor='file'>
                  <AiFillPicture size={20} />
                </Label>
              </Button>

            </div>
          </div>

          <div className=''>
            {image !== "" && image !== null && <div className='mt-2 mx-auto md:w-[300px] text-center w-[250px]  mb-4'>
              <span>Thumbnail</span>
              <img
                src={image !== "" ? image : ''}
                className='md:order-2 mt-2 p-2 border-2 rounded-md object-cover'
                alt='Product Image'
              />
            </div>}

            <hr />
            {images.length > 0 &&
              <> <div className='flex justify-center p-2 shadow-md'>Images</div>
                <div className='flex w-full flex-row justify-center gap-4 items-center flex-wrap py-4 border-2'>
                  {images.map(({ alt, url }) => (
                    <div key={url} className='relative w-[100px] h-[130px] md:w-[140px] md:h-[180px]'>
                      <img
                        src={url}
                        alt={alt.slice(1, 20)}
                        className='w-full h-full object-cover cursor-pointer hover:bg-slate-200 transition-colors duration-300'
                        onClick={() => handleImageClick(url)}
                      />
                      <Button
                        type='button'
                        size='icon'
                        variant={"outline"}
                        className='top-[-0.4rem] absolute right-[-0.5rem] '
                        onClick={() => handleDeleteImage(url)}
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
                  className="w-full md:w-[310px] border-2 rounded-md text-center"
                  {...register('parentCategoryID')}
                >
                  <option value="">--Select a category--</option>
                  {categories.map(({ _id, name }, index) => (
                    <option className="py-1" key={index} value={_id}>
                      --{name}--
                    </option>
                  ))}
                </select>

                <Button type='button' size={'icon'} variant={'secondary'}>
                  <CustomModal create={"createCategory"} setImage={setImage} />
                </Button>
              </div>

            </div>
            <div className="border-gray-900/10">

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                {input.map(({ label, name, placeholder, required, type, generate, value, func, classname, inputeType }) => (
                  <div className={`sm:col-span-3 ${classname}`} key={name as string}>
                    <div className='flex justify-between place-items-baseline'>
                      <Label htmlFor={name as string} className="block text-md font-medium leading-6 text-gray-900">
                        {label}
                      </Label>
                      <div className='flex justify-end gap-2'>
                        {generate === "barcode" &&
                          <Label htmlFor={name as string}>
                            <CustomModal setBarcode={setBarcode} scan={true} setImage={setImage} /></Label>
                        }

                        {generate &&
                          <Button type='button' onClick={func}
                          ><Label htmlFor={name as string}>Generate {generate} </Label>
                          </Button>}
                      </div>
                    </div>

                    <div className={`mt-2 flex `}>
                      {!inputeType &&
                        <Input
                        id={name as string}
                        type={type}
                        defaultValue={value}
                        required={required}
                        placeholder={placeholder}
                        {...register(name)}
                      />}
                      {
                        inputeType &&
                        <select
                          className="w-full p-2 border-2 rounded-md text-center"
                          id="storedAt"
                          {...register('storedAt')}
                        >
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
              {mutation.isPending ? "Saving..." : "Save"}
            </Button >
            <Button
              type="reset"
              variant={"outline"}
            >
              Cancel
            </Button >
          </div>
        </form>
        
      </div> :
       <ProductComboOffer />}
    </Layout>

  )
}
export default CreateProduct