import { getAProductAction } from "@/action/product.action";
import Layout from "@/components/layout/Layout";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useEffect } from "react";
import { useParams } from "react-router";
import ProductDetails from "./components/ProductDetails";
import { AddToCartButton, ChangeItemQty, getOrderNumberQuantity, itemExist } from "@/utils/QuantityChange";
import { Card, CardDescription } from "@/components/ui/card";

const ProductLanding = () => {
    const params = useParams();
    const dispatch = useAppDispatch();
    const { product } = useAppSelector((s) => s.productInfo);
    const { cart } = useAppSelector((state) => state.addToCartInfo)

    const orderQty = getOrderNumberQuantity(product._id, cart)
    const index = cart.find((item) => item._id === product._id)

    useEffect(() => {
        dispatch(getAProductAction({ qrCodeNumber: params }));
    }, [dispatch]);

    return (
        <Layout title={product.name}>
            <div className="block md:grid md:grid-cols-2 min-h-[73vh] gap-8 p-4">
                <div className="block lg:flex lg:gap-8">
                    <div className="w-full lg:w-1/2 flex justify-center items-start h-full">
                        <Card className="w-full">
                            <CardDescription>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-105"
                                    loading="lazy"
                                />

                            </CardDescription>

                        </Card>
                    </div>
                    <div className="mt-6 w-full lg:w-1/2 lg:mt-0">
                        <h3 className="text-2xl md:text-wxl text-gray-700 font-mono px-4 lg:px-0">
                            {product.name}
                        </h3>
                        <div className="flex justify-between items-center">
                            <p className="text-xl md:text-3xl mt-2 font-serif px-4 lg:px-0">
                                ${product.price}.00
                            </p>
                            <p className="text-md mt-2 font-serif px-4 lg:px-0">
                                ${product.price} / item
                            </p>
                        </div>

                        <div className="px-4 lg:px-0 my-2"></div>
                        <div className="px-4 lg:px-0 font-bold text-gray-700 mt-6 text-base md:text-xl">

                            <div className="mt-6 space-y-4">
                                <span className="block text-start md:text-lg font-semibold">Quantity</span>
                                {!itemExist(product._id, cart).length ?
                                    <AddToCartButton item={{ ...product, orderQuantity: orderQty || 0 }} />
                                    :
                                    <ChangeItemQty item={{ ...product, orderQuantity: orderQty || 0 }} />}

                                {(index?.orderQuantity || 0) >= product.quantity && (
                                    <span className="block text-center text-sm text-red-500">
                                        {product.quantity} item(s) left
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
