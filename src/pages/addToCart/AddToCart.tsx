import Layout from "@/components/layout/Layout"
import { useAppSelector } from "@/hooks"
import CartCard from "./CartCard"
import EmptyCart from "./EmptyCart"
import { Button } from "@/components/ui/button"

const AddToCart = () => {
    const { cart } = useAppSelector(s => s.addToCartInfo)
    return (
        <Layout title="Cart">
            <div className="flex justify-end me-4 ">
                <Button variant={"outline"} className="text-end">X</Button>
            </div>

            {cart.length ?
                <div className="w-full p-2 flex flex-col justify-end items-end">
                    {cart.map((product) =>
                        <CartCard key={product._id} item={product} />)}

                </div> : <EmptyCart />}
            {cart.length &&
                <div className="w-full md:w-[250px] flex justify-between  font-bold py-4 px-2">
                    <span>Subtotal</span>
                    <span className="">${cart.reduce((acc, { orderQuantity, price }) => {
                        return acc + orderQuantity * price
                    }, 0)}</span>

                </div>}
            {cart.length && <div className="w-full md:w-[250px] py-2 flex justify-center"><Button className="w-full md:w-[250px]">Checkout</Button></div>}
        </Layout>
    )
}
export default AddToCart