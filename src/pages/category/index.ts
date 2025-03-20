import { Status } from "@/types/index";

export type ICategoryUpdateTypes = {
  _id: string,
  status?: Status,
  name?: string,
  slug?: string,
  description?: string,
}