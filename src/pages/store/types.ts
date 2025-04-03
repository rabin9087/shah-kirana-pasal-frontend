export interface IStoreSaleItemTypes {
    itemName?: string;
    productId: string,
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
    saler: { userId: string, name: string },
    createdAt?: Date
}