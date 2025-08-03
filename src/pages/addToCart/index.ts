import { IProductComboOffer, IProductOfferTypes } from "@/axios/productComboOffer/types";
import { IProductTypes } from "@/types/index";

export interface IAddToCartTypes extends IProductTypes {
    price: number;
    orderQuantity: number,
    note?: string,
    productId?: IProductTypes | IProductComboOffer,
    items?: IProductOfferTypes[],
    offerName?: string,
}  

export interface IUpdateCartToUserTypes {
    productId: string | IProductTypes,
    orderQuantity: number | null,
    note?: string,
    price: number,
    offerName?: string
}