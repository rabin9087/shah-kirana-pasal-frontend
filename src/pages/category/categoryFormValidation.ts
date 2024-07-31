import { z } from 'zod';

export const categorySchema = z.object({
  _id:z.string().optional(),
  status:z.string().optional(),
  name: z.string().nonempty({ message: "Category Name is required" }),
 description: z.string(),
 slug: z.string().optional()
});

export type CategorySchema = z.infer<typeof categorySchema>;