import { IProductTypes } from "@/types";

export interface IAddToCartTypes extends IProductTypes {
    price: number;
    orderQuantity: number,
    note?: string,
    productId?: IProductTypes,
}




export interface IUpdateCartToUserTypes {
    productId: string,
    orderQuantity: number,
    note?: string,
    price: number
}