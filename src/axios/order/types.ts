import { IProductTypes } from "@/types";

export interface IItemTypes {
    productId: IProductTypes,
    quantity: number,
    price: number,
    note?: string
}

export interface IOrder  {
    _id?: string,
    name: string,
    address: string,
    orderNumber?: number,
    phone: string,
    email: string,
    items: IItemTypes[];
    deliverStatus: string,
    deliveryDate?: {
                    date: string,
                    time: string
    },
    requestDeliveryDate?: string,
    orderType?: string,
    payment: string,
    amount: number,
    createdAt?: Date | string,
    updatedAt?: Date,
}