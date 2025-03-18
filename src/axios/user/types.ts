import {IUpdateCartToUserTypes } from "@/pages/addToCart";

export type ICartHistoryInUser = {
    phone: string,
    items: IUpdateCartToUserTypes[] | [],
    cartAmount: number,
    orderNumber : number,
    deliveryStatus: string,
    paymentStatus: string}