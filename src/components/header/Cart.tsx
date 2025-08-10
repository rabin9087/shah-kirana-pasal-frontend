import { useAppDispatch, useAppSelector } from "@/hooks";
import { FaShoppingCart } from "react-icons/fa";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import AddToCart from "@/pages/addToCart/AddToCart";
import { IUpdateCartToUserTypes } from "@/pages/addToCart";
import { useEffect, useState } from "react";
import { updateCartInUserAxios } from "@/action/user.action";
import { debounce } from "lodash";

const Cart: React.FC = () => {
  const dispatch = useAppDispatch()
  const { cart } = useAppSelector((state) => state.addToCartInfo)
  const { user } = useAppSelector((state) => state.userInfo)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const cartPrice = cart.reduce((acc, { orderQuantity, price }) => {
    return acc + (orderQuantity as number) * (price as number)
  }, 0)

  const cartQuantity = cart.reduce((acc, { orderQuantity }) => acc + (orderQuantity ?? 0), 0);

  const updatedCart: IUpdateCartToUserTypes[] = cart.filter((item) => item?._id !== '')
    .map(({ _id, price, orderQuantity, note }) => ({
    productId: _id as string,
      orderQuantity: orderQuantity as number,
    note,
    price,
    }));
  
  useEffect(() => {
    if (user?._id && cartQuantity) {
      const debouncedUpdate = debounce(() => {
        dispatch(updateCartInUserAxios(user.phone, updatedCart));
      }, 3000); // 1000ms delay
      debouncedUpdate();

      return () => debouncedUpdate.cancel(); // Cleanup function to prevent unnecessary calls
    }
  }, [cart, cartQuantity, user?._id, dispatch]);

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger className="relative bg-blue-400/30 hover:bg-blue-400/50 text-sm md:text-md me-2 ms-2 p-1 sm:m-4 px-4 rounded-md"
        onClick={() => setIsDrawerOpen(true)}
      >
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
      <DrawerContent className="top-20 flex items-center w-full md:w-[500px]">
        <DrawerHeader>
          <DrawerTitle>Cart</DrawerTitle>
        </DrawerHeader>
        <AddToCart onCloseDrawer={closeDrawer} />
      </DrawerContent>
    </Drawer >
  );
};

export default Cart;