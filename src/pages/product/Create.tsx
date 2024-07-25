import Layout from '@/components/layout/Layout'
import { generateRandomCode, generateRandomBarcode } from '../../../src/utils/generateRandom'
import { ChangeEvent, useState } from 'react'
import Barcode from 'react-barcode'
import { FaAppleWhole } from "react-icons/fa6";
const CreateProduct = () => {

  const [sku, setSku] = useState<string>('')
  const [barcode, setBarcode] = useState<string>('')
  const [isBarcode, setIsBarcode] = useState<boolean>(false)
  const [image, setImage] = useState<string>('')

  const handelOnGenerateSKU = () => {
    const code = generateRandomCode()
    return setSku(code)
  }

  const handelOnGenerateBarcode = () => {
    const code = generateRandomBarcode()
    setIsBarcode(true)
    return setBarcode(code)
  }

  const convert2base64 = (image: Blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
  };

  const handelOnImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      {
        convert2base64(file);
      }
    }
  };


  const input = [
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
      defaultvalue: sku,
      func: handelOnGenerateSKU,
      required: true,
      placeholder: "Enter Product SKU Value or Generate",
    },

    {
      label: "Barcode ",
      name: "qrCodeNumber",
      type: "text",
      defaultvalue: barcode,
      func: handelOnGenerateBarcode,
      generate: "barcode",
      barcodeValue: isBarcode,
      classname: "col-span-full",
      required: true,
      placeholder: "Enter Product QR Code Value or Generate",
    },
    {
      label: "Price",
      name: "price",
      type: "number",
      required: true,
      placeholder: "Enter Product Price",
    },
    {
      label: "Quantity",
      name: "quantity",
      type: "number",
      required: true,
      placeholder: "Enter Product Qunatity",
    },
    {
      label: "Product Location",
      name: "productLocation",
      type: "text",
      required: true,
      defaultvalue: "A00 - B00 - S00",
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
      type: "number",
      placeholder: "Enter Product sales Price",
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
      placeholder: "Enter product Sale End Date",
    },
  ];

  const categoryType = [
    { cat: "men's clothing", value: "men's clothing" },
    { cat: "women's clothing", value: "women's clothing" },
    { cat: "jewelery", value: "jewelery" },
    { cat: "electronics", value: "electronics" },
  ];

  return (
    <Layout title='Enter Product Details'>

      <form className='m-2'>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="block">
              <label
                htmlFor="category"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Product Category
              </label>
              <select
                id="category"
                className="px-2 selection:block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                name={"category"}
              >
                <option value="">--Select a category--</option>
                {categoryType.map(({ cat, value }, index) => (
                  <option className="py-1" key={index} value={value}>
                    --{cat}--
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {input.map(({ label, name, placeholder, required, type, generate, defaultvalue, func, classname, barcodeValue }) => (
                <div className={`sm:col-span-3 ${classname}`} key={name}>
                  <div className='flex justify-between place-items-baseline'>
                    <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">
                      {label}
                    </label>

                    {generate &&
                      <button type='button' className='bg-blue-500  px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 hover:bg-blue-400'
                        onClick={func}
                      >Generate {generate}</button>}
                  </div>
                  <div className="sm:hidden">{barcode !== "" && barcodeValue && <Barcode value={barcode}
                    width={2}
                    height={50}
                    displayValue={true}
                  />}</div>


                  <div className={`mt-2 flex `}>
                    <input
                      id={name}
                      name={name}
                      type={type}
                      defaultValue={defaultvalue}
                      required={required}
                      placeholder={placeholder}
                      className=" px-2 selection:block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />

                  </div>
                </div>
              ))}
              {/* col-span-full */}
              <div className='hidden sm:block '>
                {barcode !== "" && <Barcode value={barcode}
                  width={2}
                  height={50}
                  displayValue={true}
                />}
              </div>

              <div className='block md:flex border-2 justify-start items-center gap-4 col-span-full'>

                <input type='file' className='md:order-1' onChange={handelOnImageChange}
                />
                <img
                  src={image !== "" ? image : ""}
                  className='md:order-2 mt-2 p-2 border-2 rounded-md w-[200px] h-[250px]'
                  alt='Product Image' />
              </div>

              <div className="col-span-full">
                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder='Enter Product description'
                  />

                </div>
              </div>
            </div>

          </div>

        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </Layout>

  )
}
export default CreateProduct