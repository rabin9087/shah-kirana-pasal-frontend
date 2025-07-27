import { IProductComboOffer } from "@/axios/productComboOffer/types";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { IAddToCartTypes } from "@/pages/addToCart";
import { setAddToCart } from "@/redux/addToCart.slice";


export const AddToCartButton = ({ item }: { item: IAddToCartTypes | IProductComboOffer }) => {
    const { language } = useAppSelector((state) => state.settings)

    const dispatch = useAppDispatch();
    const handleOnAddToCart = () => {
        dispatch(setAddToCart({ ...item, orderQuantity: 1 } as IAddToCartTypes));
    };
    return (
        <Button
            variant={"default"}
            // disabled={(item?.quantity as number)  < 1}
            onClick={handleOnAddToCart}
            className="w-full">
            {language === "en" ? "Add To Cart" : "कार्टमा थप्नुहोस्"}
        </Button>
    );
};

export const ChangeItemQty = ({ item }: { item: IAddToCartTypes | IProductComboOffer  }) => {
    const dispatch = useAppDispatch();
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        const parsedValue = parseInt(value);

        dispatch(setAddToCart({ ...item, orderQuantity: isNaN(parsedValue) ? 0 : parsedValue }));
    };

    return (
        <>
            <div className="flex w-full items-center">
                <Button
                    variant={"default"}
                    className="rounded-none rounded-l-md w-1/4"
                    onClick={() => {
                        dispatch(setAddToCart({ ...item, orderQuantity: Math.max((item.orderQuantity || 0) - 1, 0) }));
                    }}
                >
                    -
                </Button>
                <input
                    type="text"
                    className="h-10 w-full text-center border flex items-center justify-center"
                    onChange={handleOnChange}
                    value={item.orderQuantity === 0 ? "" : item.orderQuantity ?? ""}
                />
                <Button
                    variant={"default"}
                    onClick={() => {
                        dispatch(setAddToCart({ ...item, orderQuantity: (item.orderQuantity || 0) + 1 }));
                    }}
                    className="rounded-none rounded-r-md w-1/4"
                >
                    +
                </Button>
            </div>
        </>

    );
};

export const itemExist = (productId: string, cartArray: IAddToCartTypes[] ) => {
    return cartArray.filter((item) => item._id === productId && item.orderQuantity > 0);
};

export const getOrderNumberQuantity = (productId: string, cartArray: IAddToCartTypes[]) => {
    return cartArray.find((item) => item._id === productId)?.orderQuantity;
};
