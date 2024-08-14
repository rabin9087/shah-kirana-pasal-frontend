import { useAppSelector } from "@/hooks";
import { FaShoppingCart } from "react-icons/fa";
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer"



const Cart: React.FC = () => {
  const { cart } = useAppSelector((state) => state.addToCartInfo)
  const cartPrice = cart.reduce((acc, { orderQuantity, price }) => {
    return acc + (orderQuantity * price)
  }, 0)

  const cartQuantity = cart.reduce((acc, { orderQuantity }) => {
    return acc + orderQuantity
  }, 0)

  return (
    <div className="w-full flex justify-end md:me-8 lg:me-12 items-center gap-1 px-2">
      <FaShoppingCart size={20} className="text-white text-xs" />
      <div className="flex items-center me-2 h-6 w-6 bg-primary gap-1  rounded-full text-xs font-semibold">
        <span className="hidden md:flex text-white font-mono">${cartPrice > 0 ? cartPrice : "0.00"} </span>
        <span className=" text-white text-sm bg-red-500 rounded-full px-2">{cartQuantity > 0 ? cartQuantity : ""} </span>
      </div>
    </div>
  );
};

export default Cart;
