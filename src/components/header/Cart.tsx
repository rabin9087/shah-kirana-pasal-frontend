import { FaShoppingCart } from "react-icons/fa";

interface CartProps {
  cartNumber?: number;
}

const Cart: React.FC<CartProps> = ({ cartNumber = 0.89 }) => {
  return (
    <div className="flex justify-center items-center gap-1">
      <FaShoppingCart className="text-white text-2xl" />
      <div className="me-2 h-6 w-6 bg-primary text-white rounded-full text-xs font-semibold right-[-12px] top-[-12px]">
        ${cartNumber}
      </div>
    </div>
  );
};

export default Cart;
