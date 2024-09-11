export interface IItemTypes {
    productId: string,
    quantity: number,
    price: number,
}

export interface IOrder  {
    name: string,
    address: string,
    phone: string,
    email: string,
    items: IItemTypes[];
    orderNumber: number,
    deliverStatus: string,
    payment: string
}