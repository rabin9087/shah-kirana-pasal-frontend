import { IProductTypes } from "@/types/index";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { addProduct, decreaseQuantity, increaseQuantity, removeProduct } from "@/redux/storeCart";

export const StoreProductCard: React.FC<{ item: IProductTypes; addClass?: string }> = ({ item, addClass }) => {
    const dispatch = useAppDispatch();
    const { language } = useAppSelector((state) => state.settings);
    const { items } = useAppSelector((state) => state.storeCart);

    const cartItem = items.find((product) => product._id === item._id);
    const quantity = cartItem?.orderQuantity ?? 0;

    const handleAddToCart = () => {
        dispatch(addProduct(item)); // Adds product to cart
    };

    const handleAdd = () => {
        if (cartItem) {
            dispatch(increaseQuantity(item._id)); // Use increaseQuantity to increment the quantity
        } else {
            dispatch(addProduct(item)); // This will add the product if it's not in the cart
        }
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            dispatch(decreaseQuantity(item._id)); // Decrease quantity
        } else if (quantity === 1) {
            dispatch(removeProduct(item._id)); // Remove product when quantity is 1
        }
    };

    return (
        <Card
            className={`w-full h-full sm:w-[190px] md:w-[220px] bg-white shadow-lg rounded-lg overflow-hidden ${addClass}`}
        >
            {item.salesPrice && (
                <div className="border-2 h-24 rounded-md bg-yellow-300 flex items-center">
                    <div className="ml-4 w-16 h-16 flex items-center justify-center rounded-full border-8 border-primary bg-white">
                        <p className="font-bold text-sm">SALE</p>
                    </div>
                </div>
            )}

            {/* Add click handler to the image */}
            <div className="flex justify-center items-center pt-2 bg-gray-200" onClick={handleAddToCart}>
                <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="p-2 w-full h-44 object-fill transition-transform duration-300 ease-in-out"
                    loading="lazy"
                />
            </div>

            <CardHeader className="p-4 pb-2 pt-4">
                <CardTitle className="text-lg font-semibold text-gray-800 h-20 overflow-hidden text-ellipsis line-clamp-3">
                    {language === "en" ? item.name : item.alternateName || item.name}
                </CardTitle>
                {item.salesPrice && (
                    <div className="w-fit mt-2 bg-yellow-300 text-sm font-bold px-2 py-1 inline-block rounded">
                        {language === "en" ? "SAVE Rs." : "बचत रु."}
                        {(item.price - item.salesPrice).toFixed(2)}
                    </div>
                )}
            </CardHeader>

            <CardContent className="px-4 pb-4">
                {item.salesPrice ? (
                    <div className="flex justify-between items-start font-bold">
                        <div className="flex justify-start items-start">
                            <span className="font-medium">
                                {language === "en" ? "Rs." : "रु."}
                                {Math.floor(item.salesPrice)}
                            </span>
                            <span className="text-sm">
                                {((item.salesPrice % 1) * 100).toFixed(0).padStart(2, "0")}
                            </span>
                        </div>
                        <span className="text-sm text-gray-500 line-through ms-2 my-auto">
                            {language === "en" ? "Rs." : "रु."}
                            {item.price.toFixed(2)}
                        </span>
                    </div>
                ) : (
                    <div className="flex justify-start items-start font-bold">
                        <span className="font-medium">
                            {language === "en" ? "Rs." : "रु."}
                            {Math.floor(item.price)}
                        </span>
                        <span className="text-sm">
                            {((item.price % 1) * 100).toFixed(0).padStart(2, "0")}
                        </span>
                    </div>
                )}

                {item.quantity <= 5 && (
                    <p className="text-sm text-red-500 mt-2">
                        {language === "en"
                            ? `Only ${item.quantity} left in stock!`
                            : `स्टकमा केवल ${item.quantity} ओटा मात्र बाँकी छ!`}
                    </p>
                )}

                {/* Button to add to cart */}
                <div className="flex gap-2 mt-4 items-center justify-between">
                    {quantity > 0 ? (
                        <div className="grid grid-cols-3 items-center w-full gap-1">
                            <Button
                                variant={"default"}
                                className="rounded-none rounded-l-md w-full"
                                onClick={handleDecrease}
                            >
                                -
                            </Button>
                            <span className="text-center font-semibold">{quantity}</span>
                            <Button
                                variant={"default"}
                                className="rounded-none rounded-r-md w-full"
                                onClick={handleAdd}
                            >
                                +
                            </Button>
                        </div>
                    ) : (
                        <Button
                            size="sm"
                            className="w-full mt-2"
                            onClick={handleAddToCart} // Trigger add to cart when button is clicked
                        >
                            {language === "en" ? "Add to Cart" : "कार्टमा राख्नुहोस्"}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
