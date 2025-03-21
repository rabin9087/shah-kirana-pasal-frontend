export interface IStoreSaleItemTypes {
    productId: string,
    price: number,
    orderQuantity: number,
}

export interface IStoreSale {
    name?: string,
    address?: string,
    phone?: string,
    email?: string,
    items: IStoreSaleItemTypes[];
    paymentMethod: string,
    paymentStatus: string,
    amount: number,
    saler: {userId: string, name: string},
}