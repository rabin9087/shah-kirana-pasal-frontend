import { useAppDispatch, useAppSelector } from "@/hooks";
import { useEffect, useState } from "react";
import { getAllProductAction } from "@/action/product.action";
import { Link } from "react-router-dom";
import { IProductTypes } from "@/types";
import { Button } from "@/components/ui/button";
import ProductNotFound from "../product/components/ProductNotFound";

interface IProductCardProps {
  data: IProductTypes[]
}

const ProductCard: React.FC<IProductCardProps> = ({ data }) => {

  const [count, setCount] = useState<number>(0);

  const decrement = () => {
    if (count > 0) {
      setCount((prev: number) => prev - 1);
    }
  };

  const increment = () => {
    if (count < 100) {
      setCount((prev: number) => prev + 1);
    }
  };

  // useEffect(() => {
  //   dispatch(getAProductAction({ qrCodeNumber: params }));
  // }, [dispatch]);

  const dispatch = useAppDispatch()
  const { products } = useAppSelector(state => state.productInfo)

  useEffect(() => {
    dispatch(getAllProductAction())
  }, [dispatch, products.length])

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      {data.length > 0 ? <div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 xl:gap-x-8">
          {data?.slice(0, 6).map(({ _id, name, price, qrCodeNumber, image }) => (
            <div key={_id} className="flex flex-col justify-between border rounded-md shadow-lg overflow-hidden">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
                <Link to={`/product/${qrCodeNumber}`}>
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                  />
                </Link>
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-700 hover:underline">
                  <Link to={`/product/${qrCodeNumber}`}>
                    {name}
                  </Link>
                </h3>
                <p className="text-lg font-bold text-gray-900 mt-1">$ {price}</p>
                <div className="flex-grow"></div>
                <div className="flex justify-center mt-4">
                  <Button
                    type="button"
                    onClick={() => console.log(name)}
                    className="w-full rounded-md bg-primary text-white hover:bg-primary-dark"
                  >
                    Add to Cart
                  </Button>
                </div>

                {/* {count > 0 ? <div className="w-full justify-between rounded-md bg-primary text-white hover:bg-primary-dark">
                  <Button
                    onClick={decrement}
                    type="button"
                    className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 rounded-l-md w-10 md:w-12 py-2 text-lg"
                  >
                    -
                  </Button>
                  <span className="flex-1 text-center text-lg font-medium">{count}</span>
                  <Button
                    onClick={increment}
                    type="button"
                    className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 rounded-r-md w-10 md:w-12 py-2 text-lg"
                  >
                    +
                  </Button>
                </div>
                  :
                  <Button
                    onClick={increment}
                    className="flex items-center justify-center text-center border border-gray-300 rounded-md w-full md:w-2/3 lg:w-1/2"
                  >
                    Add to Cart
                  </Button>} */}
              </div>
            </div>
          ))}
          <div className="flex overflow-x-scroll space-x-4 sm:hidden">
            {data?.slice(5, 12).map(({ _id, name, price, qrCodeNumber, image }) => (
              <div key={_id} className="flex-none w-48 border rounded-md shadow-lg overflow-hidden">
                <div className="w-full h-48 overflow-hidden bg-gray-200">
                  <Link to={`/product/${qrCodeNumber}`}>
                    <img
                      src={image}
                      alt={name}
                      className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                    />
                  </Link>
                </div>
                <div className="p-2 flex flex-col flex-grow">
                  <h3 className="text-sm font-semibold text-gray-700 hover:underline">
                    <Link to={`/product/${qrCodeNumber}`}>
                      {name}
                    </Link>
                  </h3>
                  <p className="text-sm font-bold text-gray-900 mt-1">$ {price}</p>
                  <div className="flex justify-center mt-2">
                    <Button
                      type="button"
                      onClick={() => console.log(name)}
                      className="w-full rounded-md bg-primary text-white hover:bg-primary-dark"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 xl:gap-x-8">
          {data?.slice(6).map(({ _id, name, price, qrCodeNumber, image }) => (
            <div key={_id} className="hidden sm:flex flex-col justify-between border rounded-md shadow-lg overflow-hidden">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
                <Link to={`/product/${qrCodeNumber}`}>
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                  />
                </Link>
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-700 hover:underline">
                  <Link to={`/product/${qrCodeNumber}`}>
                    {name}
                  </Link>
                </h3>
                <p className="text-lg font-bold text-gray-900 mt-1">$ {price}</p>
                <div className="flex-grow"></div>
                <div className="flex justify-center mt-4">
                  <Button
                    type="button"
                    onClick={() => console.log(name)}
                    className="w-full rounded-md bg-primary text-white hover:bg-primary-dark"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div> : <ProductNotFound />}

    </div>
  );
};

export default ProductCard;
