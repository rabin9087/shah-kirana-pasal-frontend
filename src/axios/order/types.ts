export interface IItemTypes {
    productId: string,
    quantity: number,
    price: number,
    note?: string
}

export interface IOrder  {
    name: string,
    address: string,
    phone: string,
    email: string,
    items: IItemTypes[];
    deliverStatus: string,
    deliveryDate: {
                    date: string,
                    time: string
    },
    requestDeliveryDate: string,
    payment: string
    amount: number
}