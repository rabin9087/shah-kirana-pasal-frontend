import { Status } from "@/types";

export type ICategoryUpdateTypes = {
  _id: string,
  status?: Status,
  name?: string,
  slug?: string,
  description?: string,
}