import { useAppSelector } from "@/hooks";
import { FaShoppingCart } from "react-icons/fa";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "../ui/button";
import AddToCart from "@/pages/addToCart/AddToCart";



const Cart: React.FC = () => {
  const { cart } = useAppSelector((state) => state.addToCartInfo)
  const cartPrice = cart.reduce((acc, { orderQuantity, price }) => {
    return acc + (orderQuantity * price)
  }, 0)

  const cartQuantity = cart.reduce((acc, { orderQuantity }) => {
    return acc + orderQuantity
  }, 0)

  return (
    <Drawer>
      <DrawerTrigger className=" relative bg-blue-400/30 hover:bg-blue-400/50 text-sm md:text-md m-4 p-2 px-4 rounded-md">
        {/* <Button className=" bg-blue-400/30 hover:bg-blue-400/50 text-sm md:text-md"> */}
        <div className="flex justify-center items-center">
          <FaShoppingCart size={20} className="text-white text-sm me-1" />
          <div className=" flex items-center gap-1 rounded-full text-xs font-semibold">
            <span className="hidden md:flex text-white font-mono">${cartPrice > 0 ? cartPrice.toFixed(2) : "0.00"} </span>
          </div>
        </div>

        {/* </Button> */}
        {cartQuantity > 0 && <span className="text-white text-sm md:text-md bg-red-500 rounded-full px-3 py-1 top-[-0.8rem] absolute right-[-0.9rem]">{cartQuantity} </span>}
      </DrawerTrigger>
      <DrawerContent className="top-10 flex items-center w-full md:w-[283px]">
        <DrawerHeader>
          <DrawerTitle>Cart</DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <AddToCart />
      </DrawerContent>
    </Drawer >
  );
};

export default Cart;