import { IProductTypes } from "@/types/index";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
    AddToCartButton,
    ChangeItemQty,
    getOrderNumberQuantity,
    itemExist,
} from "@/utils/QuantityChange";
import { useAppSelector } from "@/hooks";
import { IAddToCartTypes } from "../addToCart";

interface Props {
    item: IProductTypes[] | IAddToCartTypes[];
    addClass?: string;
}

const ProductOfferCard: React.FC<Props> = ({ item, addClass }) => {
    const { cart } = useAppSelector((state) => state.addToCartInfo);
    const { language } = useAppSelector((state) => state.settings);

    const mainProduct = item[0];
    const totalOriginalPrice = item.reduce((acc, curr) => acc + curr.price, 0);
    const totalSalePrice = item.reduce((acc, curr) => acc + (curr.salesPrice || curr.price), 0);
    const quantity = mainProduct.quantity;
    const orderQty = getOrderNumberQuantity(mainProduct._id, cart);
    const productSlug = "dashain_offer"; // you can optionally pass this as a prop if needed

    return (
        <Card
            className={`w-full h-full sm:w-[190px] md:w-[250px] bg-white shadow-lg rounded-lg overflow-hidden ${addClass}`}
        >
            {/* Sale Badge */}
            {totalSalePrice < totalOriginalPrice && (
                <div className="border-2 h-24 rounded-md bg-yellow-300 flex items-center">
                    <div className="ml-4 w-16 h-16 flex items-center justify-center rounded-full border-8 border-primary bg-white">
                        <p className="font-bold text-sm">SALE</p>
                    </div>
                </div>
            )}

            {/* Product Image */}
            <Link to={`/product/${productSlug}`}>
                <div className="flex justify-center items-center pt-2 bg-gray-200">
                    <img
                        src={mainProduct.thumbnail}
                        alt={mainProduct.name || "Offer"}
                        className="p-2 w-full h-44 object-fill transition-transform duration-300 ease-in-out"
                        loading="lazy"
                    />
                </div>
            </Link>

            {/* Product Details */}
            <CardHeader className="p-4 pb-2 pt-4">
                <CardTitle className="text-lg font-semibold text-gray-800 h-20 overflow-hidden text-ellipsis line-clamp-3">
                    <Link to={`/product/${productSlug}`} className="hover:underline">
                        Dashain Combo Offer
                    </Link>
                </CardTitle>

                {totalSalePrice < totalOriginalPrice && (
                    <div className="w-fit mt-2 bg-yellow-300 text-sm font-bold px-2 py-1 inline-block rounded">
                        {language === "en" ? "$" : "रु."}
                        {totalOriginalPrice.toFixed(2)}
                    </div>
                )}
            </CardHeader>

            {/* Pricing & Stock */}
            <CardContent className="px-4 pb-4">
                <div className="flex justify-between items-start font-bold">
                    <div className="flex items-baseline">
                        <span className="font-medium">
                            {language === "en" ? "$" : "रु."}
                            {Math.floor(totalSalePrice)}
                        </span>
                        <span className="text-sm">
                            {(totalSalePrice % 1 * 100).toFixed(0).padStart(2, "0")}
                        </span>
                    </div>

                    {totalSalePrice < totalOriginalPrice && (
                        <span className="text-sm text-gray-500 line-through ms-2 my-auto">
                            {language === "en" ? "$" : "रु."}
                            {totalOriginalPrice.toFixed(2)}
                        </span>
                    )}
                </div>

                {quantity <= 5 && (
                    <p className="text-sm text-red-500 min-h-5 mt-2">
                        {quantity > 0
                            ? language === "en"
                                ? `Only ${quantity} left in stock!`
                                : `स्टकमा केवल ${quantity} ओटा मात्र बाँकी छ!`
                            : language === "en"
                                ? "Out of stock!"
                                : "स्टक सकिएको छ!"}
                    </p>
                )}
            </CardContent>

            {/* Cart Buttons */}
            <CardFooter className="p-4 pt-0 flex items-center justify-between">
                {itemExist(mainProduct._id, cart).length ? (
                    <ChangeItemQty item={{ ...mainProduct, orderQuantity: orderQty || 0 }} />
                ) : (
                    <AddToCartButton item={{ ...mainProduct, orderQuantity: orderQty || 0 }} />
                )}
            </CardFooter>
        </Card>
    );
};

export default ProductOfferCard;
