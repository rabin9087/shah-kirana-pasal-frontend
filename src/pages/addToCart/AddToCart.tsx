import { useAppSelector } from "@/hooks"
import CartCard from "./CartCard"
import EmptyCart from "./EmptyCart"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const AddToCart = () => {
    const { cart } = useAppSelector(s => s.addToCartInfo)
    const { language } = useAppSelector((state) => state.settings)

    const actualToatl = cart.reduce((acc, { orderQuantity, price }) => {
        return acc + orderQuantity * (price)
    }, 0)
    const toatl = cart.reduce((acc, { orderQuantity, price, salesPrice }) => {
        return acc + orderQuantity * (salesPrice > 0 ? salesPrice : price)
    }, 0)

    return (
        <div className="p-2 shadow-md w-full overflow-auto mt-2">
            {cart.length ?
                <div className="w-full md:w-[400px] flex flex-col justify-center items-center mx-auto">
                    <hr className="w-full" />

                    {cart.map((product) =>
                        <CartCard key={product._id} item={product} />)}
                </div> : <EmptyCart />}

            {cart.length > 0 && <div className="w-full md:w-[400px] p-2 flex flex-col justify-between  border-t-2 mx-auto ">

                <div className="flex flex-col">
                    <div className="flex justify-between w-full md:w-[400px] text-xl font-bold pt-4 px-2 ">
                        <span className="text-gray-600">{language === "en" ? "Subtotal" : "उपकुल राशि"} </span>
                        <span> {language === "en" ? "Rs." : "रु."}{toatl.toFixed(2)}</span>
                    </div>
                    {(actualToatl - toatl) > 0 && <div className="w-full text-sm md:w-[400px] flex justify-end p-2 font-bold px-2">
                        <span className="w-fit bg-yellow-400 rounded-md px-2 py-1 text-end"> {language === "en" ? "SAVING  Rs." : "बचत गर्दै  रु."}{(actualToatl - toatl).toFixed(2)}</span>
                    </div>}
                </div>
                <div className="w-full md:w-[400px]  py-2 flex justify-center">
                    <Link to={"/payment"}>
                        <Button className="w-[250px] md:w-[250px]">{language === "en" ? "Checkout" : "अहिले तिर्नुहोस्"}</Button>
                    </Link>
                </div>
            </div>}
        </div>
    )
}
export default AddToCart