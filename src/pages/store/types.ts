import { IProductTypes } from "@/types/index";

export interface IStoreSaleItemTypes {
    itemName?: string;
    productId:  IProductTypes | string,
    price: number,
    costPrice?: number,
    orderQuantity: number,
}

export interface IStoreSale {
    _id?: string,
    name?: string,
    address?: string,
    phone?: string,
    email?: string,
    items: IStoreSaleItemTypes[];
    paymentMethod: string,
    paymentStatus: string,
    amount: number,
    customerCash?: number;
    saler: { userId: string, name: string },
    createdAt?: Date
}