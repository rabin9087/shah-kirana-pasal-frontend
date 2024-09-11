export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IReviews{
  userId: string,
  review: string
}


export enum IStoredAt {
  AMBIENT = "AMBIENT",
  CHILLED = "CHILLED",
  "FRUTES AND VEG" = "FRUTES AND VEG"
}

export type createProductParams = {
  status?: Status,
  name: string,
  alternateName?: string,
  parentCategoryID: string,
  sku: string,
  description: string,
  images?: Array<string>,
  brand?: string,
  price: number,
  quantity: number,
  productWeight?: string,
  storedAt: IStoredAt,
  aggrateRating?: number,
  thumbnail?: string,
  qrCodeNumber: string,
  salesPrice: number,
  salesStartDate?: Date,
  salesEndDate?: Date,
  productReviews?: Array<IReviews>,
  productLocation?: string;
};