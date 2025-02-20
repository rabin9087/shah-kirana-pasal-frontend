import { useAppSelector } from "@/hooks"
import CartCard from "./CartCard"
import EmptyCart from "./EmptyCart"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const AddToCart = () => {
    const { cart } = useAppSelector(s => s.addToCartInfo)

    const actualToatl = cart.reduce((acc, { orderQuantity, price }) => {
        return acc + orderQuantity * (price)
    }, 0)
    const toatl = cart.reduce((acc, { orderQuantity, price, salesPrice }) => {
        return acc + orderQuantity * (salesPrice > 0 ? salesPrice : price)
    }, 0)

    return (
        // <Layout title="Cart">
        <div className="p-2 shadow-md w-full overflow-auto mt-2">
            {cart.length ?
                <div className="w-full md:w-[400px] flex flex-col justify-center items-center mx-auto">
                    <hr className="w-full" />

                    {cart.map((product) =>
                        <CartCard key={product._id} item={product} />)}
                </div> : <EmptyCart />}

            <div className="w-full md:w-[400px] p-2 flex flex-col justify-between  border-t-2 mx-auto ">
                {cart.length &&
                    <div className="flex flex-col">
                        <div className="flex justify-between w-full md:w-[400px] text-xl font-bold pt-4 px-2 ">
                            <span className="text-gray-600">Subtotal </span>
                            <span> ${toatl.toFixed(2)}</span>
                                
                        </div>
                        {(actualToatl - toatl) > 0 && <div className="w-full text-sm md:w-[400px] flex justify-end p-2 font-bold px-2">
                            <span className="w-fit bg-yellow-400 rounded-md px-2 py-1 text-end"> SAVING ${(actualToatl - toatl).toFixed(2)}</span>
                        </div>}
                    </div>

                }
                {cart.length && <div className="w-full md:w-[400px]  py-2 flex justify-center">
                    <Link to={"/payment"}>
                        <Button className="w-full md:w-[250px]">Checkout</Button>
                    </Link>
                </div>}
            </div>

        </div>
        // </Layout>
    )
}
export default AddToCart