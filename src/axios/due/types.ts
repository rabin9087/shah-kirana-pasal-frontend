import { IStoreSale } from "@/pages/store/types";

export interface IDue {
    _id?: string;
    userId: string;
    salesId: IStoreSale | string;// User who owns the shop
    totalAmout: number;
    dueAmount: number;
    duePaymentStatus: string; // Array of product IDs
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}