// AddToCartButton.tsx

import { IProductComboOffer } from "@/axios/productComboOffer/types";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { IAddToCartTypes } from "@/pages/addToCart";
import { setAddToCart } from "@/redux/addToCart.slice";

export type CartItem = IAddToCartTypes | IProductComboOffer;

export const AddToCartButton = ({ item }: { item: CartItem }) => {
    const { language } = useAppSelector((state) => state.settings);
    const dispatch = useAppDispatch();
    const handleOnAddToCart = () => {
        dispatch(setAddToCart({ ...item, orderQuantity: 1 } as IAddToCartTypes));
    };

    return (
        <Button
            variant="default"
            onClick={handleOnAddToCart}
            className="flex items-center justify-center w-full"
        // disabled={item?.quantity === 0}
        >
            <span className="text-center">
                {language === "en" ? "Add To Cart" : "कार्टमा थप्नुहोस्"}
            </span>
        </Button>

    );
};

export const ChangeItemQty = ({ item }: { item: CartItem }) => {
    const dispatch = useAppDispatch();

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const parsedValue = parseInt(e.target.value);
        dispatch(setAddToCart({
            ...item,
            orderQuantity: isNaN(parsedValue) ? 0 : parsedValue
        } as IAddToCartTypes));
    };

    const handleDecrease = () => {
        const currentQty = item.orderQuantity ?? 0;
        dispatch(setAddToCart({
            ...item,
            orderQuantity: Math.max(currentQty - 1, 0)
        } as IAddToCartTypes));
    };

    const handleIncrease = () => {
        const currentQty = item.orderQuantity ?? 0;
        dispatch(setAddToCart({
            ...item,
            orderQuantity: currentQty + 1
        } as IAddToCartTypes));
    };

    return (
        <div className="flex w-full items-center">
            <Button variant="default" className="rounded-none rounded-l-md w-1/4" onClick={handleDecrease}>
                -
            </Button>
            <input
                type="text"
                className="h-10 w-full text-center border flex items-center justify-center"
                onChange={handleOnChange}
                value={item.orderQuantity === 0 ? "" : item.orderQuantity ?? ""}
            />
            <Button variant="default" className="rounded-none rounded-r-md w-1/4" onClick={handleIncrease}>
                +
            </Button>
        </div>
    );
};

// Helpers
export const itemExist = (productId: string, cartArray: CartItem[]) => {
    return cartArray.some(item => item._id === productId && (item.orderQuantity ?? 0) > 0);
};

export const getOrderNumberQuantity = (productId: string, cartArray: CartItem[]) => {
    return cartArray.find(item => item._id === productId)?.orderQuantity ?? 0;
};
