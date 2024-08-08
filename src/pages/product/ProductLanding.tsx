import { getAProductAction } from "@/action/product.action";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import ProductDetails from "./components/ProductDetails";

const ProductLanding = () => {
    const params = useParams();
    const dispatch = useAppDispatch();

    const { product } = useAppSelector((s) => s.productInfo);

    const [size, SetSize] = useState("");
    const [count, setCount] = useState(1);

    const decrement = () => {
        if (count > 1) {
            setCount((prev) => prev - 1);
        }
    };

    const increment = () => {
        if (count < product.quantity) {
            setCount((prev) => prev + 1);
        }
    };

    useEffect(() => {
        dispatch(getAProductAction({ qrCodeNumber: params }));
    }, [dispatch]);

    return (
        <Layout title={product.name}>
            <div className="block md:grid md:grid-cols-2 min-h-[73vh] gap-8 p-4">
                <div className="block lg:flex lg:gap-8">
                    <div className="w-full lg:w-1/2 flex justify-center items-center">
                        <div className="bg-white h-72 md:h-full w-full flex justify-center items-center relative">
                            <img
                                src={product.image}
                                alt={product.qrCodeNumber}
                                className="p-2 border object-cover h-60 md:h-full w-full"
                            />
                        </div>
                    </div>
                    <div className="mt-6 w-full lg:w-1/2 lg:mt-0">
                        <h3 className="text-2xl md:text-3xl text-gray-700 font-mono px-4 lg:px-0">
                            {product.name}
                        </h3>
                        <p className="text-xl md:text-2xl mt-2 text-red-500 font-serif px-4 lg:px-0">
                            $ {product.price}.00
                        </p>
                        <div className="px-4 lg:px-0 my-2"></div>
                        <div className="px-4 lg:px-0 font-bold text-gray-700 mt-6 text-base md:text-xl">
                            <label htmlFor="size" className="block">
                                Size
                            </label>
                            <select
                                className="w-full md:w-2/3 lg:w-1/2 py-2 px-2.5 rounded-md mt-2 font-medium text-base md:text-lg"
                                value={size}
                                onChange={(e) => SetSize(e.target.value)}
                            >
                                <option className="py-2" value="">
                                    Select a Size
                                </option>
                                {/* Add your size options here */}
                            </select>
                            <div className="mt-6 space-y-4">
                                <span className="block text-base md:text-lg font-semibold">Quantity</span>
                                <div className="flex items-center justify-between border border-gray-300 rounded-md w-full md:w-2/3 lg:w-1/2">
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
                                <Button
                                    className="w-full bg-primary text-white hover:bg-primary-dark focus:ring-2 focus:ring-primary rounded-md py-2 text-lg"
                                >
                                    Add to Cart
                                </Button>
                                {count === product.quantity && (
                                    <span className="block text-sm text-red-500 mt-2">
                                        You've reached the maximum quantity
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <ProductDetails product={product} />
            </div>
        </Layout>
    );
};

export default ProductLanding;
