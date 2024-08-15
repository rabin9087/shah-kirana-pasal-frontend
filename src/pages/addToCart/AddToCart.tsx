import { useAppSelector } from "@/hooks"
import CartCard from "./CartCard"
import EmptyCart from "./EmptyCart"
import { Button } from "@/components/ui/button"
// import { RxCross1 } from "react-icons/rx";
// import {
//     Drawer,
//     DrawerTrigger,
// } from "@/components/ui/drawer"

const AddToCart = () => {
    const { cart } = useAppSelector(s => s.addToCartInfo)

    const toatl = cart.reduce((acc, { orderQuantity, price }) => {
        return acc + orderQuantity * price
    }, 0)

    return (
        // <Layout title="Cart">
        <div className=" p-2 shadow-md w-fit overflow-auto mt-2">
            <div className="flex justify-center underline text-2xl font-bold ">Cart</div>
            {cart.length ?
                <div className="w-full md:w-[250px] flex flex-col justify-end items-end  ">
                    {/* <div className="flex justify-end mb-2">
                        <Drawer> <DrawerTrigger>
                            <Button className="w-fit flex justify-end border-none hover:bg-gray-300" variant={"outline"}><RxCross1 className="w-fit rounded-full" size={20} /></Button>
                        </DrawerTrigger></Drawer>
                    </div> */}
                    <hr className="w-full" />
                    {cart.map((product) =>
                        <CartCard key={product._id} item={product} />)}

                </div> : <EmptyCart />}

            <div className="w-full md:w-[250px] p-2 flex flex-col justify-end items-end  border-t-2">
                {cart.length &&
                    <div className="w-full md:w-[250px] flex justify-between  font-bold py-4 px-2">
                        <span>Subtotal</span>
                        <span className="">${toatl.toFixed(2)}</span>

                    </div>}
                {cart.length && <div className="w-full md:w-[250px] py-2 flex justify-center"><Button className="w-full md:w-[250px]">Checkout</Button></div>}
            </div>

        </div>
        // </Layout>
    )
}
export default AddToCart