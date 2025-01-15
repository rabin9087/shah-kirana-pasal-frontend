import { IProductTypes } from "@/types";

export interface IAddToCartTypes  extends IProductTypes {
    orderQuantity: number,
    note?: string,
}
