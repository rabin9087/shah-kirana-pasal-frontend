import { FaShoppingCart } from "react-icons/fa";

const Cart = ({cartNumber = 9}) => {
  return (
    <div className="inline-flex items-center  relative">
      <div className="flex items-center text-3xl">
        <FaShoppingCart/>
      </div>
      <div className="flex items-center h-7 w-7 justify-center bg-primary text-white absolute rounded-full right-[-16px] top-[-16px] p-1">
        {cartNumber}
      </div>
    </div>
  )
}    

export default Cart