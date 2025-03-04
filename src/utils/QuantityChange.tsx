import { Button } from "@/components/ui/button"
import { useAppDispatch } from "@/hooks"
import { IAddToCartTypes } from "@/pages/addToCart"
import { setAddToCart } from "@/redux/addToCart.slice"

export const AddToCartButton = ({ item }: { item: IAddToCartTypes }) => {

    const dispatch = useAppDispatch()
    const handleOnAddToCart = () => {
        dispatch(setAddToCart({ ...item, orderQuantity: 1 }))
    }
    return (<Button variant={'default'} onClick={handleOnAddToCart} className="w-full">Add To Cart</Button>)
}

export const ChangeItemQty = ({ item }: { item: IAddToCartTypes }) => {
    const dispatch = useAppDispatch()
    return (
        <div className="flex w-full items-center">
            <Button variant={'default'}
                className="rounded-none rounded-l-md w-1/4"
                onClick={() => { dispatch(setAddToCart({ ...item, orderQuantity: item.orderQuantity - 1 })) }}>
                -
            </Button>
            <p className="h-10 w-full  border flex items-center justify-center ">{item.orderQuantity}</p>
            <Button variant={'default'}
                onClick={() => { dispatch(setAddToCart({ ...item, orderQuantity: item.orderQuantity + 1 })) }}
                className="rounded-none rounded-r-md w-1/4">
                +
            </Button>
        </div>
    )
}

export const itemExist = (productId: string, cartArray: IAddToCartTypes[]) => {
    return cartArray.filter((item) => item._id === productId && item.orderQuantity > 0)
}

export const getOrderNumberQuantity = (productId: string, cartArray: IAddToCartTypes[]) => {
    return cartArray.find((item) => item._id === productId)?.orderQuantity
}