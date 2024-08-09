import { useAppDispatch, useAppSelector } from "@/hooks";
import { useEffect } from "react";
import { getAllProductAction } from "@/action/product.action";
import { Link } from "react-router-dom";
import { IProductTypes } from "@/types";
import { Button } from "@/components/ui/button";
import ProductNotFound from "../product/components/ProductNotFound";

interface IProductCardProps {
  data: IProductTypes[]
}

const ProductCard: React.FC<IProductCardProps> = ({ data }) => {

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
