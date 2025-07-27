export interface IShop {
    _id?: string,
    name: string;
    owner: string;
    description?: string;
    location: {
        address: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
    };
    slogan: string;
    logo?: File | string; // Optional: Supports both File (upload) or URL (existing)
}