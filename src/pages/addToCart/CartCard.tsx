import { Card, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
    AddToCartButton,
    ChangeItemQty,
    getOrderNumberQuantity,
    itemExist,
} from "@/utils/QuantityChange";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { IAddToCartTypes } from "../addToCart";
import { Button } from "@/components/ui/button";
import { RxCross1 } from "react-icons/rx";
import { setAddToCart } from "@/redux/addToCart.slice";
import { useState } from "react";
import { IProductComboOffer } from "@/axios/productComboOffer/types";

type Props = {
    item: IAddToCartTypes | IProductComboOffer;
};

const CartCard: React.FC<Props> = ({ item }) => {
    const dispatch = useAppDispatch();
    const { cart } = useAppSelector((state) => state.addToCartInfo);
    const { language } = useAppSelector((state) => state.settings);

    const [opennNote, setOpenNote] = useState(false);
    const [note, setNote] = useState(item.note || "");

    const orderQty = getOrderNumberQuantity(item._id as string, cart) || 0;
    const isCombo = !("salesPrice" in item);

    const displayPrice = isCombo
        ? item.price
        : item.salesPrice > 0
            ? item.salesPrice
            : item.price;

    const basePrice = isCombo
        ? item.totalAmount
        : item.price;

    const productName = "name" in item ? item.name : item.offerName;
    const productAltName = "alternateName" in item ? item.alternateName : "";
    const productQty = "quantity" in item ? item.quantity : undefined;

    const handleOnAddToCart = () => {
        dispatch(setAddToCart({ ...item, note }));
        setOpenNote(false);
    };

    const handleOnResetCart = () => {
        dispatch(setAddToCart({ ...item, orderQuantity: 0 }));
    };

    const handleOnChangeNote = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNote(e.target.value);
    };

    const productUrl = (item as IAddToCartTypes).qrCodeNumber

    return (
        <Card className="w-full md:w-[400px] rounded-none mb-1">
            {/* Remove Item Button */}
            <div className="flex justify-end">
                <Button
                    className="w-fit border-none hover:bg-gray-300"
                    variant="outline"
                    onClick={handleOnResetCart}
                >
                    <RxCross1 className="rounded-full border-2" size={20} />
                </Button>
            </div>

            {/* Product Info */}
            <div className="flex items-center gap-2 px-2 py-2">
                <Link to={`/product/${productUrl}`}>
                    <img
                        src={item.thumbnail}
                        alt={productName}
                        className="w-[100px] h-[80px] rounded-md shadow-sm p-2 object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                        loading="lazy"
                    />
                </Link>

                <CardTitle className="w-full text-sm">
                    <Link to={`/product/${productUrl}`}>
                        <p className="hover:underline line-clamp-2">
                            {language === "en"
                                ? productName || productAltName
                                : productAltName || productName}
                        </p>
                        <p className="ps-4 font-normal">
                            {language === "en" ? "$" : "रु."}
                            {displayPrice} / item
                        </p>
                    </Link>
                </CardTitle>
            </div>

            {/* Quantity & Price */}
            <div className="flex items-center justify-between px-2">
                <div className="flex-col w-2/3">
                    {productQty !== undefined && orderQty >= productQty && (
                        <span className="block text-sm h-[25px] px-2 text-red-600">
                            {productQty} item(s) left
                        </span>
                    )}
                    <div className="w-[120px] mb-2">
                        {!itemExist(item._id as string, cart) ? (
                            <AddToCartButton item={{ ...item, orderQuantity: orderQty }} />
                        ) : (
                            <ChangeItemQty item={{ ...item, orderQuantity: orderQty }} />
                        )}
                    </div>
                </div>

                <div className="text-xl w-fit my-auto text-end">
                    <p>
                        {language === "en" ? "$" : "रु."}
                        {(displayPrice * orderQty).toFixed(2)}
                    </p>
                    {!isCombo && item.salesPrice > 0 && (
                        <p className="text-sm text-gray-500 line-through">
                            {language === "en" ? "was $" : "पहिले रु."}
                            {(basePrice * orderQty).toFixed(2)}
                        </p>
                    )}
                </div>
            </div>

            {/* Note Section */}
            <div>
                <p
                    className="underline cursor-pointer ps-2 pb-2"
                    onClick={() => setOpenNote(!opennNote)}
                >
                    {language === "en" ? "Add note" : "नोट लेख्नुहोस्"}
                </p>

                {opennNote && (
                    <>
                        <textarea
                            rows={4}
                            className="w-full me-2 p-2 rounded-md border-2 border-gray-300"
                            placeholder="What do you want to change..."
                            onChange={handleOnChangeNote}
                            value={note}
                        />
                        <div className="flex justify-end gap-2 items-center w-full p-2">
                            <Button className="bg-gray-500" onClick={() => setOpenNote(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleOnAddToCart}>Save</Button>
                        </div>
                    </>
                )}
            </div>
        </Card>
    );
};

export default CartCard;
