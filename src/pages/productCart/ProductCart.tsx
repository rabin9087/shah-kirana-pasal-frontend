import { currencyFormatter } from "@/lib/utils";
import { Link } from "react-router-dom";
import { BsCartCheckFill } from "react-icons/bs";
const ProductCard = ({ 
  title  = "REd burll Energy drink",
  price  = 3.55,
  productName  = "product" ,
}) => {
  return (
    <div className=" flex p-3 h-[320px] w-[200px] flex-col rounded-sm  mt-5 gap-1 border border-gray-100">
      <div className="flex-1 flex">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqGK3diR3Zi-mnOXEaj-3ewmFyRYVxGzVzZw&s"
          className="object-cover "
        />
      </div>
      <Link to={`/product/${title}`}>
        <span className="font-semibold  text-[12px] text-gray-700 hover:underline">
          {title}
        </span>
      </Link>
      <p className="text-[20px] font-semibold">{currencyFormatter(price)}</p>
      <button className="bg-primary p-1 px-3 rounded-lg hover:bg-primary text-white hover:bg-blue-900 flex items-center justify-around">
        <span className="flex-1 ">Buy</span>
        <BsCartCheckFill />
      </button>
    </div>
  );
};

export default ProductCard;
