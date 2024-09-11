import Layout from "@/components/layout/Layout"
import { useAppDispatch } from "@/hooks"
import { resetCart } from "@/redux/addToCart.slice"
import { useEffect } from "react"


const SuccessfullPayment = () => {
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(resetCart())
    }, [])

    return (
        <Layout title="">Successfull Payment</Layout>
    )
}
export default SuccessfullPayment