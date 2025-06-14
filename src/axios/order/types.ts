import { IProductTypes } from "@/types/index";

export interface IItemTypes {
    productId: IProductTypes,
    quantity: number,
    supplied?: number,
    costPrice?: number,
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
    picker?: { userId: string, name: string },
    startPickingTime?: Date,
    endPickingTime?: Date,
    createdAt?: Date | string,
    updatedAt?: Date,
}