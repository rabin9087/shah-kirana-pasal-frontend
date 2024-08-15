import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { FaShoppingCart } from "react-icons/fa";

const EmptyCart = () => {
    return (
        <div className="flex flex-col gap-2 justify-center items-center mb-2 min-h-[60vh] my-auto">
            <div className="flex flex-col gap-2 justify-center items-center">
                <FaShoppingCart className="text-primary text-center" size={50} />
                <span className="text-lg font-bold">Your cart is empty</span>
            </div>

            <Link to={"/"}><Button>Continue Shopping </Button></Link>
        </div>
    )
}
export default EmptyCart