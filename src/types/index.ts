import { IDue } from "@/axios/due/types";
import { IJobCategory } from "@/axios/jobCategory/jobCategory";
import { IJobs } from "@/axios/jobs/jobs";
import { IOrder } from "@/axios/order/types";
import { IStoredAt } from "@/axios/product/types";
import { IProductComboOffer } from "@/axios/productComboOffer/types";
import { IShop } from "@/axios/shop/types";
import { ISalesProps } from "@/components/dashboard/sales/Sales";
import { IAddToCartTypes } from "@/pages/addToCart";
import { ImageType } from "@/pages/product/formValidation";
import { IStoreSale } from "@/pages/store/types";

export interface IAxiosProcessParams {
  method: string;
  url: string;
  obj?: object;
  isPrivate?: boolean;
  refreshToken?: boolean;
  params?: object
}
export type createUserParams = {
  fName: string;
  lName: string;
  phone: string;
  email: string;
  password: string;
};

export type signInUserParams = {
    email_phone: string;
    password: string;
}

export type forgetPasswordParams = {
 email_phone: string;
};

export type otp_PasswordParams = {
  email_phone: string,
  otp: string,
  password: string
}

export type otpParams = {
  email_phone: string;
  otp: string;
 }

 export type newPasswordParams = {
  email_phone: string;
  password: string;
 }

export interface IUser {
  _id: string;
  status: string;
  fName: string;
  lName: string;
  phone: string;
  password?: string;
  role: 'ADMIN'| 'USER' | 'MODERATOR' | 'SUPERADMIN' | 'PICKER' | "STOREUSER" | "";
  email: string;
  isVerified: boolean;
  verificationCode: string | null;
  address: string;
  profile: string;
  cart: IAddToCartTypes[]; // Current active cart
  cartHistory: ICartHistory[]; 
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ICartHistory {
  items: IAddToCartTypes[];
  amount: number;// Store previous cart data
  deliveryStatus: string;
  paymentStatus: string;
  orderNumber: number
  purchasedAt: Date; // Store timestamp of purchase
}


export type serverReturnDataType = {
  status: "success" | "error";
  message?: string;
  result?: [];
  user?: IUser;
  data?: IUser;
  accessJWT?: string;
  users?: IUser[];
  userEmail_Phone?: string;
  tokens?: { accessJWT: string; refreshJWT: string };
  categoryList?: ICategoryTypes[];
  category?: ICategoryTypes;
  products?: IProductTypes[],
  product?: IProductTypes,
  clientSecret?: string,
  paymentIntentId?: string,
  customerSessionClientSecret?: string
  order: IOrder
  orders: IOrder[] 
  sales: ISalesProps
  amount: [],
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  storeSales: IStoreSale | IStoreSale[] | [],
  shop: IShop,
  allShop: IShop[],
  due: IDue,
  dues: IDue[],
  job: IJobs;
  jobs: IJobs[];
  jobCategory: IJobCategory;
  jobCategories: IJobCategory[];
  checkoutUrl: string;
  productComboOffers: IProductComboOffer[];
};

export type LocationState = {
  from: {
    pathname: string;
  };
}

export type ICategoryTypes = {
    _id?: string,
    status?: string,
    name: string,
    alternativeName?: string,
    slug?: string,
    description?: string,
}


export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}


export interface IReviews{
  userId: string,
  review: string
}

export type IProductTypes = {
  _id: string,
  status?: Status,
  name: string,
  alternateName?: string,
  parentCategoryID: string,
  sku: string,
  slug: string,
  description?: string,
  images?: ImageType[] | Array<string>,
  brand?: string,
  price: number,
  retailerPrice?: number,
  costPrice?: number,
  quantity: number,
  imageToDelete?: Array<string>;
  productWeight?: string,
  storedAt: IStoredAt,
  aggrateRating?: number,
  thumbnail?: string,
  qrCodeNumber?: string,
  salesPrice: number,
  expireDate?: string,
  salesStartDate?: Date,
  salesEndDate?: Date,
  productReviews?: Array<IReviews>,
  productLocation?: string;
}

export type IProductUpdateTypes = {
  _id: string,
  status?: Status,
  name?: string,
  alternateName?: string,
  parentCategoryID?: string,
  sku: string,
  slug?: string,
  description?: string,
  images?: ImageType[] | Array<string>,
  brand?: string,
  price?: number,
  retailerPrice?: number,
  costPrice?: number,
  quantity?: number,
  productWeight?: string,
  storedAt?: IStoredAt,
  aggrateRating?: number,
  thumbnail?: string,
  expireDate?: string,
  qrCodeNumber: string,
  salesPrice?: number,
  salesStartDate?: Date,
  salesEndDate?: Date,
  productReviews?: Array<IReviews>,
  productLocation?: string;
}

export type TAxiosProcessor = Promise<serverReturnDataType>;
