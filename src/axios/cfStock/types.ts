export type ProductTypeStock = {
    _id?: string;
    name: string;
    sku: string;
    price: number;
    location: string;
    identifier: string;
    locationType: string;
    locationCategory: string;
    category: string;
    expiryDate: string; // ISO date string
    quantity: number;
    createdAt?: Date;
    updatedAt?: Date;
};