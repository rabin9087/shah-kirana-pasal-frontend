import { useAppDispatch, useAppSelector } from "@/hooks";
import { useEffect, useState } from "react";
import { getAllProductByCategoryAction } from "@/action/product.action";
import { Link, useParams } from "react-router-dom";
import { IProductTypes } from "@/types";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import ProductNotFound from "../product/components/ProductNotFound";

// interface IProductCardProps {
//     data: IProductTypes[],
//     setData: (data: IProductTypes[]) => void
// }

const ProductCardByCategory: React.FC = () => {

    const dispatch = useAppDispatch();
    const { slug } = useParams()
    const { products } = useAppSelector(state => state.productInfo)
    const [data, setData] = useState<IProductTypes[]>(products)

    useEffect(() => {
        dispatch(getAllProductByCategoryAction(slug as string))
        setData(products)
    }, [dispatch, slug, products.length])

    return (<Layout data={data} title={`All ${slug} products`} types="category" setData={setData}>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">

            <p className="mb-2">{`All ${data.length} products`}</p>

            {data.length > 0 ? <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 xl:gap-x-8">
                {data.map(({ _id, name, price, qrCodeNumber, image }) => (
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
                {/* <div className="flex overflow-x-scroll space-x-4 sm:hidden">
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
                </div> */}

            </div> : <ProductNotFound />}
            {/* <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 xl:gap-x-8">
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
            </div> */}
        </div>
    </Layout>
    );
};

export default ProductCardByCategory;
