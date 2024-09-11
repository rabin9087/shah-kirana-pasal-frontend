import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import { z } from 'zod';

export const productSchema = z.object({
  _id:z.string().optional(),
  status:z.string().optional(),
  name: z.string().nonempty({ message: "Product Name is required" }),
  alternateName: z.string().optional(),
  sku: z.string().nonempty({ message: "SKU is required" }),
  qrCodeNumber: z.string().nonempty({ message: "Barcode is required" }),
  storedAt: z.string().nonempty({ message: "StoredAt is required" }),
  price: z.string().min(0, { message: "Price must be a positive number" }),
  quantity: z.string().min(0, { message: "Quantity must be a positive number" }),
  productLocation: z.string().optional(),
  productWeight: z.string().optional(),
  thumbnail:  z.any().refine(file => file.length > 0).optional(),
  imageToDelete:  z.string().array().optional(),
  salesPrice: z.string().optional(),
  salesStartDate: z.string().optional(),
  salesEndDate: z.string().optional(),
  parentCategoryID: z.string().nonempty({ message: "Product Category is required" }),
 description: z.string().optional(),
 images: z.any().refine(file => file.length > 0).optional(),
//  addImages: z.any().refine(file => file.length > 0).optional(),
});

export type ProductSchema = z.infer<typeof productSchema>;

export const updateProductSchema = z.object({
  _id:z.string().optional(),
  status:z.string().optional(),
  name: z.string().optional(),
  alternateName: z.string().optional(),
  sku: z.string().optional(),
  qrCodeNumber: z.string().optional(),
  storedAt: z.string().optional(),
  price: z.string().optional(),
  quantity: z.string().optional(),
  productLocation: z.string().optional(),
  productWeight: z.string().optional(),
  thumbnail:  z.any().refine(file => file.length > 0).optional(),
  imageToDelete:  z.string().array().optional(),
  salesPrice: z.string().optional(),
  salesStartDate: z.string().optional(),
  salesEndDate: z.string().optional(),
  parentCategoryID: z.string().optional(),
 description: z.string().optional(),
 images: z.string().array().optional()
//  addImages: z.any().refine(file => file.length > 0).optional(),
});

export type UpdateProductSchema = z.infer<typeof updateProductSchema>;


export type ImageType = { url: string; alt: string };
// export type ThumbnailType = { url: string };

export enum IStoredAt {
  AMBIENT = "AMBIENT",
  CHILLED = "CHILLED",
  "FRUTES AND VEG" = "FRUTES AND VEG"
}

export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE"
}

export type InputField = {
  label: string;
  name: keyof ProductSchema;
  placeholder?: string;
  required?: boolean;
  barcodeValue?: boolean;
  type?: string;
  generate?: string;
  select?: string;
  value?: any;
  func?: () => void;
  classname?: string;
  inputeType?: string;
};

export type ErrorMessageType = string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
