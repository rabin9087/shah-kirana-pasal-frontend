import {
    Card,
    CardTitle,
} from "@/components/ui/card"
import { Link } from "react-router-dom"
import { AddToCartButton, ChangeItemQty, getOrderNumberQuantity, itemExist } from "@/utils/QuantityChange"
import { useAppDispatch, useAppSelector } from "@/hooks"
import { IAddToCartTypes } from "../addToCart"
import { Button } from "@/components/ui/button"
import { RxCross1 } from "react-icons/rx";
import { setAddToCart } from "@/redux/addToCart.slice"
import { useState } from "react"


const CartCard: React.FC<{ item: IAddToCartTypes }> = ({ item }) => {
    const { cart } = useAppSelector((state) => state.addToCartInfo)
    const { language } = useAppSelector((state) => state.settings)
    const [opennNote, setOpenNote] = useState(false);
    const [note, setNote] = useState(item.note || "");
    const orderQty = getOrderNumberQuantity(item._id, cart)
    const dispatch = useAppDispatch()

    const handleOnAddToCart = () => {
        dispatch(setAddToCart({ ...item, note }))
        setOpenNote(false);
    }

    const handleOnResetCart = () => {
        dispatch(setAddToCart({ ...item, orderQuantity: 0 }))
    }

    const handelOnChangeNote = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNote(e.target.value);
    };

    return (
        <Card className="w-full md:w-[400px] rounded-none mb-1">
            <div className="flex justify-end">
                <Button className="w-fit flex justify-end border-none hover:bg-gray-300" variant={"outline"} onClick={(handleOnResetCart)}><RxCross1 className="w-fit rounded-full border-2" size={20} /></Button>
            </div>
            <div className="flex justify-start items-center gap-2 px-2 py-2">
                <Link to={`/product/${item.qrCodeNumber}`}>
                    <img
                        src={item?.thumbnail}
                        alt={item.name}
                        className="w-[100px] h-[80px] rounded-md shadow-sm p-2 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                        loading="lazy"
                    />
                </Link>

                <CardTitle className="w-full text-sm hover:underline "><Link to={`/product/${item.qrCodeNumber}`}>
                    {language === "en" ? item.name : item.alternateName ? item.alternateName : item.name}
                </Link></CardTitle>
            </div>
            <div className="flex items-center justify-between w-full px-2">
                <div className="flex-col w-2/3 justify-between  items-center">
                    {(cart.find((cart) => item._id === cart._id)?.orderQuantity || 0) >= item.quantity && (
                        <span className="block text-sm h-[25px] px-2">
                            {item.quantity} item(s) left
                        </span>
                    )
                        // : <span className="block text-sm text-red-500 h-[20px]">
                        // </span>
                    }
                    <div className="w-[120px] mb-2">
                        {!itemExist(item._id, cart).length ?
                            <AddToCartButton item={{ ...item, orderQuantity: orderQty || 0 }} />
                            :
                            <ChangeItemQty item={{ ...item, orderQuantity: orderQty || 0 }} />}
                    </div>
                </div>
                <div className="text-xl w-fit text-start items-center my-auto">
                    <p> {language === "en" ? "Rs." : "रु."}{((item.salesPrice > 0 ? item.salesPrice : item.price) * item.orderQuantity).toFixed(2)} </p>
                    {item.salesPrice > 0 && <p className="text-sm text-end  text-gray-500 line-through">{language === "en" ? "was Rs." : "पहिले रु."}{(item.price * item.orderQuantity).toFixed(2)}</p>}
                </div>

            </div>
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
                            onChange={handelOnChangeNote}
                            value={note}
                        />

                        <div className="flex justify-end gap-2 items-center w-full p-2">
                            <Button className="bg-gray-500" onClick={() => setOpenNote(false)}>Cancel</Button>
                            <Button onClick={handleOnAddToCart} >Save</Button>
                        </div>
                    </>

                )}
            </div>
        </Card>)
}
export default CartCard

