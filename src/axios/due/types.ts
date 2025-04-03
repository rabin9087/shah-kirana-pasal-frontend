import { IStoreSale } from "@/pages/store/types";

export interface IDue {
    userId: string;
    salesId: string | IStoreSale // User who owns the shop
    totalAmout: number;
    dueAmount: number;
    duePaymentStatus: string; // Array of product IDs
    isActive: boolean;
}