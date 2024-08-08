
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useEffect, useState } from "react";
import { getAllProductAction } from "@/action/product.action";
import { Link } from "react-router-dom";
import { IProductTypes } from "@/types";

interface IProductCardProps {
  data: IProductTypes[]
}

const ProductCard: React.FC<IProductCardProps> = ({ data }) => {

  const dispatch = useAppDispatch()

  const { products } = useAppSelector(state => state.productInfo)

  useEffect(() => {
    if (products.length) {
      dispatch(getAllProductAction())
    }

  }, [dispatch, products.length,])

  return (
    <div className=" mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 flex flex-col justify-start gap-5">
      <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-8 ">
        {data?.map(({ _id, name, price, qrCodeNumber, image }) => (
          <div key={_id} className="group relative">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md lg:aspect-none group-hover:opacity-75 lg:h-80 shadow-lg">
              <Link to={`/product/${qrCodeNumber}`}>
                {/* <Link to={`#`}> */}
                <img
                  // src={import.meta.env.VITE_SERVER_ROOT + thumbnail}
                  src={image}
                  alt={name}
                  className="p-2 w-full h-full object-contain  lg:h-full lg:w-full "
                />
              </Link>
            </div>

            <div className="mt-4 justify-between">
              <div>
                <h3 className="text-lg text-gray-700">
                  {name} <br />
                </h3>
              </div>
              <p className="text-lg font-bold text-gray-900">$ {price}</p>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default ProductCard;
