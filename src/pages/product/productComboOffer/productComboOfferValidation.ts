import { z } from "zod";

export const productTypeSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid number"),
});

export const comboOfferSchema = z.object({
  offerName: z.string().min(1, "Offer name is required"),
  status: z.string().min(1, "Status is required"),
  items: z.array(productTypeSchema).min(1, "At least one product must be added"),
  thumbnail: z.string().min(1, "Thumbnail is required"),
  totalAmount: z
    .number({ invalid_type_error: "Total amount must be a number" })
    .nonnegative("Total amount must be a non-negative number"),
  discountAmount: z
    .number({ invalid_type_error: "Discount amount must be a number" })
    .min(0, "Discount must be at least 0"),
  price: z
    .number({ invalid_type_error: "Offer price must be a number" })
    .nonnegative("Offer price must be a non-negative number"),
  offerStartDate: z.coerce.date().optional(),

  offerEndDate: z.coerce.date().optional(),

  description: z.string().optional(),
});
