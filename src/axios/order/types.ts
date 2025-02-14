import { IProductTypes } from "@/types";

export interface IItemTypes {
    productId: IProductTypes,
    quantity: number,
    supplied?: number,
    price: number,
    note?: string,
    _id?: string,
}

export interface IOrder  {
    _id?: string,
    name: string,
    address: string,
    orderNumber?: number,
    phone: string,
    email: string,
    items: IItemTypes[];
    deliveryStatus: string,
    deliveryDate?: {
                    date: string,
                    time: string
    },
    requestDeliveryDate?: string,
    orderType?: string,
    paymentType: string,
    paymentStatus: string,
    amount: number,
    createdAt?: Date | string,
    updatedAt?: Date,
}