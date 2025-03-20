import { IProductTypes } from "@/types/index";

export interface IItemTypes {
    productId: IProductTypes,
    quantity: number,
    supplied?: number,
    price: number,
    note?: string,
    _id?: string,
}

//  <option value="Picking">Picking</option>
//                                         <option value="Packed">Packed</option>
//                                         <option value="Collected">Collected</option>
//                                         <option value="Cancelled">Cancelled</option>

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
    picker?: {userId: string, name: string},
    createdAt?: Date | string,
    updatedAt?: Date,
}