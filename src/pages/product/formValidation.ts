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
  salesPrice: z.string().optional(),
  salesStartDate: z.string().optional(),
  salesEndDate: z.string().optional(),
  parentCategoryID: z.string().nonempty({ message: "Product Category is required" }),
 description: z.string().optional(),
 image: z.any().refine(file => file.length > 0).optional(),
});

export type ProductSchema = z.infer<typeof productSchema>;


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
