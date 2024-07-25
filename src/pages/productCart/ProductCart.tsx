import { currencyFormatter } from "@/lib/utils";
import { Link } from "react-router-dom";
import { BsCartCheckFill } from "react-icons/bs";
const ProductCard = ({
  title = "Red bull Energy drink",
  price = 3.55,


}) => {


  return (
    <div className=" flex p-3 h-[320px] w-[200px] flex-col rounded-sm z-1 mt-5 gap-1 border border-gray-500">

      <div className="flex-1 flex">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqGK3diR3Zi-mnOXEaj-3ewmFyRYVxGzVzZw&s"
          className="object-cover "
        />
      </div>
      <Link to={`/product/${title}`}>
        <span className="font-semibold text-base text-gray-700 hover:underline">
          {title}
        </span>
      </Link>
      <p className="text-lg font-semibold">{currencyFormatter(price)}</p>
      <button className="bg-primary p-1 px-3 rounded-lg hover:bg-primary text-white hover:bg-blue-900 flex items-center justify-around">
        <span className="flex-1 ">Add to Cart</span>
        <BsCartCheckFill />
      </button>
    </div>
  );
};

export default ProductCard;
