import Layout from '@/components/layout/Layout'
import { generateRandomCode, generateRandomBarcode } from '../../../src/utils/generateRandom'
import { ChangeEvent, ReactNode, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputField, IStoredAt, productSchema, ProductSchema } from './formValidation';
import { getAllCategoriesAction } from '@/action/category.action';
import { useAppDispatch, useAppSelector } from '@/hooks';
import CustomModal from '@/components/CustomModal';
import { createProductAction } from '@/action/product.action';
import { Button } from '@/components/ui/button';
import { AiFillPicture } from "react-icons/ai";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
const CreateProduct = () => {
  const [sku, setSku] = useState<string>('');
  const [barcode, setBarcode] = useState<string>('');
  const [isBarcode, setIsBarcode] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>("");

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
  });

  const dispatch = useAppDispatch()

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

  // const handelOnCaptureImage = () => {
  //   return <WebcamComponent />s
  // }

  const convert2base64 = (image: Blob) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setValue("image", reader.result)
    };
    return reader.readAsDataURL(image);
  };

  const handleOnImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      return convert2base64(file);
    }
  };


  const { categories } = useAppSelector(state => state.categoryInfo)

  useEffect(() => {
    setValue('image', image);
  }, [image, setValue]);

  const onSubmit = async (data: ProductSchema) => {
    console.log(data)
    const formData = new FormData();
    formData.append("image", image as string)
    for (const key in data) {
      if (key === 'image') {
        setValue('image', image);
      } else {
        formData.append(key, data[key as keyof ProductSchema]);
      }
    }

    await dispatch(createProductAction(data))
  };

  useEffect(() => {
    dispatch(getAllCategoriesAction())
  }, [dispatch])

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
      value: "A02 - B20 - S6",
      required: true,
      placeholder: "A02 - B20 - S6",
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

      <div className='flex justify-center w-full'>

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
              <Input type='file' className='hidden' {...register('image')}
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

          <div className='flex justify-center gap-4 col-span-full my-2 '>
            <div className='mt-2 flex justify-center w-full md:w-[500px]'>

              {image !== "" && image !== null && <img
                src={image !== "" ? image : ''}
                className='md:order-2 mt-2 p-2 border-2 rounded-md object-cover'
                alt='Product Image' />}
            </div>
          </div>

          {errors.image && <span className="text-red-600">{errors.image.message as ReactNode}</span>}
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
                  <div className={`sm:col-span-3 ${classname}`} key={name}>
                    <div className='flex justify-between place-items-baseline'>
                      <Label htmlFor={name} className="block text-md font-medium leading-6 text-gray-900">
                        {label}
                      </Label>
                      <div className='flex justify-end gap-2'>
                        {generate === "barcode" && <CustomModal setBarcode={setBarcode} scan={true} setImage={setImage} />}

                        {generate &&
                          <Button type='button' onClick={func}
                          ><Label htmlFor={name}>Generate {generate} </Label>
                          </Button>}
                      </div>


                    </div>

                    <div className={`mt-2 flex `}>
                      {!inputeType && <Input
                        id={name}
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
                          <option value="">--Select a Stored AT--</option>
                          <option value={IStoredAt.AMBIENT}>--{IStoredAt.AMBIENT}--</option>
                          <option value={IStoredAt.CHILLED}>--{IStoredAt.CHILLED}--</option>
                          <option value={IStoredAt['FRUTES AND VEG']}>--{IStoredAt['FRUTES AND VEG']}--</option>

                        </select>

                      }
                    </div>
                    {errors.name && <span className="text-red-600">{errors.name.message}</span>}
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
                    {errors.description && <span className="text-red-600">{errors?.description?.message}</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-end gap-2">
            <Button
              type="submit"
            >
              Save
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

  )
}
export default CreateProduct