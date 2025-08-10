import { useAppSelector } from "@/hooks"
import CartCard from "./CartCard"
import EmptyCart from "./EmptyCart"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { IAddToCartTypes } from "@/pages/addToCart"
import { IProductComboOffer } from "@/axios/productComboOffer/types"

interface AddToCartProps {
    onCloseDrawer?: () => void;
}

const AddToCart: React.FC<AddToCartProps> = ({ onCloseDrawer }) => {
    const { cart } = useAppSelector((state) => state.addToCartInfo)
    const { language } = useAppSelector((state) => state.settings)


    const handleCheckout = () => {
        // Handle checkout logic

        // Close drawer after checkout
        if (onCloseDrawer) {
            onCloseDrawer();
        }
    };

    // Type guards to normalize mixed cart types
    const getPrice = (item: IAddToCartTypes | IProductComboOffer) => {
        if ("salesPrice" in item) {
            return item.salesPrice > 0 ? item.salesPrice : item.price
        }
        return item.price
    }

    const getBasePrice = (item: IAddToCartTypes | IProductComboOffer) => {
        if ("salesPrice" in item) {
            return item.price
        }
        return item.totalAmount
    }

    const getOrderQuantity = (item: IAddToCartTypes | IProductComboOffer) => {
        return item.orderQuantity || 0
    }

    const actualTotal = cart.reduce((acc, item) => {
        return acc + getOrderQuantity(item) * getBasePrice(item)
    }, 0)

    const total = cart.reduce((acc, item) => {
        return acc + getOrderQuantity(item) * getPrice(item)
    }, 0)

    return (
        <div className="p-2 shadow-md w-full overflow-auto mt-2">
            {cart.length > 0 ? (
                <div className="w-full md:w-[400px] flex flex-col justify-center items-center mx-auto">
                    <hr className="w-full" />
                    {cart.map((product) => (
                        <CartCard key={product._id} item={product} onCloseDrawer={onCloseDrawer} />
                    ))}
                </div>
            ) : (
                <EmptyCart />
            )}

            {cart.length > 0 && (
                <div className="w-full md:w-[400px] p-2 flex flex-col justify-between border-t-2 mx-auto">
                    <div className="flex flex-col">
                        <div className="flex justify-between w-full text-xl font-bold pt-4 px-2">
                            <span className="text-gray-600">
                                {language === "en" ? "Subtotal" : "उपकुल राशि"}
                            </span>
                            <span>
                                {language === "en" ? "$" : "रु."}
                                {total.toFixed(2)}
                            </span>
                        </div>

                        {actualTotal - total > 0 && (
                            <div className="w-full text-sm flex justify-end p-2 font-bold px-2">
                                <span className="w-fit bg-yellow-400 rounded-md px-2 py-1 text-end">
                                    {language === "en" ? "SAVING  Rs." : "बचत गर्दै  रु."}
                                    {(actualTotal - total).toFixed(2)}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="w-full py-2 flex justify-center"
                        onClick={handleCheckout}
                    >
                        <Link to={"/payment"}>
                            <Button className="w-[250px]">{language === "en" ? "Checkout" : "अहिले तिर्नुहोस्"}</Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AddToCart;
