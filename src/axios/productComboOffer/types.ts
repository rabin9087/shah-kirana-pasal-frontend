import { IProductTypes } from "@/types/index";


export interface IProductOfferTypes {
  productId: string | IProductTypes;
  price: string;
}

export interface IProductComboOffer  {
    _id?: string,
    offerName: string,
    status: "ACTIVE" | "INACTIVE",
    items: IProductOfferTypes[],
    thumbnail: string,
    orderQuantity?: number,
    note?: string,
    totalAmount: number,
    discountAmount: number,
    offerPrice: number,
    offerStartDate?: Date,
    offerEndDate?: Date,
    description?: string,
    createdAt?: Date;
    updatedAt?: Date;
    __v?: number;
}